import { NextRequest, NextResponse } from "next/server";
import { mockBaselineAssessment } from "@/mocks/data/baseline-assessment";
import { AssessmentEvaluationResult } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  void params;
  return NextResponse.json(mockBaselineAssessment);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const body = await request.json();
    const answers: Record<string, string> = body.answers || {};

    let totalCorrect = 0;
    const competencyBreakdownMap: Record<
      string,
      {
        competencyId: string;
        competencyName: string;
        total: number;
        correct: number;
      }
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

      const selectedOptionId = answers[q.id];
      if (selectedOptionId && selectedOptionId === q.correctOptionId) {
        totalCorrect += 1;
        competencyBreakdownMap[q.competencyId].correct += 1;
      }
    });

    const totalQuestions = mockBaselineAssessment.questions.length;
    const answeredCount = Object.keys(answers).length;
    const overallScore = Math.round((totalCorrect / totalQuestions) * 100);

    const competencyScores = Object.values(competencyBreakdownMap).map((c) => {
      const score = Math.round((c.correct / c.total) * 100);
      let status: "Priority" | "Developing" | "Achieved" = "Developing";
      if (score >= 70) {
        status = "Achieved";
      } else if (score < 60) {
        status = "Priority";
      }

      return {
        competencyId: c.competencyId,
        competencyName: c.competencyName,
        total: c.total,
        correct: c.correct,
        score,
        status,
      };
    });

    const result: AssessmentEvaluationResult = {
      id: `eval-${Date.now()}`,
      assessmentId: params.assessmentId || mockBaselineAssessment.id,
      title: mockBaselineAssessment.title,
      submittedAt: new Date().toISOString(),
      totalQuestions,
      answeredCount,
      correctCount: totalCorrect,
      overallScore,
      competencyScores,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: "Failed to evaluate assessment." }, { status: 500 });
  }
}
