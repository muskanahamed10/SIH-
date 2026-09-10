"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useLearningPath } from "@/hooks/use-queries";
import { useLearningPathStore } from "@/stores/learning-path-store";
import { LearningPathHeader } from "@/components/learner/learning-path/learning-path-header";
import { JourneyRoadmap } from "@/components/learner/learning-path/journey-roadmap";
import { LearningPathSummary } from "@/components/learner/learning-path/learning-path-summary";
import { CadreCompetencyTracker } from "@/components/learner/learning-path/cadre-competency-tracker";
import { WhyOrderInsight } from "@/components/learner/learning-path/why-order-insight";
import { LearningTimeline } from "@/components/learner/learning-path/learning-timeline";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, BookOpen, RotateCcw } from "lucide-react";

export default function LearningPathPage() {
  const locale = useLocale();
  const t = useTranslations("personalizedLearningPath");
  const { data, isLoading, isError, refetch } = useLearningPath();
  const { items: storeItems, overallProgress: storeProgress, initPath } = useLearningPathStore();

  // Sync server items with local Zustand store on load
  React.useEffect(() => {
    if (data?.items) {
      initPath(data.items);
    }
  }, [data, initPath]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-sm text-slate-500 animate-pulse space-y-4">
        <div className="h-28 bg-slate-100 rounded-2xl max-w-xl mx-auto" />
        <p>{t("loadingMessage")}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 my-12">
        <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">{t("errorTitle")}</h2>
          <p className="text-xs text-slate-500">{t("errorMessage")}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => refetch()} className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>{t("tryAgain")}</span>
          </Button>
          <Link href={`/${locale}/learner/competency`}>
            <Button variant="outline" className="text-xs font-semibold border-slate-300">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>{t("backToCompetency")}</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use active items from Zustand store if present to reflect interactive state
  const activeItems = storeItems && storeItems.length > 0 ? storeItems : data.items;
  const activeProgress = storeProgress || data.overallProgress;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in-50 duration-200 pb-12">
      {/* 1. Page Header */}
      <LearningPathHeader
        learnerName={data.learnerName}
        role={data.role}
        cadre={data.cadre}
        department={data.department}
      />

      {/* 2. Visual NOW -> NEXT -> LATER Stepper Journey */}
      <JourneyRoadmap items={activeItems} />

      {/* 3. Personalized Path Summary (Overall Progress & Metrics) */}
      <LearningPathSummary
        overallProgress={activeProgress}
        stats={data.stats}
      />

      {/* 3. 5-Stage Cadre Competency Intelligence Lifecycle Tracker */}
      <CadreCompetencyTracker stages={data.competencyLoopStages} />

      {/* 4. Why this learning order AI Insight Panel */}
      <WhyOrderInsight whyThisOrder={data.whyThisOrder} />

      {/* 5. NOW / NEXT / LATER Vertical Progression Timeline */}
      <LearningTimeline items={activeItems} />

      {/* 6. Bottom Navigation Bar */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-slate-600">
          Want to browse individual modules or review competency gaps?
        </span>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/learner/competency`}>
            <Button variant="outline" className="text-xs font-semibold bg-white border-slate-300">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to My Competency</span>
            </Button>
          </Link>
          <Link href={`/${locale}/learner/recommendations`}>
            <Button className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Learning</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
