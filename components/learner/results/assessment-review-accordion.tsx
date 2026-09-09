"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Flag, ChevronDown, ChevronUp, FileQuestion, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionReviewItem } from "@/types";

interface AssessmentReviewAccordionProps {
  questions: QuestionReviewItem[];
}

export function AssessmentReviewAccordion({
  questions,
}: AssessmentReviewAccordionProps) {
  const t = useTranslations("assessmentResults.review");
  const [expandedIds, setExpandedIds] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpandAll = () => {
    const areAllExpanded = questions.every((q) => expandedIds[q.id]);
    if (areAllExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      questions.forEach((q) => {
        next[q.id] = true;
      });
      setExpandedIds(next);
    }
  };

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-blue-900" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleExpandAll}
          className="text-xs font-semibold self-start sm:self-auto border-slate-300"
        >
          {questions.every((q) => expandedIds[q.id]) ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q) => {
          const isExpanded = !!expandedIds[q.id];
          const isCorrect = q.result === "Correct";

          return (
            <div
              key={q.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? "bg-slate-50/70 border-slate-300 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Question Item Header */}
              <button
                type="button"
                onClick={() => toggleExpand(q.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded-xl"
                aria-expanded={isExpanded}
                aria-controls={`q-content-${q.id}`}
              >
                <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                  <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {t("question")} {q.questionNumber}
                  </span>

                  <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-200 text-[11px] font-semibold">
                    {q.competencyName}
                  </Badge>

                  <Badge
                    className={`text-[10px] font-bold gap-1 ${
                      isCorrect
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t("correct")}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>{t("incorrect")}</span>
                      </>
                    )}
                  </Badge>

                  {q.isFlagged && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      <Flag className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                      <span>{t("flagged")}</span>
                    </span>
                  )}
                </div>

                <div className="text-slate-400 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div
                  id={`q-content-${q.id}`}
                  className="px-4 pb-4 pt-1 border-t border-slate-200/70 space-y-3 animate-in fade-in-50 duration-150 text-xs"
                >
                  <p className="font-bold text-sm text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {t("yourAnswer")}
                      </span>
                      <p
                        className={`font-semibold ${
                          isCorrect ? "text-emerald-800" : "text-rose-800"
                        }`}
                      >
                        {q.selectedOptionText}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                          {t("correctAnswer")}
                        </span>
                        <p className="font-semibold text-emerald-900">
                          {q.correctOptionText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Official Rationale & Grounding */}
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {t("explanation")}
                    </span>
                    <p className="text-blue-950/90 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
