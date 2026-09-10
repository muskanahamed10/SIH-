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
    <Card className="p-6 sm:p-7 shadow-lg border-2 border-blue-700/60 bg-[#0B2545] bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0A2240] text-white space-y-5 rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-800/90 border border-blue-600 text-amber-300 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{t("title")}</span>
            </h2>
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mt-0.5">
              {t("headline")}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/50 text-xs font-bold text-blue-100 self-start sm:self-auto shadow-xs">
          <Brain className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>Cadre Decision Support</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3.5">
          <p className="text-sm sm:text-base text-white leading-relaxed font-normal">
            {analysis}
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Targeting this gap unlocks prerequisite eligibility for higher cadre promotions.</span>
          </div>
        </div>

        <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/70 border border-blue-400/40 shadow-md space-y-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
              {t("recommendedNextAction")}
            </span>
            <p className="font-bold text-sm sm:text-base text-white mt-1 leading-snug">
              {recommendedNextAction}
            </p>
          </div>

          <Link href={`/${locale}/learner/recommendations?competencyId=comp-stat-model`}>
            <Button className="w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-500 text-slate-950 text-xs font-bold py-2 shadow-md flex items-center justify-center gap-1.5 transition-colors">
              <span>{actionCta || t("cta")}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      <p className="text-xs text-blue-200/90 italic flex items-center gap-1.5 pt-2 border-t border-blue-700/60">
        <Info className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
        <span>{t("disclaimer")}</span>
      </p>
    </Card>
  );
}
