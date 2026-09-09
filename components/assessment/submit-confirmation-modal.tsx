"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  isSubmitting: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: () => void;
}

export function SubmitConfirmationModal({
  isOpen,
  totalQuestions,
  answeredCount,
  flaggedCount,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: SubmitConfirmationModalProps) {
  const t = useTranslations("baselineAssessment.modal");

  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="space-y-1.5 text-center">
          <h2 id="submit-modal-title" className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xs text-slate-500">
            {t("description")}
          </p>
        </div>

        {/* Progress Breakdown */}
        <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 block">{t("answered")}</span>
            <span className="text-lg font-bold text-emerald-700">{answeredCount}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 block">{t("unanswered")}</span>
            <span className="text-lg font-bold text-rose-700">{unansweredCount}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 block">{t("flagged")}</span>
            <span className="text-lg font-bold text-amber-700">{flaggedCount}</span>
          </div>
        </div>

        {/* Unanswered Notice if any */}
        {unansweredCount > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{t("unansweredWarning", { count: unansweredCount })}</p>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
              <span>{t("error")}</span>
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onSubmit}
              className="text-xs h-7 border-rose-300 text-rose-800 hover:bg-rose-100"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>{t("tryAgain")}</span>
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 text-xs font-semibold border-slate-300 text-slate-700"
          >
            {t("continueBtn")}
          </Button>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>{t("submitting")}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>{t("submitBtn")}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
