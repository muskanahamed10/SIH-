"""
models.py — 12 canonical SQLAlchemy entities for the iGOT Karmayogi platform.

Entity map (matches SIH Group B architecture spec):
  1.  User              — platform users (officers, admins, backend devs)
  2.  Role              — role definitions with competency requirements
  3.  Competency        — skill/competency catalogue
  4.  RoleCompetency    — target levels per role per competency
  5.  UserCompetency    — user's current level + gap data per competency
  6.  Evidence          — demonstrated competency evidence records
  7.  Assessment        — completed assessment sessions
  8.  MCQQuestion       — question bank items
  9.  LearningModule    — learning resources / courses
  10. Recommendation    — AI-generated course recommendations per user
  11. LearningPath      — ordered sequence of resources for a user
  12. AuditLog          — immutable audit trail of all platform actions
"""

import uuid
import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, JSON, String, Text
)
from services.api.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


# ── 1. User ───────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id              = Column(String, primary_key=True, default=_uuid)
    email           = Column(String(255), unique=True, index=True, nullable=False)
    name            = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role            = Column(String(100), default="officer")       # logical role label
    department      = Column(String(255), default="iGOT Karmayogi Platform Team")
    language        = Column(String(50), default="English")
    wallet_address  = Column(String(255), nullable=True)           # NFT credential wallet
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime, default=datetime.datetime.utcnow)


# ── 2. Role ───────────────────────────────────────────────────────────────────
class Role(Base):
    __tablename__ = "roles"

    id         = Column(String, primary_key=True, default=_uuid)
    role_id    = Column(String(100), unique=True, index=True, nullable=False)
    name       = Column(String(255), nullable=False)
    department = Column(String(255))
    level      = Column(String(100))    # e.g. "Junior", "Senior", "Principal"
    description = Column(Text)


# ── 3. Competency ─────────────────────────────────────────────────────────────
class Competency(Base):
    __tablename__ = "competencies"

    id          = Column(String, primary_key=True, default=_uuid)
    name        = Column(String(255), nullable=False)
    description = Column(Text)
    category    = Column(String(100), default="Domain")  # Domain | Behavioural | Functional


# ── 4. RoleCompetency ─────────────────────────────────────────────────────────
class RoleCompetency(Base):
    """Target proficiency level required for a role per competency."""
    __tablename__ = "role_competencies"

    id            = Column(String, primary_key=True, default=_uuid)
    role_id       = Column(String, ForeignKey("roles.role_id"), index=True)
    competency_id = Column(String, ForeignKey("competencies.id"), index=True)
    target_level  = Column(Float, default=4.0)    # 1.0–5.0
    weight        = Column(Float, default=1.0)     # weighting in gap formula


# ── 5. UserCompetency ─────────────────────────────────────────────────────────
class UserCompetency(Base):
    """Current demonstrated level + gap mapping per user per competency."""
    __tablename__ = "user_competencies"

    id            = Column(String, primary_key=True, default=_uuid)
    user_id       = Column(String, ForeignKey("users.id"), index=True)
    competency_id = Column(String, ForeignKey("competencies.id"), index=True)
    current_level = Column(Float, default=1.0)    # demonstrated level
    target_level  = Column(Float, default=4.0)    # from role requirement
    weight        = Column(Float, default=1.0)
    last_assessed = Column(DateTime, default=datetime.datetime.utcnow)


# ── 6. Evidence ───────────────────────────────────────────────────────────────
class Evidence(Base):
    """Individual evidence records that inform the demonstrated competency level."""
    __tablename__ = "evidence"

    id                  = Column(String, primary_key=True, default=_uuid)
    user_id             = Column(String, ForeignKey("users.id"), index=True)
    competency_id       = Column(String, ForeignKey("competencies.id"), index=True)
    source              = Column(String(255))      # e.g. "assessment", "igot_course", "document"
    demonstrated_level  = Column(Float)
    confidence          = Column(Float, default=0.9)
    timestamp           = Column(DateTime, default=datetime.datetime.utcnow)


