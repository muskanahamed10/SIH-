"use client";

import { useTranslations } from "next-intl";
import { Flag, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, string>;
  flaggedQuestionIds: Record<string, boolean>;
  questionIds: string[];
  onSelectIndex: (index: number) => void;
}

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answers,
  flaggedQuestionIds,
  questionIds,
  onSelectIndex,
}: QuestionNavigatorProps) {
  const t = useTranslations("baselineAssessment.navigator");

  return (
    <Card className="p-5 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {t("title")}
        </h2>
        <span className="text-[11px] text-slate-500 font-semibold">
          {Object.keys(answers).length} / {totalQuestions} done
        </span>
      </div>

      {/* Grid of question buttons 1 to 10 */}
      <div className="grid grid-cols-5 gap-2" role="navigation" aria-label="Questions list">
        {Array.from({ length: totalQuestions }, (_, idx) => {
          const qId = questionIds[idx];
          const isCurrent = idx === currentIndex;
          const isAnswered = !!answers[qId];
          const isFlagged = !!flaggedQuestionIds[qId];

          let stateClass = "bg-white border-slate-200 text-slate-700 hover:border-slate-300";
          if (isCurrent) {
            stateClass = "bg-blue-900 text-white border-blue-900 ring-2 ring-blue-800 font-bold";
          } else if (isAnswered) {
            stateClass = "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold hover:bg-emerald-100";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`h-10 rounded-lg border text-xs font-semibold flex items-center justify-center relative transition-all focus-visible:ring-2 focus-visible:ring-blue-800 ${stateClass}`}
              aria-label={`Question ${idx + 1}: ${isCurrent ? "Current" : isAnswered ? "Answered" : "Unanswered"}${
                isFlagged ? ", Flagged for review" : ""
              }`}
            >
              <span>{idx + 1}</span>

              {/* Status Icons */}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 p-0.5 bg-amber-500 rounded-full text-slate-950 border border-white">
                  <Flag className="w-2.5 h-2.5 fill-slate-950" />
                </span>
              )}

              {isAnswered && !isCurrent && !isFlagged && (
                <span className="absolute bottom-1 right-1 text-emerald-700">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Accessible Status Legend */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-blue-900 bg-blue-900 shrink-0" />
          <span>{t("current")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-emerald-300 bg-emerald-50 shrink-0" />
          <span>{t("answered")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-slate-200 bg-white shrink-0" />
          <span>{t("unanswered")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-amber-400 bg-amber-100 shrink-0" />
          <span>{t("flagged")}</span>
        </div>
      </div>
    </Card>
  );
}
