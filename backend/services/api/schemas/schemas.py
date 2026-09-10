"""
schemas.py — Pydantic v2 request/response schemas for all API endpoints.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


# ── Auth ──────────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str
    role: str = "officer"
    department: str = "iGOT Karmayogi Platform Team"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


# ── User ──────────────────────────────────────────────────────────────────────
class UserBase(BaseModel):
    email: str
    name: str
    role: str
    department: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    language: str
    wallet_address: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str
    language: str
    wallet_address: Optional[str] = None
    karma_points: int = 0
    model_config = ConfigDict(from_attributes=True)


# ── Competency ────────────────────────────────────────────────────────────────
class CompetencyResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: str
    model_config = ConfigDict(from_attributes=True)


# ── Shared Group B Contracts (Prompt 2 Specification) ─────────────────────────
from typing import Literal, Tuple

class GapVector(BaseModel):
    competency_id: str
    competency_name: str
    competency_name_hi: Optional[str] = ""
    required_level: int        # 1-5
    current_level: float       # 0.0-5.0
    gap_score: float           # 0.0-1.0
    priority: Literal['critical', 'high', 'medium', 'low']


class RecommendationResult(BaseModel):
    resource_id: str
    igot_id: Optional[str] = None
    title: str
    title_hi: Optional[str] = ""
    score: float               # 0.0-1.0 composite
    reason_code: str
    competency_ids: List[str]
    duration_hours: float
    language: Literal['en', 'hi', 'both'] = 'en'
    thumbnail_url: Optional[str] = None


class MCQQuestionContract(BaseModel):
    question_id: str
    stem: str
    stem_hi: Optional[str] = ""
    options: Tuple[str, str, str, str]
    options_hi: Optional[Tuple[str, str, str, str]] = None
    correct_option: Literal[0, 1, 2, 3]
    explanation: str
    competency_id: str
    difficulty: Literal['easy', 'medium', 'hard']
    source_locator: Optional[str] = ""


# ── Gap Analysis ──────────────────────────────────────────────────────────────
class GapScoreItem(BaseModel):
    competency_id: str
    name: str
    current_level: float
    target_level: float
    gap_score: float
    priority: str


class GapAnalysisResponse(BaseModel):
    user_id: str
    target_role: str
    overall_demonstrated_level: float
    overall_gap: float
    gaps: List[GapScoreItem]


# ── Learning Modules ──────────────────────────────────────────────────────────
class LearningModuleResponse(BaseModel):
    id: str
    title: str
    provider: Optional[str] = None
    duration_hours: float
    language: str
    rating: float
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# ── Recommendations ───────────────────────────────────────────────────────────
class RecommendationItem(BaseModel):
    id: str
    title: str
    provider: Optional[str] = None
    competency: str
    score: float
    reason: str
    priority_stage: str
    duration: str
    rating: float


class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[RecommendationItem]


# ── Assessment ────────────────────────────────────────────────────────────────
class MCQOptionMap(BaseModel):
    A: str
    B: str
    C: str
    D: str


class MCQQuestionResponse(BaseModel):
    id: str
    competency_id: str
    question: str
    options: Dict[str, str]
    answer: str
    provenance: Optional[str] = None
    explanation: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class AssessmentQuestionsResponse(BaseModel):
    count: int
    questions: List[MCQQuestionResponse]


class AssessmentSubmitRequest(BaseModel):
    user_id: str
    score: int
    total: int

    @field_validator("score")
    @classmethod
    def score_non_negative(cls, v):
        if v < 0:
            raise ValueError("score must be >= 0")
        return v

    @field_validator("total")
    @classmethod
    def total_positive(cls, v):
        if v <= 0:
            raise ValueError("total must be > 0")
        return v


class BlockchainReceipt(BaseModel):
    network: str
    contract: str
    token_id: Optional[int] = None
    tx_hash: Optional[str] = None
    soulbound: bool = True


class AssessmentResultResponse(BaseModel):
    status: str
    user_id: str
    score: int
    total: int
    percentage: float
    nft_minted: bool
    blockchain: BlockchainReceipt


# ── iGOT Adapter ─────────────────────────────────────────────────────────────
class EnrollRequest(BaseModel):
    course_id: str


class EnrollResponse(BaseModel):
    status: str
    user_id: str
    course_id: str
    enrollment_id: str
    message: str


class CourseProgressItem(BaseModel):
    course_id: str
    title: str
    status: str
    progress_pct: Optional[float] = None
    score: Optional[float] = None


class ProgressResponse(BaseModel):
    user_id: str
    courses: List[CourseProgressItem]


class CertificateItem(BaseModel):
    certificate_id: str
    course_id: str
    title: str
    issued_at: str
    token_id: Optional[int] = None
    network: str = "Polygon Amoy Testnet"


class CertificatesResponse(BaseModel):
    user_id: str
    certificates: List[CertificateItem]


# ── Audit Log ─────────────────────────────────────────────────────────────────
class AuditLogResponse(BaseModel):
    id: str
    actor: str
    action: str
    object_id: Optional[str] = None
    ip_address: Optional[str] = None
    request_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)


class AuditLogsListResponse(BaseModel):
    total: int
    logs: List[AuditLogResponse]


# ── Document Upload ───────────────────────────────────────────────────────────
class DocumentUploadResponse(BaseModel):
    status: str
    filename: str
    chunks_indexed: int
    vector_store: str
    generated_mcqs: int
    message: str


# ═══════════════════════════════════════════════════════════════════════════════
# LEARNER-ALIGNED SCHEMAS  (match frontend TypeScript types/index.ts exactly)
# ═══════════════════════════════════════════════════════════════════════════════

class RadarItem(BaseModel):
    competency: str
    required: float
    demonstrated: float


class PriorityGapItem(BaseModel):
    id: str
    competencyId: str
    competencyName: str
    currentScore: float
    requiredScore: float
    gapPoints: float
    priorityLevel: str
    explanation: str
    resourceId: str


class DashboardRecommendationItem(BaseModel):
    id: str
    title: str
    competency: str
    duration: str
    difficulty: str
    source: str
    reason: str
    resourceId: str


class DashboardLearningPathEntry(BaseModel):
    title: str
    competency: str
    duration: str
    status: str
    resourceId: str


class RecentAssessmentSummary(BaseModel):
    id: str
    title: str
    date: str
    score: int
    totalQuestions: int
    status: str


class DashboardAiInsight(BaseModel):
    headline: str
    competencyName: str
    gapPoints: float
    analysis: str
    recommendedNextAction: str
    resourceId: str
    targetCadreBenchmark: float
    currentDemonstratedScore: float


class ProgressHistoryPoint(BaseModel):
    assessment: str
    score: float
    target: float
    date: str


class LearnerDashboardResponse(BaseModel):
    learner: Dict[str, Any]
    kpis: Dict[str, Any]
    radarData: List[RadarItem]
    priorityGaps: List[PriorityGapItem]
    recommendations: List[DashboardRecommendationItem]
    learningPath: Dict[str, Any]
    recentAssessment: Optional[RecentAssessmentSummary] = None
    upcomingAssessment: Optional[Dict[str, Any]] = None
    aiInsight: Optional[DashboardAiInsight] = None
    progressHistory: List[ProgressHistoryPoint]


class CompetencyDetailItem(BaseModel):
    id: str
    name: str
    requiredScore: float
    demonstratedScore: float
    gap: float
    status: str
    priority: str
    aiInsight: Optional[str] = None


class CompetencyProfileResponse(BaseModel):
    learner: Dict[str, Any]
    summary: Dict[str, Any]
    radarData: List[RadarItem]
    competenciesTable: List[CompetencyDetailItem]
    priorityGaps: List[Dict[str, Any]]
    competencyLoopStages: List[Dict[str, Any]]


class AssessmentOptionFE(BaseModel):
    id: str
    text: str


class AssessmentQuestionFE(BaseModel):
    id: str
    question: str
    options: List[AssessmentOptionFE]
    correctOptionId: str
    competencyId: str
    competencyName: str
    difficulty: str
    explanation: Optional[str] = None
    sourceMaterial: Optional[str] = None


class BaselineAssessmentResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    role: str
    department: str
    cadre: str
    totalQuestions: int
    estimatedTimeMinutes: int
    assessmentType: str
    competenciesCovered: List[str]
    questions: List[AssessmentQuestionFE]


class AssessmentSubmitFERequest(BaseModel):
    answers: Dict[str, str]
    timeSpentSeconds: int = 0


class CompetencyScoreFE(BaseModel):
    competencyId: str
    competencyName: str
    total: int
    correct: int
    score: float
    status: str


class AssessmentEvaluationResponse(BaseModel):
    id: str
    assessmentId: str
    title: str
    submittedAt: str
    totalQuestions: int
    answeredCount: int
    correctCount: int
    overallScore: float
    competencyScores: List[CompetencyScoreFE]


class CompetencyPerformanceItem(BaseModel):
    competencyId: str
    competencyName: str
    requiredScore: float
    demonstratedScore: float
    gap: float
    status: str
    priority: Optional[str] = None


class QuestionReviewItem(BaseModel):
    id: str
    questionNumber: int
    questionText: str
    competencyName: str
    difficulty: str
    result: str
    selectedOptionText: str
    correctOptionText: str
    explanation: str


class AssessmentDetailedResultResponse(BaseModel):
    id: str
    assessmentId: str
    title: str
    role: str
    cadre: str
    department: str
    status: str
    completedDate: str
    overallScore: float
    totalQuestions: int
    correctAnswers: int
    incorrectAnswers: int
    durationMinutes: int
    competencyPerformance: List[CompetencyPerformanceItem]
    radarData: List[Dict[str, Any]]
    topPriorityGaps: List[Dict[str, Any]]
    aiInsight: Dict[str, Any]
    questionsReview: List[QuestionReviewItem]
    progressData: List[Dict[str, Any]]


class DetailedReasoning(BaseModel):
    currentScore: float
    requiredScore: float
    gapPoints: float
    rationale: str


class RecommendedResourceFE(BaseModel):
    id: str
    title: str
    description: str
    competencyId: str
    competencyName: str
    durationMinutes: int
    durationCategory: Optional[str] = None
    difficulty: str
    learningType: str
    source: str
    platform: str
    isDemoCatalog: bool = True
    provider: str
    whyRecommended: str
    explanation: Optional[str] = None
    progress: float = 0.0
    progressStatus: str = "not_started"
    detailedReasoning: DetailedReasoning
    learningObjectives: List[str]
    priority: str
    categorySection: str
    recommendedOrder: Optional[str] = None
    orderIndex: Optional[int] = None
    enrollmentCount: Optional[int] = None
    rating: Optional[float] = None


class LearnerRecommendationsResponse(BaseModel):
    role: str
    cadre: str
    department: str
    priorityArea: Dict[str, Any]
    gapChips: List[Dict[str, Any]]
    orderQueue: List[Dict[str, Any]]
    resources: List[RecommendedResourceFE]


class LearningPathItemFE(BaseModel):
    id: str
    resourceId: str
    competencyId: str
    competencyName: str
    title: str
    stage: str
    priority: str
    status: str
    completionStatus: Optional[str] = None
    difficulty: Optional[str] = None
    durationMinutes: int
    progress: float
    reason: str
    requiredScore: float
    currentScore: float
    gapPoints: float
    source: str
    milestones: Optional[List[Dict[str, Any]]] = None
    learningOutcomes: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None


class PersonalizedLearningPathResponse(BaseModel):
    learnerName: str
    role: str
    cadre: str
    department: str
    overallProgress: float
    stats: Dict[str, Any]
    competencyLoopStages: List[Dict[str, Any]]
    items: List[LearningPathItemFE]
    whyThisOrder: Dict[str, Any]
