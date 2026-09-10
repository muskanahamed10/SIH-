"""
igot_adapter.py — Interface to the iGOT (Integrated Government Online Training) platform.

Architecture:
  - IGotAdapter       : Abstract base — swap mock for real HTTP adapter without changing callers.
  - MockIGotAdapter   : Demo-safe mock returning realistic data for SIH presentation.
  - igot_client       : Singleton mock instance imported by routes.

To swap in the real iGOT API:
    class RealIGotAdapter(IGotAdapter):
        BASE_URL = "https://igot.gov.in/api"
        ...
    igot_client = RealIGotAdapter()
"""

import uuid
from abc import ABC, abstractmethod
from typing import Any, Dict, List


# ── Abstract Interface ────────────────────────────────────────────────────────
class IGotAdapter(ABC):

    @abstractmethod
    async def fetch_user_courses(self, user_id: str) -> List[Dict[str, Any]]:
        """Fetch all courses a user has enrolled in from iGOT."""
        ...

    @abstractmethod
    async def fetch_catalog(self) -> List[Dict[str, Any]]:
        """Fetch the full iGOT course catalogue."""
        ...

    @abstractmethod
    async def enroll_user(self, user_id: str, course_id: str) -> Dict[str, Any]:
        """Enroll a user in a specific iGOT course and return a confirmation receipt."""
        ...

    @abstractmethod
    async def sync_progress(self, user_id: str) -> List[Dict[str, Any]]:
        """Sync and return the latest progress for all of a user's enrolled courses."""
        ...

    @abstractmethod
    async def fetch_certificates(self, user_id: str) -> List[Dict[str, Any]]:
        """Fetch all issued certificates/NFT credentials for a user from iGOT."""
        ...


# ── Mock Implementation ───────────────────────────────────────────────────────
class MockIGotAdapter(IGotAdapter):
    """
    Realistic mock for SIH demo — returns curated backend engineering data
    scoped to the M3 Backend Developer persona.
    """

    # Simulated enrollment store (in-memory for demo)
    _enrollments: Dict[str, List[str]] = {}

    async def fetch_user_courses(self, user_id: str) -> List[Dict[str, Any]]:
        return [
            {
                "course_id": "IGOT-BE-201",
                "title": "FastAPI Advanced Patterns & Microservices",
                "provider": "iGOT Karmayogi Platform Team",
                "status": "completed",
                "score": 94.0,
                "progress_pct": 100.0,
                "completed_at": "2026-08-20T14:30:00Z",
            },
            {
                "course_id": "IGOT-BE-202",
                "title": "Building RAG Pipelines with LangChain",
                "provider": "iGOT Karmayogi Platform Team",
                "status": "in_progress",
                "score": None,
                "progress_pct": 68.0,
                "completed_at": None,
            },
            {
                "course_id": "IGOT-BE-203",
                "title": "JWT Security & OAuth2 for Government APIs",
                "provider": "CERT-In / MeitY",
                "status": "enrolled",
                "score": None,
                "progress_pct": 0.0,
                "completed_at": None,
            },
        ]

    async def fetch_catalog(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "IGOT-BE-201",
                "title": "FastAPI Advanced Patterns & Microservices",
                "provider": "iGOT Karmayogi Platform Team",
                "hours": 20.0,
                "language": "English",
                "rating": 4.9,
                "category": "Backend Engineering",
                "url": "https://igot.gov.in/courses/igot-be-201",
            },
            {
                "id": "IGOT-BE-202",
                "title": "Building RAG Pipelines with LangChain",
                "provider": "iGOT Karmayogi Platform Team",
                "hours": 25.0,
                "language": "English",
                "rating": 4.9,
                "category": "AI/ML Pipeline",
                "url": "https://igot.gov.in/courses/igot-be-202",
            },
            {
                "id": "IGOT-BE-203",
                "title": "JWT Security & OAuth2 for Government APIs",
                "provider": "CERT-In / MeitY",
                "hours": 12.0,
                "language": "English",
                "rating": 4.8,
                "category": "Security",
                "url": "https://igot.gov.in/courses/igot-be-203",
            },
            {
                "id": "IGOT-BE-204",
                "title": "Redis Caching Strategies for High-Traffic APIs",
                "provider": "National e-Governance Division (NeGD)",
                "hours": 10.0,
                "language": "English",
                "rating": 4.6,
                "category": "Performance",
                "url": "https://igot.gov.in/courses/igot-be-204",
            },
            {
                "id": "IGOT-BE-205",
                "title": "Microservices Architecture & API Gateway Design",
                "provider": "iGOT Karmayogi Platform Team",
                "hours": 22.0,
                "language": "English",
                "rating": 4.9,
                "category": "Architecture",
                "url": "https://igot.gov.in/courses/igot-be-205",
            },
            {
                "id": "IGOT-BE-206",
                "title": "SQLAlchemy 2.x & PostgreSQL Optimisation",
                "provider": "National e-Governance Division (NeGD)",
                "hours": 18.0,
                "language": "English",
                "rating": 4.8,
                "category": "Database",
                "url": "https://igot.gov.in/courses/igot-be-206",
            },
            {
                "id": "IGOT-BE-207",
                "title": "Backend Testing: pytest, Testcontainers & Locust",
                "provider": "NSSTA",
                "hours": 14.0,
                "language": "English",
                "rating": 4.7,
                "category": "Quality",
                "url": "https://igot.gov.in/courses/igot-be-207",
            },
        ]

    async def enroll_user(self, user_id: str, course_id: str) -> Dict[str, Any]:
        enrollment_id = f"ENR-{str(uuid.uuid4())[:8].upper()}"
        # Track enrollment in-memory for sync_progress to reflect
        if user_id not in self._enrollments:
            self._enrollments[user_id] = []
        if course_id not in self._enrollments[user_id]:
            self._enrollments[user_id].append(course_id)
        return {
            "status": "enrolled",
            "user_id": user_id,
            "course_id": course_id,
            "enrollment_id": enrollment_id,
            "enrolled_at": "2026-09-10T10:30:00+05:30",
            "message": f"Successfully enrolled in course {course_id}. "
                       f"Access it at: https://igot.gov.in/courses/{course_id}",
        }

    async def sync_progress(self, user_id: str) -> List[Dict[str, Any]]:
        base_courses = await self.fetch_user_courses(user_id)
        # Append any newly enrolled courses tracked in-memory
        enrolled_ids = {c["course_id"] for c in base_courses}
        extra = self._enrollments.get(user_id, [])
        for cid in extra:
            if cid not in enrolled_ids:
                base_courses.append({
                    "course_id": cid,
                    "title": f"iGOT Course {cid}",
                    "status": "enrolled",
                    "progress_pct": 0.0,
                    "score": None,
                    "completed_at": None,
                })
        return base_courses

    async def fetch_certificates(self, user_id: str) -> List[Dict[str, Any]]:
        return [
            {
                "certificate_id": f"CERT-{str(uuid.uuid4())[:8].upper()}",
                "course_id": "IGOT-BE-201",
                "title": "FastAPI Advanced Patterns & Microservices — Completion Certificate",
                "issued_at": "2026-08-20T15:00:00Z",
                "token_id": 4201,
                "tx_hash": "0x9f4a2b1c8e7d6f5a4b3c2d1e0f8a7b6c5d4e3f2a1b0c9f8",
                "network": "Polygon Amoy Testnet",
                "contract": "0x71C2B9a1dE09F39A",
                "soulbound": True,
            }
        ]


# ── Singleton ─────────────────────────────────────────────────────────────────
igot_client = MockIGotAdapter()
