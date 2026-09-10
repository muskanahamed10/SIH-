"""
audit.py — Audit logging middleware and helper for the iGOT Karmayogi platform.

Components:
  - AuditMiddleware  : Starlette BaseHTTPMiddleware that auto-logs every
                       non-GET, non-docs request to the audit_logs table.
  - log_audit()      : Helper for explicit audit points inside route handlers.
"""

import uuid
import logging
from typing import Optional, Dict, Any

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Paths that should NOT be audit-logged (health + docs)
_SKIP_PATHS = {"/health", "/docs", "/redoc", "/openapi.json", "/favicon.ico"}


class AuditMiddleware(BaseHTTPMiddleware):
    """
    Starlette middleware that intercepts every modifying request (POST/PUT/PATCH/DELETE)
    and writes an AuditLog record to the database.

    Captures:
      - actor       : email from the JWT Bearer token (or "anonymous")
      - action      : "{METHOD} {path}"
      - object_id   : last non-empty path segment (best-effort)
      - ip_address  : client IP from X-Forwarded-For or request.client
      - request_id  : X-Request-ID header (added by main.py middleware)
      - timestamp   : UTC now
    """

    # HTTP methods we want to audit
    AUDIT_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

    async def dispatch(self, request: Request, call_next) -> Response:
        # Always forward the request first
        response = await call_next(request)

        # Skip read-only requests and docs/health paths
        if (
            request.method not in self.AUDIT_METHODS
            or request.url.path in _SKIP_PATHS
            or request.url.path.startswith("/docs")
            or request.url.path.startswith("/redoc")
        ):
            return response

        try:
            self._write_log(request, response)
        except Exception as exc:
            # Audit failure must never break the main request
            logger.warning("Audit log write failed: %s", exc)

        return response

    # ── Private ─────────────────────────────────────────────────────────
    @staticmethod
    def _extract_actor(request: Request) -> str:
        """Extract user email/sub from the Authorization header without verifying."""
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
            try:
                from jose import jwt as _jwt
                from services.api.core.config import settings
                payload = _jwt.decode(
                    token,
                    settings.SECRET_KEY,
                    algorithms=[settings.ALGORITHM],
                    options={"verify_exp": False},  # already validated by route
                )
                return payload.get("sub", "anonymous")
            except Exception:
                pass
        return "anonymous"

    @staticmethod
    def _extract_object_id(path: str) -> Optional[str]:
        """Best-effort: return the last non-empty path segment as object_id."""
        parts = [p for p in path.strip("/").split("/") if p]
        return parts[-1] if parts else None

    @staticmethod
    def _get_ip(request: Request) -> str:
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        if request.client:
            return request.client.host
        return "unknown"

    def _write_log(self, request: Request, response: Response) -> None:
        from services.api.core.database import SessionLocal
        from services.api.models.models import AuditLog

        db: Session = SessionLocal()
        try:
            log = AuditLog(
                id=str(uuid.uuid4()),
                actor=self._extract_actor(request),
                action=f"{request.method} {request.url.path}",
                object_id=self._extract_object_id(request.url.path),
                ip_address=self._get_ip(request),
                request_id=request.headers.get("X-Request-ID"),
                details={
                    "status_code": response.status_code,
                    "query_params": str(request.query_params) or None,
                },
            )
            db.add(log)
            db.commit()
        except Exception as exc:
            db.rollback()
            raise exc
        finally:
            db.close()


# ── Explicit audit helper ─────────────────────────────────────────────────────
def log_audit(
    db: Session,
    actor: str,
    action: str,
    object_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
) -> None:
    """
    Write an explicit audit log entry from inside a route handler.

    Use this for business-critical events that need richer detail than the
    middleware captures automatically (e.g. NFT minting, password changes).

    Args:
        db        : Active SQLAlchemy session (from Depends(get_db)).
        actor     : User email or identifier performing the action.
        action    : Human-readable description, e.g. "NFT_MINTED".
        object_id : ID of the resource being acted on.
        details   : Optional JSON-serialisable dict with extra context.
    """
    from services.api.models.models import AuditLog

    try:
        log = AuditLog(
            id=str(uuid.uuid4()),
            actor=actor,
            action=action,
            object_id=object_id,
            details=details,
        )
        db.add(log)
        db.flush()  # write without committing — caller commits with the main transaction
    except Exception as exc:
        logger.warning("Explicit audit log failed for actor=%s action=%s: %s", actor, action, exc)
