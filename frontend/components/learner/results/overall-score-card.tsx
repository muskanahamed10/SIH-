"use client";

import { useTranslations } from "next-intl";
import { Award, CheckCircle, XCircle, Clock, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OverallScoreCardProps {
  overallScore: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  durationMinutes: number;
}

export function OverallScoreCard({
  overallScore,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  durationMinutes,
}: OverallScoreCardProps) {
  const t = useTranslations("assessmentResults.scoreCard");

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Overall Score Metric */}
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 shrink-0">
            <Award className="w-8 h-8 text-blue-800" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t("title")}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {overallScore}%
              </span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                <span>{t("statusNotice")}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: 4 Metrics Quick Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 block flex items-center justify-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              {t("questionsLabel")}
            </span>
            <span className="text-lg font-bold text-slate-900">{totalQuestions}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center space-y-0.5">
            <span className="text-[11px] font-semibold text-emerald-800 block flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              {t("correctLabel")}
            </span>
            <span className="text-lg font-bold text-emerald-700">{correctAnswers}</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-center space-y-0.5">
            <span className="text-[11px] font-semibold text-rose-800 block flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3 text-rose-600" />
              {t("incorrectLabel")}
            </span>
            <span className="text-lg font-bold text-rose-700">{incorrectAnswers}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 block flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {t("durationLabel")}
            </span>
            <span className="text-lg font-bold text-slate-900">{durationMinutes}m</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
