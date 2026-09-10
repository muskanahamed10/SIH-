"use client";

import { useTranslations } from "next-intl";
import { useAdminAnalytics } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export default function AnalyticsAdminPage() {
  const t = useTranslations("common");
  const { data: analytics, isLoading } = useAdminAnalytics();

  if (isLoading || !analytics) {
    return <div className="p-8 text-center text-sm text-slate-500">{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          MoSPI Statistical Cadre Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          High-level reporting on workforce diagnostic assessments, competency development trends, and divisional training progress.
        </p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardDescription className="text-xs uppercase font-medium text-slate-500">
              Total Assessments Evaluated
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900">
              {analytics.totalAssessmentsConducted.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            Across ISS Group &apos;A&apos; & SSS Group &apos;B&apos; cadres
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardDescription className="text-xs uppercase font-medium text-slate-500">
              Active Learners (30 Days)
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-900">
              {analytics.activeLearnersLast30Days.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            Out of {analytics.totalLearners.toLocaleString()} registered officers
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardDescription className="text-xs uppercase font-medium text-slate-500">
              Mean Cadre Score
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-600">
              {analytics.averageAssessmentScore}%
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-500">
            Completion rate: {analytics.overallCourseCompletionRate}%
          </CardContent>
        </Card>
      </div>

      {/* Divisional Performance Breakdown */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">
            Division-Wise Competency Scorecard
          </CardTitle>
          <CardDescription className="text-xs">
            Performance comparison across MoSPI headquarters and field offices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.departmentPerformance.map((dept) => (
              <div
                key={dept.department}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-blue-800" />
                  <div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-800 block">
                      {dept.department}
                    </span>
                    <span className="text-xs text-slate-400">
                      {dept.learnerCount} officers assessed
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-sm text-slate-900">{dept.averageCompetencyScore}%</span>
                    <span className="text-[10px] text-slate-400 block">Avg Score</span>
                  </div>
                  <Badge
                    variant={dept.averageCompetencyScore >= 80 ? "success" : "gov"}
                    className="text-xs"
                  >
                    {dept.averageCompetencyScore >= 80 ? "High Proficiency" : "Satisfactory"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
