"use client";

import { useTranslations } from "next-intl";
import { useAdminAnalytics, useMCQReviewQueue } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, CheckSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data: analytics, isLoading } = useAdminAnalytics();
  const { data: mcqQueue } = useMCQReviewQueue();

  if (isLoading || !analytics) {
    return <div className="p-8 text-center text-sm text-slate-500">{commonT("loading")}</div>;
  }

  const pendingMCQs = mcqQueue?.filter((m) => m.status === "pending") || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System overview of cadre assessments, national competency gaps, and AI generation queues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-white">
            NSSTA Governance Active
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("totalLearners")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-800" />
              <span>{analytics.totalLearners.toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500">{analytics.activeLearnersLast30Days.toLocaleString()} active in last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("avgScore")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-600 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <span>{analytics.averageAssessmentScore}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500">Across {analytics.totalAssessmentsConducted} cadre tests</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("completionRate")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-700">
              {analytics.overallCourseCompletionRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500">On iGOT Karmayogi modules</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("mcqQueue")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-600 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-amber-600" />
              <span>{pendingMCQs.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500">Requiring SME vetting</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Common Gaps & Pending Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Most Common Gaps */}
        <Card className="lg:col-span-7 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              National Cadre Competency Deficits
            </CardTitle>
            <CardDescription className="text-xs">
              Top skill shortfalls reported across all regional statistical directorates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.mostCommonGaps.map((item) => (
              <div
                key={item.competencyName}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white"
              >
                <div>
                  <span className="font-semibold text-xs sm:text-sm text-slate-800 block">
                    {item.competencyName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.gapCount} affected officers
                  </span>
                </div>
                <Badge variant="warning" className="text-xs">
                  - {item.averageDeficit} Levels Avg Deficit
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="lg:col-span-5 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              Administrative Quick Actions
            </CardTitle>
            <CardDescription className="text-xs">
              Governance and curriculum controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-between text-xs h-11 border-slate-200">
              <Link href={`/${locale}/admin/competencies`}>
                <span>Manage Competency Dictionary & Levels</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between text-xs h-11 border-slate-200">
              <Link href={`/${locale}/admin/roles`}>
                <span>Role-to-Competency Mapping Matrix</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between text-xs h-11 border-slate-200">
              <Link href={`/${locale}/admin/mcq-review`}>
                <span>AI-Generated MCQ SME Review ({pendingMCQs.length})</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between text-xs h-11 border-slate-200">
              <Link href={`/${locale}/admin/team-gaps`}>
                <span>Departmental Team Competency Heatmap</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
