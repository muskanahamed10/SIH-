"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecentAssessmentSummary } from "@/types";

interface RecentAssessmentCardProps {
  assessment: RecentAssessmentSummary | null;
}

export function RecentAssessmentCard({ assessment }: RecentAssessmentCardProps) {
  const t = useTranslations("dashboard.recentAssessment");
  const locale = useLocale();

  if (!assessment) {
    return (
      <Card className="p-6 shadow-xs border-slate-200 text-center space-y-3 flex flex-col justify-between">
        <div className="space-y-2 py-4">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
          <h2 className="font-bold text-base text-slate-900 tracking-tight">
            {t("emptyTitle")}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t("emptyDesc")}
          </p>
        </div>
        <Link href={`/${locale}/learner/assessment`}>
          <Button className="w-full bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold py-2">
            <span>{t("startBaseline")}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-xs border-slate-200 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold text-[10px]">
              {assessment.status}
            </Badge>
            <Link
              href={`/${locale}/learner/assessments`}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline flex items-center gap-0.5 ml-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900 leading-snug">
            {assessment.title}
          </h3>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                Score Achieved
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {assessment.score}%
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                Question Count
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {assessment.totalQuestions} <span className="text-xs font-normal text-slate-500">{t("questions")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Completed on:</span>
            <strong className="text-slate-700 font-semibold">{assessment.date}</strong>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4 flex flex-col sm:flex-row items-center gap-2">
        <Link href={`/${locale}/learner/results`} className="flex-1 w-full">
          <Button
            variant="outline"
            className="w-full border-blue-200 text-blue-900 hover:bg-blue-50 font-semibold text-xs py-2 flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>{t("viewResults")}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </Link>
        <Link href={`/${locale}/learner/assessments`} className="w-full sm:w-auto">
          <Button
            variant="ghost"
            className="w-full text-xs font-semibold text-slate-600 hover:text-slate-900 py-2"
          >
            <span>All Assessments</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
