"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Award, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BaselineAssessment } from "@/types";

interface AssessmentIntroProps {
  assessment: BaselineAssessment;
  onStart: () => void;
}

export function AssessmentIntro({ assessment, onStart }: AssessmentIntroProps) {
  const t = useTranslations("baselineAssessment.intro");
  const locale = useLocale();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      <Card className="p-6 sm:p-8 shadow-xs border-slate-200 bg-white space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
            <span>{t("badge")}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("title")}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t("role")}
            </span>
            <p className="font-bold text-sm text-slate-900">{assessment.role}</p>
            <p className="text-xs text-slate-500">{assessment.cadre}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t("questions")}
            </span>
            <p className="font-bold text-lg text-slate-900">{t("questionsValue")}</p>
            <p className="text-xs text-slate-500">{t("singleSelect")}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t("estimatedTime")}
            </span>
            <p className="font-bold text-lg text-slate-900">{t("estimatedTimeValue")}</p>
            <p className="text-xs text-slate-500">{t("timedEvaluation")}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t("assessmentType")}
            </span>
            <p className="font-bold text-sm text-blue-900">{assessment.assessmentType}</p>
            <p className="text-xs text-slate-500">{t("benchmarkCalibrated")}</p>
          </div>
        </div>

        {/* Competencies Covered */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t("competenciesCovered")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {assessment.competenciesCovered.map((comp) => (
              <div
                key={comp}
                className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2 text-xs font-semibold text-slate-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                <span className="truncate">{comp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Alert */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 space-y-1.5 leading-relaxed">
          <p className="font-bold">{t("instructionsTitle")}</p>
          <ul className="list-disc list-inside space-y-0.5 text-blue-900/90">
            <li>{t("instruction1")}</li>
            <li>{t("instruction2")}</li>
            <li>{t("instruction3")}</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <Link href={`/${locale}/learner/competency`}>
            <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t("backCta")}</span>
            </Button>
          </Link>

          <Button
            onClick={onStart}
            className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white font-bold px-6 py-2.5 text-sm shadow-sm flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>{t("startCta")}</span>
            <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
