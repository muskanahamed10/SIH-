/**
 * Official Statistical System - Competency Platform Domain Types
 * SIH 2026 Problem Statement 101
 */

export type UserRole = "learner" | "admin" | "sme" | "supervisor";

export interface User {
  id: string;
  name: string;
  email: string;
  designation: string;
  cadre: string; // e.g. "Indian Statistical Service (ISS)", "Subordinate Statistical Service (SSS)"
  department: string; // e.g. "National Statistical Office (NSO)", "Ministry of Statistics and Programme Implementation"
  currentRoleId: string;
  targetRoleId: string;
  systemRole: UserRole;
  avatarUrl?: string;
  learningStreakDays: number;
}

export type Learner = {
  id: string;
  name: string;
  role: string;
  department: string;
  cadre?: string;
};

export type CompetencySummary = {
  required: number;
  demonstrated: number | null;
  gap: number | null;
  status: string;
};

export interface StatisticalRole {
  id: string;
  name: string;
  code: string;
  cadre: string;
  description: string;
  requiredCompetencies: RoleCompetencyRequirement[];
}

export interface RoleCompetencyRequirement {
  competencyId: string;
  requiredLevel: number; // 1 to 5
  priority: "essential" | "desirable" | "advanced";
}

export type CompetencyCategory =
  | "statistical_methods"
  | "survey_methodology"
  | "data_management"
  | "statistical_computing"
  | "data_visualization"
  | "official_standards"
  | "public_policy_communication";

export interface CompetencyLevel {
  level: number; // 1 to 5
  title: string;
  description: string;
  behavioralIndicators: string[];
}

export interface Competency {
  id: string;
  code: string;
  name: string;
  category: CompetencyCategory;
  description: string;
  levels: CompetencyLevel[];
  updatedAt: string;
}

export interface CompetencyGap {
  competencyId: string;
  competencyName: string;
  category: CompetencyCategory;
  currentLevel: number; // 0 to 5
  requiredLevel: number; // 1 to 5
  gap: number; // current - required
  gapPercentage: number;
  severity: "critical" | "moderate" | "meets" | "exceeds";
  recommendedAction: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  competencyId: string;
  competencyName?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questionText: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
  sourceMaterial?: string;
  aiConfidence?: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  targetRoleId: string;
  competencyIds: string[];
  totalQuestions: number;
  durationMinutes: number;
  passingPercentage: number;
  questions: Question[];
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOptionId: string | null;
  markedForReview: boolean;
  timeSpentSeconds: number;
}

