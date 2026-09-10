"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Award, CheckCircle2, AlertCircle, ArrowRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CompetencyAssessmentStatusProps {
  isCompleted: boolean;
  score: number;
  date: string;
}

export function CompetencyAssessmentStatus({
  isCompleted,
  score,
  date,
}: CompetencyAssessmentStatusProps) {
  const t = useTranslations("myCompetency.assessmentSection");
  const locale = useLocale();

  return (
    <Card className="p-6 shadow-xs border-slate-200 space-y-4">
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" aria-hidden="true" />
          <span>{t("title")}</span>
        </h2>
        {isCompleted ? (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-300 text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pending</span>
          </Badge>
        )}
      </div>

      {isCompleted ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-bold text-base text-slate-900">
                {t("completedTitle")}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>{t("date")} {date}</span>
                </span>
                <span>•</span>
                <span>{t("score")} <strong className="text-slate-900 font-bold">{score}%</strong></span>
              </div>
            </div>

            <Link href={`/${locale}/learner/results`}>
              <Button className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold h-9 px-4 flex items-center gap-1.5 shrink-0">
                <span>{t("viewResults")}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-500 italic">
            * Diagnostic results are benchmarked against official MoSPI cadre competency rubrics.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
          <div>
            <p className="font-bold text-base text-amber-950">
              {t("requiredTitle")}
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              You have not yet completed your cadre diagnostic assessment. Complete it to calculate your GapRadar.
            </p>
          </div>
          <Link href={`/${locale}/learner/assessment`}>
            <Button className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold h-9 px-4 flex items-center gap-1.5">
              <span>{t("startBaseline")}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
