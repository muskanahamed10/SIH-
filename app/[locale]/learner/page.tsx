"use client";

import { useLearnerDashboard } from "@/hooks/use-queries";
import { DashboardSkeleton } from "@/components/learner/dashboard-skeleton";
import { DashboardError } from "@/components/learner/dashboard-error";
import { DashboardHeader } from "@/components/learner/dashboard-header";
import { KpiCards } from "@/components/learner/kpi-cards";
import { GapRadarCard } from "@/components/learner/gap-radar-card";
import { PriorityGaps } from "@/components/learner/priority-gaps";
import { AiInsightCard } from "@/components/learner/ai-insight-card";
import { AiRecommendations } from "@/components/learner/ai-recommendations";
import { LearningPathPreview } from "@/components/learner/learning-path-preview";
import { UpcomingAssessmentCard } from "@/components/learner/upcoming-assessment-card";
import { RecentAssessmentCard } from "@/components/learner/recent-assessment-card";
import { QuickActions } from "@/components/learner/quick-actions";
import { ProgressLineChart } from "@/components/learner/progress-line-chart";

export default function LearnerDashboardPage() {
  const { data, isLoading, isError, refetch } = useLearnerDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return <DashboardError onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Welcome Section with Learner Name, Role, Cadre & Department */}
      <DashboardHeader
        name={data.learner.name}
        role={data.learner.role}
        cadre={data.learner.cadre}
        department={data.learner.department}
        lastAssessmentDate={data.learner.lastAssessmentDate}
      />

      {/* 2 & 3. Overall Competency Score & Summary Cards (4 KPIs) */}
      <KpiCards
        overallCompetency={data.kpis.overallCompetency}
        priorityGapsCount={data.kpis.priorityGapsCount}
        learningProgress={data.kpis.learningProgress}
        completedCoursesCount={data.kpis.completedCoursesCount}
      />

      {/* 12. Quick Actions: Take Assessment | View Learning Path | Practice Quiz | Upload Study Material */}
      <QuickActions />

      {/* 7. AI-Generated Insight Section: Highest-Impact Focus Area */}
      {data.aiInsight && (
        <AiInsightCard insight={data.aiInsight} />
      )}

      {/* 4, 5 & 6. GapRadar (Recharts) & Top Competency Gaps (Required vs Current) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <GapRadarCard data={data.radarData} />
        </div>
        <div className="lg:col-span-5">
          <PriorityGaps gaps={data.priorityGaps} />
        </div>
      </section>

      {/* 8. Recommended Courses (iGOT Karmayogi Integrated) */}
      <AiRecommendations recommendations={data.recommendations} />

      {/* 10. Current Learning Path (NOW -> NEXT -> LATER) */}
      <LearningPathPreview learningPath={data.learningPath} />

      {/* 11. Assessments: Upcoming Reassessment & Recent Assessment */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <UpcomingAssessmentCard assessment={data.upcomingAssessment} />
        </div>
        <div className="lg:col-span-6">
          <RecentAssessmentCard assessment={data.recentAssessment} />
        </div>
      </section>

      {/* 9. Learning Progress (Historical Competency Trends) */}
      <ProgressLineChart data={data.progressHistory} />
    </div>
  );
}
