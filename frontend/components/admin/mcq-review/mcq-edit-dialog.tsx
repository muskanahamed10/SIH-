"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Edit3, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMCQReviewStore } from "@/stores/mcq-review-store";

export function MCQEditDialog() {
  const t = useTranslations("admin.mcqReview.editDialog");
  const { editingItem, setEditingItem, updateMCQ } = useMCQReviewStore();

  const [questionText, setQuestionText] = React.useState("");
  const [options, setOptions] = React.useState<{ id: string; text: string }[]>([]);
  const [correctOptionId, setCorrectOptionId] = React.useState("");
  const [explanation, setExplanation] = React.useState("");
  const [competencyName, setCompetencyName] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [sourceDoc, setSourceDoc] = React.useState("");
  const [sourcePage, setSourcePage] = React.useState("");

  // Sync state when editingItem changes
  React.useEffect(() => {
    if (editingItem) {
      setQuestionText(editingItem.question.questionText);
      setOptions(editingItem.question.options.map((o) => ({ id: o.id, text: o.text })));
      setCorrectOptionId(editingItem.question.correctOptionId);
      setExplanation(editingItem.question.explanation);
      setCompetencyName(editingItem.question.competencyName || "Survey Methodology & Sampling Design");
      setDifficulty(editingItem.question.difficulty || "intermediate");
      setSourceDoc(editingItem.sourceDocumentName);
      setSourcePage(editingItem.sourcePage);
    }
  }, [editingItem]);

  if (!editingItem) return null;

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMCQ(
      editingItem.id,
      {
        questionText,
        options,
        correctOptionId,
        explanation,
        competencyName,
        difficulty,
      },
      sourceDoc,
      sourcePage
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-mcq-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <Edit3 className="w-4 h-4 text-blue-700" />
            </span>
            <div>
              <h2 id="edit-mcq-title" className="text-base font-extrabold text-slate-900">
                {t("title")}
              </h2>
              <p className="text-xs text-slate-500">
                SME Rubric & Content Grounding Editor
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditingItem(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close edit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Question Text */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              {t("questionLabel")}
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-medium"
              required
            />
          </div>

          {/* Options & Suggested Correct Answer Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">
              {t("optionsLabel")}
            </label>
            <p className="text-[11px] text-slate-500">
              Select radio button to designate the official correct answer:
            </p>

            <div className="space-y-2">
              {options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isCorrect = opt.id === correctOptionId;

                return (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                      isCorrect
                        ? "border-emerald-400 bg-emerald-50/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctOption"
                      id={`opt-radio-${opt.id}`}
                      checked={isCorrect}
                      onChange={() => setCorrectOptionId(opt.id)}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor={`opt-radio-${opt.id}`}
                      className="font-extrabold text-xs text-slate-700 w-4 shrink-0 cursor-pointer"
                    >
                      {letter}.
                    </label>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 p-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      required
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              {t("explanationLabel")}
            </label>
            <textarea
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              required
            />
          </div>

          {/* Competency & Difficulty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                {t("competencyLabel")}
              </label>
              <input
                type="text"
                value={competencyName}
                onChange={(e) => setCompetencyName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                {t("difficultyLabel")}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Source Document & Page Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                {t("sourceDocLabel")}
              </label>
              <input
                type="text"
                value={sourceDoc}
                onChange={(e) => setSourceDoc(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 block">
                {t("sourcePageLabel")}
              </label>
              <input
                type="text"
                value={sourcePage}
                onChange={(e) => setSourcePage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingItem(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t("saveButton")}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
