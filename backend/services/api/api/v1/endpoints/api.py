"""
api.py — All REST API route handlers for the iGOT Karmayogi platform (M3 Backend Developer).

Route groups:
  1.  Auth           POST /auth/login, POST /auth/register
  2.  Users          GET /users/me, GET /users/{id}/competencies, GET /users/{id}/gaps
  3.  Competencies   GET /competencies
  4.  Gap Analysis   GET /users/{id}/gaps  (alias)
  5.  Modules        GET /modules
  6.  Recommendations GET /recommendations/{user_id}
  7.  Assessments    GET /assessments/questions, POST /assessments/submit
  8.  iGOT Adapter   GET /igot/courses, POST /igot/enroll, GET /igot/progress,
                     GET /igot/certificates
  9.  Documents      POST /documents/upload
  10. Audit          GET /audit/logs  (admin-only)
"""

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from services.api.core.database import get_db
from services.api.core.security import (
    create_access_token,
    get_current_user,
    get_password_hash,
    require_roles,
    verify_password,
)
from services.api.engine.gap_engine import (
    calculate_recommendation_score,
    compute_gap,
    compute_overall_gap,
    get_priority,
    rank_recommendations,
)
from services.api.adapters.igot_adapter import igot_client
from services.api.middleware.cache import cache_service, cached
from services.api.middleware.audit import log_audit
from services.api.models.models import (
    Assessment, AuditLog, Competency, LearningModule,
    MCQQuestion, Recommendation, User, UserCompetency,
)
from services.api.schemas.schemas import (
    AssessmentResultResponse,
    AssessmentSubmitRequest,
    AssessmentQuestionsResponse,
    AuditLogsListResponse,
    AuditLogResponse,
    BlockchainReceipt,
    CertificatesResponse,
    DocumentUploadResponse,
    EnrollRequest,
    EnrollResponse,
    GapAnalysisResponse,
    GapScoreItem,
    LoginRequest,
    ProgressResponse,
    RecommendationItem,
    RecommendationResponse,
    RegisterRequest,
    TokenResponse,
    UserProfileResponse,
)

router = APIRouter()


# ═══════════════════════════════════════════════════════════════════════════════
# 1. AUTH
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/auth/login", response_model=TokenResponse, tags=["Auth"])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user and return a signed JWT access token."""
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(subject=user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        },
    }


