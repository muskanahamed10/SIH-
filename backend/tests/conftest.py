"""
conftest.py — Shared pytest fixtures for all test modules.

Provides:
  - client       : TestClient backed by an in-memory SQLite test DB.
  - db_session   : Raw SQLAlchemy session for direct DB inspection.
  - auth_headers : Authorization headers with a valid M3 JWT token.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from services.api.core.database import Base, get_db
from services.api.core.security import create_access_token, get_password_hash
from services.api.main import app

# ── Test Database (in-memory SQLite, isolated per test session) ───────────────
TEST_DATABASE_URL = "sqlite:///./test_sih.db"

test_engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Session-scoped DB setup ───────────────────────────────────────────────────
@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create all tables once per test session, drop after."""
    # Import models so metadata is complete
    from services.api.models.models import (  # noqa: F401
        User, Role, Competency, RoleCompetency, UserCompetency,
        Evidence, Assessment, MCQQuestion, LearningModule,
        Recommendation, LearningPath, AuditLog,
    )
    Base.metadata.create_all(bind=test_engine)

    # Seed minimal M3 data for tests
    _seed_test_data()

    yield

    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()

    # Clean up test DB file (Windows needs engine disposed first)
    import os, time
    time.sleep(0.2)  # brief pause to let OS release handles
    try:
        if os.path.exists("test_sih.db"):
            os.remove("test_sih.db")
    except PermissionError:
        pass  # leave file if still locked; next run will overwrite it


def _seed_test_data():
    from services.api.models.models import User, Competency, UserCompetency, LearningModule, MCQQuestion
    db = TestingSessionLocal()
    try:
        # User
        if not db.query(User).filter(User.email == "m3.backend@igot.gov.in").first():
            db.add(User(
                id              = "M3-BACKEND-001",
                email           = "m3.backend@igot.gov.in",
                name            = "M3 Backend Developer",
                hashed_password = get_password_hash("m3pass"),
                role            = "Senior Backend Engineer",
                department      = "iGOT Karmayogi Platform Team",
            ))
        # Admin user for RBAC tests
        if not db.query(User).filter(User.email == "admin@igot.gov.in").first():
            db.add(User(
                id              = "ADMIN-001",
                email           = "admin@igot.gov.in",
                name            = "Admin User",
                hashed_password = get_password_hash("adminpass"),
                role            = "admin",
                department      = "iGOT Karmayogi Platform Team",
            ))
        # Competency
        if not db.query(Competency).filter(Competency.id == "COMP-BE-001").first():
            db.add(Competency(
                id          = "COMP-BE-001",
                name        = "RESTful API Design & FastAPI",
                description = "Design and implement scalable REST APIs.",
                category    = "Technical",
            ))
        # UserCompetency
        if not db.query(UserCompetency).filter(UserCompetency.user_id == "M3-BACKEND-001").first():
            db.add(UserCompetency(
                id            = "UC-BE-001",
                user_id       = "M3-BACKEND-001",
                competency_id = "COMP-BE-001",
                current_level = 3.5,
                target_level  = 5.0,
                weight        = 1.0,
            ))
        # LearningModule
        if not db.query(LearningModule).filter(LearningModule.id == "MOD-BE-001").first():
            db.add(LearningModule(
                id             = "MOD-BE-001",
                title          = "FastAPI Mastery: Advanced Patterns",
                provider       = "iGOT Karmayogi Platform Team",
                duration_hours = 20.0,
                language       = "English",
                competency_id  = "COMP-BE-001",
                rating         = 4.9,
            ))
        # MCQ
        if not db.query(MCQQuestion).filter(MCQQuestion.id == "MCQ-BE-001").first():
            db.add(MCQQuestion(
                id            = "MCQ-BE-001",
                competency_id = "COMP-BE-001",
                question      = "Which FastAPI pattern manages shared resources via lifespan?",
                options       = {"A": "on_event", "B": "lifespan asynccontextmanager", "C": "middleware", "D": "global var"},
                answer        = "B",
                explanation   = "FastAPI 0.93+ recommends the lifespan context manager.",
            ))
        db.commit()
    finally:
        db.close()


# ── Per-test fixtures ─────────────────────────────────────────────────────────
@pytest.fixture
def client():
    """TestClient with the test DB injected via dependency override."""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def db_session():
    """Raw SQLAlchemy session for direct DB inspection in tests."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def auth_headers():
    """JWT Bearer headers for M3 user."""
    token = create_access_token(subject="m3.backend@igot.gov.in")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers():
    """JWT Bearer headers for Admin user."""
    token = create_access_token(subject="admin@igot.gov.in")
    return {"Authorization": f"Bearer {token}"}
