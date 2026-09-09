"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  Activity,
  Award,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAdminAnalytics } from "@/mocks/data/admin";

export function AdminKpiGrid() {
  const t = useTranslations("admin.dashboard.kpis");
  const analytics = mockAdminAnalytics;

  return (
    <section
      role="region"
      aria-label="Administrative Core KPIs"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
    >
      {/* 1. Total Officials */}
      <Card className="border-slate-200 shadow-xs bg-white rounded-2xl hover:border-slate-300 transition-all">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("totalOfficials")}
            </CardDescription>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-900">
              <Users className="w-4 h-4 text-blue-900" />
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 mt-1">
            <span>{analytics.totalLearners.toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-1.5">
          <p className="text-[11px] text-slate-500 leading-tight">
            {t("totalOfficialsDesc")}
          </p>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-semibold text-slate-600 bg-slate-50">
              5 Directorates
            </Badge>
            <span className="text-[10px] font-bold text-slate-400">• {t("sampleData")}</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Active Learners */}
      <Card className="border-slate-200 shadow-xs bg-white rounded-2xl hover:border-blue-300 transition-all">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("activeLearners")}
            </CardDescription>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Activity className="w-4 h-4 text-emerald-600" />
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 mt-1">
            <span>{analytics.activeLearnersLast30Days.toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-1.5">
          <p className="text-[11px] text-slate-500 leading-tight">
            {t("activeLearnersDesc")}
          </p>
          <div className="flex items-center gap-1.5">
            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
              {t("activeRate")}
            </Badge>
            <span className="text-[10px] font-bold text-emerald-600">+12.4% QoQ</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Assessments Completed */}
      <Card className="border-slate-200 shadow-xs bg-white rounded-2xl hover:border-indigo-300 transition-all">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("assessmentsCompleted")}
            </CardDescription>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Award className="w-4 h-4 text-indigo-600" />
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-blue-900 flex items-center gap-2 mt-1">
            <span>{analytics.totalAssessmentsConducted.toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-1.5">
          <p className="text-[11px] text-slate-500 leading-tight">
            {t("assessmentsCompletedDesc")}
          </p>
          <div className="flex items-center gap-1.5">
            <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 text-[10px] font-bold">
              {t("assessmentGrowth")}
            </Badge>
            <span className="text-[10px] font-semibold text-slate-400">88.4% Pass</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Average Competency Score */}
      <Card className="border-slate-200 shadow-xs bg-white rounded-2xl hover:border-emerald-300 transition-all">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("avgCompetency")}
            </CardDescription>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-emerald-700 flex items-center gap-2 mt-1">
            <span>{analytics.averageAssessmentScore}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-1.5">
          <p className="text-[11px] text-slate-500 leading-tight">
            {t("avgCompetencyDesc")}
          </p>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-semibold text-slate-600">
              {t("targetBenchmark")} 80%
            </Badge>
            <span className="text-[10px] font-bold text-amber-600">{t("gapDeficit")}</span>
          </div>
        </CardContent>
      </Card>

      {/* 5. Course Completion Rate */}
      <Card className="border-slate-200 shadow-xs bg-white rounded-2xl hover:border-blue-300 transition-all">
        <CardHeader className="p-4 pb-1">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("courseCompletion")}
            </CardDescription>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-900">
              <GraduationCap className="w-4 h-4 text-blue-900" />
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2 mt-1">
            <span>{analytics.overallCourseCompletionRate}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-1.5">
          <p className="text-[11px] text-slate-500 leading-tight">
            {t("courseCompletionDesc")}
          </p>
          <div className="flex items-center gap-1.5">
            <Badge className="bg-blue-50 text-blue-900 border-blue-200 text-[10px] font-bold">
              iGOT Karmayogi
            </Badge>
            <span className="text-[10px] font-bold text-emerald-600">{t("courseGrowth")}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
