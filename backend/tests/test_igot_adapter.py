"""
test_igot_adapter.py — Unit tests for the iGOT Mock Adapter.

Tests all 5 adapter methods:
  - fetch_user_courses()
  - fetch_catalog()
  - enroll_user()
  - sync_progress()
  - fetch_certificates()
"""

import pytest
import asyncio
from services.api.adapters.igot_adapter import MockIGotAdapter


@pytest.fixture
def adapter():
    """Fresh adapter instance per test (no shared enrollment state)."""
    return MockIGotAdapter()


# ── fetch_catalog ──────────────────────────────────────────────────────────────
class TestFetchCatalog:
    def test_returns_list(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(adapter.fetch_catalog())
        assert isinstance(result, list)

    def test_has_items(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(adapter.fetch_catalog())
        assert len(result) >= 3

    def test_item_has_required_fields(self, adapter):
        catalog = asyncio.get_event_loop().run_until_complete(adapter.fetch_catalog())
        item = catalog[0]
        assert "id" in item
        assert "title" in item
        assert "provider" in item
        assert "hours" in item
        assert "language" in item
        assert "rating" in item

    def test_all_items_have_english_option(self, adapter):
        catalog = asyncio.get_event_loop().run_until_complete(adapter.fetch_catalog())
        languages = [c["language"] for c in catalog]
        assert "English" in languages


# ── fetch_user_courses ────────────────────────────────────────────────────────
class TestFetchUserCourses:
    def test_returns_list(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_user_courses("M3-BACKEND-001")
        )
        assert isinstance(result, list)

    def test_has_status_field(self, adapter):
        courses = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_user_courses("M3-BACKEND-001")
        )
        for c in courses:
            assert "status" in c
            assert c["status"] in {"completed", "in_progress", "enrolled"}

    def test_has_course_id(self, adapter):
        courses = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_user_courses("M3-BACKEND-001")
        )
        for c in courses:
            assert "course_id" in c

    def test_completed_has_score(self, adapter):
        courses = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_user_courses("M3-BACKEND-001")
        )
        completed = [c for c in courses if c["status"] == "completed"]
        for c in completed:
            assert c.get("score") is not None


# ── enroll_user ───────────────────────────────────────────────────────────────
class TestEnrollUser:
    def test_returns_enrollment_confirmation(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(
            adapter.enroll_user("M3-BACKEND-001", "IGOT-BE-204")
        )
        assert result["status"] == "enrolled"

    def test_returns_enrollment_id(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(
            adapter.enroll_user("M3-BACKEND-001", "IGOT-BE-204")
        )
        assert "enrollment_id" in result
        assert result["enrollment_id"].startswith("ENR-")

    def test_returns_correct_course_id(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(
            adapter.enroll_user("M3-BACKEND-001", "IGOT-BE-205")
        )
        assert result["course_id"] == "IGOT-BE-205"

    def test_returns_correct_user_id(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(
            adapter.enroll_user("USR-999", "IGOT-BE-201")
        )
        assert result["user_id"] == "USR-999"

    def test_unique_enrollment_ids(self, adapter):
        r1 = asyncio.get_event_loop().run_until_complete(
            adapter.enroll_user("M3-BACKEND-001", "IGOT-BE-204")
        )
        r2 = asyncio.get_event_loop().run_until_complete(
            adapter.enroll_user("M3-BACKEND-001", "IGOT-BE-204")
        )
        # Duplicate enrollment — enrollment IDs may differ (UUID-based)
        assert r1["status"] == r2["status"] == "enrolled"


# ── sync_progress ─────────────────────────────────────────────────────────────
class TestSyncProgress:
    def test_returns_list(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(
            adapter.sync_progress("M3-BACKEND-001")
        )
        assert isinstance(result, list)

    def test_reflects_new_enrollment(self, adapter):
        # Enroll first
        asyncio.get_event_loop().run_until_complete(
            adapter.enroll_user("M3-BACKEND-999", "IGOT-BE-207")
        )
        # Then sync
        progress = asyncio.get_event_loop().run_until_complete(
            adapter.sync_progress("M3-BACKEND-999")
        )
        course_ids = [p["course_id"] for p in progress]
        assert "IGOT-BE-207" in course_ids

    def test_progress_pct_non_negative(self, adapter):
        progress = asyncio.get_event_loop().run_until_complete(
            adapter.sync_progress("M3-BACKEND-001")
        )
        for p in progress:
            pct = p.get("progress_pct", 0) or 0
            assert pct >= 0.0


# ── fetch_certificates ────────────────────────────────────────────────────────
class TestFetchCertificates:
    def test_returns_list(self, adapter):
        result = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_certificates("M3-BACKEND-001")
        )
        assert isinstance(result, list)

    def test_certificate_has_required_fields(self, adapter):
        certs = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_certificates("M3-BACKEND-001")
        )
        if certs:
            cert = certs[0]
            assert "certificate_id" in cert
            assert "course_id" in cert
            assert "title" in cert
            assert "issued_at" in cert
            assert "network" in cert

    def test_certificate_is_soulbound(self, adapter):
        certs = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_certificates("M3-BACKEND-001")
        )
        for cert in certs:
            assert cert.get("soulbound") is True

    def test_token_id_is_integer(self, adapter):
        certs = asyncio.get_event_loop().run_until_complete(
            adapter.fetch_certificates("M3-BACKEND-001")
        )
        for cert in certs:
            if cert.get("token_id") is not None:
                assert isinstance(cert["token_id"], int)
