"use client";

import { useTranslations } from "next-intl";
import { useLearnerProfile } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Target, Flame, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function LearnerDashboardPage() {
  const t = useTranslations("dashboard");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data, isLoading, error } = useLearnerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">{commonT("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-center space-y-2">
        <AlertCircle className="w-6 h-6 mx-auto text-rose-600" />
        <p className="font-semibold">{commonT("error")}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          {commonT("retry")}
        </Button>
      </div>
    );
  }

  const { user, gaps, activeTargetRole } = data;
  const criticalGaps = gaps.filter((g) => g.severity === "critical");
  const moderateGaps = gaps.filter((g) => g.severity === "moderate");

  return (
    <div className="space-y-8">
      {/* Officer Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {t("welcome")}, {user.name}
            </h1>
            <Badge variant="gov" className="text-xs">
              {user.cadre}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            {user.designation} • {user.department}
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs">
            <span className="text-slate-600">
              {t("targetRole")}: <strong className="text-slate-900">{activeTargetRole?.name}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="bg-[#0B2545] hover:bg-[#134074] text-white shadow-sm gap-2">
            <Link href={`/${locale}/learner/assessments`}>
              <Award className="w-4 h-4" />
              <span>{t("startAssessmentCta")}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("overallScore")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <span>Level 3.1</span>
              <span className="text-xs font-normal text-slate-500">/ 5.0</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-emerald-600 font-medium">Target: Level 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("activeGaps")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-amber-600 flex items-center gap-2">
              <span>{criticalGaps.length + moderateGaps.length}</span>
              <span className="text-xs font-normal text-slate-500">
                ({criticalGaps.length} Critical)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-rose-600 font-medium">Highest: Statistical Computing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("coursesInProgress")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-700">
              1
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500 font-medium">Python for Official Statistics (45%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {t("streakDays")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span>{user.learningStreakDays}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500 font-medium">Continuous learning activity</p>
          </CardContent>
        </Card>
      </div>

      {/* GapRadar Placeholder & Priority Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar container */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  {t("gapRadarTitle")}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {t("gapRadarDesc")}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {activeTargetRole?.code}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 min-h-[300px] bg-slate-50/50 rounded-b-lg">
            <div className="text-center space-y-2 max-w-sm">
              <Target className="w-12 h-12 text-blue-800 mx-auto opacity-70" />
              <p className="font-semibold text-slate-800 text-sm">
                GapRadar Component Scaffolded
              </p>
              <p className="text-xs text-slate-500">
                Compares assessed level against target role across all 7 MoSPI statistical competencies (M1 Scope - Phase 4).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Priority Gaps List */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              {t("criticalGapsTitle")}
            </CardTitle>
            <CardDescription className="text-xs">
              Direct recommendations to bridge target role qualifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gaps.slice(0, 4).map((gap) => (
              <div
                key={gap.competencyId}
                className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs sm:text-sm text-slate-800">
                    {gap.competencyName}
                  </span>
                  <Badge
                    variant={gap.severity === "critical" ? "critical" : gap.severity === "moderate" ? "warning" : "success"}
                    className="text-[10px]"
                  >
                    Level {gap.currentLevel} → {gap.requiredLevel}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {gap.recommendedAction}
                </p>
              </div>
            ))}

            <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
              <Link href={`/${locale}/learner/learning-path`} className="gap-1.5">
                <span>View Full Personalized Path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
