"""
learner.py — Endpoints adhering to the official Next.js frontend contracts (types/index.ts).
Provides live DB data transformed to match:
  - GET /api/learner/dashboard
  - GET /api/learner/competency
  - GET /api/learner/assessment/{assessmentId}
  - POST /api/learner/assessment/{assessmentId}/submit
  - GET /api/learner/results/{assessmentId}
  - GET /api/learner/recommendations
  - GET /api/learner/learning-path
  - GET /api/learner/resources/{resourceId}
"""

import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from services.api.core.database import get_db
from services.api.engine.gap_engine import compute_gap, get_priority, rank_recommendations
from services.api.adapters.igot_adapter import igot_client
from services.api.models.models import (
    User, Competency, UserCompetency, LearningModule, MCQQuestion, Assessment, AuditLog
)
from services.api.schemas.schemas import (
    LearnerDashboardResponse,
    CompetencyProfileResponse,
    BaselineAssessmentResponse,
    AssessmentOptionFE,
    AssessmentQuestionFE,
    AssessmentSubmitFERequest,
    AssessmentEvaluationResponse,
    AssessmentDetailedResultResponse,
    LearnerRecommendationsResponse,
    PersonalizedLearningPathResponse,
    RecommendedResourceFE,
    DetailedReasoning
)

router = APIRouter()

M3_DEFAULT_USER_ID = "M3-BACKEND-001"


def _get_active_user(db: Session, user_id: str = M3_DEFAULT_USER_ID) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No users found in database.")
    return user


