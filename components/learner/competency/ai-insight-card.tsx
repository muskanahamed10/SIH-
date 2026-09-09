"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles, ArrowRight, Brain, Info, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIInsightCardProps {
  headline: string;
  analysis: string;
  recommendedNextAction: string;
  actionCta: string;
}

export function AIInsightCard({
  analysis,
  recommendedNextAction,
  actionCta,
}: AIInsightCardProps) {
  const t = useTranslations("myCompetency.aiInsightSection");
  const locale = useLocale();

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-indigo-200 bg-linear-to-r from-blue-900 via-indigo-900 to-[#0B2545] text-white space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-800/80 border border-indigo-700 text-amber-300">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{t("title")}</span>
            </h2>
            <p className="text-xs text-indigo-200">
              {t("headline")}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-800/70 border border-indigo-700 text-[11px] font-semibold text-indigo-200 self-start sm:self-auto">
          <Brain className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>Cadre Decision Support</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <p className="text-sm sm:text-base text-blue-50 leading-relaxed font-normal">
            {analysis}
          </p>

          <div className="flex items-center gap-2 text-xs text-indigo-200 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Targeting this gap unlocks prerequisite eligibility for higher cadre promotions.</span>
          </div>
        </div>

        <div className="md:col-span-4 p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              {t("recommendedNextAction")}
            </span>
            <p className="font-bold text-sm text-white mt-1 leading-snug">
              {recommendedNextAction}
            </p>
          </div>

          <Link href={`/${locale}/learner/recommendations?competencyId=comp-stat-model`}>
            <Button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold py-2 shadow-md flex items-center justify-center gap-1.5">
              <span>{actionCta || t("cta")}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      <p className="text-[11px] text-indigo-300/80 italic flex items-center gap-1.5 pt-1 border-t border-indigo-800/80">
        <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{t("disclaimer")}</span>
      </p>
    </Card>
  );
}