export interface CompetencyScore {
  competencyId: string;
  competencyName: string;
  score: number;
  total: number;
  percentage: number;
  evaluatedLevel: number;
  targetLevel: number;
  status: "critical" | "moderate" | "meets" | "exceeds";
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  totalScore: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  timeSpentMinutes: number;
  competencyScores: CompetencyScore[];
  identifiedGaps: CompetencyGap[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  competencyId: string;
  competencyName: string;
  difficulty: "easy" | "medium" | "hard" | "intermediate" | "advanced";
  explanation?: string;
  sourceType?: "question_bank" | "uploaded_material";
  sourceTitle?: string;
  sourceLocator?: string;
}

export interface BaselineAssessment {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  department: string;
  cadre: string;
  totalQuestions: number;
  estimatedTimeMinutes: number;
  assessmentType: string;
  competenciesCovered: string[];
  questions: AssessmentQuestion[];
}

export interface AssessmentSubmissionPayload {
  assessmentId: string;
  answers: Record<string, string>;
  timeSpentSeconds: number;
}

export interface CompetencyPerformanceItem {
  competencyId: string;
  competencyName: string;
  requiredScore: number;
  demonstratedScore: number;
  gap: number;
  status: "Critical Gap" | "Priority Gap" | "Developing" | "Achieved" | "Above Requirement" | "Meets Benchmark";
  priority?: "Critical" | "High" | "Moderate" | "Low" | "Medium";
}

export interface QuestionReviewItem {
  id: string;
  questionNumber: number;
  questionText: string;
  competencyName: string;
  difficulty: string;
  result: "Correct" | "Incorrect";
  selectedOptionText: string;
  correctOptionText: string;
  explanation: string;
  isFlagged?: boolean;
}

export interface AssessmentDetailedResult {
  id: string;
  assessmentId: string;
  title: string;
  role: string;
  cadre: string;
  department: string;
  status: "Completed";
  completedDate: string;
  overallScore: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  durationMinutes: number;
  competencyPerformance: CompetencyPerformanceItem[];
  radarData: {
    competency: string;
    required: number;
    demonstrated: number;
    gap: number;
    fullMark: number;
  }[];
  topPriorityGaps: {
    competencyId: string;
    competencyName: string;
    requiredScore: number;
    demonstratedScore: number;
    gap: number;
    priority: "Critical" | "High" | "Moderate" | "Low" | "Medium";
    aiInsight: string;
  }[];
  aiInsight: {
    strongestOpportunity: string;
    demonstratedScore: number;
    requiredScore: number;
    summary: string;
    recommendationText: string;
  };
  questionsReview: QuestionReviewItem[];
  progressData: {
    stage: string;
    score: number;
    label: string;
    status: "completed" | "sample";
  }[];
}

export interface AssessmentEvaluationResult {
  id: string;
  assessmentId: string;
  title: string;
  submittedAt: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  overallScore: number;
  competencyScores: {
    competencyId: string;
    competencyName: string;
    total: number;
    correct: number;
    score: number;
    status: "Priority" | "Developing" | "Achieved";
  }[];
}

export type ResourceType = "course" | "document" | "video" | "handbook" | "interactive";
export type ResourceSource = "igot_karmayogi" | "mospi_internal" | "un_stats" | "sme_upload";

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  competencyId: string;
  competencyName: string;
  targetLevel: number;
  durationHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  resourceType: ResourceType;
  source: ResourceSource;
  sourceUrl?: string;
  thumbnailUrl?: string;
  enrollmentCount?: number;
  rating?: number;
  completionStatus?: "not_started" | "in_progress" | "completed";
  progressPercentage?: number;
}

export interface IGOTCourse extends LearningResource {
  igotCourseId: string;
  provider: string; // e.g., "National Statistical Systems Training Academy (NSSTA)"
  curriculumCategory: string;
  certificateOffered: boolean;
}

export interface LearningPathNode {
  id: string;
  order: number;
  resource: LearningResource;
  competencyAddressed: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  estimatedHours: number;
  recommendedReason: string;
  deadline?: string;
}

export interface LearningPath {
  id: string;
  userId: string;
  targetRoleId: string;
  targetRoleName: string;
  overallProgress: number;
  nodes: LearningPathNode[];
  generatedAt: string;
  lastUpdatedAt: string;
}

export type LearningPathStage = "NOW" | "NEXT" | "LATER";
export type LearningPathStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "LOCKED";

export interface LearningPathMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface LearningPathItem {
  id: string;
  resourceId: string;
  competencyId: string;
  competencyName: string;
  title: string;
  stage: LearningPathStage;
  priority: "Critical Priority" | "High Priority" | "Medium Priority" | "Low Priority";
  status: LearningPathStatus;
  completionStatus?: "Completed" | "In Progress" | "Up Next" | "Planned" | "Locked";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  progress: number; // 0 - 100
  reason: string;
  requiredScore: number;
  currentScore: number;
  gapPoints: number;
  source: string; // "iGOT Karmayogi"
  milestones?: LearningPathMilestone[];
  learningOutcomes?: string[];
  prerequisites?: string[];
}

export interface PersonalizedLearningPathData {
  learnerName: string;
  role: string;
  cadre: string;
  department: string;
  overallProgress: number;
  stats: {
    priorityCompetencies: number;
    recommendedResources: number;
    currentlyLearning: number;
    reassessmentsDue: number;
  };
  competencyLoopStages: {
    name: string;
    status: "completed" | "in_progress" | "not_started";
    label: string;
  }[];
  items: LearningPathItem[];
  whyThisOrder: {
    title: string;
    summary: string;
    rationale: string;
  };
}

