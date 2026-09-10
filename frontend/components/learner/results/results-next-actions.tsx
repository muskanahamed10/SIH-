"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ResultsNextActions() {
  const t = useTranslations("assessmentResults.nextActions");
  const locale = useLocale();

  return (
    <Card className="p-7 sm:p-8 shadow-md border-blue-200 bg-linear-to-r from-blue-900 via-indigo-950 to-[#0B2545] text-white space-y-5">
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Next Action Step</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          {t("title")}
        </h2>

        <p className="text-sm text-blue-100/90 leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href={`/${locale}/learner/learning-path`}>
          <Button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-6 h-11 text-xs sm:text-sm shadow-md flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-950" aria-hidden="true" />
            <span>{t("viewLearningPath")}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
          </Button>
        </Link>

        <Link href={`/${locale}/learner/recommendations`}>
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20 font-semibold px-5 h-11 text-xs sm:text-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span>{t("viewRecommendations")}</span>
          </Button>
        </Link>

        <Link href={`/${locale}/learner/competency`}>
          <Button
            variant="ghost"
            className="text-slate-200 hover:text-white hover:bg-white/10 font-medium px-4 h-11 text-xs sm:text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t("backToCompetency")}</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
