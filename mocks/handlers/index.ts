import { http, HttpResponse } from "msw";
import { mockLearnerUser, mockCompetencyGaps } from "../data/learner";
import { mockCompetencies } from "../data/competencies";
import { mockRoles } from "../data/roles";
import { mockAssessment } from "../data/assessments";
import { mockLearningResources, mockLearningPath, mockRecommendations } from "../data/resources";
import { mockAdminAnalytics, mockTeamCompetencies, mockMCQReviewQueue } from "../data/admin";

export const handlers = [
  // Learner profile & Gaps
  http.get("/api/learner/profile", () => {
    return HttpResponse.json({
      user: mockLearnerUser,
      gaps: mockCompetencyGaps,
      activeTargetRole: mockRoles.find(r => r.id === mockLearnerUser.targetRoleId)
    });
  }),

  // Competencies list
  http.get("/api/competencies", () => {
    return HttpResponse.json(mockCompetencies);
  }),

  // Roles list
  http.get("/api/roles", () => {
    return HttpResponse.json(mockRoles);
  }),

  // Assessments
  http.get("/api/assessments", () => {
    return HttpResponse.json([mockAssessment]);
  }),

  http.get("/api/assessments/:id", ({ params }) => {
    return HttpResponse.json(mockAssessment);
  }),

  http.post("/api/assessments/:id/submit", async ({ request }) => {
    const body = await request.json() as { answers: Record<string, string> };
    return HttpResponse.json({
      success: true,
      assessmentId: "asm-iss-2026-ad",
      scorePercentage: 80,
      totalQuestions: 5,
      correctAnswers: 4,
      incorrectAnswers: 1,
      unansweredQuestions: 0,
      isPassed: true,
      completedAt: new Date().toISOString()
    });
  }),

  // Learning Path
  http.get("/api/learning-path", () => {
    return HttpResponse.json(mockLearningPath);
  }),

  // Resources (iGOT & Official Courseware)
  http.get("/api/resources", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const competencyId = url.searchParams.get("competencyId");

    let filtered = [...mockLearningResources];
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search)
      );
    }
    if (competencyId && competencyId !== "all") {
      filtered = filtered.filter((r) => r.competencyId === competencyId);
    }
    return HttpResponse.json(filtered);
  }),

  // Recommendations
  http.get("/api/recommendations", () => {
    return HttpResponse.json(mockRecommendations);
  }),

  // Admin Analytics
  http.get("/api/admin/analytics", () => {
    return HttpResponse.json(mockAdminAnalytics);
  }),

  // Admin Team Competencies Heatmap
  http.get("/api/admin/team-competencies", () => {
    return HttpResponse.json(mockTeamCompetencies);
  }),

  // Admin MCQ Review Queue
  http.get("/api/admin/mcq-queue", () => {
    return HttpResponse.json(mockMCQReviewQueue);
  }),

  // MCQ approve/reject actions
  http.post("/api/admin/mcq/:id/approve", ({ params }) => {
    return HttpResponse.json({ success: true, id: params.id, status: "approved" });
  }),

  http.post("/api/admin/mcq/:id/reject", ({ params }) => {
    return HttpResponse.json({ success: true, id: params.id, status: "rejected" });
  }),
];