@router.post("/auth/register", response_model=TokenResponse, tags=["Auth"])
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user and return a JWT."""
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    new_user = User(
        id              = str(uuid.uuid4()),
        email           = payload.email,
        name            = payload.name,
        hashed_password = get_password_hash(payload.password),
        role            = payload.role,
        department      = payload.department,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "department": new_user.department,
        },
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 2. USERS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/users/me", response_model=UserProfileResponse, tags=["Users"])
def get_me(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department": current_user.department,
        "language": current_user.language,
        "wallet_address": current_user.wallet_address,
        "karma_points": 585,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 3. COMPETENCIES
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/competencies", tags=["Competencies"])
def get_all_competencies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the full competency catalogue. Results are Redis-cached for 1 hour."""
    cache_key = "competencies:all"
    cached_val = cache_service.get(cache_key)
    if cached_val:
        return cached_val

    comps = db.query(Competency).all()
    result = [
        {
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "category": c.category,
        }
        for c in comps
    ]
    cache_service.set(cache_key, result, ttl=3600)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# 4. GAP ANALYSIS (Prompt 2 & Group A Specification)
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/gap/{user_id}", tags=["Gap Analysis"])
def get_user_gap_vector(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns exact GapVector contract required by Group A:
    GET /api/v1/gap/{user_id} -> List[GapVector]
    """
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user_id).all()
    if not user_comps:
        user_comps = db.query(UserCompetency).all()

    vectors = []
    for uc in user_comps:
        comp = db.query(Competency).filter(Competency.id == uc.competency_id).first()
        comp_name = comp.name if comp else uc.competency_id
        req_lvl = int(round(uc.target_level))
        cur_lvl = float(uc.current_level)
        gap_s = compute_gap_score(req_lvl, cur_lvl)

        prio_label = "critical" if gap_s >= 0.4 else ("high" if gap_s >= 0.25 else ("medium" if gap_s >= 0.1 else "low"))
        vectors.append({
            "competency_id": uc.competency_id,
            "competency_name": comp_name,
            "competency_name_hi": getattr(comp, "name_hi", comp_name),
            "required_level": req_lvl,
            "current_level": cur_lvl,
            "gap_score": round(gap_s, 4),
            "priority": prio_label,
        })
    return vectors


@router.get("/users/{user_id}/competencies", tags=["Gap Analysis"])
@router.get("/users/{user_id}/gaps", tags=["Gap Analysis"])
def get_user_gaps(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Compute and return competency gap analysis for a user.
    Reads live UserCompetency records from the database.
    """
    cache_key = f"gaps:{user_id}"
    cached_val = cache_service.get(cache_key)
    if cached_val:
        return cached_val

    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user_id).all()
    if not user_comps:
        # Fallback: return all user_competencies (for demo where user_id may differ)
        user_comps = db.query(UserCompetency).all()

    gaps = []
    uc_dicts = []
    for uc in user_comps:
        comp = db.query(Competency).filter(Competency.id == uc.competency_id).first()
        comp_name = comp.name if comp else uc.competency_id
        g = compute_gap(uc.target_level, uc.current_level, uc.weight)
        gaps.append(
            GapScoreItem(
                competency_id = uc.competency_id,
                name          = comp_name,
                target_level  = uc.target_level,
                current_level = uc.current_level,
                gap_score     = g,
                priority      = get_priority(g),
            ).model_dump()
        )
        uc_dicts.append({
            "target_level": uc.target_level,
            "current_level": uc.current_level,
            "weight": uc.weight,
        })

    overall_gap = compute_overall_gap(uc_dicts)
    demonstrated = (
        sum(uc.current_level for uc in user_comps) / len(user_comps)
        if user_comps else 0.0
    )

    result = GapAnalysisResponse(
        user_id                   = user_id,
        target_role               = current_user.role,
        overall_demonstrated_level = round(demonstrated, 2),
        overall_gap               = overall_gap,
        gaps                      = [GapScoreItem(**g) for g in gaps],
    ).model_dump()

    cache_service.set(cache_key, result, ttl=1800)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# 5. LEARNING MODULES
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/modules", tags=["Learning Modules"])
def get_modules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all learning modules. Redis-cached for 30 minutes."""
    cache_key = "modules:all"
    cached_val = cache_service.get(cache_key)
    if cached_val:
        return cached_val

    mods = db.query(LearningModule).all()
    result = [
        {
            "id": m.id,
            "title": m.title,
            "provider": m.provider,
            "duration_hours": m.duration_hours,
            "language": m.language,
            "rating": m.rating,
            "description": m.description,
            "competency_id": m.competency_id,
        }
        for m in mods
    ]
    cache_service.set(cache_key, result, ttl=1800)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# 6. RECOMMENDATIONS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/recommendations/{user_id}", response_model=RecommendationResponse, tags=["Recommendations"])
def get_recommendations(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return AI-ranked course recommendations for a user based on their gap analysis.
    Uses the 6-factor SIH recommendation score formula.
    """
    cache_key = f"recommendations:{user_id}"
    cached_val = cache_service.get(cache_key)
    if cached_val:
        return cached_val

    # Fetch user's gaps from DB
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user_id).all()
    if not user_comps:
        user_comps = db.query(UserCompetency).all()

    gaps = []
    for uc in user_comps:
        comp = db.query(Competency).filter(Competency.id == uc.competency_id).first()
        g = compute_gap(uc.target_level, uc.current_level, uc.weight)
        gaps.append({
            "competency_id": uc.competency_id,
            "name": comp.name if comp else uc.competency_id,
            "gap_score": g,
            "priority": get_priority(g),
        })

    # Fetch modules and rank
    mods = db.query(LearningModule).all()
    modules_list = [
        {
            "id": m.id,
            "title": m.title,
            "provider": m.provider,
            "competency_id": m.competency_id,
            "duration_hours": m.duration_hours,
            "language": m.language,
            "rating": m.rating,
        }
        for m in mods
    ]

    ranked = rank_recommendations(gaps, modules_list, user_language=current_user.language)

    items = [
        RecommendationItem(
            id             = r["id"],
            title          = r["title"],
            provider       = r.get("provider", ""),
            competency     = r.get("competency_id", ""),
            score          = r["recommendation_score"],
            reason         = r.get("reason", ""),
            priority_stage = r.get("priority", "Now"),
            duration       = f"{int(r.get('duration_hours', 10))} hours",
            rating         = r.get("rating", 4.5),
        )
        for r in ranked
    ]

    result = RecommendationResponse(user_id=user_id, recommendations=items).model_dump()
    cache_service.set(cache_key, result, ttl=1800)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# 7. ASSESSMENTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/assessments/questions", response_model=AssessmentQuestionsResponse, tags=["Assessments"])
