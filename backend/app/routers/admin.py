from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import create_access_token, verify_password
from ..database import get_db
from ..models import Admin
from ..schemas import LoginIn, TokenOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.username == payload.username))
    admin = result.scalar_one_or_none()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid username or password")
    return TokenOut(access_token=create_access_token(admin.username))