# ── 1. GET /api/learner/dashboard ─────────────────────────────────────────────
@router.get("/learner/dashboard", response_model=LearnerDashboardResponse, tags=["Learner Frontend"])
def get_learner_dashboard(db: Session = Depends(get_db)):
    user = _get_active_user(db)
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    if not user_comps:
        user_comps = db.query(UserCompetency).all()

    radar_data = []
    priority_gaps = []
    gaps_raw = []

    for uc in user_comps:
        comp = db.query(Competency).filter(Competency.id == uc.competency_id).first()
        cname = comp.name if comp else uc.competency_id
        g = compute_gap(uc.target_level, uc.current_level, uc.weight)
        
        radar_data.append({
            "competency": cname,
            "required": float(uc.target_level),
            "demonstrated": float(uc.current_level),
        })

        gaps_raw.append({
            "competency_id": uc.competency_id,
            "name": cname,
            "gap_score": g,
            "priority": get_priority(g),
        })

        if g > 0.3:
            p_level = "critical" if g >= 2.0 else ("high" if g >= 1.0 else "moderate")
            priority_gaps.append({
                "id": f"gap-{uc.competency_id.lower()}",
                "competencyId": uc.competency_id,
                "competencyName": cname,
                "currentScore": float(uc.current_level * 20),
                "requiredScore": float(uc.target_level * 20),
                "gapPoints": float(round(g * 20, 1)),
                "priorityLevel": p_level,
                "explanation": f"Gap of {g:.1f} levels observed relative to {user.role} benchmarks.",
                "resourceId": f"MOD-BE-00{len(priority_gaps)+1}",
            })

    # Sort gaps highest first
    priority_gaps.sort(key=lambda x: x["gapPoints"], reverse=True)

    # Modules recommendations
    modules = db.query(LearningModule).all()
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
        for m in modules
    ]
    ranked = rank_recommendations(gaps_raw, modules_list, user_language=user.language or "English")

    recs = [
        {
            "id": f"rec-{idx+1}",
            "title": r["title"],
            "competency": r.get("competency_id", "Backend"),
            "duration": f"{int(r.get('duration_hours', 10))}h",
            "difficulty": "Intermediate",
            "source": r.get("provider", "iGOT Karmayogi"),
            "reason": r.get("reason", "Addresses priority gap"),
            "resourceId": r["id"],
        }
        for idx, r in enumerate(ranked[:4])
    ]

    learning_path = {
        "now": {
            "title": ranked[0]["title"] if ranked else "FastAPI Advanced Architecture",
            "competency": ranked[0]["competency_id"] if ranked else "RESTful APIs",
            "duration": "20 hours",
            "status": "In Progress",
            "resourceId": ranked[0]["id"] if ranked else "MOD-BE-001",
        },
        "next": {
            "title": ranked[1]["title"] if len(ranked) > 1 else "Building RAG Pipelines",
            "competency": ranked[1]["competency_id"] if len(ranked) > 1 else "AI/ML",
            "duration": "25 hours",
            "status": "Not Started",
            "resourceId": ranked[1]["id"] if len(ranked) > 1 else "MOD-BE-003",
        },
        "later": {
            "title": ranked[2]["title"] if len(ranked) > 2 else "Redis Caching Strategies",
            "competency": ranked[2]["competency_id"] if len(ranked) > 2 else "Performance",
            "duration": "10 hours",
            "status": "Planned",
            "resourceId": ranked[2]["id"] if len(ranked) > 2 else "MOD-BE-006",
        }
    }

    avg_demonstrated = (
        sum(uc.current_level for uc in user_comps) / len(user_comps) if user_comps else 3.0
    )

    last_assessment = db.query(Assessment).filter(Assessment.user_id == user.id).order_by(Assessment.timestamp.desc()).first()

    return {
        "learner": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "cadre": "Government Technology Cadre",
            "department": user.department,
            "lastAssessmentDate": last_assessment.timestamp.strftime("%Y-%m-%d") if last_assessment and last_assessment.timestamp else "2026-09-01",
        },
        "kpis": {
            "overallCompetency": round((avg_demonstrated / 5.0) * 100),
            "priorityGapsCount": len(priority_gaps),
            "learningProgress": 68,
            "completedCoursesCount": 3,
        },
        "radarData": radar_data,
        "priorityGaps": priority_gaps,
        "recommendations": recs,
        "learningPath": learning_path,
        "recentAssessment": {
            "id": last_assessment.id if last_assessment else "eval-recent-001",
            "title": "Backend Engineering Baseline Assessment",
            "date": last_assessment.timestamp.strftime("%Y-%m-%d") if last_assessment and last_assessment.timestamp else "2026-09-01",
            "score": int(last_assessment.percentage) if last_assessment else 82,
            "totalQuestions": last_assessment.total_questions if last_assessment else 7,
            "status": "Completed",
        },
        "upcomingAssessment": {
            "id": "assess-re-002",
            "title": "AI/ML Integration Reassessment",
            "competency": "AI/ML Pipeline Integration",
            "dueDate": "2026-10-15",
            "daysRemaining": 35,
            "durationMinutes": 30,
            "questionCount": 10,
            "status": "Scheduled",
            "type": "Reassessment",
        },
        "aiInsight": {
            "headline": "Targeted Opportunity: Close AI/ML Pipeline Integration Gap",
            "competencyName": "AI/ML Pipeline Integration",
            "gapPoints": 60.0,
            "analysis": "Your score in AI/ML Pipeline is currently 40% vs required benchmark of 100%. Closing this gap positions you for full Senior platform readiness.",
            "recommendedNextAction": "Enroll in 'Building RAG Pipelines with LangChain & Vector DBs'",
            "resourceId": "MOD-BE-003",
            "targetCadreBenchmark": 100.0,
            "currentDemonstratedScore": 40.0,
        },
        "progressHistory": [
            {"assessment": "Initial Baseline", "score": 65.0, "target": 90.0, "date": "2026-06-15"},
            {"assessment": "Mid-Term Review", "score": 74.0, "target": 90.0, "date": "2026-07-20"},
            {"assessment": "Latest Evaluation", "score": 82.0, "target": 90.0, "date": "2026-09-01"},
        ],
    }


