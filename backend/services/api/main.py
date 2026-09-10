"""
main.py — FastAPI application entry point for the iGOT Karmayogi platform (M3 Backend).

Features:
  - Lifespan context manager: creates DB tables + seeds M3 demo data on startup.
  - AuditMiddleware: auto-logs all POST/PUT/PATCH/DELETE requests.
  - X-Request-ID middleware: stamps every request with a unique trace ID.
  - CORS middleware: permissive for demo; restrict origins in production.
  - Global 500 exception handler: returns JSON instead of HTML stack traces.
"""

import logging
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from services.api.core.config import settings
from services.api.core.database import engine, Base, SessionLocal
from services.api.api.v1.endpoints.api import router as api_router
from services.api.api.v1.endpoints.learner import router as learner_router
from services.api.middleware.audit import AuditMiddleware

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ── Request-ID Middleware ─────────────────────────────────────────────────────
class RequestIDMiddleware(BaseHTTPMiddleware):
    """Stamp every request with a unique X-Request-ID header for distributed tracing."""

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan:
      Startup  — create all 12 DB tables, then seed M3 demo data (idempotent).
      Shutdown — log graceful stop.
    """
    # Import all models so SQLAlchemy metadata is complete before create_all
    from services.api.models.models import (  # noqa: F401
        User, Role, Competency, RoleCompetency, UserCompetency,
        Evidence, Assessment, MCQQuestion, LearningModule,
        Recommendation, LearningPath, AuditLog,
    )

    logger.info("🚀  Creating database tables…")
    Base.metadata.create_all(bind=engine)
    logger.info("✅  Tables created (or already exist).")

    # Seed demo data
    from services.api.core.seed import seed_m3_data
    db = SessionLocal()
    try:
        seed_m3_data(db)
    except Exception as exc:
        logger.error("Seed failed: %s", exc)
    finally:
        db.close()

    logger.info("🟢  iGOT Karmayogi API ready — http://localhost:8000/docs")
    yield
    logger.info("🔴  iGOT Karmayogi API shutting down.")


# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title       = settings.PROJECT_NAME,
    description = (
        "M3 Backend Developer API — iGOT Karmayogi AI Competency Gap Platform\n\n"
        "**Authenticate**: POST /api/v1/auth/login → copy `access_token` → "
        "click 🔒 Authorize → paste as `Bearer <token>`"
    ),
    version     = "2.0.0",
    docs_url    = "/docs",
    redoc_url   = "/redoc",
    lifespan    = lifespan,
)

# ── Middleware (order matters: outermost runs first on request) ───────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(AuditMiddleware)

# ── Global Exception Handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "path": str(request.url.path),
            "request_id": request.headers.get("X-Request-ID", "unknown"),
        },
    )

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(learner_router, prefix="/api")        # Next.js calls /api/learner/... directly
app.include_router(learner_router, prefix=settings.API_V1_STR)  # Also available under /api/v1/learner/...

# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check():
    from services.api.middleware.cache import cache_service
    return {
        "status": "healthy",
        "service": "iGOT Karmayogi M3 Backend API",
        "version": "2.0.0",
        "database": "connected",
        "redis": "connected" if cache_service.is_redis_active else "fallback (in-memory)",
    }


# ── Dev entrypoint ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "services.api.main:app",
        host    = "0.0.0.0",
        port    = 8000,
        reload  = True,
        log_level = settings.LOG_LEVEL.lower(),
    )