export interface Recommendation {
  id: string;
  resourceId: string;
  resource: LearningResource;
  priorityScore: number;
  gapAddressed: string;
  rationale: string;
}

export type RecommendationPriority = "High Priority" | "Medium Priority" | "Recommended" | "Achieved";
export type LearningCategorySection = "gaps" | "strengthen" | "practice" | "meeting";

export interface RecommendedResource {
  id: string;
  title: string;
  description: string;
  competencyId: string;
  competencyName: string;
  durationMinutes: number;
  durationCategory?: "<30" | "30-60" | ">60";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  learningType: "Course" | "Video" | "Document" | "Practice";
  source: string; // "iGOT Karmayogi"
  platform: string; // "iGOT Karmayogi (Demo Catalog)"
  isDemoCatalog: boolean;
  provider: string;
  whyRecommended: string;
  explanation?: string;
  progress: number; // 0 - 100
  progressStatus?: "not_started" | "in_progress" | "completed";
  detailedReasoning: {
    currentScore: number;
    requiredScore: number;
    gapPoints: number;
    rationale: string;
  };
  learningObjectives: string[];
  priority: RecommendationPriority;
  categorySection: LearningCategorySection;
  recommendedOrder?: "NOW" | "NEXT" | "LATER";
  orderIndex?: number;
  enrollmentCount?: number;
  rating?: number;
}

export interface LearnerRecommendationsData {
  role: string;
  cadre: string;
  department: string;
  priorityArea: {
    competencyName: string;
    currentScore: number;
    requiredScore: number;
    gapPoints: number;
    recommendationText: string;
    priorityResourceId: string;
  };
  gapChips: {
    competencyId: string;
    competencyName: string;
    gapPoints: number;
    priority: RecommendationPriority;
  }[];
  orderQueue: {
    timing: "NOW" | "NEXT" | "LATER";
    orderNumber: number;
    resourceId: string;
    title: string;
    competencyName: string;
  }[];
  resources: RecommendedResource[];
}

export interface PracticeQuiz {
  id: string;
  competencyId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  totalQuestions: number;
  questions: Question[];
}

export interface CompetencyDistributionDomain {
  domain: string;
  code: string;
  demonstrated: number;
  benchmark: number;
  deficit: number;
  officersCount: number;
  status: "critical" | "moderate" | "meets" | "exceeds";
}

export interface ProficiencyLevelDistribution {
  level: string;
  levelNumber: number;
  officersCount: number;
  percentage: number;
  description: string;
}

export interface HeatmapDivisionScore {
  divisionCode: string;
  divisionName: string;
  shortName: string;
  officerCount: number;
  averageScore: number;
  scores: {
    methods: number;
    sampling: number;
    dataManagement: number;
    computing: number;
    standards: number;
    visualization: number;
  };
  statuses: {
    methods: "critical" | "moderate" | "meets" | "exceeds";
    sampling: "critical" | "moderate" | "meets" | "exceeds";
    dataManagement: "critical" | "moderate" | "meets" | "exceeds";
    computing: "critical" | "moderate" | "meets" | "exceeds";
    standards: "critical" | "moderate" | "meets" | "exceeds";
    visualization: "critical" | "moderate" | "meets" | "exceeds";
  };
}

export interface AssessmentPerformanceTrendItem {
  month: string;
  assessmentsCount: number;
  averageScore: number;
  passRate: number;
}

export interface ScoreTierDistribution {
  tier: string;
  range: string;
  percentage: number;
  count: number;
  color: string;
}

export interface CourseCompletionTrendItem {
  month: string;
  enrolled: number;
  completed: number;
  quizzes: number;
  learningHours: number;
}

