"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, ArrowRight, Sparkles, BookOpen, ShieldAlert, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateDeterministicGap, GapPriority } from "@/lib/competency-gap";

interface PriorityGapItem {
  competencyId: string;
  competencyName: string;
  requiredScore: number;
  demonstratedScore: number;
  gap: number;
  priority?: "Critical" | "High" | "Moderate" | "Low" | "Medium";
  aiInsight: string;
}

interface ResultsPriorityGapsProps {
  gaps: PriorityGapItem[];
}

export function ResultsPriorityGaps({ gaps }: ResultsPriorityGapsProps) {
  const t = useTranslations("assessmentResults.priorityGaps");
  const tPerf = useTranslations("assessmentResults.performance");
  const locale = useLocale();

  // Deterministically sort by largest gap and take top 3 focus areas
  const top3 = [...gaps]
    .sort((a, b) => {
      const gapA = Math.max(0, a.requiredScore - a.demonstratedScore);
      const gapB = Math.max(0, b.requiredScore - b.demonstratedScore);
      return gapB - gapA;
    })
    .slice(0, 3);

  const getPriorityBadge = (priority: GapPriority) => {
    switch (priority) {
      case "Critical":
        return (
          <Badge className="bg-rose-100 text-rose-900 border-rose-300 font-extrabold text-[10px] gap-1 hover:bg-rose-100 shadow-2xs">
            <ShieldAlert className="w-3 h-3 text-rose-700 shrink-0" aria-hidden="true" />
            <span>{tPerf("critical")} Priority</span>
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-orange-100 text-orange-900 border-orange-300 font-bold text-[10px] gap-1 hover:bg-orange-100">
            <AlertTriangle className="w-3 h-3 text-orange-700 shrink-0" aria-hidden="true" />
            <span>{tPerf("high")} Priority</span>
          </Badge>
        );
      case "Moderate":
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-[10px] gap-1 hover:bg-amber-100">
            <TrendingUp className="w-3 h-3 text-amber-700 shrink-0" aria-hidden="true" />
            <span>{tPerf("moderate")} Priority</span>
          </Badge>
        );
      case "Low":
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-300 font-semibold text-[10px] gap-1 hover:bg-slate-100">
            <CheckCircle2 className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
            <span>{tPerf("low")} Priority</span>
          </Badge>
        );
    }
  };

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" aria-hidden="true" />
            <span>{t("top3Title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("top3Subtitle")}
          </p>
        </div>

        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 self-start sm:self-auto font-medium">
          Deterministic Gap Ranking (Top 3)
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((gapItem, index) => {
          const calc = calculateDeterministicGap(gapItem.requiredScore, gapItem.demonstratedScore);

          return (
            <div
              key={gapItem.competencyId}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                calc.priority === "Critical"
                  ? "border-rose-200 bg-rose-50/20 hover:border-rose-300 shadow-2xs"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Focus #{index + 1}
                  </span>
                  {getPriorityBadge(calc.priority)}
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {gapItem.competencyName}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span>{t("required")} <strong>{calc.required}%</strong></span>
                  <span>•</span>
                  <span>{t("current")} <strong>{calc.current}%</strong></span>
                  <span>•</span>
                  <span className={calc.priority === "Critical" ? "text-rose-700 font-extrabold" : "text-amber-800 font-bold"}>
                    {t("gap")} {calc.gap}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed italic space-y-1">
                  <p className="text-[10px] font-bold text-blue-900 flex items-center gap-1 not-italic">
                    <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
                    <span>{t("simulatedAiBadge")}:</span>
                  </p>
                  <p className="line-clamp-3">{gapItem.aiInsight}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link href={`/${locale}/learner/recommendations?competencyId=${gapItem.competencyId}`}>
                  <Button className="w-full bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold h-8 flex items-center justify-center gap-1.5 shadow-xs">
                    <BookOpen className="w-3 h-3 text-amber-400" aria-hidden="true" />
                    <span>{t("cta")}</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
