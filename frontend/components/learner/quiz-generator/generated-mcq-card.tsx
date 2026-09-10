"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Quote,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeneratedMCQ } from "@/types";

interface GeneratedMCQCardProps {
  mcq: GeneratedMCQ;
}

export function GeneratedMCQCard({ mcq }: GeneratedMCQCardProps) {
  const t = useTranslations("quizGenerator.mcq");
  const [showCitation, setShowCitation] = React.useState(false);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">Beginner</Badge>;
      case "Intermediate":
        return <Badge className="bg-blue-100 text-blue-900 border-blue-300 text-[10px] font-bold">Intermediate</Badge>;
      case "Advanced":
      default:
        return <Badge className="bg-purple-100 text-purple-900 border-purple-300 text-[10px] font-bold">Advanced</Badge>;
    }
  };

  return (
    <Card
      data-testid={`generated-mcq-card-${mcq.questionNumber}`}
      className="border-slate-200 shadow-xs hover:border-slate-300 transition-all rounded-2xl overflow-hidden"
    >
      {/* Question Header: Number, Difficulty, Competency, Source */}
      <CardHeader className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-xs font-extrabold shadow-xs">
              {mcq.questionNumber}
            </span>
            <span className="text-xs font-bold text-slate-700">
              Question {mcq.questionNumber}
            </span>
            {getDifficultyBadge(mcq.difficulty)}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Competency Tag */}
            <Badge className="bg-amber-50 text-amber-900 border-amber-200 text-[11px] font-bold">
              {mcq.competency}
            </Badge>

            {/* Source Page Citation Badge */}
            <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 text-[10px] font-medium flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              <span>{mcq.sourcePage}</span>
            </Badge>
          </div>
        </div>

        {/* Question Text */}
        <div className="pt-2">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
            {mcq.question}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        {/* Four Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {mcq.options.map((opt) => {
            const isCorrect = opt.id === mcq.correctOptionId || opt.label === mcq.correctOptionLabel;

            return (
              <div
                key={opt.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isCorrect
                    ? "border-emerald-400 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/30"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCorrect
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {opt.label}
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-xs leading-relaxed block ${isCorrect ? "font-bold text-emerald-950" : "text-slate-800"}`}>
                    {opt.text}
                  </span>

                  {isCorrect && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t("correctAnswerBadge")}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistical Domain Explanation */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-950">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>{t("explanationTitle")}:</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {mcq.explanation}
          </p>
        </div>

        {/* Source Citation & Grounding Metadata Strip */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600">Source Document:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800 text-[10px]">
              {mcq.sourceDocument}
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-600">{mcq.sourcePage}</span>
          </div>

          {mcq.sourceSnippet && (
            <button
              type="button"
              onClick={() => setShowCitation(!showCitation)}
              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 focus:outline-none self-start sm:self-auto"
            >
              <span>{showCitation ? "Hide Passage" : "View Source Passage"}</span>
              {showCitation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Expandable Cited Passage */}
        {showCitation && mcq.sourceSnippet && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-700 text-xs italic space-y-1">
            <span className="font-bold text-amber-900 not-italic flex items-center gap-1">
              <Quote className="w-3 h-3 text-amber-700" />
              <span>Cited Official Manual Excerpt:</span>
            </span>
            <p className="leading-relaxed font-serif">
              &ldquo;{mcq.sourceSnippet}&rdquo;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
