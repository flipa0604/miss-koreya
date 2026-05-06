from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import get_current_admin
from ..database import get_db
from ..models import Product
from ..schemas import ProductIn, ProductOut

public_router = APIRouter(prefix="/api/products", tags=["products"])
admin_router = APIRouter(prefix="/api/admin/products", tags=["admin:products"])


@public_router.get("", response_model=list[ProductOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.in_stock.is_(True)).order_by(Product.sort_order, Product.id)
    )
    return result.scalars().all()


@admin_router.get("", response_model=list[ProductOut])
async def admin_list_products(
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    result = await db.execute(select(Product).order_by(Product.sort_order, Product.id))
    return result.scalars().all()


@admin_router.post("", response_model=ProductOut, status_code=201)
async def create_product(
    payload: ProductIn,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    product = Product(**payload.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


@admin_router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    payload: ProductIn,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    for k, v in payload.model_dump().items():
        setattr(product, k, v)
    await db.commit()
    await db.refresh(product)
    return product


@admin_router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    await db.delete(product)
    await db.commit()
