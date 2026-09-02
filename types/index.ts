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
  assessmentTitle: string;
  userId: string;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  isPassed: boolean;
  competencyBreakdown: CompetencyScore[];
  strengths: string[];
  weaknesses: string[];
  recommendedResourceIds: string[];
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

export interface Recommendation {
  id: string;
  resourceId: string;
  resource: LearningResource;
  priorityScore: number;
  gapAddressed: string;
  rationale: string;
}

export interface PracticeQuiz {
  id: string;
  competencyId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  totalQuestions: number;
  questions: Question[];
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
  extractedSnippet: string;
  status: "pending" | "approved" | "rejected";
  aiConfidence: number;
  reviewerNotes?: string;
  createdAt: string;
}
