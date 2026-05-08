import re
import secrets
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..auth import get_current_admin

router = APIRouter(prefix="/api/admin/uploads", tags=["admin:uploads"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_BYTES = 10 * 1024 * 1024  # 10 MB
_SAFE = re.compile(r"[^a-zA-Z0-9._-]+")


@router.post("", status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    _=Depends(get_current_admin),
):
    if not file.filename:
        raise HTTPException(400, "Empty filename")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Unsupported extension {ext}; allowed: {sorted(ALLOWED_EXT)}")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "File too large (max 10 MB)")

    stem = _SAFE.sub("-", Path(file.filename).stem)[:60] or "img"
    name = f"{datetime.now(timezone.utc):%Y%m%d-%H%M%S}-{secrets.token_hex(4)}-{stem}{ext}"
    target = UPLOAD_DIR / name
    target.write_bytes(data)

    return {"url": f"/uploads/{name}", "filename": name}
