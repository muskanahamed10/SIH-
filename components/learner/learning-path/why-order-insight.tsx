"use client";

import { useTranslations } from "next-intl";
import { Brain, Sparkles, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WhyOrderInsightProps {
  whyThisOrder: {
    title: string;
    summary: string;
    rationale: string;
  };
}

export function WhyOrderInsight({ whyThisOrder }: WhyOrderInsightProps) {
  const t = useTranslations("personalizedLearningPath.whyOrder");

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-blue-200/80 bg-blue-50/40 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-[#0B2545] text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
          <Brain className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t("title")}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              <span>Algorithmic Sequencing</span>
            </span>
          </h2>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white/90 border border-blue-100 space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
        <p className="font-semibold text-slate-900">
          {whyThisOrder.summary}
        </p>
        <p className="text-slate-600">
          {whyThisOrder.rationale}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
        <span>{t("demoNotice")}</span>
      </div>
    </Card>
  );
}