# ── 7. Assessment ─────────────────────────────────────────────────────────────
class Assessment(Base):
    __tablename__ = "assessments"

    id              = Column(String, primary_key=True, default=_uuid)
    user_id         = Column(String, ForeignKey("users.id"), index=True)
    mode            = Column(String(100), default="adaptive_diagnostic")
    score           = Column(Float, default=0.0)
    total_questions = Column(Integer, default=5)
    percentage      = Column(Float, default=0.0)
    passed          = Column(Boolean, default=False)
    nft_token_id    = Column(Integer, nullable=True)
    timestamp       = Column(DateTime, default=datetime.datetime.utcnow)


# ── 8. MCQQuestion ────────────────────────────────────────────────────────────
class MCQQuestion(Base):
    __tablename__ = "mcq_questions"

    id            = Column(String, primary_key=True, default=_uuid)
    competency_id = Column(String, ForeignKey("competencies.id"), index=True)
    question      = Column(Text, nullable=False)
    options       = Column(JSON, nullable=False)   # {"A": "...", "B": "...", "C": "...", "D": "..."}
    answer        = Column(String(10), nullable=False)   # e.g. "B"
    difficulty    = Column(String(50), default="intermediate")
    provenance    = Column(String(512))
    explanation   = Column(Text)


# ── 9. LearningModule ─────────────────────────────────────────────────────────
class LearningModule(Base):
    __tablename__ = "learning_modules"

    id             = Column(String, primary_key=True, default=_uuid)
    igot_id        = Column(String(255), nullable=True)   # iGOT platform course ID
    title          = Column(String(512), nullable=False)
    description    = Column(Text)
    provider       = Column(String(255))
    duration_hours = Column(Float, default=10.0)
    language       = Column(String(50), default="English")
    competency_id  = Column(String, ForeignKey("competencies.id"), index=True)
    rating         = Column(Float, default=4.5)
    url            = Column(String(512), nullable=True)


# ── 10. Recommendation ───────────────────────────────────────────────────────
class Recommendation(Base):
    """AI-generated course recommendations stored per user."""
    __tablename__ = "recommendations"

    id             = Column(String, primary_key=True, default=_uuid)
    user_id        = Column(String, ForeignKey("users.id"), index=True)
    module_id      = Column(String, ForeignKey("learning_modules.id"), index=True)
    score          = Column(Float)           # recommendation score (0–1)
    reason         = Column(Text)
    priority_stage = Column(String(50), default="Now")  # Now | Next | Later
    generated_at   = Column(DateTime, default=datetime.datetime.utcnow)


# ── 11. LearningPath ─────────────────────────────────────────────────────────
class LearningPath(Base):
    """Ordered sequence of learning modules for a user."""
    __tablename__ = "learning_paths"

    id                = Column(String, primary_key=True, default=_uuid)
    user_id           = Column(String, ForeignKey("users.id"), index=True)
    ordered_resources = Column(JSON)    # list of module IDs in order
    status            = Column(String(50), default="active")
    created_at        = Column(DateTime, default=datetime.datetime.utcnow)


# ── 12. AuditLog ─────────────────────────────────────────────────────────────
class AuditLog(Base):
    """Immutable audit trail — records every platform action for compliance."""
    __tablename__ = "audit_logs"

    id               = Column(String, primary_key=True, default=_uuid)
    actor            = Column(String(255), index=True)   # user email or system
    action           = Column(String(255))               # e.g. "POST /api/v1/assessments/submit"
    object_id        = Column(String(255), nullable=True)
    ip_address       = Column(String(64), nullable=True)
    request_id       = Column(String(64), nullable=True)
    details          = Column(JSON, nullable=True)       # extra context
    timestamp        = Column(DateTime, default=datetime.datetime.utcnow, index=True)
