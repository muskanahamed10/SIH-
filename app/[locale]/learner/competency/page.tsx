"use client";

import { useCompetencyProfile } from "@/hooks/use-queries";
import { CompetencyHeader } from "@/components/learner/competency/competency-header";
import { CompetencySummaryCards } from "@/components/learner/competency/competency-summary-cards";
import { GapRadar } from "@/components/learner/competency/gap-radar";
import { PriorityGapList } from "@/components/learner/competency/priority-gap-list";
import { AIInsightCard } from "@/components/learner/competency/ai-insight-card";
import { CompetencyComparisonTable } from "@/components/learner/competency/competency-comparison-table";
import { GapRecommendations } from "@/components/learner/competency/gap-recommendations";
import { CompetencyLearningPath } from "@/components/learner/competency/competency-learning-path";
import { CompetencyAssessmentStatus } from "@/components/learner/competency/competency-assessment-status";
import { CompetencyProgressChart } from "@/components/learner/competency/competency-progress-chart";
import { CompetencySkeleton } from "@/components/learner/competency/competency-skeleton";
import { CompetencyError } from "@/components/learner/competency/competency-error";
import { CompetencyEmpty } from "@/components/learner/competency/competency-empty";
import { CompetencyJourney } from "@/components/learner/competency-journey";

export default function MyCompetencyPage() {
  const { data, isLoading, isError, refetch } = useCompetencyProfile();

  if (isLoading) {
    return <CompetencySkeleton />;
  }

  if (isError || !data) {
    return <CompetencyError onRetry={() => refetch()} />;
  }

  // Handle empty state if assessment not completed
  if (!data.assessmentStatus?.isCompleted) {
    return (
      <div className="space-y-8">
        <CompetencyHeader
          name={data.learner.name}
          role={data.learner.role}
          department={data.learner.department}
          cadre={data.learner.cadre}
        />
        <CompetencyEmpty />
        <CompetencyJourney />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Page Header with Learner & Cadre Metadata */}
      <CompetencyHeader
        name={data.learner.name}
        role={data.learner.role}
        department={data.learner.department}
        cadre={data.learner.cadre}
      />

      {/* 2. Four Competency Summary Cards */}
      <CompetencySummaryCards
        overallCompetency={data.summary.overallCompetency}
        requiredCompetenciesCount={data.summary.requiredCompetenciesCount}
        priorityGapsCount={data.summary.priorityGapsCount}
        assessmentStatus={data.summary.assessmentStatus}
      />

      {/* 3. GapRadar & Priority Competency Gaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <GapRadar data={data.radarData} />
        </div>
        <div className="lg:col-span-5">
          <PriorityGapList gaps={data.priorityGaps} />
        </div>
      </div>

      {/* 4. AI Insight Panel */}
      <AIInsightCard
        headline={data.aiInsight.headline}
        analysis={data.aiInsight.analysis}
        recommendedNextAction={data.aiInsight.recommendedNextAction}
        actionCta={data.aiInsight.actionCta}
      />

      {/* 5. Detailed Required vs Demonstrated Comparison Table */}
      <CompetencyComparisonTable competencies={data.competenciesTable} />

      {/* 6. Learning Connection: Recommended for Your Gaps */}
      <GapRecommendations recommendations={data.recommendations} />

      {/* 7. Learning Path Preview & Assessment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CompetencyLearningPath
            now={data.learningPath.now}
            next={data.learningPath.next}
            later={data.learningPath.later}
          />
        </div>
        <div className="lg:col-span-5">
          <CompetencyAssessmentStatus
            isCompleted={data.assessmentStatus.isCompleted}
            score={data.assessmentStatus.score}
            date={data.assessmentStatus.date}
          />
        </div>
      </div>

      {/* 8. Progress Over Time Chart */}
      <CompetencyProgressChart data={data.progressHistory} />

      {/* 9. Visual Competency Journey */}
      <CompetencyJourney />
    </div>
  );
}
