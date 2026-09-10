"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAssessmentResult } from "@/hooks/use-queries";
import { AssessmentEvaluationResult, CompetencyPerformanceItem } from "@/types";
import { ResultsHeader } from "@/components/learner/results/results-header";
import { OverallScoreCard } from "@/components/learner/results/overall-score-card";
import { CompetencyPerformanceTable } from "@/components/learner/results/competency-performance-table";
import { ResultsPriorityGaps } from "@/components/learner/results/results-priority-gaps";
import { ResultsAiInsight } from "@/components/learner/results/results-ai-insight";
import { AssessmentReviewAccordion } from "@/components/learner/results/assessment-review-accordion";
import { ProgressProjectionChart } from "@/components/learner/results/progress-projection-chart";
import { ResultsNextActions } from "@/components/learner/results/results-next-actions";
import { GapRadar } from "@/components/learner/competency/gap-radar";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

import { calculateDeterministicGap } from "@/lib/competency-gap";

export default function AssessmentResultsPage() {
  const params = useParams();
  const assessmentId = (params?.assessmentId as string) || "baseline-cadre-2026";
  const { data, isLoading, isError, refetch } = useAssessmentResult(assessmentId);
  const t = useTranslations("assessmentResults");

  const [localResult, setLocalResult] = React.useState<AssessmentEvaluationResult | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`sih_last_assessment_result_${assessmentId}`);
        if (stored) {
          setLocalResult(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Could not read local assessment result:", e);
      }
    }
  }, [assessmentId]);

  const displayData = React.useMemo(() => {
    if (!data) return null;
    if (!localResult) return data;

    const updatedPerformance = data.competencyPerformance.map((item) => {
      const match = localResult.competencyScores.find((cs) => cs.competencyId === item.competencyId);
      const demonstratedScore = match ? match.score : item.demonstratedScore;
      const calc = calculateDeterministicGap(item.requiredScore, demonstratedScore);

      return {
        ...item,
        demonstratedScore: calc.current,
        gap: calc.gap,
        priority: calc.priority,
        status: calc.statusText as CompetencyPerformanceItem["status"],
      };
    });

    const updatedRadar = data.radarData.map((pt) => {
      const match = localResult.competencyScores.find(
        (cs) => cs.competencyName.toLowerCase() === pt.competency.toLowerCase() || cs.competencyId === pt.competency
      );
      const demonstrated = match ? match.score : pt.demonstrated;
      return {
        ...pt,
        demonstrated,
        gap: Math.max(0, pt.required - demonstrated),
      };
    });

    // Deterministically rank top 3 recommended focus areas by largest gap
    const updatedTopGaps = [...updatedPerformance]
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 3)
      .map((item) => ({
        competencyId: item.competencyId,
        competencyName: item.competencyName,
        requiredScore: item.requiredScore,
        demonstratedScore: item.demonstratedScore,
        gap: item.gap,
        priority: item.priority as NonNullable<CompetencyPerformanceItem["priority"]>,
        aiInsight: `Targeted developmental curriculum recommended to close your ${item.gap}% deficit in ${item.competencyName}.`,
      }));

    const highestGap = updatedTopGaps[0];
    const updatedAiInsight = highestGap
      ? {
          strongestOpportunity: highestGap.competencyName,
          demonstratedScore: highestGap.demonstratedScore,
          requiredScore: highestGap.requiredScore,
          summary: `Your largest demonstrated competency deficit is in ${highestGap.competencyName} (${highestGap.gap}% gap). Closing this gap is critical for your role as a Statistical Officer.`,
          recommendationText: `We recommend prioritizing foundational courses for ${highestGap.competencyName} on iGOT Karmayogi before reassessment.`,
        }
      : data.aiInsight;

    return {
      ...data,
      overallScore: localResult.overallScore,
      totalQuestions: localResult.totalQuestions,
      correctAnswers: localResult.correctCount,
      incorrectAnswers: localResult.totalQuestions - localResult.correctCount,
      status: "Completed" as const,
      completedDate: "Just now (Evaluated)",
      competencyPerformance: updatedPerformance,
      radarData: updatedRadar,
      topPriorityGaps: updatedTopGaps,
      aiInsight: updatedAiInsight,
    };
  }, [data, localResult]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-sm text-slate-500 animate-pulse space-y-4">
        <div className="h-20 bg-slate-100 rounded-xl max-w-xl mx-auto" />
        <p>Loading assessment results and competency gap analysis...</p>
      </div>
    );
  }

  if (isError || !displayData) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 my-12">
        <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">Failed to load assessment results</h2>
          <p className="text-xs text-slate-500">We could not retrieve your evaluation report. Please try again.</p>
        </div>
        <Button onClick={() => refetch()} className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>Try Again</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in-50 duration-200 pb-10">
      {/* 1. Results Header */}
      <ResultsHeader
        role={displayData.role}
        cadre={displayData.cadre}
        department={displayData.department}
        title={displayData.title}
        status={displayData.status}
        completedDate={displayData.completedDate}
      />

      {/* 2. Overall Score Card */}
      <OverallScoreCard
        overallScore={displayData.overallScore}
        totalQuestions={displayData.totalQuestions}
        correctAnswers={displayData.correctAnswers}
        incorrectAnswers={displayData.incorrectAnswers}
        durationMinutes={displayData.durationMinutes}
      />

      {/* 3. Competency Performance & GapRadar Visual Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <CompetencyPerformanceTable performance={displayData.competencyPerformance} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <GapRadar
            data={displayData.radarData}
            title={t("visualGap.title")}
            subtitle={t("visualGap.subtitle")}
          />
        </div>
      </div>

      {/* 4. Top Priority Gaps */}
      <ResultsPriorityGaps gaps={displayData.topPriorityGaps} />

      {/* 5. AI Competency Insight Panel */}
      <ResultsAiInsight insight={displayData.aiInsight} />

      {/* 6. Assessment Question Review (Collapsible) */}
      <AssessmentReviewAccordion questions={displayData.questionsReview} />

      {/* 7. Competency Progress Projection Chart */}
      <ProgressProjectionChart progressData={displayData.progressData} />

      {/* 8. Ready to close competency gaps CTA Banner */}
      <ResultsNextActions />
    </div>
  );
}
