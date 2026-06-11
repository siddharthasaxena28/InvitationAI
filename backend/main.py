from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from database import engine, Base
from config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create all DB tables on startup (idempotent via CREATE TABLE IF NOT EXISTS)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="InviteAI API",
    version="0.1.0",
    description="AI-powered digital invitation card platform — backend API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
from routers import templates, payments, ai, users, render, share  # noqa: E402

app.include_router(templates.router, prefix="/api/templates")
app.include_router(payments.router, prefix="/api/payments")
app.include_router(ai.router, prefix="/api/ai")
app.include_router(users.router, prefix="/api/auth")
app.include_router(render.router, prefix="/api/render")
app.include_router(share.router, prefix="/api/share")


# ── Health & root ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
async def health():
    return {"status": "ok", "service": "InviteAI API"}


@app.get("/", tags=["meta"])
async def root():
    return {
        "message": "InviteAI API",
        "docs": "/docs",
        "redoc": "/redoc",
        "version": "0.1.0",
    }