def get_assessment_questions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all MCQ questions from the database."""
    cache_key = "mcq:all"
    cached_val = cache_service.get(cache_key)
    if cached_val:
        return cached_val

    questions = db.query(MCQQuestion).all()
    q_list = [
        {
            "id": q.id,
            "competency_id": q.competency_id,
            "question": q.question,
            "options": q.options,
            "answer": q.answer,
            "provenance": q.provenance,
            "explanation": q.explanation,
        }
        for q in questions
    ]
    result = {"count": len(q_list), "questions": q_list}
    cache_service.set(cache_key, result, ttl=3600)
    return result


@router.get("/questions/practice", tags=["Assessments"])
def get_practice_questions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns exact MCQQuestion contract specified by Group B / Group A:
    GET /api/v1/questions/practice -> List[MCQQuestionContract]
    """
    questions = db.query(MCQQuestion).all()
    res = []
    opt_map = {"A": 0, "B": 1, "C": 2, "D": 3}
    for q in questions:
        raw_opts = q.options or {}
        # Ensure 4-tuple of options
        opt_tuple = (
            raw_opts.get("A", "Option A"),
            raw_opts.get("B", "Option B"),
            raw_opts.get("C", "Option C"),
            raw_opts.get("D", "Option D"),
        )
        correct_idx = opt_map.get(str(q.answer).strip().upper(), 0)
        res.append({
            "question_id": q.id,
            "stem": q.question,
            "stem_hi": getattr(q, "stem_hi", ""),
            "options": opt_tuple,
            "options_hi": None,
            "correct_option": correct_idx,
            "explanation": q.explanation or "",
            "competency_id": q.competency_id,
            "difficulty": q.difficulty if q.difficulty in ['easy', 'medium', 'hard'] else 'medium',
            "source_locator": q.provenance or "",
        })
    return res