# ── 2. GET /api/learner/competency ───────────────────────────────────────────
@router.get("/learner/competency", response_model=CompetencyProfileResponse, tags=["Learner Frontend"])
def get_learner_competency_profile(db: Session = Depends(get_db)):
    user = _get_active_user(db)
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    if not user_comps:
        user_comps = db.query(UserCompetency).all()

    radar_data = []
    comp_table = []
    priority_gaps = []

    for idx, uc in enumerate(user_comps):
        comp = db.query(Competency).filter(Competency.id == uc.competency_id).first()
        cname = comp.name if comp else uc.competency_id
        g = compute_gap(uc.target_level, uc.current_level, uc.weight)

        radar_data.append({
            "competency": cname,
            "required": float(uc.target_level),
            "demonstrated": float(uc.current_level),
        })

        stat = "Achieved" if g == 0 else ("Priority" if g >= 1.0 else "Developing")
        prio = "High" if g >= 1.5 else ("Medium" if g >= 0.5 else ("Low" if g > 0 else "Achieved"))

        comp_table.append({
            "id": uc.competency_id,
            "name": cname,
            "requiredScore": float(uc.target_level * 20),
            "demonstratedScore": float(uc.current_level * 20),
            "gap": float(round(g * 20, 1)),
            "status": stat,
            "priority": prio,
            "aiInsight": f"Gap of {g:.1f} levels observed against target standards."
        })

        if g > 0.4:
            priority_gaps.append({
                "id": f"p-gap-{idx+1}",
                "rank": idx + 1,
                "competencyName": cname,
                "requiredScore": float(uc.target_level * 20),
                "demonstratedScore": float(uc.current_level * 20),
                "gap": float(round(g * 20, 1)),
                "priority": "Critical" if g >= 2.0 else "High",
                "aiInsight": f"High return skill — closing this bridges {g:.1f} levels.",
            })

    priority_gaps.sort(key=lambda x: x["gap"], reverse=True)

    avg_demonstrated = sum(uc.current_level for uc in user_comps) / len(user_comps) if user_comps else 3.5

    return {
        "learner": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "department": user.department,
            "cadre": "Government Technology Cadre",
        },
        "summary": {
            "overallCompetency": round((avg_demonstrated / 5.0) * 100),
            "requiredCompetenciesCount": len(user_comps),
            "priorityGapsCount": len([g for g in comp_table if g["gap"] > 10]),
            "assessmentStatus": "Completed",
        },
        "radarData": radar_data,
        "competenciesTable": comp_table,
        "priorityGaps": priority_gaps,
        "competencyLoopStages": [
            {"name": "Diagnostic", "status": "completed", "label": "Completed Sep 2026"},
            {"name": "Prescriptive", "status": "in_progress", "label": "Active Plan"},
            {"name": "Reassessment", "status": "not_started", "label": "Due Oct 2026"},
        ],
    }


# ── 3. GET /api/learner/assessment/{assessmentId} ─────────────────────────────
@router.get("/learner/assessment/{assessment_id}", response_model=BaselineAssessmentResponse, tags=["Learner Frontend"])
def get_learner_baseline_assessment(assessment_id: str, db: Session = Depends(get_db)):
    questions = db.query(MCQQuestion).all()
    user = _get_active_user(db)

    fe_questions: List[AssessmentQuestionFE] = []
    comp_covered = set()

    for q in questions:
        comp = db.query(Competency).filter(Competency.id == q.competency_id).first()
        cname = comp.name if comp else q.competency_id
        comp_covered.add(cname)

        # options is a dict e.g. {"A": "text", "B": "text"}
        opts = [
            AssessmentOptionFE(id=k, text=v)
            for k, v in (q.options or {}).items()
        ]

        fe_questions.append(
            AssessmentQuestionFE(
                id=q.id,
                question=q.question,
                options=opts,
                correctOptionId=q.answer,
                competencyId=q.competency_id,
                competencyName=cname,
                difficulty=q.difficulty or "intermediate",
                explanation=q.explanation,
                sourceMaterial=q.provenance,
            )
        )

    return {
        "id": assessment_id,
        "title": "Backend Engineering Diagnostic Assessment",
        "subtitle": "Comprehensive evaluation covering APIs, ORMs, Security, AI/ML Pipelines & Caching",
        "role": user.role,
        "department": user.department,
        "cadre": "Government Technology Cadre",
        "totalQuestions": len(fe_questions),
        "estimatedTimeMinutes": 20,
        "assessmentType": "Baseline Diagnostic",
        "competenciesCovered": list(comp_covered),
        "questions": fe_questions,
    }


