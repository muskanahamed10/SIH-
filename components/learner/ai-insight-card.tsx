"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles, ArrowRight, ShieldCheck, Target, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardAiInsight } from "@/types";

interface AiInsightCardProps {
  insight?: DashboardAiInsight;
}

export function AiInsightCard({ insight }: AiInsightCardProps) {
  const t = useTranslations("dashboard.aiInsight");
  const locale = useLocale();

  if (!insight) return null;

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 shadow-sm relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-600 to-blue-600" />

      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100/80 text-indigo-900 text-xs font-bold uppercase tracking-wider border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>{t("badge")}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span className="font-semibold text-slate-700">MoSPI Calibrated</span>
          </div>
        </div>

        <div className="mt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            {t("headline")}
          </span>
          <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Target className="w-5 h-5 text-indigo-700 shrink-0" aria-hidden="true" />
            <span>{insight.competencyName}</span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metric Comparison Pill */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-white border border-indigo-100 shadow-2xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">
              {t("currentScore")}
            </span>
            <span className="text-xl font-bold text-slate-900">
              {insight.currentDemonstratedScore}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">
              {t("targetScore")}
            </span>
            <span className="text-xl font-bold text-indigo-900">
              {insight.targetCadreBenchmark}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-rose-600 block uppercase">
              {t("pointsDeficit")}
            </span>
            <span className="text-xl font-bold text-rose-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>-{insight.gapPoints} pts</span>
            </span>
          </div>
        </div>

        {/* Explainable AI Analysis */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {insight.analysis}
        </p>

        {/* Next Action Box */}
        <div className="p-3 rounded-lg bg-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
              {t("recommendedNextAction")}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {insight.recommendedNextAction}
            </p>
          </div>
          <Link
            href={`/${locale}/learner/recommendations?competencyId=${insight.resourceId || "res-stat-model"}`}
            className="shrink-0"
          >
            <Button
              size="sm"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-1.5"
            >
              <span>{t("viewRecommendation")}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-indigo-100 text-[11px] text-slate-500 leading-relaxed">
        <p>{t("disclaimer")}</p>
      </CardFooter>
    </Card>
  );
}
