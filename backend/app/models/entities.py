import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, JSON, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role_id = Column(String, default="SSO_GRADE_2")
    department = Column(String, default="Ministry of Statistics and Programme Implementation (MoSPI)")
    language = Column(String, default="English")
    wallet_address = Column(String, default="0x71C...39A")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(String, unique=True, index=True)
    name = Column(String)
    department = Column(String)
    level = Column(String)

class Competency(Base):
    __tablename__ = "competencies"
    id = Column(Integer, primary_key=True, index=True)
    competency_id = Column(String, unique=True, index=True)
    type = Column(String)
    name = Column(String)
    description = Column(Text)

class RoleCompetency(Base):
    __tablename__ = "role_competencies"
    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(String, index=True)
    competency_id = Column(String, index=True)
    target_level = Column(Float, default=4.0)
    weight = Column(Float, default=1.0)

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    competency_id = Column(String, index=True)
    source = Column(String)
    demonstrated_level = Column(Float)
    confidence = Column(Float, default=0.9)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(String, unique=True, index=True)
    user_id = Column(String, index=True)
    mode = Column(String, default="adaptive_diagnostic")
    score = Column(Float, default=0.0)
    total_questions = Column(Integer, default=5)
    status = Column(String, default="completed")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(String, unique=True, index=True)
    competency_id = Column(String, index=True)
    stem = Column(Text)
    options = Column(JSON)
    correct_option = Column(Integer)
    provenance = Column(String)
    difficulty = Column(String, default="intermediate")

class LearningResource(Base):
    __tablename__ = "learning_resources"
    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(String, unique=True, index=True)
    igot_id = Column(String, index=True)
    title = Column(String)
    provider = Column(String)
    competency_id = Column(String, index=True)
    duration = Column(String)
    rating = Column(Float, default=4.5)
    language = Column(String, default="English")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    resource_id = Column(String, index=True)
    score = Column(Float)
    reason = Column(String)
    priority_stage = Column(String, default="Now")

class LearningPath(Base):
    __tablename__ = "learning_paths"
    id = Column(Integer, primary_key=True, index=True)
    path_id = Column(String, unique=True, index=True)
    user_id = Column(String, index=True)
    ordered_resources = Column(JSON)
    status = Column(String, default="active")

class TelemetryEvent(Base):
    __tablename__ = "telemetry_events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    event_type = Column(String)
    payload = Column(JSON)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    actor = Column(String)
    action = Column(String)
    object_id = Column(String)
    blockchain_hash = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
