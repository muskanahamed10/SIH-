import {
  User,
  StatisticalRole,
  Competency,
  CompetencyGap,
  Assessment,
  LearningPath,
  LearningResource,
  Recommendation,
  AdminAnalytics,
  TeamMemberCompetency,
  MCQReviewItem,
} from "@/types";
import { mockLearnerUser, mockCompetencyGaps } from "@/mocks/data/learner";
import { mockCompetencies } from "@/mocks/data/competencies";
import { mockRoles } from "@/mocks/data/roles";
import { mockAssessment } from "@/mocks/data/assessments";
import { mockLearningResources, mockLearningPath, mockRecommendations } from "@/mocks/data/resources";
import { mockAdminAnalytics, mockTeamCompetencies, mockMCQReviewQueue } from "@/mocks/data/admin";

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

  getLearningPath: async (): Promise<LearningPath> => {
    return fetcher("/api/learning-path", mockLearningPath);
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

  getRecommendations: async (): Promise<Recommendation[]> => {
    return fetcher("/api/recommendations", mockRecommendations);
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