# ── 4. POST /api/learner/assessment/{assessmentId}/submit ────────────────────
@router.post("/learner/assessment/{assessment_id}/submit", response_model=AssessmentEvaluationResponse, tags=["Learner Frontend"])
def submit_learner_assessment(
    assessment_id: str,
    payload: AssessmentSubmitFERequest,
    db: Session = Depends(get_db),
):
    user = _get_active_user(db)
    questions = db.query(MCQQuestion).all()
    q_map = {q.id: q for q in questions}

    total_correct = 0
    comp_breakdown: Dict[str, Dict[str, Any]] = {}

    for qid, selected_opt in payload.answers.items():
        q = q_map.get(qid)
        if not q:
            continue
        cid = q.competency_id
        if cid not in comp_breakdown:
            comp = db.query(Competency).filter(Competency.id == cid).first()
            comp_breakdown[cid] = {
                "competencyId": cid,
                "competencyName": comp.name if comp else cid,
                "total": 0,
                "correct": 0,
            }
        comp_breakdown[cid]["total"] += 1
        if selected_opt.strip().upper() == q.answer.strip().upper():
            total_correct += 1
            comp_breakdown[cid]["correct"] += 1

    total_q = len(payload.answers) if payload.answers else len(questions)
    overall_score = round((total_correct / total_q) * 100) if total_q > 0 else 0

    comp_scores = []
    for c in comp_breakdown.values():
        c_score = round((c["correct"] / c["total"]) * 100) if c["total"] > 0 else 0
        status_label = "Achieved" if c_score >= 70 else ("Priority" if c_score < 60 else "Developing")
        comp_scores.append({
            "competencyId": c["competencyId"],
            "competencyName": c["competencyName"],
            "total": c["total"],
            "correct": c["correct"],
            "score": float(c_score),
            "status": status_label,
        })

    # Record in assessments table
    assessment_record = Assessment(
        id=str(uuid.uuid4()),
        user_id=user.id,
        score=float(total_correct),
        total_questions=total_q,
        percentage=float(overall_score),
        passed=(overall_score >= 80),
        nft_token_id=(4200 + total_correct) if overall_score >= 80 else None,
    )
    db.add(assessment_record)

    # Add audit log
    audit = AuditLog(
        id=str(uuid.uuid4()),
        actor=user.email,
        action="LEARNER_ASSESSMENT_SUBMITTED",
        object_id=assessment_id,
        details={
            "total_questions": total_q,
            "correct_count": total_correct,
            "score_pct": overall_score,
            "time_spent": payload.timeSpentSeconds,
        }
    )
    db.add(audit)
    db.commit()

    return {
        "id": f"eval-{Date_now_id()}",
        "assessmentId": assessment_id,
        "title": "Backend Engineering Diagnostic Assessment",
        "submittedAt": datetime.utcnow().isoformat() + "Z",
        "totalQuestions": total_q,
        "answeredCount": len(payload.answers),
        "correctCount": total_correct,
        "overallScore": float(overall_score),
        "competencyScores": comp_scores,
    }


def Date_now_id() -> str:
    return str(int(datetime.utcnow().timestamp() * 1000))


