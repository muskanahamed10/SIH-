"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Brain, Sparkles, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResultsAiInsightProps {
  insight: {
    strongestOpportunity: string;
    demonstratedScore: number;
    requiredScore: number;
    summary: string;
    recommendationText: string;
  };
}

export function ResultsAiInsight({ insight }: ResultsAiInsightProps) {
  const t = useTranslations("assessmentResults.aiInsight");
  const locale = useLocale();

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 relative overflow-hidden space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#0B2545] flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <Brain className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-blue-950 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-[11px] text-blue-900/70">
              {t("disclaimer")}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-950 text-xs font-bold self-start sm:self-auto shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" aria-hidden="true" />
          <span>{t("mockBadge")}</span>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/95 p-4 sm:p-5 rounded-xl border border-blue-100 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-950 pb-1 border-b border-slate-100">
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-extrabold text-[11px]">
            Primary Bottleneck
          </span>
          <span>{insight.strongestOpportunity} (Current {insight.demonstratedScore}% vs Required {insight.requiredScore}%)</span>
        </div>

        <p className="font-medium text-slate-900 leading-relaxed">
          {insight.summary}
        </p>
        <p className="text-slate-600 text-xs">
          {insight.recommendationText}
        </p>

        {/* Transparent Mock AI Disclaimer Note */}
        <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{t("transparentDisclaimer")}</span>
        </div>
      </div>

      {/* Footer Navigation Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
          <span>Calibrated against Official Statistical Officer (SSS / ISS) competency benchmarks.</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link href={`/${locale}/learner/learning-path`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-4 h-9 shadow-xs flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>{t("viewLearningPath")}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