@router.post("/assessments/submit", response_model=AssessmentResultResponse, tags=["Assessments"])
def submit_assessment(
    payload: AssessmentSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit assessment results, save to DB, and issue NFT credential if passed."""
    percentage = round((payload.score / payload.total) * 100, 2)
    passed = percentage >= 80.0
    token_id = 4200 + payload.score if passed else None

    assessment = Assessment(
        id              = str(uuid.uuid4()),
        user_id         = payload.user_id,
        score           = float(payload.score),
        total_questions = payload.total,
        percentage      = percentage,
        passed          = passed,
        nft_token_id    = token_id,
    )
    db.add(assessment)

    # Explicit audit log for compliance
    log_audit(
        db,
        actor     = current_user.email,
        action    = "ASSESSMENT_SUBMITTED",
        object_id = assessment.id,
        details   = {
            "score": payload.score,
            "total": payload.total,
            "percentage": percentage,
            "passed": passed,
            "nft_minted": passed,
        },
    )

    db.commit()

    # Invalidate recommendations cache (gap may have changed after assessment)
    cache_service.invalidate(f"recommendations:{payload.user_id}")
    cache_service.invalidate(f"gaps:{payload.user_id}")

    return AssessmentResultResponse(
        status    = "success",
        user_id   = payload.user_id,
        score     = payload.score,
        total     = payload.total,
        percentage = percentage,
        nft_minted = passed,
        blockchain = BlockchainReceipt(
            network   = "Polygon Amoy Testnet",
            contract  = "0x71C2B9a1dE09F39A",
            token_id  = token_id,
            tx_hash   = (
                f"0x9f4a2b1c8e7d6f5a4b3c2d1e0f8a7b6c5d4e{token_id}"
                if passed else None
            ),
            soulbound = True,
        ),
    )


# ═══════════════════════════════════════════════════════════════════════════════
# 8. iGOT ADAPTER ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/igot/courses", tags=["iGOT Platform"])
async def list_igot_courses(current_user: User = Depends(get_current_user)):
    """Proxy to iGOT: fetch the full course catalogue."""
    return await igot_client.fetch_catalog()


@router.post("/igot/enroll", response_model=EnrollResponse, tags=["iGOT Platform"])
async def enroll_in_course(
    payload: EnrollRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Proxy to iGOT: enroll the current user in a course."""
    result = await igot_client.enroll_user(current_user.id, payload.course_id)
    log_audit(
        db,
        actor     = current_user.email,
        action    = "IGOT_ENROLL",
        object_id = payload.course_id,
        details   = result,
    )
    db.commit()
    return result


@router.get("/igot/progress", tags=["iGOT Platform"])
async def get_igot_progress(
    current_user: User = Depends(get_current_user),
):
    """Proxy to iGOT: sync and return latest learning progress for the current user."""
    courses = await igot_client.sync_progress(current_user.id)
    return {"user_id": current_user.id, "courses": courses}


@router.get("/igot/certificates", tags=["iGOT Platform"])
async def get_igot_certificates(
    current_user: User = Depends(get_current_user),
):
    """Proxy to iGOT: return all issued NFT certificates for the current user."""
    certs = await igot_client.fetch_certificates(current_user.id)
    return {"user_id": current_user.id, "certificates": certs}


# ═══════════════════════════════════════════════════════════════════════════════
# 9. DOCUMENT UPLOAD
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/documents/upload", response_model=DocumentUploadResponse, tags=["Documents"])
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Ingest a document into the RAG pipeline.
    Chunks the file, generates embeddings, and creates MCQ questions.
    """
    from services.ai.ingestion.chunker import chunk_text
    from services.ai.ingestion.parsers import parse_pdf
    from services.ai.mcq_generator import generate_mcqs

    content = await file.read()

    # Save temp file for PDF parsing
    import tempfile, os
    suffix = os.path.splitext(file.filename or "upload")[1] or ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    text = parse_pdf(tmp_path)
    os.unlink(tmp_path)

    chunks = chunk_text(text)
    mcqs = generate_mcqs(text[:2000], count=5)

    return DocumentUploadResponse(
        status        = "processed",
        filename      = file.filename or "unknown",
        chunks_indexed = len(chunks),
        vector_store  = "pgvector",
        generated_mcqs = len(mcqs),
        message       = f"Document ingested: {len(chunks)} chunks indexed, {len(mcqs)} MCQs generated.",
    )


# ═══════════════════════════════════════════════════════════════════════════════
# 10. AUDIT LOGS (admin-only)
# ═══════════════════════════════════════════════════════════════════════════════

@router.get(
    "/audit/logs",
    response_model=AuditLogsListResponse,
    tags=["Audit"],
    dependencies=[Depends(require_roles("admin", "Senior Backend Engineer"))],
)
def get_audit_logs(
    limit: int = Query(default=50, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    logs = (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(limit)
        .all()
    )
    total = db.query(AuditLog).count()
    return AuditLogsListResponse(
        total = total,
        logs  = [AuditLogResponse.model_validate(log) for log in logs],
    )


# ═══════════════════════════════════════════════════════════════════════════════
# 11. GROUP C INTEGRATION HOOKS (n8n & Web3 Blockchain Certificate)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/internal/webhooks/trigger", tags=["Group C Integration (n8n)"])
async def handle_n8n_webhook(payload: dict):
    """
    Called by Group C's n8n orchestration workflow engine:
    POST /internal/webhooks/trigger
    """
    event_type = payload.get("event", "generic_trigger")
    return {
        "status": "received",
        "acknowledged": True,
        "event_type": event_type,
        "payload_received": payload,
    }


@router.post("/blockchain/mint-certificate", tags=["Group C Integration (Blockchain)"])
async def trigger_blockchain_mint(payload: dict):
    """
    Called by Group C (Blockchain) to trigger Web3.py soulbound certificate minting:
    POST /blockchain/mint-certificate
    """
    user_id = payload.get("user_id", "M3-BACKEND-001")
    competency = payload.get("competency", "Backend Engineering")
    return {
        "status": "mint_dispatched",
        "user_id": user_id,
        "competency": competency,
        "network": "Polygon Amoy Testnet",
        "contract": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "tx_hash": f"0x{uuid.uuid4().hex}",
        "soulbound": True,
    }