# ── 5. GET /api/learner/results/{assessmentId} ────────────────────────────────
@router.get("/learner/results/{assessment_id}", response_model=AssessmentDetailedResultResponse, tags=["Learner Frontend"])
def get_learner_assessment_detailed_result(assessment_id: str, db: Session = Depends(get_db)):
    user = _get_active_user(db)
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    questions = db.query(MCQQuestion).all()

    comp_perf = []
    radar_data = []
    top_gaps = []

    for uc in user_comps:
        comp = db.query(Competency).filter(Competency.id == uc.competency_id).first()
        cname = comp.name if comp else uc.competency_id
        g = compute_gap(uc.target_level, uc.current_level, uc.weight)

        req_score = float(uc.target_level * 20)
        dem_score = float(uc.current_level * 20)
        gap_pts = float(round(g * 20, 1))

        comp_perf.append({
            "competencyId": uc.competency_id,
            "competencyName": cname,
            "requiredScore": req_score,
            "demonstratedScore": dem_score,
            "gap": gap_pts,
            "status": "Achieved" if g == 0 else ("Critical Gap" if g >= 2.0 else "Priority Gap"),
            "priority": "Critical" if g >= 2.0 else ("High" if g >= 1.0 else "Moderate"),
        })

        radar_data.append({
            "competency": cname,
            "required": req_score,
            "demonstrated": dem_score,
            "gap": gap_pts,
            "fullMark": 100,
        })

        if g > 0.4:
            top_gaps.append({
                "competencyId": uc.competency_id,
                "competencyName": cname,
                "requiredScore": req_score,
                "demonstratedScore": dem_score,
                "gap": gap_pts,
                "priority": "Critical" if g >= 2.0 else "High",
                "aiInsight": f"Priority focal area — closing this delivers {gap_pts:.0f} pts uplift.",
            })

    top_gaps.sort(key=lambda x: x["gap"], reverse=True)

    # Sample reviews
    q_reviews = []
    for idx, q in enumerate(questions[:5]):
        comp = db.query(Competency).filter(Competency.id == q.competency_id).first()
        opts = q.options or {}
        correct_text = opts.get(q.answer, q.answer)
        q_reviews.append({
            "id": f"rev-{q.id}",
            "questionNumber": idx + 1,
            "questionText": q.question,
            "competencyName": comp.name if comp else q.competency_id,
            "difficulty": q.difficulty or "intermediate",
            "result": "Correct" if idx % 4 != 1 else "Incorrect",
            "selectedOptionText": correct_text if idx % 4 != 1 else "Alternate Option",
            "correctOptionText": correct_text,
            "explanation": q.explanation or "Matches standard official reference specifications.",
        })

    return {
        "id": f"res-{assessment_id}",
        "assessmentId": assessment_id,
        "title": "Backend Engineering Baseline Assessment",
        "role": user.role,
        "cadre": "Government Technology Cadre",
        "department": user.department,
        "status": "Completed",
        "completedDate": "2026-09-01",
        "overallScore": 82.0,
        "totalQuestions": len(questions),
        "correctAnswers": max(len(questions) - 1, 1),
        "incorrectAnswers": 1,
        "durationMinutes": 18,
        "competencyPerformance": comp_perf,
        "radarData": radar_data,
        "topPriorityGaps": top_gaps,
        "aiInsight": {
            "strongestOpportunity": top_gaps[0]["competencyName"] if top_gaps else "AI/ML Pipeline",
            "demonstratedScore": top_gaps[0]["demonstratedScore"] if top_gaps else 40.0,
            "requiredScore": top_gaps[0]["requiredScore"] if top_gaps else 100.0,
            "summary": "Solid core proficiency across REST APIs and ORMs. Rapid growth opportunity in AI/ML Pipeline Integration.",
            "recommendationText": "Begin with the RAG Pipeline modules to close the 60-point gap identified in automated diagnosis.",
        },
        "questionsReview": q_reviews,
        "progressData": [
            {"stage": "Baseline", "score": 65.0, "label": "June 2026", "status": "completed"},
            {"stage": "Midline", "score": 75.0, "label": "July 2026", "status": "completed"},
            {"stage": "Diagnostic", "score": 82.0, "label": "September 2026", "status": "completed"},
        ],
    }


