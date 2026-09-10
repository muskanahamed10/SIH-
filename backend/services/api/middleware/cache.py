"""
cache.py — Redis caching layer with graceful in-memory fallback.

Design:
  - RedisCache wraps redis-py with TTL-based get/set/invalidate.
  - Falls back to an in-memory TTL dict when Redis is unavailable.
  - @cached(prefix, ttl) decorator for simple route-level caching.
  - cache_service singleton imported by routes.
"""

import json
import time
import logging
from functools import wraps
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)


# ── In-memory fallback ────────────────────────────────────────────────────────
class _InMemoryCache:
    """Simple TTL-aware in-memory cache used when Redis is unavailable."""

    def __init__(self):
        self._store: dict = {}
        self._ttl: dict = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self._store and time.time() < self._ttl.get(key, 0):
            return self._store[key]
        self._store.pop(key, None)
        self._ttl.pop(key, None)
        return None

    def set(self, key: str, value: Any, ttl: int = 1800) -> None:
        self._store[key] = value
        self._ttl[key] = time.time() + ttl

    def invalidate(self, key: str) -> None:
        self._store.pop(key, None)
        self._ttl.pop(key, None)

    def invalidate_prefix(self, prefix: str) -> None:
        stale = [k for k in self._store if k.startswith(prefix)]
        for k in stale:
            self.invalidate(k)

    def clear(self) -> None:
        self._store.clear()
        self._ttl.clear()


# ── Redis Cache ───────────────────────────────────────────────────────────────
class RedisCache:
    """
    Redis-backed cache with automatic JSON serialisation and a graceful
    in-memory fallback when Redis is unavailable (demo-safe).
    """

    def __init__(self, redis_url: str = "redis://localhost:6379/0"):
        self._client = None
        self._fallback = _InMemoryCache()
        self._redis_url = redis_url
        self._connect()

    def _connect(self) -> None:
        try:
            import redis as redis_lib
            client = redis_lib.Redis.from_url(
                self._redis_url, decode_responses=True, socket_connect_timeout=2
            )
            client.ping()
            self._client = client
            logger.info("✅ Redis connected: %s", self._redis_url)
        except Exception as exc:
            logger.warning(
                "⚠️  Redis unavailable (%s) — using in-memory cache fallback.", exc
            )
            self._client = None

    # ── Public interface ─────────────────────────────────────────────────
    def get(self, key: str) -> Optional[Any]:
        if self._client:
            try:
                raw = self._client.get(key)
                return json.loads(raw) if raw is not None else None
            except Exception as exc:
                logger.warning("Redis GET failed: %s", exc)
        return self._fallback.get(key)

    def set(self, key: str, value: Any, ttl: int = 1800) -> None:
        if self._client:
            try:
                self._client.setex(key, ttl, json.dumps(value, default=str))
                return
            except Exception as exc:
                logger.warning("Redis SET failed: %s", exc)
        self._fallback.set(key, value, ttl)

    def invalidate(self, key: str) -> None:
        if self._client:
            try:
                self._client.delete(key)
                return
            except Exception as exc:
                logger.warning("Redis DEL failed: %s", exc)
        self._fallback.invalidate(key)

    def invalidate_prefix(self, prefix: str) -> None:
        """Invalidate all keys sharing a common prefix (pattern delete)."""
        if self._client:
            try:
                pattern = f"{prefix}*"
                keys = self._client.keys(pattern)
                if keys:
                    self._client.delete(*keys)
                return
            except Exception as exc:
                logger.warning("Redis prefix invalidation failed: %s", exc)
        self._fallback.invalidate_prefix(prefix)

    def clear(self) -> None:
        if self._client:
            try:
                self._client.flushdb()
                return
            except Exception as exc:
                logger.warning("Redis FLUSHDB failed: %s", exc)
        self._fallback.clear()

    @property
    def is_redis_active(self) -> bool:
        return self._client is not None


# ── Singleton ─────────────────────────────────────────────────────────────────
def _build_cache() -> RedisCache:
    from services.api.core.config import settings
    return RedisCache(redis_url=settings.REDIS_URL)


cache_service: RedisCache = _build_cache()


# ── @cached decorator ────────────────────────────────────────────────────────
def cached(prefix: str, ttl: int = 1800):
    """
    Decorator for synchronous route handlers.

    Usage:
        @router.get("/competencies")
        @cached("competencies", ttl=3600)
        def get_competencies(...):
            ...

    Cache key: "{prefix}:{arg0_value}" where arg0 is the first positional arg.
    For no-arg routes the key is just the prefix.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Build a simple cache key from prefix + first non-db kwarg value
            key_parts = [prefix]
            for v in args:
                # skip SQLAlchemy sessions and similar objects
                if hasattr(v, "query") or hasattr(v, "credentials"):
                    continue
                key_parts.append(str(v))
            for k, v in kwargs.items():
                if k not in ("db", "current_user", "credentials"):
                    key_parts.append(f"{k}={v}")
            cache_key = ":".join(key_parts)

            cached_val = cache_service.get(cache_key)
            if cached_val is not None:
                return cached_val

            result = func(*args, **kwargs)

            # Only cache JSON-serialisable results (dicts, lists)
            if isinstance(result, (dict, list)):
                cache_service.set(cache_key, result, ttl)

            return result

        return wrapper
    return decorator
