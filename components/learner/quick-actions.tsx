"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Award, Route, CheckSquare, UploadCloud, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UploadMaterialModal } from "./upload-material-modal";

export function QuickActions() {
  const t = useTranslations("dashboard.quickActions");
  const locale = useLocale();
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  return (
    <>
      <Card className="p-6 shadow-xs border-slate-200 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Take Assessment */}
          <Link
            href={`/${locale}/learner/assessment`}
            className="p-3.5 rounded-lg flex items-center justify-between transition-all group shadow-2xs bg-blue-900 text-white hover:bg-blue-800"
          >
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 shrink-0 text-amber-400" aria-hidden="true" />
              <div className="text-left">
                <p className="font-bold text-xs leading-tight">{t("takeAssessment")}</p>
                <p className="text-[10px] opacity-75 mt-0.5">{t("takeAssessmentDesc")}</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
          </Link>

          {/* 2. View Learning Path */}
          <Link
            href={`/${locale}/learner/learning-path`}
            className="p-3.5 rounded-lg flex items-center justify-between transition-all group shadow-2xs bg-white text-slate-800 hover:bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <Route className="w-5 h-5 shrink-0 text-indigo-700" aria-hidden="true" />
              <div className="text-left">
                <p className="font-bold text-xs leading-tight">{t("viewLearningPath")}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{t("viewLearningPathDesc")}</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 text-slate-400" aria-hidden="true" />
          </Link>

          {/* 3. Practice Quiz */}
          <Link
            href={`/${locale}/learner/practice`}
            className="p-3.5 rounded-lg flex items-center justify-between transition-all group shadow-2xs bg-white text-slate-800 hover:bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div className="text-left">
                <p className="font-bold text-xs leading-tight">{t("practiceQuiz")}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{t("practiceQuizDesc")}</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 text-slate-400" aria-hidden="true" />
          </Link>

          {/* 4. Upload Study Material (AI Quiz Generator) */}
          <Link
            href={`/${locale}/learner/quiz-generator`}
            className="p-3.5 rounded-lg flex items-center justify-between transition-all group shadow-2xs bg-amber-50 text-amber-950 hover:bg-amber-100/80 border border-amber-200 cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="w-5 h-5 shrink-0 text-amber-700" aria-hidden="true" />
              <div className="text-left">
                <p className="font-bold text-xs leading-tight">{t("uploadMaterial")}</p>
                <p className="text-[10px] text-amber-800/80 mt-0.5">{t("uploadMaterialDesc")}</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 text-amber-800" aria-hidden="true" />
          </Link>
        </div>
      </Card>

      {/* Upload Study Material Modal */}
      <UploadMaterialModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </>
  );
}