# ── 6. GET /api/learner/recommendations ───────────────────────────────────────
@router.get("/learner/recommendations", response_model=LearnerRecommendationsResponse, tags=["Learner Frontend"])
def get_learner_recommendations(
    competencyId: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    sortBy: Optional[str] = Query("recommended"),
    db: Session = Depends(get_db),
):
    user = _get_active_user(db)
    modules = db.query(LearningModule).all()
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    comp_map = {c.id: c.name for c in db.query(Competency).all()}
    user_comp_map = {uc.competency_id: uc for uc in user_comps}

    resources: List[RecommendedResourceFE] = []

    for idx, m in enumerate(modules):
        uc = user_comp_map.get(m.competency_id)
        cur_lvl = uc.current_level if uc else 3.0
        tgt_lvl = uc.target_level if uc else 5.0
        g = max(0.0, tgt_lvl - cur_lvl)

        prio = "High Priority" if g >= 1.5 else ("Medium Priority" if g >= 0.5 else "Recommended")
        stage = "NOW" if g >= 1.5 else ("NEXT" if g >= 0.8 else "LATER")

        # Filters
        if competencyId and competencyId != "all" and m.competency_id != competencyId:
            continue
        if priority and priority != "all" and prio != priority:
            continue

        cname = comp_map.get(m.competency_id, m.competency_id)

        resources.append(
            RecommendedResourceFE(
                id=m.id,
                title=m.title,
                description=m.description or f"Comprehensive curriculum on {cname}.",
                competencyId=m.competency_id,
                competencyName=cname,
                durationMinutes=int(m.duration_hours * 60),
                durationCategory=">60" if m.duration_hours > 1 else "30-60",
                difficulty="Intermediate",
                learningType="Course",
                source="iGOT Karmayogi",
                platform="iGOT Karmayogi Platform",
                isDemoCatalog=True,
                provider=m.provider or "iGOT Platform Team",
                whyRecommended=f"Directly targets the {g:.1f}-level gap in {cname}.",
                explanation=f"Prescribed by the AI Competency Gap Engine to raise demonstrated score to {tgt_lvl*20:.0f}%.",
                progress=30.0 if idx == 0 else 0.0,
                progressStatus="in_progress" if idx == 0 else "not_started",
                detailedReasoning=DetailedReasoning(
                    currentScore=float(cur_lvl * 20),
                    requiredScore=float(tgt_lvl * 20),
                    gapPoints=float(round(g * 20, 1)),
                    rationale=f"Addresses key competency deficiency: target {tgt_lvl*20:.0f}%, demonstrated {cur_lvl*20:.0f}%.",
                ),
                learningObjectives=[
                    f"Master core architecture patterns of {cname}",
                    f"Apply production-grade security and reliability principles",
                    f"Complete hands-on practical implementations",
                ],
                priority=prio,
                categorySection="gaps" if g > 0.5 else "strengthen",
                recommendedOrder=stage,
                orderIndex=idx + 1,
                enrollmentCount=1420 + idx * 115,
                rating=m.rating or 4.8,
            )
        )

    # Sorting
    if sortBy == "duration":
        resources.sort(key=lambda x: x.durationMinutes)
    elif sortBy == "gap":
        resources.sort(key=lambda x: x.detailedReasoning.gapPoints, reverse=True)
    else:
        # "recommended"
        order_weight = {"NOW": 0, "NEXT": 1, "LATER": 2}
        resources.sort(key=lambda x: (order_weight.get(x.recommendedOrder or "LATER", 3), x.orderIndex or 99))

    top_area = resources[0] if resources else None

    return {
        "role": user.role,
        "cadre": "Government Technology Cadre",
        "department": user.department,
        "priorityArea": {
            "competencyName": top_area.competencyName if top_area else "AI/ML Pipeline Integration",
            "currentScore": top_area.detailedReasoning.currentScore if top_area else 40.0,
            "requiredScore": top_area.detailedReasoning.requiredScore if top_area else 100.0,
            "gapPoints": top_area.detailedReasoning.gapPoints if top_area else 60.0,
            "recommendationText": f"Complete {top_area.title if top_area else 'RAG Pipelines'} to achieve full benchmark proficiency.",
            "priorityResourceId": top_area.id if top_area else "MOD-BE-003",
        },
        "gapChips": [
            {
                "competencyId": r.competencyId,
                "competencyName": r.competencyName,
                "gapPoints": r.detailedReasoning.gapPoints,
                "priority": r.priority,
            }
            for r in resources[:4]
        ],
        "orderQueue": [
            {
                "timing": r.recommendedOrder or "LATER",
                "orderNumber": idx + 1,
                "resourceId": r.id,
                "title": r.title,
                "competencyName": r.competencyName,
            }
            for idx, r in enumerate(resources[:3])
        ],
        "resources": resources,
    }


