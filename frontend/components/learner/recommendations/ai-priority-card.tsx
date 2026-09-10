"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Brain, Sparkles, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AiPriorityCardProps {
  priorityArea: {
    competencyName: string;
    currentScore: number;
    requiredScore: number;
    gapPoints: number;
    recommendationText: string;
    priorityResourceId: string;
  };
}

export function AiPriorityCard({ priorityArea }: AiPriorityCardProps) {
  const t = useTranslations("learningRecommendations.aiPriorityCard");
  const locale = useLocale();

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-amber-200/90 bg-linear-to-r from-amber-50/70 via-orange-50/40 to-amber-50/60 relative overflow-hidden space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#0B2545] flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <Brain className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{t("title")}</span>
              <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] font-bold gap-1">
                <Flame className="w-3 h-3 text-rose-600" />
                <span>Urgent Gap</span>
              </Badge>
            </h2>
            <p className="text-xs text-slate-600">
              {t("preface")}{" "}
              <strong className="text-slate-900">{priorityArea.competencyName}</strong>
            </p>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs shadow-2xs self-start sm:self-auto">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block">{t("currentLabel")}</span>
            <strong className="text-slate-900 font-bold">{priorityArea.currentScore}%</strong>
          </div>
          <span className="text-slate-300">/</span>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block">{t("requiredLabel")}</span>
            <strong className="text-slate-900 font-bold">{priorityArea.requiredScore}%</strong>
          </div>
          <span className="text-slate-300">/</span>
          <div>
            <span className="text-[10px] text-rose-600 font-semibold block">{t("gapLabel")}</span>
            <strong className="text-rose-700 font-extrabold">{priorityArea.gapPoints} {t("points")}</strong>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t("aiRecommendation")}</span>
          </p>
          <p className="font-semibold text-slate-900">
            &ldquo;{priorityArea.recommendationText}&rdquo;
          </p>
        </div>

        <Link href={`/${locale}/learner/resources/${priorityArea.priorityResourceId}`} className="shrink-0">
          <Button className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs h-9 px-4 shadow-xs flex items-center gap-2">
            <span>{t("startPriorityCta")}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
        <span>{t("demoNotice")}</span>
      </div>
    </Card>
  );
}
