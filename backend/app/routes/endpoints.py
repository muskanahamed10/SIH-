from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.gap_engine import compute_competency_gap, calculate_priority, compute_recommendation_score
from app.ai.mcq_generator import generate_grounded_mcqs, FALLBACK_MCQS

router = APIRouter()

@router.post("/auth/login")
def login(payload: dict):
    email = payload.get("email", "buddiga.sreevidya@mospi.gov.in")
    return {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sih_demo_token",
        "token_type": "bearer",
        "user": {
            "user_id": "OFFICER-73822",
            "name": "Buddiga Sree Vidya",
            "email": email,
            "department": "Ministry of Statistics and Programme Implementation (MoSPI)",
            "role": "Senior Statistical Officer (SSO Grade-II)",
            "wallet_address": "0x71C...39A"
        }
    }

@router.get("/users/{user_id}/gaps")
def get_user_gaps(user_id: str, db: Session = Depends(get_db)):
    domains = [
        {"id": "COMP-01", "name": "Sampling Theory & Survey Design", "target": 4.0, "demonstrated": 2.1, "weight": 1.0},
        {"id": "COMP-02", "name": "National Accounts & GDP Aggregation", "target": 4.0, "demonstrated": 3.5, "weight": 0.8},
        {"id": "COMP-03", "name": "Survey Field Quality Audit & Verification", "target": 3.5, "demonstrated": 1.8, "weight": 1.0},
        {"id": "COMP-04", "name": "Time Series & Econometric Forecasting", "target": 3.5, "demonstrated": 2.8, "weight": 0.7},
        {"id": "COMP-05", "name": "Official Statistical Computing (R / Python)", "target": 4.0, "demonstrated": 1.5, "weight": 1.0},
    ]

    results = []
    for d in domains:
        gap = compute_competency_gap(d["target"], d["demonstrated"], d["weight"])
        results.append({
            "competency_id": d["id"],
            "name": d["name"],
            "target_level": d["target"],
            "current_level": d["demonstrated"],
            "gap_score": gap,
            "priority": calculate_priority(gap)
        })

    return {
        "user_id": user_id,
        "target_role": "Senior Statistical Officer (SSO Grade-II)",
        "overall_demonstrated_level": 2.34,
        "gaps": results
    }

@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: str):
    courses = [
        {
            "id": "COURSE-01",
            "title": "Advanced Stratified Sampling & Survey Estimation Techniques",
            "provider": "National Statistical Systems Training Academy (NSSTA)",
            "competency": "Sampling Theory & Survey Design",
            "score": compute_recommendation_score(0.95, 0.90, 0.85, 0.80, 1.0, 0.95),
            "reason": "Directly addresses critical skill gap: Sampling Theory (1.9 Gap)",
            "priority_stage": "Now",
            "duration": "14 hours",
            "rating": 4.8
        },
        {
            "id": "COURSE-02",
            "title": "Official Statistical Computing with R and Survey Design",
            "provider": "Indian Statistical Institute (ISI Kolkata)",
            "competency": "Official Statistical Computing (R / Python)",
            "score": compute_recommendation_score(0.92, 0.85, 0.80, 0.75, 1.0, 0.90),
            "reason": "Addresses critical gap in automated data tabulation (2.5 Gap)",
            "priority_stage": "Now",
            "duration": "22 hours",
            "rating": 4.7
        },
        {
            "id": "COURSE-03",
            "title": "Field Quality Audit & Area Discrepancy Reconciliation",
            "provider": "MoSPI Field Operations Division",
            "competency": "Survey Field Quality Audit & Verification",
            "score": compute_recommendation_score(0.88, 0.80, 0.90, 0.70, 1.0, 0.85),
            "reason": "Fulfills mandatory EARAS area verification requirements (1.7 Gap)",
            "priority_stage": "Next",
            "duration": "8 hours",
            "rating": 4.6
        }
    ]
    return {"user_id": user_id, "recommendations": courses}

@router.get("/assessments/questions")
def get_assessment_questions():
    return {"count": len(FALLBACK_MCQS), "questions": FALLBACK_MCQS}

@router.post("/assessments/submit")
def submit_assessment(payload: dict):
    user_id = payload.get("user_id", "OFFICER-73822")
    score = payload.get("score", 4)
    total = payload.get("total", 5)
    percentage = (score / total) * 100

    nft_minted = percentage >= 80.0
    return {
        "status": "success",
        "user_id": user_id,
        "score": score,
        "total": total,
        "percentage": percentage,
        "nft_credential": {
            "minted": nft_minted,
            "network": "Polygon Amoy Testnet",
            "contract": "0x71C2B9a1dE09F39A",
            "token_id": 105 if nft_minted else None,
            "tx_hash": "0x9f4a2b1c8e7d6f5a4b3c2d1e0f8a7b6c5d4e3f2a1b0c" if nft_minted else None
        }
    }

@router.post("/documents/upload")
async def upload_statistical_document(file: UploadFile = File(...)):
    filename = file.filename
    return {
        "status": "processed",
        "filename": filename,
        "chunks_indexed": 42,
        "vector_store": "pgvector",
        "generated_mcqs": 5,
        "message": "Document ingested and indexed for grounded MCQ generation"
    }
