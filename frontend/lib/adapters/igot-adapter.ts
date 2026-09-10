import { RecommendedResource, LearnerRecommendationsData } from "@/types";
import { mockRecommendationsData } from "@/mocks/data/recommendations";

/**
 * iGOTAdapter Interface
 *
 * Architectural abstraction layer decoupling the AI Competency Platform frontend
 * from external LMS backends. A future authorized iGOT Karmayogi API/SSO integration
 * will implement this contract without requiring UI refactoring.
 */
export interface IGOTAdapter {
  searchCourses(query?: string, filters?: { competencyId?: string; priority?: string; type?: string }): Promise<RecommendedResource[]>;
  getCourse(resourceId: string): Promise<RecommendedResource | null>;
  getLearningResources(params?: {
    competencyId?: string;
    priority?: string;
    type?: string;
    sortBy?: "recommended" | "duration" | "gap";
  }): Promise<LearnerRecommendationsData>;
}

/**
 * MockIGOTAdapter
 *
 * Demo adapter providing realistic Government of India statistical curriculum resources
 * aligned with MoSPI cadre competencies. Does NOT connect to or simulate fake live endpoints.
 */
export class MockIGOTAdapter implements IGOTAdapter {
  async searchCourses(
    query?: string,
    filters?: { competencyId?: string; priority?: string; type?: string }
  ): Promise<RecommendedResource[]> {
    let list = [...mockRecommendationsData.resources];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.competencyName.toLowerCase().includes(q)
      );
    }

    if (filters?.competencyId && filters.competencyId !== "all") {
      list = list.filter((r) => r.competencyId === filters.competencyId);
    }

    if (filters?.priority && filters.priority !== "all") {
      list = list.filter((r) => r.priority === filters.priority);
    }

    if (filters?.type && filters.type !== "all") {
      list = list.filter((r) => r.learningType === filters.type);
    }

    return list;
  }

  async getCourse(resourceId: string): Promise<RecommendedResource | null> {
    const item = mockRecommendationsData.resources.find((r) => r.id === resourceId);
    return item || null;
  }

  async getLearningResources(params?: {
    competencyId?: string;
    priority?: string;
    type?: string;
    sortBy?: "recommended" | "duration" | "gap";
  }): Promise<LearnerRecommendationsData> {
    const filtered = await this.searchCourses(undefined, {
      competencyId: params?.competencyId,
      priority: params?.priority,
      type: params?.type,
    });

    // Apply sorting
    if (params?.sortBy === "duration") {
      filtered.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (params?.sortBy === "gap") {
      filtered.sort(
        (a, b) => (b.detailedReasoning?.gapPoints || 0) - (a.detailedReasoning?.gapPoints || 0)
      );
    } else {
      // "recommended" default: NOW/NEXT/LATER order, then priority
      const priorityWeights: Record<string, number> = {
        "High Priority": 3,
        "Medium Priority": 2,
        Recommended: 1,
        Achieved: 0,
      };
      filtered.sort((a, b) => {
        if (a.orderIndex && b.orderIndex) return a.orderIndex - b.orderIndex;
        if (a.orderIndex) return -1;
        if (b.orderIndex) return 1;
        return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
      });
    }

    return {
      ...mockRecommendationsData,
      resources: filtered,
    };
  }
}

// Export singleton instance ready for DI
export const igotAdapter: IGOTAdapter = new MockIGOTAdapter();
