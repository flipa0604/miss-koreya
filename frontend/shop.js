/* MY Cosmetic — shop frontend logic. Works in browser and inside Telegram Mini App. */
(function () {
  const API = '';
  const CART_KEY = 'mk_cart_v1';

  let products = [];
  let cart = loadCart();

  // Telegram WebApp integration
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    // Apply Telegram theme color to header on supported clients
    if (tg.themeParams && tg.themeParams.bg_color) {
      document.documentElement.style.setProperty('--cream', tg.themeParams.bg_color);
    }
  }

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch { return {}; }
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function fmtMoney(n) {
    return Number(n).toLocaleString('ru-RU') + ' сум';
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  async function loadProducts() {
    try {
      const r = await fetch(API + '/api/products');
      products = await r.json();
      renderProducts();
    } catch (e) {
      document.getElementById('products-grid').innerHTML =
        '<div class="loading">Ошибка загрузки. Обновите страницу.</div>';
    }
  }

  function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!products.length) {
      grid.innerHTML = '<div class="loading">Товары пока не добавлены</div>';
      return;
    }
    grid.innerHTML = products.map(p => `
      <article class="card">
        <div class="card-img" ${p.image_url ? `style="background-image:url('${escapeHtml(p.image_url)}')"` : ''}>
          ${p.image_url ? '' : escapeHtml(p.name.split(' ')[0])}
        </div>
        <div class="card-body">
          ${p.category ? `<div class="card-cat">${escapeHtml(p.category)}</div>` : ''}
          <div class="card-name">${escapeHtml(p.name)}</div>
          ${p.description ? `<div class="card-desc">${escapeHtml(p.description)}</div>` : ''}
          <div class="card-price">${fmtMoney(p.price)}</div>
          <button class="add-btn" onclick="window.MK.addToCart(${p.id})">+ В корзину</button>
        </div>
      </article>
    `).join('');
  }

  function addToCart(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    updateCartBadge();
    renderCart();
    showToast(`«${p.name}» добавлен в корзину`);
  }

  function updateCartBadge() {
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    document.getElementById('cart-count').textContent = count;
  }

  function renderCart() {
    const container = document.getElementById('cart-items');
    const ids = Object.keys(cart).map(Number).filter(id => cart[id] > 0);
    const items = ids.map(id => {
      const p = products.find(x => x.id === id);
      return p ? { product: p, qty: cart[id] } : null;
    }).filter(Boolean);

    if (!items.length) {
      container.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
      document.getElementById('cart-total').textContent = fmtMoney(0);
      document.getElementById('checkout-btn').disabled = true;
      return;
    }

    container.innerHTML = items.map(({product, qty}) => `
      <div class="cart-item">
        <div class="cart-item-img" ${product.image_url ? `style="background-image:url('${escapeHtml(product.image_url)}');background-size:cover"` : ''}></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(product.name)}</div>
          <div class="cart-item-price">${fmtMoney(product.price)}</div>
          <div class="qty">
            <button onclick="window.MK.changeQty(${product.id}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="window.MK.changeQty(${product.id}, 1)">+</button>
            <button class="remove" onclick="window.MK.removeItem(${product.id})">Удалить</button>
          </div>
        </div>
      </div>
    `).join('');

    const total = items.reduce((sum, {product, qty}) => sum + Number(product.price) * qty, 0);
    document.getElementById('cart-total').textContent = fmtMoney(total);
    document.getElementById('checkout-btn').disabled = false;
  }

  function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function removeItem(id) {
    delete cart[id];
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function openCart() {
    document.getElementById('overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
    renderCart();
  }

  function closeCart() {
    document.getElementById('overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
  }

  function openCheckout() {
    if (!Object.keys(cart).length) return;
    document.getElementById('checkout-err').textContent = '';
    document.getElementById('checkout-modal').classList.add('open');

    // Prefill from Telegram if available
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const u = tg.initDataUnsafe.user;
      const nameInput = document.querySelector('#checkout-form [name="customer_name"]');
      if (!nameInput.value) {
        nameInput.value = [u.first_name, u.last_name].filter(Boolean).join(' ');
      }
    }
  }

  function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
  }

  async function submitOrder(ev) {
    ev.preventDefault();
    const form = ev.target;
    const btn = document.getElementById('submit-btn');
    const err = document.getElementById('checkout-err');
    err.textContent = '';

    const items = Object.entries(cart)
      .map(([id, qty]) => ({ product_id: Number(id), quantity: qty }))
      .filter(i => i.quantity > 0);

    if (!items.length) {
      err.textContent = 'Корзина пуста';
      return;
    }

    const payload = {
      customer_name: form.customer_name.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      comment: form.comment.value.trim() || null,
      items,
      source: tg ? 'telegram' : 'web',
    };

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      payload.telegram_user_id = String(tg.initDataUnsafe.user.id);
      payload.telegram_username = tg.initDataUnsafe.user.username || null;
    }

    btn.disabled = true;
    btn.textContent = 'Отправка...';

    try {
      const r = await fetch(API + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.detail || 'Ошибка ' + r.status);
      }
      const order = await r.json();
      cart = {};
      saveCart();
      updateCartBadge();
      closeCheckout();
      closeCart();
      form.reset();

      const successMsg = `Заказ #${order.id} принят! Мы свяжемся с вами в ближайшее время.`;
      if (tg) {
        tg.showAlert(successMsg, () => tg.close());
      } else {
        showToast(successMsg);
      }
    } catch (e) {
      err.textContent = String(e.message || e);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Подтвердить заказ';
    }
  }

  // Expose
  window.MK = { addToCart, changeQty, removeItem };
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.openCheckout = openCheckout;
  window.closeCheckout = closeCheckout;
  window.submitOrder = submitOrder;

  // Init
  loadProducts();
  updateCartBadge();
})();
