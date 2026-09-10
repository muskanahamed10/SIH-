from datetime import datetime, timedelta
from typing import Any, List, Union

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from services.api.core.config import settings
from services.api.core.database import get_db

# ── Password hashing ──────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# ── JWT creation ──────────────────────────────────────────────────────────────
def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    expire = datetime.utcnow() + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"exp": expire, "sub": str(subject)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> str:
    """Decode JWT and return the 'sub' (email/user_id). Raise 401 on any failure."""
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        sub: str = payload.get("sub")
        if sub is None:
            raise credentials_exc
        return sub
    except JWTError:
        raise credentials_exc


# ── FastAPI dependency: resolve authenticated User ────────────────────────────
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    """
    Dependency that extracts + validates the Bearer JWT and returns the
    corresponding User ORM object. Raises HTTP 401 if token is missing/invalid.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide: Authorization: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = decode_access_token(credentials.credentials)

    # Import here to avoid circular imports at module load
    from services.api.models.models import User  # noqa: PLC0415

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found for this token",
        )
    return user


# ── RBAC: require specific roles ──────────────────────────────────────────────
def require_roles(*allowed_roles: str):
    """
    Returns a FastAPI dependency that asserts the current user holds one of
    the specified roles. Usage:

        @router.get("/admin/logs", dependencies=[Depends(require_roles("admin"))])
    """

    def _check(current_user=Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' is not authorized. "
                       f"Required: {list(allowed_roles)}",
            )
        return current_user

    return _check
