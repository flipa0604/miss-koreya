from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    price: Decimal
    image_url: str | None
    category: str | None
    in_stock: bool
    sort_order: int


class ProductIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    price: Decimal = Field(ge=0)
    image_url: str | None = None
    category: str | None = None
    in_stock: bool = True
    sort_order: int = 0


class OrderItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=999)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=4, max_length=64)
    address: str = Field(min_length=1)
    comment: str | None = None
    items: list[OrderItemIn] = Field(min_length=1)
    source: str = "web"
    telegram_user_id: str | None = None
    telegram_username: str | None = None


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    product_name: str
    price: Decimal
    quantity: int


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    phone: str
    address: str
    comment: str | None
    total: Decimal
    status: str
    source: str
    telegram_user_id: str | None
    telegram_username: str | None
    created_at: datetime
    items: list[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|confirmed|shipped|delivered|cancelled)$")


class LoginIn(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
