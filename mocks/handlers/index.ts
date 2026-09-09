import { http, HttpResponse } from "msw";
import { mockLearnerUser, mockCompetencyGaps, mockLearnerDashboardData } from "../data/learner";
import { mockCompetencies } from "../data/competencies";
import { mockRoles } from "../data/roles";
import { mockAssessment } from "../data/assessments";
import { mockBaselineAssessment } from "../data/baseline-assessment";
import { mockAssessmentResult } from "../data/assessment-results";
import { mockRecommendationsData } from "../data/recommendations";
import { mockPersonalizedLearningPath } from "../data/learning-path";
import { mockLearningResources, mockLearningPath, mockRecommendations } from "../data/resources";
import { mockAdminAnalytics, mockTeamCompetencies, mockMCQReviewQueue } from "../data/admin";
import { mockCompetencyProfileData } from "../data/competency-profile";

export const handlers = [
  // Learner Personalized Learning Path (Prompt 6)
  http.get("/api/learner/learning-path", () => {
    return HttpResponse.json(mockPersonalizedLearningPath);
  }),

  // Learner Recommendations (Prompt 5)
  http.get("/api/learner/recommendations", ({ request }) => {
    const url = new URL(request.url);
    const compId = url.searchParams.get("competencyId");
    if (compId && compId !== "all") {
      const filtered = mockRecommendationsData.resources.filter((r) => r.competencyId === compId);
      return HttpResponse.json({
        ...mockRecommendationsData,
        resources: filtered,
      });
    }
    return HttpResponse.json(mockRecommendationsData);
  }),

  // Learner Resource Preview (Prompt 5)
  http.get("/api/learner/resources/:id", ({ params }) => {
    const found = mockRecommendationsData.resources.find((r) => r.id === params.id);
    if (!found) {
      return new HttpResponse(JSON.stringify({ error: "Resource not found" }), { status: 404 });
    }
    return HttpResponse.json(found);
  }),

  // Learner Assessment Detailed Results (Prompt 4)
  http.get("/api/learner/results/:id", () => {
    return HttpResponse.json(mockAssessmentResult);
  }),

  // Learner Baseline Assessment (Prompt 3)
  http.get("/api/learner/assessment/:id", () => {
    return HttpResponse.json(mockBaselineAssessment);
  }),

  http.post("/api/learner/assessment/:id/submit", async ({ request, params }) => {
    const body = (await request.json()) as { answers: Record<string, string> };
    const answers = body.answers || {};

    let totalCorrect = 0;
    const competencyBreakdownMap: Record<
      string,
      { competencyId: string; competencyName: string; total: number; correct: number }
    > = {};

    mockBaselineAssessment.questions.forEach((q) => {
      if (!competencyBreakdownMap[q.competencyId]) {
        competencyBreakdownMap[q.competencyId] = {
          competencyId: q.competencyId,
          competencyName: q.competencyName,
          total: 0,
          correct: 0,
        };
      }
      competencyBreakdownMap[q.competencyId].total += 1;

      if (answers[q.id] && answers[q.id] === q.correctOptionId) {
        totalCorrect += 1;
        competencyBreakdownMap[q.competencyId].correct += 1;
      }
    });

    const totalQuestions = mockBaselineAssessment.questions.length;
    const overallScore = Math.round((totalCorrect / totalQuestions) * 100);

    const competencyScores = Object.values(competencyBreakdownMap).map((c) => {
      const score = Math.round((c.correct / c.total) * 100);
      let status: "Priority" | "Developing" | "Achieved" = "Developing";
      if (score >= 70) status = "Achieved";
      else if (score < 60) status = "Priority";

      return {
        competencyId: c.competencyId,
        competencyName: c.competencyName,
        total: c.total,
        correct: c.correct,
        score,
        status,
      };
    });

    return HttpResponse.json({
      id: `eval-${Date.now()}`,
      assessmentId: params.id || mockBaselineAssessment.id,
      title: mockBaselineAssessment.title,
      submittedAt: new Date().toISOString(),
      totalQuestions,
      answeredCount: Object.keys(answers).length,
      correctCount: totalCorrect,
      overallScore,
      competencyScores,
    });
  }),
  // Learner Competency Profile (Prompt 2)
  http.get("/api/learner/competency", () => {
    return HttpResponse.json(mockCompetencyProfileData);
  }),

  // Learner Dashboard
  http.get("/api/learner/dashboard", () => {
    return HttpResponse.json(mockLearnerDashboardData);
  }),

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
