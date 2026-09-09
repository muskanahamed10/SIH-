"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Flag, Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssessmentQuestion } from "@/types";

interface QuestionCardProps {
  question: AssessmentQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  isFlagged: boolean;
  onSelectOption: (optionId: string) => void;
  onToggleFlag: () => void;
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  isFlagged,
  onSelectOption,
  onToggleFlag,
}: QuestionCardProps) {
  const t = useTranslations("baselineAssessment.runner");

  // Keyboard navigation for A-D, 1-4, and Arrow keys
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input, textarea, or button
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "BUTTON" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key;

      // 1-4 number keys
      if (["1", "2", "3", "4"].includes(key)) {
        const index = parseInt(key, 10) - 1;
        if (question.options[index]) {
          e.preventDefault();
          onSelectOption(question.options[index].id);
        }
        return;
      }

      // A-D letter keys
      const lower = key.toLowerCase();
      const letterIndex = ["a", "b", "c", "d"].indexOf(lower);
      if (letterIndex !== -1 && question.options[letterIndex]) {
        e.preventDefault();
        onSelectOption(question.options[letterIndex].id);
        return;
      }

      // Arrow navigation
      if (key === "ArrowDown" || key === "ArrowRight") {
        e.preventDefault();
        const currentIndex = question.options.findIndex((opt) => opt.id === selectedOptionId);
        if (currentIndex === -1 || currentIndex === question.options.length - 1) {
          onSelectOption(question.options[0].id);
        } else {
          onSelectOption(question.options[currentIndex + 1].id);
        }
        return;
      }

      if (key === "ArrowUp" || key === "ArrowLeft") {
        e.preventDefault();
        const currentIndex = question.options.findIndex((opt) => opt.id === selectedOptionId);
        if (currentIndex <= 0) {
          onSelectOption(question.options[question.options.length - 1].id);
        } else {
          onSelectOption(question.options[currentIndex - 1].id);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question.options, selectedOptionId, onSelectOption]);

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
      case "beginner":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "hard":
      case "advanced":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-6">
      {/* Header Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            {t("questionHeader", { current: questionIndex + 1, total: totalQuestions })}
          </span>

          <Badge variant="outline" className="text-[11px] font-bold bg-blue-50 text-blue-900 border-blue-200">
            {t("competencyLabel")} {question.competencyName}
          </Badge>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBadge(
              question.difficulty
            )}`}
          >
            {t("difficultyLabel")} {question.difficulty}
          </span>
        </div>

        {/* Flag Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFlag}
          className={`text-xs h-8 px-3 gap-1.5 transition-colors self-start sm:self-auto ${
            isFlagged
              ? "bg-amber-100 text-amber-900 border-amber-300 font-bold hover:bg-amber-200"
              : "text-slate-600 hover:text-slate-900 border-slate-200"
          }`}
          aria-pressed={isFlagged}
          aria-label={isFlagged ? t("flagged") : t("flagForReview")}
        >
          <Flag className={`w-3.5 h-3.5 ${isFlagged ? "fill-amber-600 text-amber-600" : "text-slate-400"}`} />
          <span>{isFlagged ? t("flagged") : t("flagForReview")}</span>
        </Button>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
          {question.question}
        </h2>
        {question.sourceTitle && (
          <p className="text-[11px] text-slate-400 flex items-center gap-1 italic">
            <Sparkles className="w-3 h-3 text-slate-400" />
            <span>Source Grounding: {question.sourceTitle}</span>
          </p>
        )}
      </div>

      {/* Answer Options Radio Group */}
      <fieldset className="space-y-3" role="radiogroup" aria-label="Answer options">
        <legend className="sr-only">Answer options for question {questionIndex + 1}</legend>
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const letter = String.fromCharCode(65 + idx);

          return (
            <label
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onSelectOption(option.id);
                }
              }}
              onClick={() => onSelectOption(option.id)}
              className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                isSelected
                  ? "bg-blue-50/80 border-blue-800 shadow-xs ring-1 ring-blue-800"
                  : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() => onSelectOption(option.id)}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />

              <div
                className={`h-5 w-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "border-blue-900 bg-[#0B2545] text-white"
                    : "border-slate-300 bg-white"
                }`}
                aria-hidden="true"
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <div className="flex-1 text-xs sm:text-sm font-medium leading-normal text-slate-800 flex items-baseline gap-2">
                <span className="font-bold text-slate-500 uppercase shrink-0">{letter}.</span>
                <span>{option.text}</span>
              </div>

              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-500 shrink-0 select-none">
                {letter} / {idx + 1}
              </kbd>
            </label>
          );
        })}
      </fieldset>
    </Card>
  );
}
