"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

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

export function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api.getRecommendations(),
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
