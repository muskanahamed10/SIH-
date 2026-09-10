import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────────────────────
    PROJECT_NAME: str = "iGOT Karmayogi AI Competency Gap Platform"
    API_V1_STR: str = "/api/v1"
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: str = "*"

    # ── JWT ───────────────────────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "sih_super_secret_jwt_key_karmayogi_2026_production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./sih_karmayogi.db"
    )

    # ── Redis ─────────────────────────────────────────────────────────────────
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    REDIS_TTL_SECONDS: int = 1800  # 30 minutes default TTL

    # ── AI / External ─────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