export interface TopOrganizationalGap {
  id: string;
  rank: number;
  competencyName: string;
  competencyCode: string;
  category: string;
  affectedOfficers: number;
  affectedPercentage: number;
  averageDeficit: number;
  currentScore: number;
  requiredScore: number;
  priority: "Critical" | "High" | "Moderate";
  recommendedCourse: {
    id: string;
    title: string;
    provider: string;
    duration: string;
  };
  remedialAction: string;
}

export type CompetencyHeatmapSeverity = "critical" | "moderate" | "meets" | "exceeds";

export interface HeatmapTeamRow {
  id: string;
  teamName: string;
  department: string;
  headcount: number;
  scores: {
    python: number;
    statistics: number;
    survey: number;
    visualization: number;
    dataManagement?: number;
    officialStandards?: number;
  };
  averageScore: number;
  status: CompetencyHeatmapSeverity;
}

export interface HeatmapEmployeeRow {
  id: string;
  name: string;
  role: string;
  department: string;
  team: string;
  scores: {
    python: number;
    statistics: number;
    survey: number;
    visualization: number;
    dataManagement?: number;
    officialStandards?: number;
  };
  averageScore: number;
  status: CompetencyHeatmapSeverity;
}

export interface HeatmapCellDetail {
  targetName: string;
  isTeam: boolean;
  department: string;
  competencyKey: "python" | "statistics" | "survey" | "visualization" | "dataManagement" | "officialStandards";
  competencyTitle: string;
  score: number;
  benchmark: number;
  gap: number;
  severity: CompetencyHeatmapSeverity;
  recommendedCourse: {
    title: string;
    provider: string;
    duration: string;
    url?: string;
  };
}

export interface AdminAnalytics {
  totalLearners: number;
  activeLearnersLast30Days: number;
  averageAssessmentScore: number;
  overallCourseCompletionRate: number;
  totalAssessmentsConducted: number;
  mostCommonGaps: {
    competencyName: string;
    gapCount: number;
    averageDeficit: number;
  }[];
  monthlyActivityTrends: {
    month: string;
    assessmentsTaken: number;
    coursesCompleted: number;
    quizzesAttempted: number;
  }[];
  departmentPerformance: {
    department: string;
    averageCompetencyScore: number;
    learnerCount: number;
  }[];
}

export interface TeamMemberCompetency {
  userId: string;
  name: string;
  role: string;
  department: string;
  competencies: {
    competencyId: string;
    competencyName: string;
    currentLevel: number;
    requiredLevel: number;
    status: "critical" | "moderate" | "meets" | "exceeds";
  }[];
}

