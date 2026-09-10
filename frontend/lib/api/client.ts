import {
  User,
  StatisticalRole,
  Competency,
  CompetencyGap,
  Assessment,
  LearningResource,
  AdminAnalytics,
  TeamMemberCompetency,
  MCQReviewItem,
  LearnerDashboardData,
  CompetencyProfileData,
  BaselineAssessment,
  AssessmentEvaluationResult,
  AssessmentDetailedResult,
  RecommendedResource,
  LearnerRecommendationsData,
  PersonalizedLearningPathData,
} from "@/types";
import { mockLearnerUser, mockCompetencyGaps, mockLearnerDashboardData } from "@/mocks/data/learner";
import { mockCompetencyProfileData } from "@/mocks/data/competency-profile";
import { mockBaselineAssessment } from "@/mocks/data/baseline-assessment";
import { mockAssessmentResult } from "@/mocks/data/assessment-results";
import { mockCompetencies } from "@/mocks/data/competencies";
import { mockRoles } from "@/mocks/data/roles";
import { mockAssessment } from "@/mocks/data/assessments";
import { mockLearningResources } from "@/mocks/data/resources";
import { mockAdminAnalytics, mockTeamCompetencies, mockMCQReviewQueue } from "@/mocks/data/admin";
import { getIgotCatalogService } from "@/lib/services/igot-catalog.service";
import { getLearningPathService } from "@/lib/services/learning-path.service";

