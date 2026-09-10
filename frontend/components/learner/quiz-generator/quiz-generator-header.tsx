"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Sparkles,
  ArrowLeft,
  FileUp,
  FileCheck,
  Cpu,
  ListChecks,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuizGeneratorStore } from "@/stores/quiz-generator-store";

export function QuizGeneratorHeader() {
  const t = useTranslations("quizGenerator.header");
  const stepT = useTranslations("quizGenerator.steps");
  const locale = useLocale();
  const { currentStep, setStep, uploadedFile, generatedQuestions } = useQuizGeneratorStore();

  const steps = [
    { num: 1, label: stepT("step1"), icon: FileUp, enabled: true },
    { num: 2, label: stepT("step2"), icon: FileCheck, enabled: !!uploadedFile },
    { num: 3, label: stepT("step3"), icon: Cpu, enabled: !!uploadedFile },
    { num: 4, label: stepT("step4"), icon: ListChecks, enabled: generatedQuestions.length > 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Back Link & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/learner/dashboard`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("backToDashboard")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-medium text-slate-600 bg-white">
            Priya Sharma • Statistical Officer
          </Badge>
          <Badge className="bg-[#0B2545] text-white text-[11px]">
            Subordinate Statistical Service (SSS)
          </Badge>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </span>
              <span>{t("title")}</span>
            </h1>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[11px] font-bold">
              AI / RAG Enabled
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Stepper Navigation Bar */}
      <nav aria-label="Quiz Generation Workflow" className="py-2">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.num;
            const isPassed = currentStep > s.num;

            return (
              <li key={s.num}>
                <button
                  type="button"
                  disabled={!s.enabled}
                  onClick={() => s.enabled && setStep(s.num as 1 | 2 | 3 | 4)}
                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    isCurrent
                      ? "border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20"
                      : isPassed
                      ? "border-emerald-300 bg-emerald-50/40 text-emerald-950 hover:bg-emerald-50"
                      : s.enabled
                      ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      : "border-slate-200 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent
                        ? "bg-[#0B2545] text-white"
                        : isPassed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Step {s.num}
                    </span>
                    <span className="block text-xs font-extrabold truncate text-slate-900">
                      {s.label}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