export interface MCQReviewItem {
  id: string;
  question: Question;
  sourceDocumentName: string;
  sourcePage: string;
  extractedSnippet: string;
  status: "pending" | "approved" | "rejected";
  aiConfidence: number;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Learner Dashboard Data Contracts (Prompt 2)
// ---------------------------------------------------------------------------

export interface CompetencyRadarItem {
  competency: string;
  required: number;
  demonstrated: number;
}

export interface PriorityCompetencyGapItem {
  id: string;
  competencyId: string;
  competencyName: string;
  currentScore: number;
  requiredScore: number;
  gapPoints: number;
  priorityLevel: "critical" | "high" | "moderate";
  explanation: string;
  resourceId: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  competency: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  source: string;
  reason: string;
  resourceId: string;
}

export interface DashboardLearningPathItem {
  title: string;
  competency: string;
  duration: string;
  status: "In Progress" | "Not Started" | "Planned";
  resourceId: string;
}

export interface RecentAssessmentSummary {
  id: string;
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  status: "Completed" | "Pending Review";
}

export interface UpcomingAssessmentSummary {
  id: string;
  title: string;
  competency: string;
  dueDate: string;
  daysRemaining: number;
  durationMinutes: number;
  questionCount: number;
  status: "Scheduled" | "Due Soon";
  type: "Reassessment" | "Annual Diagnostic";
}

export interface DashboardAiInsight {
  headline: string;
  competencyName: string;
  gapPoints: number;
  analysis: string;
  recommendedNextAction: string;
  resourceId: string;
  targetCadreBenchmark: number;
  currentDemonstratedScore: number;
}

export interface ProgressHistoryPoint {
  assessment: string;
  score: number;
  target: number;
  date: string;
}

export interface LearnerDashboardData {
  learner: {
    id: string;
    name: string;
    role: string;
    cadre: string;
    department: string;
    lastAssessmentDate?: string;
  };
  kpis: {
    overallCompetency: number;
    priorityGapsCount: number;
    learningProgress: number;
    completedCoursesCount: number;
  };
  radarData: CompetencyRadarItem[];
  priorityGaps: PriorityCompetencyGapItem[];
  recommendations: RecommendationItem[];
  learningPath: {
    now: DashboardLearningPathItem;
    next: DashboardLearningPathItem;
    later: DashboardLearningPathItem;
  };
  recentAssessment: RecentAssessmentSummary | null;
  upcomingAssessment?: UpcomingAssessmentSummary | null;
  aiInsight?: DashboardAiInsight;
  progressHistory: ProgressHistoryPoint[];
}

export interface CompetencyDetailItem {
  id: string;
  name: string;
  requiredScore: number;
  demonstratedScore: number;
  gap: number;
  status: "Priority" | "Developing" | "Achieved";
  priority: "High" | "Medium" | "Low" | "Achieved";
  aiInsight?: string;
}

export interface CompetencyProfileData {
  learner: {
    id: string;
    name: string;
    role: string;
    department: string;
    cadre: string;
  };
  summary: {
    overallCompetency: number;
    requiredCompetenciesCount: number;
    priorityGapsCount: number;
    assessmentStatus: "Completed" | "Assessment Required";
  };
  radarData: CompetencyRadarItem[];
  competenciesTable: CompetencyDetailItem[];
  priorityGaps: {
    id: string;
    rank: number;
    competencyName: string;
    requiredScore: number;
    currentScore: number;
    gapPoints: number;
    priority: "High" | "Medium" | "Low";
    aiInsight: string;
    recommendedResource: string;
  }[];
  aiInsight: {
    headline: string;
    analysis: string;
    recommendedNextAction: string;
    actionCta: string;
  };
  recommendations: {
    id: string;
    title: string;
    competency: string;
    durationMinutes: number;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    source: string;
    reason: string;
    resourceId: string;
  }[];
  learningPath: {
    now: string;
    next: string;
    later: string;
  };
  assessmentStatus: {
    isCompleted: boolean;
    title: string;
    score: number;
    date: string;
  };
  progressHistory: {
    stage: string;
    score: number;
  }[];
}

/**
 * AI Quiz Generator Domain Types
 * SIH 2026 Problem Statement 101 - RAG & MCQ Extraction
 */

export type QuizProcessingStage =
  | "uploading"
  | "extracting"
  | "retrieving"
  | "generating"
  | "ready";

export interface GeneratedMCQOption {
  id: string;
  label: "A" | "B" | "C" | "D";
  text: string;
}

export interface GeneratedMCQ {
  id: string;
  questionNumber: number;
  question: string;
  options: [GeneratedMCQOption, GeneratedMCQOption, GeneratedMCQOption, GeneratedMCQOption];
  correctOptionId: string;
  correctOptionLabel: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  competency: string;
  competencyId: string;
  sourceDocument: string;
  sourcePage: string;
  sourceSnippet?: string;
  aiConfidence?: number; // e.g. 0.94
}

export interface UploadedMaterialInfo {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  fileType: string; // "application/pdf"
  pageCount: number;
  uploadedAt: string;
  checksum: string;
  summary?: string;
  competenciesIdentified?: string[];
}

export interface QuizGenerationConfig {
  questionCount: number; // 3, 5, 10
  competencyFocus: string;
  targetCadre: string;
  difficultyPreference?: "balanced" | "beginner" | "intermediate" | "advanced";
}

export interface SampleLearningMaterial {
  id: string;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  pageCount: number;
  category: string;
  description: string;
  competencies: string[];
}
