from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .routers import admin, orders, products, uploads
from .seed import seed

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
UPLOADS_DIR = PROJECT_ROOT / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed()
    yield


app = FastAPI(title="Miss Koreya API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.PUBLIC_SITE_URL, "http://localhost", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.public_router)
app.include_router(products.admin_router)
app.include_router(orders.public_router)
app.include_router(orders.admin_router)
app.include_router(admin.router)
app.include_router(uploads.router)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.get("/healthz")
async def healthz():
    return {"ok": True}


# Serve frontend (shop, admin) — Ubuntu prod can also use nginx instead.
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    async def root():
        return FileResponse(FRONTEND_DIR / "index.html")

    @app.get("/admin")
    async def admin_page():
        return FileResponse(FRONTEND_DIR / "admin.html")
