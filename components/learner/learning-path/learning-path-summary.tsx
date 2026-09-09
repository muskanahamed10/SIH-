"use client";

import { useTranslations } from "next-intl";
import { BookOpen, AlertCircle, Clock, CheckCircle2, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface LearningPathSummaryProps {
  overallProgress: number;
  stats: {
    priorityCompetencies: number;
    recommendedResources: number;
    currentlyLearning: number;
    reassessmentsDue: number;
  };
}

export function LearningPathSummary({
  overallProgress,
  stats,
}: LearningPathSummaryProps) {
  const t = useTranslations("personalizedLearningPath.summary");

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-6 rounded-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {t("title")}
            </h2>
            <Badge className="bg-blue-100 text-blue-900 border-blue-200 text-[10px] font-bold">
              Cadre Aligned
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Statistical Officer Competency Standard (MoSPI / NSSTA)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 self-start sm:self-auto">
          <Target className="w-4 h-4 text-amber-600" />
          <span>Cadre Benchmark: 75% Target</span>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
          <span className="text-[11px] font-semibold text-rose-900 block flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{t("priorityCompetencies")}</span>
          </span>
          <strong className="text-2xl font-black text-rose-950 block">
            {stats.priorityCompetencies}
          </strong>
          <span className="text-[10px] text-rose-700 block">Identified deficits</span>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
          <span className="text-[11px] font-semibold text-blue-900 block flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>{t("recommendedResources")}</span>
          </span>
          <strong className="text-2xl font-black text-blue-950 block">
            {stats.recommendedResources}
          </strong>
          <span className="text-[10px] text-blue-700 block">Structured modules</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
          <span className="text-[11px] font-semibold text-amber-900 block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{t("currentlyLearning")}</span>
          </span>
          <strong className="text-2xl font-black text-amber-950 block">
            {stats.currentlyLearning}
          </strong>
          <span className="text-[10px] text-amber-700 block">NOW stage active</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-900 block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Estimated Duration</span>
          </span>
          <strong className="text-2xl font-black text-emerald-950 block">
            3h 15m
          </strong>
          <span className="text-[10px] text-emerald-700 block">Total pathway time</span>
        </div>
      </div>

      {/* Big Overall Progress Bar Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#0B2545] text-white">
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">
                {t("progressLabel")}
              </span>
              <span className="text-[11px] text-slate-500">
                Stage 1 of 3 active • Estimated 1h 45m remaining
              </span>
            </div>
          </div>

          <strong className="text-xl sm:text-2xl font-black text-[#0B2545]">
            {overallProgress}%
          </strong>
        </div>

        <Progress value={overallProgress} className="h-3 bg-slate-200" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>{t("demoProgressNotice")}</span>
          </div>
          <span className="text-slate-600 font-medium">
            Next milestone: Complete Step 1 (Python Fundamentals)
          </span>
        </div>
      </div>
    </Card>
  );
}