/**
 * Dedicated API Layer abstraction for India's Official Statistical System Platform.
 * Connects transparently to mock data during development/MSW and easily shifts to production backend endpoints.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function fetcher<T>(endpoint: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}${endpoint}`, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }
    // Try relative fetch (will be intercepted by MSW if active)
    const res = await fetch(endpoint, options);
    if (res.ok) return await res.json();
  } catch {
    // Graceful fallback to rich mock data during local development
  }
  return fallbackData;
}

export const api = {
  // Learner Dashboard (Prompt 2)
  getLearnerDashboard: async (): Promise<LearnerDashboardData> => {
    return fetcher("/api/learner/dashboard", mockLearnerDashboardData);
  },

  // Learner Competency Profile (Prompt 2)
  getCompetencyProfile: async (): Promise<CompetencyProfileData> => {
    return fetcher("/api/learner/competency", mockCompetencyProfileData);
  },

  // Learner Baseline Assessment (Prompt 3)
  getBaselineAssessment: async (assessmentId: string): Promise<BaselineAssessment> => {
    return fetcher(`/api/learner/assessment/${assessmentId}`, mockBaselineAssessment);
  },

  // Learner Assessment Detailed Results (Prompt 4)
  getAssessmentResult: async (assessmentId: string = "baseline-cadre-2026"): Promise<AssessmentDetailedResult> => {
    return fetcher(`/api/learner/results/${assessmentId}`, mockAssessmentResult);
  },

  // Learner Recommendations (Prompt 5)
  getRecommendations: async (params?: {
    competencyId?: string;
    priority?: string;
    type?: string;
    difficulty?: "all" | "Beginner" | "Intermediate" | "Advanced";
    durationCategory?: "all" | "<30" | "30-60" | ">60";
    search?: string;
    sortBy?: "recommended" | "duration" | "gap" | "progress";
  }): Promise<LearnerRecommendationsData> => {
    // Delegated to abstract iGOT service adapter (swappable for production authorized API)
    const igotService = getIgotCatalogService();
    return igotService.fetchRecommendations(params);
  },

  getResourceById: async (resourceId: string): Promise<RecommendedResource | null> => {
    const igotService = getIgotCatalogService();
    return igotService.fetchResourceById(resourceId);
  },

  submitBaselineAssessment: async (
    assessmentId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<AssessmentEvaluationResult> => {
    try {
      const res = await fetch(`/api/learner/assessment/${assessmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, timeSpentSeconds }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Falling back to local evaluation:", e);
    }

    // Local evaluation fallback
    let correct = 0;
    mockBaselineAssessment.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) correct += 1;
    });
    return {
      id: `eval-${Date.now()}`,
      assessmentId,
      title: mockBaselineAssessment.title,
      submittedAt: new Date().toISOString(),
      totalQuestions: mockBaselineAssessment.questions.length,
      answeredCount: Object.keys(answers).length,
      correctCount: correct,
      overallScore: Math.round((correct / mockBaselineAssessment.questions.length) * 100),
      competencyScores: [
        { competencyId: "comp-stat-model", competencyName: "Statistical Modeling", total: 2, correct: 1, score: 50, status: "Priority" },
        { competencyId: "comp-data-analysis", competencyName: "Data Analysis", total: 2, correct: 2, score: 100, status: "Achieved" },
        { competencyId: "comp-data-vis", competencyName: "Data Visualization", total: 1, correct: 1, score: 100, status: "Achieved" },
        { competencyId: "comp-stat-comp", competencyName: "Statistical Computing", total: 2, correct: 1, score: 50, status: "Priority" },
        { competencyId: "comp-survey-method", competencyName: "Survey Methodology", total: 1, correct: 1, score: 100, status: "Achieved" },
        { competencyId: "comp-data-quality", competencyName: "Data Quality", total: 2, correct: 1, score: 50, status: "Priority" },
      ],
    };
  },

  // Learner
  getLearnerProfile: async (): Promise<{
    user: User;
    gaps: CompetencyGap[];
    activeTargetRole: StatisticalRole;
  }> => {
    return fetcher("/api/learner/profile", {
      user: mockLearnerUser,
      gaps: mockCompetencyGaps,
      activeTargetRole: mockRoles.find((r) => r.id === mockLearnerUser.targetRoleId) || mockRoles[2],
    });
  },

  getCompetencies: async (): Promise<Competency[]> => {
    return fetcher("/api/competencies", mockCompetencies);
  },

  getRoles: async (): Promise<StatisticalRole[]> => {
    return fetcher("/api/roles", mockRoles);
  },

  getAssessments: async (): Promise<Assessment[]> => {
    return fetcher("/api/assessments", [mockAssessment]);
  },

  getAssessmentById: async (id: string): Promise<Assessment> => {
    return fetcher(`/api/assessments/${id}`, mockAssessment);
  },

  submitAssessment: async (
    id: string,
    answers: Record<string, string>
  ): Promise<{
    success: boolean;
    scorePercentage: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
  }> => {
    return fetcher(
      `/api/assessments/${id}/submit`,
      {
        success: true,
        scorePercentage: 80,
        totalQuestions: 5,
        correctAnswers: 4,
        incorrectAnswers: 1,
      },
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      }
    );
  },

  getLearningPath: async (): Promise<PersonalizedLearningPathData> => {
    const service = getLearningPathService();
    return service.fetchPersonalizedPath();
  },

  getResources: async (params?: { search?: string; competencyId?: string }): Promise<LearningResource[]> => {
    let list = [...mockLearningResources];
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    if (params?.competencyId && params.competencyId !== "all") {
      list = list.filter((r) => r.competencyId === params.competencyId);
    }
    return fetcher(`/api/resources?search=${params?.search || ""}&competencyId=${params?.competencyId || ""}`, list);
  },

  // Admin
  getAdminAnalytics: async (): Promise<AdminAnalytics> => {
    return fetcher("/api/admin/analytics", mockAdminAnalytics);
  },

  getTeamCompetencies: async (): Promise<TeamMemberCompetency[]> => {
    return fetcher("/api/admin/team-competencies", mockTeamCompetencies);
  },

  getMCQReviewQueue: async (): Promise<MCQReviewItem[]> => {
    return fetcher("/api/admin/mcq-queue", mockMCQReviewQueue);
  },

  approveMCQ: async (id: string) => {
    return fetcher(`/api/admin/mcq/${id}/approve`, { success: true, id, status: "approved" }, { method: "POST" });
  },

  rejectMCQ: async (id: string) => {
    return fetcher(`/api/admin/mcq/${id}/reject`, { success: true, id, status: "rejected" }, { method: "POST" });
  },
};
