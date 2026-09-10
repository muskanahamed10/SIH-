"""
seed.py — M3 Backend Developer demo data seeder.

Seeds the database with M3-only data:
  - 1  User        : M3 Backend Developer
  - 1  Role        : Senior Backend Engineer
  - 7  Competencies: Backend engineering domains
  - 7  RoleCompetency mappings
  - 7  UserCompetency gap records (current vs target levels)
  - 8  LearningModules: backend-focused courses
  - 7  MCQQuestions: backend engineering domain

Called automatically from main.py lifespan on startup.
Safe to call multiple times — checks existence before inserting.
"""

import uuid
import datetime
import logging

from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


def seed_m3_data(db: Session) -> None:
    """Idempotently seed M3 Backend Developer demo data."""
    from services.api.models.models import (
        User, Role, Competency, RoleCompetency,
        UserCompetency, LearningModule, MCQQuestion,
    )
    from services.api.core.security import get_password_hash

    # ── Guard: skip if already seeded ─────────────────────────────────────
    if db.query(User).filter(User.email == "m3.backend@igot.gov.in").first():
        logger.info("Seed: M3 data already present — skipping.")
        return

    logger.info("Seed: Inserting M3 Backend Developer demo data…")

    # ── 1. Role ────────────────────────────────────────────────────────────
    role = Role(
        id          = str(uuid.uuid4()),
        role_id     = "SENIOR_BACKEND_ENGINEER",
        name        = "Senior Backend Engineer",
        department  = "iGOT Karmayogi Platform Team",
        level       = "Senior",
        description = "Owns the API server, data layer, authentication, caching, and AI pipeline integration.",
    )
    db.add(role)

    # ── 2. User ────────────────────────────────────────────────────────────
    M3_ID    = "M3-BACKEND-001"
    M3_EMAIL = "m3.backend@igot.gov.in"

    user = User(
        id              = M3_ID,
        email           = M3_EMAIL,
        name            = "M3 Backend Developer",
        hashed_password = get_password_hash("m3pass"),
        role            = "Senior Backend Engineer",
        department      = "iGOT Karmayogi Platform Team",
        language        = "English",
        wallet_address  = "0xM3B4CK3ND00000000000000000000000000000001",
        is_active       = True,
        created_at      = datetime.datetime(2026, 1, 15, 9, 0, 0),
    )
    db.add(user)

    # ── 3. Competencies ────────────────────────────────────────────────────
    competencies_raw = [
        ("COMP-BE-001", "RESTful API Design & FastAPI",
         "Design and implement scalable REST APIs using FastAPI, Pydantic models, and OpenAPI specs.",
         "Technical"),
        ("COMP-BE-002", "Database Architecture & ORM (SQLAlchemy)",
         "Model relational data with SQLAlchemy, write efficient queries, manage migrations.",
         "Technical"),
        ("COMP-BE-003", "AI/ML Pipeline Integration",
         "Integrate RAG pipelines, vector embeddings, LightGBM recommenders, and LLM APIs into backend services.",
         "Technical"),
        ("COMP-BE-004", "Authentication & Security (JWT/OAuth2)",
         "Implement JWT-based auth, OAuth2 flows, RBAC, and API security best practices.",
         "Technical"),
        ("COMP-BE-005", "Caching & Performance Optimization (Redis)",
         "Design Redis caching strategies, TTL management, and cache invalidation patterns.",
         "Technical"),
        ("COMP-BE-006", "Microservices & System Design",
         "Architect loosely coupled microservices, API gateways, inter-service communication.",
         "Architecture"),
        ("COMP-BE-007", "Testing & Quality Assurance",
         "Write unit, integration, and load tests; set up CI pipelines for backend services.",
         "Quality"),
    ]

    for cid, name, desc, cat in competencies_raw:
        db.add(Competency(id=cid, name=name, description=desc, category=cat))

    # ── 4. RoleCompetency mappings ─────────────────────────────────────────
    role_comp_data = [
        # (competency_id, target_level, weight)
        ("COMP-BE-001", 5.0, 1.0),
        ("COMP-BE-002", 5.0, 1.0),
        ("COMP-BE-003", 5.0, 1.2),
        ("COMP-BE-004", 5.0, 0.9),
        ("COMP-BE-005", 4.5, 1.0),
        ("COMP-BE-006", 5.0, 1.1),
        ("COMP-BE-007", 4.5, 0.8),
    ]
    for cid, tgt, wt in role_comp_data:
        db.add(RoleCompetency(
            id            = str(uuid.uuid4()),
            role_id       = "SENIOR_BACKEND_ENGINEER",
            competency_id = cid,
            target_level  = tgt,
            weight        = wt,
        ))

    # ── 5. UserCompetency gap records ──────────────────────────────────────
    uc_data = [
        # (competency_id, current_level, target_level, weight)
        ("COMP-BE-001", 3.5, 5.0, 1.0),
        ("COMP-BE-002", 3.0, 5.0, 1.0),
        ("COMP-BE-003", 2.0, 5.0, 1.2),
        ("COMP-BE-004", 3.5, 5.0, 0.9),
        ("COMP-BE-005", 2.5, 4.5, 1.0),
        ("COMP-BE-006", 2.5, 5.0, 1.1),
        ("COMP-BE-007", 3.0, 4.5, 0.8),
    ]
    for cid, cur, tgt, wt in uc_data:
        db.add(UserCompetency(
            id            = str(uuid.uuid4()),
            user_id       = M3_ID,
            competency_id = cid,
            current_level = cur,
            target_level  = tgt,
            weight        = wt,
            last_assessed = datetime.datetime(2026, 9, 1, 10, 0, 0),
        ))

    # ── 6. Learning Modules ────────────────────────────────────────────────
    modules_raw = [
        ("MOD-BE-001",
         "FastAPI Mastery: Advanced Patterns & Performance",
         "Deep-dive into dependency injection, background tasks, WebSockets, and profiling in FastAPI.",
         "iGOT Karmayogi Platform Team", 20.0, "English", "COMP-BE-001", 4.9),
        ("MOD-BE-002",
         "SQLAlchemy 2.x & Advanced Query Optimisation",
         "Master ORM patterns, raw SQL execution, async sessions, and PostgreSQL tuning.",
         "National e-Governance Division (NeGD)", 18.0, "English", "COMP-BE-002", 4.8),
        ("MOD-BE-003",
         "Building RAG Pipelines with LangChain & Vector DBs",
         "End-to-end Retrieval-Augmented Generation: chunking, embedding, pgvector, Gemini API.",
         "iGOT Karmayogi Platform Team", 25.0, "English", "COMP-BE-003", 4.9),
        ("MOD-BE-004",
         "LightGBM Recommender Systems for Government Platforms",
         "Train, tune, and deploy LightGBM-based recommendation engines with feature engineering.",
         "iGOT Karmayogi Platform Team", 15.0, "English", "COMP-BE-003", 4.7),
        ("MOD-BE-005",
         "JWT, OAuth2 & API Security Best Practices",
         "Implement secure token flows, RBAC, rate limiting, and OWASP API Top-10 mitigations.",
         "CERT-In / MeitY", 12.0, "English", "COMP-BE-004", 4.8),
        ("MOD-BE-006",
         "Redis Caching for High-Performance APIs",
         "Cache strategies (write-through, write-behind), TTL design, Pub/Sub, and Redis Streams.",
         "National e-Governance Division (NeGD)", 10.0, "English", "COMP-BE-005", 4.6),
        ("MOD-BE-007",
         "Microservices Architecture & API Gateway Design",
         "Domain-driven design, inter-service comms (REST/gRPC), circuit breakers, and observability.",
         "iGOT Karmayogi Platform Team", 22.0, "English", "COMP-BE-006", 4.9),
        ("MOD-BE-008",
         "Backend Testing: pytest, Testcontainers & Load Testing",
         "Write reliable unit + integration tests, mock external services, and run Locust load tests.",
         "NSSTA", 14.0, "English", "COMP-BE-007", 4.7),
    ]
    for mid, title, desc, provider, dur, lang, cid, rating in modules_raw:
        db.add(LearningModule(
            id             = mid,
            title          = title,
            description    = desc,
            provider       = provider,
            duration_hours = dur,
            language       = lang,
            competency_id  = cid,
            rating         = rating,
        ))

    # ── 7. MCQ Questions ───────────────────────────────────────────────────
    mcq_raw = [
        {
            "id": "MCQ-BE-001",
            "competency_id": "COMP-BE-001",
            "question": "Which FastAPI pattern is used to manage shared resources (e.g. DB connections) across the application lifespan?",
            "options": {
                "A": "@app.on_event('startup') decorator",
                "B": "contextlib.asynccontextmanager with lifespan parameter",
                "C": "middleware only",
                "D": "global variable initialization at module import"
            },
            "answer": "B",
            "difficulty": "intermediate",
            "provenance": "FastAPI Official Docs – Lifespan Events",
            "explanation": "FastAPI 0.93+ recommends the lifespan context manager (asynccontextmanager) for startup/shutdown logic, replacing the deprecated on_event decorators.",
        },
        {
            "id": "MCQ-BE-002",
            "competency_id": "COMP-BE-002",
            "question": "In SQLAlchemy 2.x, what is the recommended way to execute a SELECT query using the ORM session?",
            "options": {
                "A": "session.query(Model).all()",
                "B": "session.execute(select(Model)).scalars().all()",
                "C": "session.run(Model)",
                "D": "Model.objects.all()"
            },
            "answer": "B",
            "difficulty": "intermediate",
            "provenance": "SQLAlchemy 2.0 Migration Guide",
            "explanation": "SQLAlchemy 2.x promotes the select() construct with session.execute(). The legacy session.query() still works but is considered legacy.",
        },
        {
            "id": "MCQ-BE-003",
            "competency_id": "COMP-BE-003",
            "question": "In a RAG pipeline, what is the primary purpose of the 'chunker' component?",
            "options": {
                "A": "Generates MCQ questions from text",
                "B": "Splits large documents into smaller, semantically meaningful segments for embedding",
                "C": "Handles HTTP request routing",
                "D": "Compresses vector embeddings to reduce storage"
            },
            "answer": "B",
            "difficulty": "intermediate",
            "provenance": "iGOT SIH 2026 – Group B Architecture Guide",
            "explanation": "Chunking breaks documents into segments that fit within the embedding model's token window while preserving semantic context for retrieval accuracy.",
        },
        {
            "id": "MCQ-BE-004",
            "competency_id": "COMP-BE-004",
            "question": "Which HTTP header is the standard way to transmit a JWT Bearer token in API requests?",
            "options": {
                "A": "X-Auth-Token: <token>",
                "B": "Cookie: jwt=<token>",
                "C": "Authorization: Bearer <token>",
                "D": "API-Key: <token>"
            },
            "answer": "C",
            "difficulty": "basic",
            "provenance": "RFC 6750 – OAuth 2.0 Bearer Token Usage",
            "explanation": "RFC 6750 defines Authorization: Bearer <token> as the standard mechanism for transmitting JWT access tokens in HTTP requests.",
        },
        {
            "id": "MCQ-BE-005",
            "competency_id": "COMP-BE-005",
            "question": "What Redis command atomically sets a key with a value and an expiry time in seconds?",
            "options": {
                "A": "SET key value EXPIRE seconds",
                "B": "SETEX key seconds value",
                "C": "PUT key value TTL seconds",
                "D": "CACHE key value seconds"
            },
            "answer": "B",
            "difficulty": "basic",
            "provenance": "Redis Documentation – SETEX",
            "explanation": "SETEX atomically sets a key to a value and sets its TTL in one command. Equivalent to SET key value EX seconds in Redis 2.6+.",
        },
        {
            "id": "MCQ-BE-006",
            "competency_id": "COMP-BE-006",
            "question": "In microservices architecture, which pattern prevents cascading failures when a dependent service is unavailable?",
            "options": {
                "A": "Sidecar Pattern",
                "B": "Circuit Breaker Pattern",
                "C": "Saga Pattern",
                "D": "CQRS Pattern"
            },
            "answer": "B",
            "difficulty": "intermediate",
            "provenance": "Martin Fowler – Patterns of Enterprise Application Architecture",
            "explanation": "The Circuit Breaker Pattern detects repeated failures and opens the circuit to stop sending requests to the failing service, preventing cascading failures.",
        },
        {
            "id": "MCQ-BE-007",
            "competency_id": "COMP-BE-007",
            "question": "Which FastAPI utility is recommended for writing integration tests without running an actual server?",
            "options": {
                "A": "requests.Session()",
                "B": "fastapi.testclient.TestClient",
                "C": "httpx.AsyncClient with pytest-asyncio",
                "D": "Both TestClient and httpx.AsyncClient are valid approaches"
            },
            "answer": "D",
            "difficulty": "intermediate",
            "provenance": "FastAPI Official Docs – Testing",
            "explanation": "FastAPI supports TestClient (synchronous, wraps requests) and httpx.AsyncClient (async tests with pytest-asyncio). Both are valid for integration testing.",
        },
    ]
    for q in mcq_raw:
        db.add(MCQQuestion(**q))

    db.commit()
    logger.info(
        "Seed: ✅  M3 Backend Developer data inserted — "
        "1 user, 1 role, 7 competencies, 7 gap mappings, 8 modules, 7 MCQs."
    )
