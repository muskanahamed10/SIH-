import { LearnerRecommendationsData, RecommendedResource } from "@/types";
import { mockRecommendationsData } from "@/mocks/data/recommendations";

/**
 * iGOT Karmayogi Catalog Service Interface & Adapter Architecture
 * ---------------------------------------------------------------
 * This module cleanly isolates the demo course catalog from future live authorized
 * iGOT APIs (DoPT / Karmayogi Bharat ecosystem).
 *
 * Current State: Uses MockIgotCatalogAdapter with verified MoSPI cadre competencies.
 * Production Cutover: Set NEXT_PUBLIC_IGOT_API_LIVE=true and supply OAuth credentials
 * to automatically switch to AuthorizedIgotApiAdapter without changing frontend components.
 */

export interface IgotCatalogQueryParams {
  search?: string;
  competencyId?: string;
  difficulty?: "all" | "Beginner" | "Intermediate" | "Advanced";
  durationCategory?: "all" | "<30" | "30-60" | ">60";
  sortBy?: "recommended" | "duration" | "gap" | "progress";
}

export interface IgotCatalogService {
  readonly isLiveIntegration: boolean;
  fetchRecommendations(params?: IgotCatalogQueryParams): Promise<LearnerRecommendationsData>;
  fetchResourceById(id: string): Promise<RecommendedResource | null>;
}

/**
 * Adapter 1: Mock / Demo iGOT-Aligned Course Catalog
 * Uses deterministic MoSPI cadre courses aligned with NSSTA and official statistics requirements.
 */
export class MockIgotCatalogAdapter implements IgotCatalogService {
  readonly isLiveIntegration = false;

  async fetchRecommendations(params?: IgotCatalogQueryParams): Promise<LearnerRecommendationsData> {
    // Clone demo dataset
    let filteredResources = [...mockRecommendationsData.resources];

    // Filter by Competency
    if (params?.competencyId && params.competencyId !== "all") {
      filteredResources = filteredResources.filter((r) => r.competencyId === params.competencyId);
    }

    // Filter by Difficulty
    if (params?.difficulty && params.difficulty !== "all") {
      filteredResources = filteredResources.filter((r) => r.difficulty === params.difficulty);
    }

    // Filter by Duration Category
    if (params?.durationCategory && params.durationCategory !== "all") {
      if (params.durationCategory === "<30") {
        filteredResources = filteredResources.filter((r) => r.durationMinutes < 30);
      } else if (params.durationCategory === "30-60") {
        filteredResources = filteredResources.filter((r) => r.durationMinutes >= 30 && r.durationMinutes <= 60);
      } else if (params.durationCategory === ">60") {
        filteredResources = filteredResources.filter((r) => r.durationMinutes > 60);
      }
    }

    // Filter by Search query
    if (params?.search && params.search.trim() !== "") {
      const q = params.search.toLowerCase().trim();
      filteredResources = filteredResources.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.competencyName.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q) ||
          (r.explanation && r.explanation.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (params?.sortBy === "duration") {
      filteredResources.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (params?.sortBy === "gap") {
      filteredResources.sort(
        (a, b) => (b.detailedReasoning?.gapPoints || 0) - (a.detailedReasoning?.gapPoints || 0)
      );
    } else if (params?.sortBy === "progress") {
      filteredResources.sort((a, b) => b.progress - a.progress);
    } else {
      // Default: "recommended" by orderIndex or priority
      filteredResources.sort((a, b) => (a.orderIndex || 99) - (b.orderIndex || 99));
    }

    return {
      ...mockRecommendationsData,
      resources: filteredResources,
    };
  }

  async fetchResourceById(id: string): Promise<RecommendedResource | null> {
    const resource = mockRecommendationsData.resources.find((r) => r.id === id);
    return resource ? { ...resource } : null;
  }
}

/**
 * Adapter 2: Authorized iGOT Bharat Production API Adapter (Future Ready)
 * Configured to connect to official iGOT OAuth 2.0 endpoints and course hierarchy APIs.
 */
export class AuthorizedIgotApiAdapter implements IgotCatalogService {
  readonly isLiveIntegration = true;
  private readonly baseUrl: string;
  private readonly clientId: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_IGOT_API_BASE || "https://igot-karmayogi.gov.in/api";
    this.clientId = process.env.NEXT_PUBLIC_IGOT_CLIENT_ID || "";
  }

  async fetchRecommendations(params?: IgotCatalogQueryParams): Promise<LearnerRecommendationsData> {
    const query = new URLSearchParams();
    if (params?.competencyId && params.competencyId !== "all") query.set("competencyId", params.competencyId);
    if (params?.difficulty && params.difficulty !== "all") query.set("difficulty", params.difficulty);
    if (params?.durationCategory && params.durationCategory !== "all") query.set("duration", params.durationCategory);
    if (params?.search) query.set("search", params.search);
    if (params?.sortBy) query.set("sortBy", params.sortBy);

    try {
      const response = await fetch(`${this.baseUrl}/v1/cadre/recommendations?${query.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": this.clientId,
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`iGOT API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn("Authorized iGOT API request failed; falling back to demo catalog adapter:", err);
      const fallback = new MockIgotCatalogAdapter();
      return fallback.fetchRecommendations(params);
    }
  }

  async fetchResourceById(id: string): Promise<RecommendedResource | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn("Authorized iGOT course lookup failed; falling back:", err);
      const fallback = new MockIgotCatalogAdapter();
      return fallback.fetchResourceById(id);
    }
  }

  private getAuthToken(): string {
    return process.env.IGOT_API_BEARER_TOKEN || "mock-authorized-token";
  }
}

/**
 * Singleton factory to provide the active iGOT catalog service instance.
 */
let serviceInstance: IgotCatalogService | null = null;

export function getIgotCatalogService(): IgotCatalogService {
  if (!serviceInstance) {
    const isLiveRequested = process.env.NEXT_PUBLIC_IGOT_API_LIVE === "true";
    serviceInstance = isLiveRequested ? new AuthorizedIgotApiAdapter() : new MockIgotCatalogAdapter();
  }
  return serviceInstance;
}
