import { PersonalizedLearningPathData, LearningPathItem } from "@/types";
import { mockPersonalizedLearningPath } from "@/mocks/data/learning-path";

/**
 * Personalized Learning Path Service Interface & Adapter Architecture
 * -------------------------------------------------------------------
 * Decouples the frontend NOW -> NEXT -> LATER visual journey from the
 * recommendation engine backend.
 *
 * Current State: Uses MockLearningPathAdapter with calibrated MoSPI Cadre data.
 * Production Cutover: Set NEXT_PUBLIC_ENGINE_API_LIVE=true and configure endpoints
 * to connect directly to the FastAPI / Python recommendation engine.
 */

export interface LearningPathService {
  readonly isLiveIntegration: boolean;
  fetchPersonalizedPath(userId?: string): Promise<PersonalizedLearningPathData>;
  updateStepProgress(itemId: string, progress: number): Promise<PersonalizedLearningPathData>;
}

/**
 * Adapter 1: Mock Learning Path Adapter
 * Delivers deterministic NOW -> NEXT -> LATER sequence:
 * 1. NOW: Python Fundamentals
 * 2. NEXT: Data Analysis with Python
 * 3. LATER: Advanced Statistical Computing
 */
export class MockLearningPathAdapter implements LearningPathService {
  readonly isLiveIntegration = false;

  async fetchPersonalizedPath(): Promise<PersonalizedLearningPathData> {
    return {
      ...mockPersonalizedLearningPath,
      items: mockPersonalizedLearningPath.items.map((item) => ({ ...item })),
    };
  }

  async updateStepProgress(itemId: string, progress: number): Promise<PersonalizedLearningPathData> {
    const updatedItems: LearningPathItem[] = mockPersonalizedLearningPath.items.map((item) => {
      if (item.id === itemId) {
        const clamped = Math.min(100, Math.max(0, progress));
        const status = clamped === 100 ? "COMPLETED" : clamped > 0 ? "IN_PROGRESS" : "NOT_STARTED";
        const completionStatus =
          clamped === 100 ? "Completed" : clamped > 0 ? "In Progress" : item.stage === "NOW" ? "In Progress" : "Up Next";
        return {
          ...item,
          progress: clamped,
          status,
          completionStatus,
        };
      }
      return { ...item };
    });

    // Recompute overall path progress
    const totalWeightedProgress = Math.round(
      updatedItems.reduce((acc, curr) => acc + curr.progress, 0) / updatedItems.length
    );

    return {
      ...mockPersonalizedLearningPath,
      overallProgress: totalWeightedProgress,
      items: updatedItems,
    };
  }
}

/**
 * Adapter 2: AI Recommendation Engine Production Adapter (Future Ready)
 * Communicates with the external machine learning recommendation engine service.
 */
export class EngineLearningPathAdapter implements LearningPathService {
  readonly isLiveIntegration = true;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_ENGINE_API_BASE || "https://recommendation-engine.mospi.gov.in/api";
  }

  async fetchPersonalizedPath(userId: string = "current-user"): Promise<PersonalizedLearningPathData> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/learning-path/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Recommendation engine error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn("Recommendation engine call failed; falling back to mock adapter:", err);
      const fallback = new MockLearningPathAdapter();
      return fallback.fetchPersonalizedPath();
    }
  }

  async updateStepProgress(itemId: string, progress: number): Promise<PersonalizedLearningPathData> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/learning-path/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ itemId, progress }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update step progress: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn("Failed to sync step progress with engine; falling back to local simulation:", err);
      const fallback = new MockLearningPathAdapter();
      return fallback.updateStepProgress(itemId, progress);
    }
  }

  private getAuthToken(): string {
    return process.env.RECOMMENDATION_ENGINE_TOKEN || "mock-engine-token";
  }
}

let serviceInstance: LearningPathService | null = null;

export function getLearningPathService(): LearningPathService {
  if (!serviceInstance) {
    const isLive = process.env.NEXT_PUBLIC_ENGINE_API_LIVE === "true";
    serviceInstance = isLive ? new EngineLearningPathAdapter() : new MockLearningPathAdapter();
  }
  return serviceInstance;
}
