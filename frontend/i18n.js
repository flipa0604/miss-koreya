/* Shared translations for shop + admin. Default: ru. Persists in localStorage. */
(function () {
  const STORAGE_KEY = 'mk_lang';

  const T = {
    ru: {
      /* ===== Shop ===== */
      'site.title': 'MY COSMETIC — Корейская косметика в Бухаре',
      'shop.nav.cart': 'Корзина',
      'shop.hero.eyebrow': '★ Оригинальная корейская косметика',
      'shop.hero.title.before': 'Корейская ',
      'shop.hero.title.em': 'косметика',
      'shop.hero.title.after': ' в Бухаре',
      'shop.hero.subtitle': 'Только оригинальные товары. Прямые поставки из Кореи. Быстрая доставка по всему Узбекистану.',
      'shop.hero.cta': 'Смотреть каталог',
      'shop.section.title.before': 'Популярные ',
      'shop.section.title.em': 'товары',
      'shop.products.loading': 'Загрузка...',
      'shop.products.empty': 'Товары пока не добавлены',
      'shop.products.error': 'Ошибка загрузки. Обновите страницу.',
      'shop.product.add': '+ В корзину',
      'shop.cart.title': 'Корзина',
      'shop.cart.empty': 'Корзина пуста',
      'shop.cart.total': 'Итого:',
      'shop.cart.checkout': 'Оформить заказ',
      'shop.cart.remove': 'Удалить',
      'shop.checkout.title': 'Оформление заказа',
      'shop.checkout.sub': 'Заполните данные — мы свяжемся с вами для подтверждения.',
      'shop.checkout.name': 'Имя *',
      'shop.checkout.phone': 'Телефон *',
      'shop.checkout.address': 'Адрес доставки *',
      'shop.checkout.comment': 'Комментарий',
      'shop.checkout.comment.ph': 'Дополнительные пожелания',
      'shop.checkout.submit': 'Подтвердить заказ',
      'shop.checkout.cancel': 'Отмена',
      'shop.checkout.sending': 'Отправка...',
      'shop.checkout.empty': 'Корзина пуста',
      'shop.checkout.success': 'Заказ #{id} принят! Мы свяжемся с вами в ближайшее время.',
      'shop.toast.added': '«{name}» добавлен в корзину',
      'shop.footer.about': 'Корейская косметика в Бухаре. Оригинальные товары, доступные цены, быстрая доставка.',
      'shop.footer.contacts': 'Контакты',
      'shop.footer.city': 'г. Бухара',
      'shop.footer.social': 'Соцсети',
      'shop.footer.copyright': '© 2026 MY Cosmetic · Корейская косметика · Оригинальные товары',

      /* ===== Admin ===== */
      'admin.login.title': 'Вход для администратора',
      'admin.login.user': 'Имя пользователя',
      'admin.login.pass': 'Пароль',
      'admin.login.submit': 'Войти',
      'admin.login.err': 'Неверный логин или пароль',
      'admin.login.network': 'Ошибка сети',
      'admin.header.title': 'Miss Koreya — Админ',
      'admin.header.logout': 'Выйти',
      'admin.tabs.orders': 'Заказы',
      'admin.tabs.products': 'Товары',
      'admin.filter.all': 'Все статусы',
      'admin.filter.refresh': 'Обновить',
      'admin.empty.orders': 'Заказов нет',
      'admin.empty.products': 'Товаров нет. Добавьте через кнопку выше.',
      'admin.status.new': 'Новый',
      'admin.status.confirmed': 'Подтверждён',
      'admin.status.shipped': 'Отправлен',
      'admin.status.delivered': 'Доставлен',
      'admin.status.cancelled': 'Отменён',
      'admin.order.customer': 'Клиент',
      'admin.order.phone': 'Телефон',
      'admin.order.address': 'Адрес',
      'admin.order.telegram': 'Telegram',
      'admin.order.comment': 'Комментарий',
      'admin.order.product': 'Товар',
      'admin.order.price': 'Цена',
      'admin.order.qty': 'Кол-во',
      'admin.order.sum': 'Сумма',
      'admin.product.add_new': '+ Добавить новый товар',
      'admin.product.name': 'Название *',
      'admin.product.name.ph': 'Например: Anua Heartleaf Toner',
      'admin.product.cat': 'Тип (категория)',
      'admin.product.cat.ph': 'например: тонер, крем, сыворотка',
      'admin.product.price': 'Цена (сум) *',
      'admin.product.desc': 'Описание',
      'admin.product.desc.ph': 'Краткая информация о товаре',
      'admin.product.sort': 'Порядковый номер',
      'admin.product.stock': 'В продаже',
      'admin.product.img.upload': 'Загрузить фото',
      'admin.product.img.change': 'Изменить фото',
      'admin.product.img.remove': '× Убрать фото',
      'admin.product.save': 'Сохранить',
      'admin.product.add': 'Добавить',
      'admin.product.del': 'Удалить',
      'admin.product.cancel': 'Отмена',
      'admin.product.confirm_del': 'Удалить товар: {name}?',
      'admin.product.name_required': 'Название не может быть пустым',
      'admin.toast.saved': 'Сохранено',
      'admin.toast.added': 'Товар добавлен',
      'admin.toast.deleted': 'Удалено',
      'admin.toast.uploaded': 'Фото загружено',
      'admin.toast.status_updated': 'Статус обновлён',
      'admin.toast.error': 'Ошибка: {msg}',
    },
    uz: {
      /* ===== Shop ===== */
      'site.title': 'MY COSMETIC — Buxorodagi Koreya kosmetikasi',
      'shop.nav.cart': 'Savat',
      'shop.hero.eyebrow': '★ Asl Koreya kosmetikasi',
      'shop.hero.title.before': 'Koreya ',
      'shop.hero.title.em': 'kosmetikasi',
      'shop.hero.title.after': ' Buxoroda',
      'shop.hero.subtitle': 'Faqat asl mahsulotlar. To\'g\'ridan-to\'g\'ri Koreyadan. O\'zbekiston bo\'ylab tezkor yetkazib berish.',
      'shop.hero.cta': 'Katalogni ko\'rish',
      'shop.section.title.before': 'Mashhur ',
      'shop.section.title.em': 'mahsulotlar',
      'shop.products.loading': 'Yuklanmoqda...',
      'shop.products.empty': 'Mahsulotlar hali qo\'shilmagan',
      'shop.products.error': 'Xato yuz berdi. Sahifani yangilang.',
      'shop.product.add': '+ Savatga',
      'shop.cart.title': 'Savat',
      'shop.cart.empty': 'Savat bo\'sh',
      'shop.cart.total': 'Jami:',
      'shop.cart.checkout': 'Buyurtma berish',
      'shop.cart.remove': 'O\'chirish',
      'shop.checkout.title': 'Buyurtma berish',
      'shop.checkout.sub': 'Ma\'lumotlarni to\'ldiring — biz tasdiqlash uchun bog\'lanamiz.',
      'shop.checkout.name': 'Ism *',
      'shop.checkout.phone': 'Telefon *',
      'shop.checkout.address': 'Manzil *',
      'shop.checkout.comment': 'Izoh',
      'shop.checkout.comment.ph': 'Qo\'shimcha xohish',
      'shop.checkout.submit': 'Buyurtmani tasdiqlash',
      'shop.checkout.cancel': 'Bekor qilish',
      'shop.checkout.sending': 'Yuborilmoqda...',
      'shop.checkout.empty': 'Savat bo\'sh',
      'shop.checkout.success': 'Buyurtma #{id} qabul qilindi! Tez orada bog\'lanamiz.',
      'shop.toast.added': '«{name}» savatga qo\'shildi',
      'shop.footer.about': 'Buxorodagi Koreya kosmetikasi. Asl mahsulotlar, qulay narxlar, tezkor yetkazib berish.',
      'shop.footer.contacts': 'Kontaktlar',
      'shop.footer.city': 'Buxoro sh.',
      'shop.footer.social': 'Ijtimoiy tarmoqlar',
      'shop.footer.copyright': '© 2026 MY Cosmetic · Koreya kosmetikasi · Asl mahsulotlar',

      /* ===== Admin ===== */
      'admin.login.title': 'Admin kirish',
      'admin.login.user': 'Foydalanuvchi nomi',
      'admin.login.pass': 'Parol',
      'admin.login.submit': 'Kirish',
      'admin.login.err': 'Noto\'g\'ri login yoki parol',
      'admin.login.network': 'Tarmoq xatosi',
      'admin.header.title': 'Miss Koreya — Admin',
      'admin.header.logout': 'Chiqish',
      'admin.tabs.orders': 'Buyurtmalar',
      'admin.tabs.products': 'Mahsulotlar',
      'admin.filter.all': 'Barcha statuslar',
      'admin.filter.refresh': 'Yangilash',
      'admin.empty.orders': 'Buyurtmalar yo\'q',
      'admin.empty.products': 'Mahsulotlar yo\'q. Yuqoridagi tugma orqali qo\'shing.',
      'admin.status.new': 'Yangi',
      'admin.status.confirmed': 'Tasdiqlangan',
      'admin.status.shipped': 'Yuborilgan',
      'admin.status.delivered': 'Yetkazilgan',
      'admin.status.cancelled': 'Bekor qilingan',
      'admin.order.customer': 'Mijoz',
      'admin.order.phone': 'Telefon',
      'admin.order.address': 'Manzil',
      'admin.order.telegram': 'Telegram',
      'admin.order.comment': 'Izoh',
      'admin.order.product': 'Mahsulot',
      'admin.order.price': 'Narxi',
      'admin.order.qty': 'Soni',
      'admin.order.sum': 'Jami',
      'admin.product.add_new': '+ Yangi mahsulot qo\'shish',
      'admin.product.name': 'Nomi *',
      'admin.product.name.ph': 'Masalan: Anua Heartleaf Toner',
      'admin.product.cat': 'Turi (kategoriya)',
      'admin.product.cat.ph': 'masalan: toner, krem, serum',
      'admin.product.price': 'Narxi (so\'m) *',
      'admin.product.desc': 'Tavsif',
      'admin.product.desc.ph': 'Mahsulot haqida qisqa ma\'lumot',
      'admin.product.sort': 'Tartib raqami',
      'admin.product.stock': 'Sotuvda mavjud',
      'admin.product.img.upload': 'Rasm yuklash',
      'admin.product.img.change': 'Rasmni o\'zgartirish',
      'admin.product.img.remove': '× Rasmni olib tashlash',
      'admin.product.save': 'Saqlash',
      'admin.product.add': 'Qo\'shish',
      'admin.product.del': 'O\'chirish',
      'admin.product.cancel': 'Bekor qilish',
      'admin.product.confirm_del': 'O\'chirilsinmi: {name}?',
      'admin.product.name_required': 'Nomi bo\'sh bo\'lishi mumkin emas',
      'admin.toast.saved': 'Saqlandi',
      'admin.toast.added': 'Mahsulot qo\'shildi',
      'admin.toast.deleted': 'O\'chirildi',
      'admin.toast.uploaded': 'Rasm yuklandi',
      'admin.toast.status_updated': 'Status yangilandi',
      'admin.toast.error': 'Xato: {msg}',
    },
  };

  let lang = localStorage.getItem(STORAGE_KEY) || 'ru';
  if (!T[lang]) lang = 'ru';

  function t(key, vars) {
    let str = (T[lang] && T[lang][key]) || (T.ru[key]) || key;
    if (vars) {
      for (const k in vars) str = str.replace('{' + k + '}', vars[k]);
    }
    return str;
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPh);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      // format: "attr1:key1;attr2:key2"
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [a, k] = pair.split(':');
        if (a && k) el.setAttribute(a.trim(), t(k.trim()));
      });
    });
    if (document.title) document.title = t('site.title');
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function setLang(newLang) {
    if (!T[newLang]) return;
    lang = newLang;
    localStorage.setItem(STORAGE_KEY, newLang);
    applyI18n();
    if (typeof window.onLangChange === 'function') window.onLangChange(newLang);
  }

  function getLang() { return lang; }

  function langSwitcherHtml() {
    return `
      <div class="lang-switch">
        <button class="lang-btn" data-lang="ru" onclick="setLang('ru')">RU</button>
        <button class="lang-btn" data-lang="uz" onclick="setLang('uz')">UZ</button>
      </div>
    `;
  }

  window.t = t;
  window.setLang = setLang;
  window.getLang = getLang;
  window.applyI18n = applyI18n;
  window.langSwitcherHtml = langSwitcherHtml;

  document.addEventListener('DOMContentLoaded', applyI18n);
})();
