"use client";

import * as React from "react";
import { DepartmentHeadHeader } from "@/components/admin/dashboard/department-head-header";
import { AdminKpiGrid } from "@/components/admin/dashboard/admin-kpi-grid";
import { CompetencyDistributionChart } from "@/components/admin/dashboard/competency-distribution-chart";
import { TeamHeatmapMatrix } from "@/components/admin/dashboard/team-heatmap-matrix";
import { AssessmentPerformanceChart } from "@/components/admin/dashboard/assessment-performance-chart";
import { CourseCompletionTrendsChart } from "@/components/admin/dashboard/course-completion-trends-chart";
import { TopOrganizationalGaps } from "@/components/admin/dashboard/top-organizational-gaps";
import { AdminQuickActions } from "@/components/admin/dashboard/admin-quick-actions";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-14">
      {/* 1. Header & Department Head Context */}
      <DepartmentHeadHeader />

      {/* 2. Core KPI Cards: Total Officials, Active Learners, Assessments, Avg Competency, Course Completion */}
      <AdminKpiGrid />

      {/* 3. Competency Distribution (BarChart) & Team Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <CompetencyDistributionChart />
        </div>
        <div className="lg:col-span-6">
          <TeamHeatmapMatrix />
        </div>
      </div>

      {/* 4. Assessment Performance & Course Completion Trends (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <AssessmentPerformanceChart />
        </div>
        <div className="lg:col-span-6">
          <CourseCompletionTrendsChart />
        </div>
      </div>

      {/* 5. Top Organizational Competency Gaps */}
      <TopOrganizationalGaps />

      {/* 6. Administrative Quick Actions & Shortcuts */}
      <AdminQuickActions />
    </div>
  );
}
