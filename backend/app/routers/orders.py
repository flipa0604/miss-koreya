from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..auth import get_current_admin
from ..database import get_db
from ..models import Order, OrderItem, Product
from ..schemas import OrderCreate, OrderOut, OrderStatusUpdate
from ..telegram_notifier import notify_new_order

public_router = APIRouter(prefix="/api/orders", tags=["orders"])
admin_router = APIRouter(prefix="/api/admin/orders", tags=["admin:orders"])


@public_router.post("", response_model=OrderOut, status_code=201)
async def create_order(
    payload: OrderCreate,
    background: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    product_ids = [it.product_id for it in payload.items]
    result = await db.execute(select(Product).where(Product.id.in_(product_ids)))
    products = {p.id: p for p in result.scalars().all()}

    missing = set(product_ids) - set(products)
    if missing:
        raise HTTPException(400, f"Products not found: {sorted(missing)}")

    order = Order(
        customer_name=payload.customer_name.strip(),
        phone=payload.phone.strip(),
        address=payload.address.strip(),
        comment=(payload.comment or "").strip() or None,
        source=payload.source if payload.source in ("web", "telegram") else "web",
        telegram_user_id=payload.telegram_user_id,
        telegram_username=payload.telegram_username,
        total=Decimal("0"),
    )

    total = Decimal("0")
    for it in payload.items:
        product = products[it.product_id]
        if not product.in_stock:
            raise HTTPException(400, f"Product not in stock: {product.name}")
        order.items.append(OrderItem(
            product_id=product.id,
            product_name=product.name,
            price=product.price,
            quantity=it.quantity,
        ))
        total += product.price * it.quantity

    order.total = total
    db.add(order)
    await db.commit()

    # reload with items eagerly for response & notifier
    result = await db.execute(
        select(Order).where(Order.id == order.id).options(selectinload(Order.items))
    )
    order = result.scalar_one()
    background.add_task(notify_new_order, order)
    return order


@admin_router.get("", response_model=list[OrderOut])
async def admin_list_orders(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    stmt = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())
    if status:
        stmt = stmt.where(Order.status == status)
    result = await db.execute(stmt)
    return result.scalars().all()


@admin_router.get("/{order_id}", response_model=OrderOut)
async def admin_get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    result = await db.execute(
        select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(404, "Order not found")
    return order


@admin_router.patch("/{order_id}", response_model=OrderOut)
async def admin_update_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    order = await db.get(Order, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    order.status = payload.status
    await db.commit()
    result = await db.execute(
        select(Order).where(Order.id == order.id).options(selectinload(Order.items))
    )
    return result.scalar_one()
