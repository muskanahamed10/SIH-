"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useLearnerDashboard() {
  return useQuery({
    queryKey: ["learner", "dashboard"],
    queryFn: () => api.getLearnerDashboard(),
  });
}

export function useCompetencyProfile() {
  return useQuery({
    queryKey: ["learner", "competency"],
    queryFn: () => api.getCompetencyProfile(),
  });
}

export function useBaselineAssessment(assessmentId: string = "baseline-cadre-2026") {
  return useQuery({
    queryKey: ["learner", "assessment", assessmentId],
    queryFn: () => api.getBaselineAssessment(assessmentId),
  });
}

export function useAssessmentResult(assessmentId: string = "baseline-cadre-2026") {
  return useQuery({
    queryKey: ["learner", "results", assessmentId],
    queryFn: () => api.getAssessmentResult(assessmentId),
  });
}

export function useRecommendations(params?: {
  competencyId?: string;
  priority?: string;
  type?: string;
  difficulty?: "all" | "Beginner" | "Intermediate" | "Advanced";
  durationCategory?: "all" | "<30" | "30-60" | ">60";
  search?: string;
  sortBy?: "recommended" | "duration" | "gap" | "progress";
}) {
  return useQuery({
    queryKey: ["learner", "recommendations", params],
    queryFn: () => api.getRecommendations(params),
  });
}

export function useResourceDetail(resourceId: string) {
  return useQuery({
    queryKey: ["learner", "resource", resourceId],
    queryFn: () => api.getResourceById(resourceId),
    enabled: !!resourceId,
  });
}

export function useSubmitBaselineAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      answers,
      timeSpentSeconds,
    }: {
      assessmentId: string;
      answers: Record<string, string>;
      timeSpentSeconds: number;
    }) => api.submitBaselineAssessment(assessmentId, answers, timeSpentSeconds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner", "competency"] });
      queryClient.invalidateQueries({ queryKey: ["learner", "dashboard"] });
    },
  });
}

export function useLearnerProfile() {
  return useQuery({
    queryKey: ["learner", "profile"],
    queryFn: () => api.getLearnerProfile(),
  });
}

export function useCompetencies() {
  return useQuery({
    queryKey: ["competencies"],
    queryFn: () => api.getCompetencies(),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => api.getRoles(),
  });
}

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: () => api.getAssessments(),
  });
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ["assessment", id],
    queryFn: () => api.getAssessmentById(id),
    enabled: !!id,
  });
}

export function useLearningPath() {
  return useQuery({
    queryKey: ["learning-path"],
    queryFn: () => api.getLearningPath(),
  });
}

export function useResources(params?: { search?: string; competencyId?: string }) {
  return useQuery({
    queryKey: ["resources", params?.search, params?.competencyId],
    queryFn: () => api.getResources(params),
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => api.getAdminAnalytics(),
  });
}

export function useTeamCompetencies() {
  return useQuery({
    queryKey: ["admin", "team-competencies"],
    queryFn: () => api.getTeamCompetencies(),
  });
}

export function useMCQReviewQueue() {
  return useQuery({
    queryKey: ["admin", "mcq-queue"],
    queryFn: () => api.getMCQReviewQueue(),
  });
}

export function useApproveMCQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.approveMCQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mcq-queue"] });
    },
  });
}

export function useRejectMCQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.rejectMCQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mcq-queue"] });
    },
  });
}
