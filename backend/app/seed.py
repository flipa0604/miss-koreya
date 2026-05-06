"""Seed initial product catalog. Idempotent — only inserts when table is empty."""
import asyncio
from decimal import Decimal

from sqlalchemy import select

from .auth import hash_password
from .config import settings
from .database import SessionLocal, engine, Base
from .models import Admin, Product


PRODUCTS = [
    {
        "name": "FarmStay Gold Collagen 2in1 Serum Toner",
        "description": "Oltin va kollagen asosidagi yuz uchun 2-in-1 toner-serum.",
        "price": Decimal("180000"),
        "category": "toner",
        "sort_order": 1,
    },
    {
        "name": "Coreana Orthia Eye Cream",
        "description": "Ko'z atrofi uchun namlantiruvchi va yoshartiruvchi krem.",
        "price": Decimal("220000"),
        "category": "eye-cream",
        "sort_order": 2,
    },
    {
        "name": "Eco Branch Intensive Cream",
        "description": "Quruq teri uchun intensiv namlovchi krem.",
        "price": Decimal("150000"),
        "category": "cream",
        "sort_order": 3,
    },
    {
        "name": "AXIS-Y Dark Spot Serum",
        "description": "Qora dog'larga qarshi serum, terini tekislaydi.",
        "price": Decimal("190000"),
        "category": "serum",
        "sort_order": 4,
    },
    {
        "name": "VT Reedle Shot Lifting Eye Cream",
        "description": "Ko'z atrofi uchun lifting effektli krem.",
        "price": Decimal("280000"),
        "category": "eye-cream",
        "sort_order": 5,
    },
    {
        "name": "Coreana Orthia Rose Gold Cream",
        "description": "Premium yoshartiruvchi krem rose gold formulasi bilan.",
        "price": Decimal("350000"),
        "category": "cream",
        "sort_order": 6,
    },
    {
        "name": "Ronas CC Color Change Cream",
        "description": "Teri rangiga moslashuvchi CC krem.",
        "price": Decimal("200000"),
        "category": "makeup",
        "sort_order": 7,
    },
    {
        "name": "Anua Heartleaf 77% Soothing Toner",
        "description": "Sezgir teri uchun tinchlantiruvchi toner.",
        "price": Decimal("180000"),
        "category": "toner",
        "sort_order": 8,
    },
    {
        "name": "NYM Botocsilk Glow Volume Cream",
        "description": "Yorqin va to'la teri effekti uchun krem.",
        "price": Decimal("250000"),
        "category": "cream",
        "sort_order": 9,
    },
]


async def seed() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        # admin
        result = await db.execute(select(Admin))
        if not result.first():
            db.add(Admin(
                username=settings.ADMIN_USERNAME,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
            ))
            print(f"Created admin '{settings.ADMIN_USERNAME}'")

        # products
        result = await db.execute(select(Product))
        if not result.first():
            for p in PRODUCTS:
                db.add(Product(**p))
            print(f"Inserted {len(PRODUCTS)} products")

        await db.commit()


if __name__ == "__main__":
    asyncio.run(seed())
