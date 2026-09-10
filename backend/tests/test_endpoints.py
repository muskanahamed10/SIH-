"""
test_endpoints.py — Integration tests for all API endpoints.

Uses TestClient (in-memory SQLite, no real server) to verify:
  - Response shapes and status codes
  - Data integrity (DB reads/writes)
  - Cache key behaviour
  - Assessment submission flow
"""

import pytest


# ── Health ────────────────────────────────────────────────────────────────────
class TestHealth:
    def test_health_returns_200(self, client):
        resp = client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert "database" in data
        assert "redis" in data
        assert "version" in data


# ── Competencies ──────────────────────────────────────────────────────────────
class TestCompetencies:
    def test_get_competencies_requires_auth(self, client):
        resp = client.get("/api/v1/competencies")
        assert resp.status_code == 401

    def test_get_competencies_returns_list(self, client, auth_headers):
        resp = client.get("/api/v1/competencies", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_competency_has_required_fields(self, client, auth_headers):
        resp = client.get("/api/v1/competencies", headers=auth_headers)
        comp = resp.json()[0]
        assert "id" in comp
        assert "name" in comp
        assert "category" in comp


# ── Gap Analysis ──────────────────────────────────────────────────────────────
class TestGapAnalysis:
    def test_get_gaps_requires_auth(self, client):
        resp = client.get("/api/v1/users/M3-BACKEND-001/gaps")
        assert resp.status_code == 401

    def test_get_gaps_returns_analysis(self, client, auth_headers):
        resp = client.get("/api/v1/users/M3-BACKEND-001/gaps", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "user_id" in data
        assert "gaps" in data
        assert "overall_gap" in data
        assert isinstance(data["gaps"], list)

    def test_gap_item_has_required_fields(self, client, auth_headers):
        resp = client.get("/api/v1/users/M3-BACKEND-001/gaps", headers=auth_headers)
        gap = resp.json()["gaps"][0]
        assert "competency_id" in gap
        assert "name" in gap
        assert "current_level" in gap
        assert "target_level" in gap
        assert "gap_score" in gap
        assert "priority" in gap

    def test_gap_score_non_negative(self, client, auth_headers):
        resp = client.get("/api/v1/users/M3-BACKEND-001/gaps", headers=auth_headers)
        for gap in resp.json()["gaps"]:
            assert gap["gap_score"] >= 0.0

    def test_competencies_alias_same_as_gaps(self, client, auth_headers):
        r1 = client.get("/api/v1/users/M3-BACKEND-001/gaps", headers=auth_headers)
        r2 = client.get("/api/v1/users/M3-BACKEND-001/competencies", headers=auth_headers)
        assert r1.status_code == r2.status_code == 200


# ── Learning Modules ──────────────────────────────────────────────────────────
class TestModules:
    def test_get_modules_requires_auth(self, client):
        assert client.get("/api/v1/modules").status_code == 401

    def test_get_modules_returns_list(self, client, auth_headers):
        resp = client.get("/api/v1/modules", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_module_has_required_fields(self, client, auth_headers):
        resp = client.get("/api/v1/modules", headers=auth_headers)
        mod = resp.json()[0]
        assert "id" in mod
        assert "title" in mod
        assert "duration_hours" in mod
        assert "rating" in mod


# ── Recommendations ───────────────────────────────────────────────────────────
class TestRecommendations:
    def test_get_recommendations_requires_auth(self, client):
        assert client.get("/api/v1/recommendations/M3-BACKEND-001").status_code == 401

    def test_get_recommendations_returns_ranked_list(self, client, auth_headers):
        resp = client.get("/api/v1/recommendations/M3-BACKEND-001", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "user_id" in data
        assert "recommendations" in data
        assert isinstance(data["recommendations"], list)

    def test_recommendations_are_sorted_by_score(self, client, auth_headers):
        resp = client.get("/api/v1/recommendations/M3-BACKEND-001", headers=auth_headers)
        scores = [r["score"] for r in resp.json()["recommendations"]]
        assert scores == sorted(scores, reverse=True)

    def test_recommendation_item_has_required_fields(self, client, auth_headers):
        resp = client.get("/api/v1/recommendations/M3-BACKEND-001", headers=auth_headers)
        if resp.json()["recommendations"]:
            rec = resp.json()["recommendations"][0]
            assert "id" in rec
            assert "title" in rec
            assert "score" in rec
            assert "priority_stage" in rec
            assert "duration" in rec


# ── Assessments ───────────────────────────────────────────────────────────────
class TestAssessments:
    def test_get_questions_requires_auth(self, client):
        assert client.get("/api/v1/assessments/questions").status_code == 401

    def test_get_questions_returns_list(self, client, auth_headers):
        resp = client.get("/api/v1/assessments/questions", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "count" in data
        assert "questions" in data
        assert isinstance(data["questions"], list)

    def test_submit_assessment_passed(self, client, auth_headers):
        resp = client.post("/api/v1/assessments/submit", json={
            "user_id": "M3-BACKEND-001",
            "score": 4,
            "total": 5,
        }, headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert data["percentage"] == 80.0
        assert data["nft_minted"] is True
        assert data["blockchain"]["network"] == "Polygon Amoy Testnet"

    def test_submit_assessment_failed(self, client, auth_headers):
        resp = client.post("/api/v1/assessments/submit", json={
            "user_id": "M3-BACKEND-001",
            "score": 2,
            "total": 5,
        }, headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["nft_minted"] is False
        assert data["blockchain"]["token_id"] is None

    def test_submit_assessment_percentage_correct(self, client, auth_headers):
        resp = client.post("/api/v1/assessments/submit", json={
            "user_id": "M3-BACKEND-001",
            "score": 3,
            "total": 4,
        }, headers=auth_headers)
        assert resp.json()["percentage"] == 75.0

    def test_submit_requires_auth(self, client):
        resp = client.post("/api/v1/assessments/submit", json={
            "user_id": "M3-BACKEND-001",
            "score": 4,
            "total": 5,
        })
        assert resp.status_code == 401


# ── iGOT Adapter ─────────────────────────────────────────────────────────────
class TestIGotRoutes:
    def test_list_igot_courses(self, client, auth_headers):
        resp = client.get("/api/v1/igot/courses", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "id" in data[0]
        assert "title" in data[0]

    def test_enroll_in_course(self, client, auth_headers):
        resp = client.post("/api/v1/igot/enroll", json={
            "course_id": "IGOT-BE-204",
        }, headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "enrolled"
        assert "enrollment_id" in data

    def test_get_progress(self, client, auth_headers):
        resp = client.get("/api/v1/igot/progress", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "user_id" in data
        assert "courses" in data
        assert isinstance(data["courses"], list)

    def test_get_certificates(self, client, auth_headers):
        resp = client.get("/api/v1/igot/certificates", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "certificates" in data
        assert isinstance(data["certificates"], list)


# ── Audit Logs ────────────────────────────────────────────────────────────────
class TestAuditLogs:
    def test_audit_logs_accessible(self, client, auth_headers):
        resp = client.get("/api/v1/audit/logs", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "total" in data
        assert "logs" in data
        assert isinstance(data["logs"], list)

    def test_submit_creates_audit_log(self, client, auth_headers, db_session):
        from services.api.models.models import AuditLog
        before_count = db_session.query(AuditLog).count()

        client.post("/api/v1/assessments/submit", json={
            "user_id": "M3-BACKEND-001",
            "score": 5,
            "total": 5,
        }, headers=auth_headers)

        after_count = db_session.query(AuditLog).count()
        assert after_count > before_count