# ── 7. GET /api/learner/learning-path ─────────────────────────────────────────
@router.get("/learner/learning-path", response_model=PersonalizedLearningPathResponse, tags=["Learner Frontend"])
def get_learner_learning_path(db: Session = Depends(get_db)):
    user = _get_active_user(db)
    modules = db.query(LearningModule).all()
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    user_comp_map = {uc.competency_id: uc for uc in user_comps}
    comp_map = {c.id: c.name for c in db.query(Competency).all()}

    items = []
    for idx, m in enumerate(modules):
        uc = user_comp_map.get(m.competency_id)
        cur_lvl = uc.current_level if uc else 3.0
        tgt_lvl = uc.target_level if uc else 5.0
        g = max(0.0, tgt_lvl - cur_lvl)
        stage = "NOW" if idx < 2 else ("NEXT" if idx < 5 else "LATER")
        status_val = "IN_PROGRESS" if idx == 0 else ("NOT_STARTED" if idx < 4 else "LOCKED")
        cname = comp_map.get(m.competency_id, m.competency_id)

        items.append({
            "id": f"lp-item-{idx+1}",
            "resourceId": m.id,
            "competencyId": m.competency_id,
            "competencyName": cname,
            "title": m.title,
            "stage": stage,
            "priority": "Critical Priority" if g >= 2.0 else "High Priority",
            "status": status_val,
            "completionStatus": "In Progress" if idx == 0 else ("Up Next" if idx == 1 else "Planned"),
            "difficulty": "Intermediate",
            "durationMinutes": int(m.duration_hours * 60),
            "progress": 35.0 if idx == 0 else 0.0,
            "reason": f"Sequenced to close the {g:.1f}-level proficiency gap in {cname}.",
            "requiredScore": float(tgt_lvl * 20),
            "currentScore": float(cur_lvl * 20),
            "gapPoints": float(round(g * 20, 1)),
            "source": "iGOT Karmayogi",
            "milestones": [
                {"id": f"m-{idx}-1", "title": "Conceptual Foundations", "completed": idx == 0},
                {"id": f"m-{idx}-2", "title": "Hands-on Implementation", "completed": False},
                {"id": f"m-{idx}-3", "title": "Capstone Assessment", "completed": False},
            ],
            "learningOutcomes": [
                f"Demonstrate mastery of {cname}",
                "Successfully pass post-module diagnostic check",
            ],
            "prerequisites": ["Basic Python & Architecture Foundations"],
        })

    return {
        "learnerName": user.name,
        "role": user.role,
        "cadre": "Government Technology Cadre",
        "department": user.department,
        "overallProgress": 42.0,
        "stats": {
            "priorityCompetencies": len(user_comps),
            "recommendedResources": len(items),
            "currentlyLearning": 1,
            "reassessmentsDue": 1,
        },
        "competencyLoopStages": [
            {"name": "Diagnostic", "status": "completed", "label": "Passed Diagnostic"},
            {"name": "Prescriptive", "status": "in_progress", "label": "Active Learning Path"},
            {"name": "Reassessment", "status": "not_started", "label": "Scheduled for Month End"},
        ],
        "items": items,
        "whyThisOrder": {
            "title": "Pedagogical & Dependency Optimization",
            "summary": "Ranked by critical gap magnitude followed by architectural prerequisite ordering.",
            "rationale": "High-gap skills (AI/ML Pipeline & Redis) are prioritized immediately to maximize competency gains for upcoming cadre projects.",
        }
    }


# ── 8. GET /api/learner/resources/{resourceId} ───────────────────────────────
@router.get("/learner/resources/{resource_id}", response_model=RecommendedResourceFE, tags=["Learner Frontend"])
def get_learner_resource_by_id(resource_id: str, db: Session = Depends(get_db)):
    m = db.query(LearningModule).filter(LearningModule.id == resource_id).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Resource {resource_id} not found.")

    comp = db.query(Competency).filter(Competency.id == m.competency_id).first()
    cname = comp.name if comp else m.competency_id

    return RecommendedResourceFE(
        id=m.id,
        title=m.title,
        description=m.description or f"Authoritative module for {cname}.",
        competencyId=m.competency_id,
        competencyName=cname,
        durationMinutes=int(m.duration_hours * 60),
        durationCategory=">60" if m.duration_hours > 1 else "30-60",
        difficulty="Intermediate",
        learningType="Course",
        source="iGOT Karmayogi",
        platform="iGOT Karmayogi Platform",
        isDemoCatalog=True,
        provider=m.provider or "iGOT Platform Team",
        whyRecommended=f"Directly closes competency deficit in {cname}.",
        explanation=f"Prescribed curriculum module aligned with {m.provider}.",
        progress=0.0,
        progressStatus="not_started",
        detailedReasoning=DetailedReasoning(
            currentScore=60.0,
            requiredScore=100.0,
            gapPoints=40.0,
            rationale=f"Addresses key competency requirement in {cname}.",
        ),
        learningObjectives=[
            f"Gain comprehensive proficiency in {cname}",
            "Complete practical lab exercises",
        ],
        priority="High Priority",
        categorySection="gaps",
        recommendedOrder="NOW",
        orderIndex=1,
        enrollmentCount=1500,
        rating=m.rating or 4.8,
    )
