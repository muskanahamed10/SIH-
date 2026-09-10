"""
test_auth.py — Unit and integration tests for JWT authentication and RBAC.
"""

import pytest


class TestRegister:
    def test_register_new_user(self, client):
        resp = client.post("/api/v1/auth/register", json={
            "email": "newuser@igot.gov.in",
            "name": "New User",
            "password": "newpass123",
            "role": "officer",
            "department": "Test Dept",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "newuser@igot.gov.in"

    def test_register_duplicate_email(self, client):
        # First registration
        client.post("/api/v1/auth/register", json={
            "email": "dupe@igot.gov.in",
            "name": "Dupe User",
            "password": "pass123",
        })
        # Second registration with same email
        resp = client.post("/api/v1/auth/register", json={
            "email": "dupe@igot.gov.in",
            "name": "Dupe User 2",
            "password": "pass456",
        })
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"].lower()


class TestLogin:
    def test_login_success(self, client):
        resp = client.post("/api/v1/auth/login", json={
            "email": "m3.backend@igot.gov.in",
            "password": "m3pass",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["role"] == "Senior Backend Engineer"

    def test_login_wrong_password(self, client):
        resp = client.post("/api/v1/auth/login", json={
            "email": "m3.backend@igot.gov.in",
            "password": "wrongpassword",
        })
        assert resp.status_code == 401
        assert "incorrect" in resp.json()["detail"].lower()

    def test_login_unknown_email(self, client):
        resp = client.post("/api/v1/auth/login", json={
            "email": "nobody@igot.gov.in",
            "password": "doesntmatter",
        })
        assert resp.status_code == 401

    def test_login_returns_user_fields(self, client):
        resp = client.post("/api/v1/auth/login", json={
            "email": "m3.backend@igot.gov.in",
            "password": "m3pass",
        })
        user = resp.json()["user"]
        assert "id" in user
        assert "name" in user
        assert "email" in user
        assert "role" in user
        assert "department" in user


class TestProtectedRoutes:
    def test_no_token_returns_401(self, client):
        resp = client.get("/api/v1/users/me")
        assert resp.status_code == 401

    def test_invalid_token_returns_401(self, client):
        resp = client.get(
            "/api/v1/users/me",
            headers={"Authorization": "Bearer totally.invalid.token"},
        )
        assert resp.status_code == 401

    def test_valid_token_returns_profile(self, client, auth_headers):
        resp = client.get("/api/v1/users/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "m3.backend@igot.gov.in"
        assert data["role"] == "Senior Backend Engineer"

    def test_malformed_bearer_returns_401(self, client):
        resp = client.get(
            "/api/v1/users/me",
            headers={"Authorization": "NotBearer sometoken"},
        )
        assert resp.status_code == 401


class TestRBAC:
    def test_audit_logs_allowed_for_admin(self, client, admin_headers):
        resp = client.get("/api/v1/audit/logs", headers=admin_headers)
        assert resp.status_code == 200

    def test_audit_logs_allowed_for_senior_backend_engineer(self, client, auth_headers):
        """M3 user has 'Senior Backend Engineer' role — should be allowed."""
        resp = client.get("/api/v1/audit/logs", headers=auth_headers)
        assert resp.status_code == 200

    def test_audit_logs_denied_for_officer(self, client):
        # Register a plain officer
        reg = client.post("/api/v1/auth/register", json={
            "email": "officer@igot.gov.in",
            "name": "Plain Officer",
            "password": "officerpass",
            "role": "officer",
            "department": "MoSPI",
        })
        token = reg.json()["access_token"]
        resp = client.get(
            "/api/v1/audit/logs",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 403
