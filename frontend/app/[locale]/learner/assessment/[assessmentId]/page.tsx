"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useBaselineAssessment, useSubmitBaselineAssessment } from "@/hooks/use-queries";
import { useBaselineAssessmentStore } from "@/stores/baseline-assessment-store";
import { AssessmentIntro } from "@/components/assessment/assessment-intro";
import { AssessmentTimer } from "@/components/assessment/assessment-timer";
import { QuestionCard } from "@/components/assessment/question-card";
import { QuestionNavigator } from "@/components/assessment/question-navigator";
import { SubmitConfirmationModal } from "@/components/assessment/submit-confirmation-modal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("baselineAssessment.runner");

  const assessmentId = (params?.assessmentId as string) || "baseline-cadre-2026";
  const { data: assessment, isLoading } = useBaselineAssessment(assessmentId);
  const submitMutation = useSubmitBaselineAssessment();

  const {
    currentQuestionIndex,
    answers,
    flaggedQuestionIds,
    remainingSeconds,
    isStarted,
    isSubmitting,
    isSubmitModalOpen,
    initAssessment,
    startAssessment,
    selectOption,
    toggleFlag,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    decrementTimer,
    openSubmitModal,
    closeSubmitModal,
    setSubmitting,
    evaluateAssessment,
    clearStorage,
  } = useBaselineAssessmentStore();

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Prevent accidental submission/tab close when assessment is in progress
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && !submitMutation.isSuccess) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isStarted, submitMutation.isSuccess]);

  // Initialize store when assessment data loads
  React.useEffect(() => {
    if (assessment) {
      initAssessment(assessment);
    }
  }, [assessment, initAssessment]);

  if (isLoading || !assessment) {
    return (
      <div className="p-12 text-center text-sm text-slate-500 animate-pulse">
        Loading baseline assessment...
      </div>
    );
  }

  // 1. Intro Screen before starting
  if (!isStarted) {
    return (
      <AssessmentIntro
        assessment={assessment}
        onStart={() => startAssessment()}
      />
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestionIds).filter(Boolean).length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Deterministically calculate score and save to store & localStorage
      evaluateAssessment();

      const timeSpentSeconds = assessment.estimatedTimeMinutes * 60 - remainingSeconds;
      await submitMutation.mutateAsync({
        assessmentId,
        answers,
        timeSpentSeconds,
      });

      clearStorage();
      closeSubmitModal();
      router.push(`/${locale}/learner/assessment-results/${assessmentId}`);
    } catch (err) {
      console.error("Submission failed:", err);
      // Even if network fails, deterministic result is saved in localStorage
      clearStorage();
      closeSubmitModal();
      router.push(`/${locale}/learner/assessment-results/${assessmentId}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in-50 duration-200">
      {/* Runner Top Bar: Title, Timer, Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-800" aria-hidden="true" />
            <span>{assessment.title}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{t("answeredCount", { answered: answeredCount, total: totalQuestions })}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{t("savingAnswer")}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AssessmentTimer
            remainingSeconds={remainingSeconds}
            onTick={decrementTimer}
            onTimeUp={openSubmitModal}
          />

          <Button
            onClick={openSubmitModal}
            size="sm"
            className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-4 h-9 shadow-xs"
          >
            <span>{t("submitCta")}</span>
          </Button>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="space-y-1">
        <Progress value={progressPercentage} className="h-2 bg-slate-100" />
      </div>

      {/* Main Runner Content: Question Card + Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Question Card & Navigation Buttons */}
        <div className="lg:col-span-8 space-y-4">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            selectedOptionId={answers[currentQuestion.id]}
            isFlagged={!!flaggedQuestionIds[currentQuestion.id]}
            onSelectOption={(optId) => selectOption(currentQuestion.id, optId)}
            onToggleFlag={() => toggleFlag(currentQuestion.id)}
          />

          {/* Previous / Next Navigation Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="text-xs font-semibold px-4 h-9 border-slate-300 text-slate-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t("previous")}</span>
            </Button>

            <div className="flex items-center gap-2">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  type="button"
                  onClick={nextQuestion}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-5 h-9 flex items-center gap-1.5"
                >
                  <span>{t("next")}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={openSubmitModal}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 h-9 flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  <span>{t("submitCta")}</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Navigator Grid & Submit Button */}
        <div className="lg:col-span-4 space-y-4">
          <QuestionNavigator
            totalQuestions={totalQuestions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            flaggedQuestionIds={flaggedQuestionIds}
            questionIds={assessment.questions.map((q) => q.id)}
            onSelectIndex={(idx) => goToQuestion(idx)}
          />

          <Button
            type="button"
            onClick={openSubmitModal}
            className="w-full bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs h-10 shadow-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>{t("submitCta")}</span>
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        isSubmitting={isSubmitting}
        error={submitError}
        onClose={closeSubmitModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
