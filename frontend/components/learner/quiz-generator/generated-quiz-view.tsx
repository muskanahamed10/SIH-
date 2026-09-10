"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Play,
  Download,
  RotateCcw,
  Filter,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuizGeneratorStore } from "@/stores/quiz-generator-store";
import { GeneratedMCQCard } from "./generated-mcq-card";

export function GeneratedQuizView() {
  const t = useTranslations("quizGenerator.results");
  const locale = useLocale();
  const {
    generatedQuestions,
    uploadedFile,
    reset,
    difficultyFilter,
    setDifficultyFilter,
    competencyFilter,
  } = useQuizGeneratorStore();

  // Filtered Questions
  const filtered = generatedQuestions.filter((q) => {
    if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) return false;
    if (competencyFilter !== "all" && q.competency !== competencyFilter) return false;
    return true;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedQuestions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mospi_ai_quiz_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Summary Banner & Action Controls */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-700 text-white font-extrabold text-xs">
                {t("readyBadge")}
              </Badge>
              <span className="text-xs text-slate-500">
                {t("extractedFrom")}{" "}
                <strong>{uploadedFile?.fileName || t("uploadedMaterial")}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{t("title")}</span>
            </h2>
            <p className="text-xs text-slate-600">
              {t("subtitle", { count: generatedQuestions.length })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="text-xs font-semibold gap-1.5 border-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>{t("exportButton")}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="text-xs font-semibold gap-1.5 border-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>{t("generateAnother")}</span>
            </Button>

            <Link href={`/${locale}/learner/practice`}>
              <Button
                size="sm"
                className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold gap-1.5 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t("startPractice")}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Controls Strip */}
        <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter Difficulty:</span>
            </span>

            {(["all", "Beginner", "Intermediate", "Advanced"] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-xs transition-all ${
                  difficultyFilter === diff
                    ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {diff === "all" ? "All Levels" : diff}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong>{filtered.length}</strong> of <strong>{generatedQuestions.length}</strong> MCQs
          </div>
        </div>
      </div>

      {/* List of Generated Questions */}
      <div className="space-y-4">
        {filtered.map((mcq) => (
          <GeneratedMCQCard key={mcq.id} mcq={mcq} />
        ))}
      </div>
    </div>
  );
}
