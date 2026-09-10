import { create } from "zustand";
import { BaselineAssessment, AssessmentEvaluationResult } from "@/types";

const STORAGE_KEY_PREFIX = "sih_baseline_assessment_state_";

interface BaselineAssessmentState {
  assessment: BaselineAssessment | null;
  assessmentId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> optionId
  flaggedQuestionIds: Record<string, boolean>; // questionId -> boolean
  startedAt: number | null;
  remainingSeconds: number;
  isStarted: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSubmitModalOpen: boolean;
  lastEvaluationResult: AssessmentEvaluationResult | null;

  // Actions
  initAssessment: (assessment: BaselineAssessment) => void;
  startAssessment: () => void;
  selectOption: (questionId: string, optionId: string) => void;
  toggleFlag: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  decrementTimer: () => void;
  openSubmitModal: () => void;
  closeSubmitModal: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitted: (isSubmitted: boolean) => void;
  evaluateAssessment: () => AssessmentEvaluationResult | null;
  resetAssessment: () => void;
  clearStorage: () => void;
}

export const useBaselineAssessmentStore = create<BaselineAssessmentState>((set, get) => ({
  assessment: null,
  assessmentId: "baseline-cadre-2026",
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestionIds: {},
  startedAt: null,
  remainingSeconds: 600, // 10 minutes
  isStarted: false,
  isSubmitting: false,
  isSubmitted: false,
  isSubmitModalOpen: false,
  lastEvaluationResult: null,

  initAssessment: (assessment: BaselineAssessment) => {
    const current = get();
    if (current.assessment?.id === assessment.id && current.isStarted) {
      return;
    }

    const storageKey = `${STORAGE_KEY_PREFIX}${assessment.id}`;
    let savedAnswers: Record<string, string> = {};
    let savedFlags: Record<string, boolean> = {};
    let savedIndex = 0;
    let savedRemaining = assessment.estimatedTimeMinutes * 60;
    let savedStarted = false;

    // Restore from localStorage if present
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          savedAnswers = parsed.answers || {};
          savedFlags = parsed.flaggedQuestionIds || {};
          savedIndex = typeof parsed.currentQuestionIndex === "number" ? parsed.currentQuestionIndex : 0;
          if (typeof parsed.remainingSeconds === "number" && parsed.remainingSeconds > 0) {
            savedRemaining = parsed.remainingSeconds;
          }
          savedStarted = !!parsed.isStarted;
        }
      } catch (e) {
        console.warn("Could not restore saved assessment state:", e);
      }
    }

    set({
      assessment,
      assessmentId: assessment.id,
      currentQuestionIndex: savedIndex,
      answers: savedAnswers,
      flaggedQuestionIds: savedFlags,
      remainingSeconds: savedRemaining,
      isStarted: savedStarted,
      isSubmitted: false,
      isSubmitting: false,
      isSubmitModalOpen: false,
    });
  },

  startAssessment: () => {
    const { assessment } = get();
    const duration = assessment ? assessment.estimatedTimeMinutes * 60 : 600;
    const now = Date.now();

    set((state) => {
      const nextState = {
        ...state,
        isStarted: true,
        startedAt: now,
        remainingSeconds: state.remainingSeconds > 0 ? state.remainingSeconds : duration,
      };

      if (typeof window !== "undefined" && state.assessment) {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${state.assessment.id}`,
          JSON.stringify({
            answers: nextState.answers,
            flaggedQuestionIds: nextState.flaggedQuestionIds,
            currentQuestionIndex: nextState.currentQuestionIndex,
            remainingSeconds: nextState.remainingSeconds,
            isStarted: true,
            startedAt: now,
          })
        );
      }
      return nextState;
    });
  },

  selectOption: (questionId: string, optionId: string) => {
    set((state) => {
      const updatedAnswers = {
        ...state.answers,
        [questionId]: optionId,
      };

      if (typeof window !== "undefined" && state.assessment) {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${state.assessment.id}`,
          JSON.stringify({
            answers: updatedAnswers,
            flaggedQuestionIds: state.flaggedQuestionIds,
            currentQuestionIndex: state.currentQuestionIndex,
            remainingSeconds: state.remainingSeconds,
            isStarted: state.isStarted,
          })
        );
      }

      return { answers: updatedAnswers };
    });
  },

  toggleFlag: (questionId: string) => {
    set((state) => {
      const updatedFlags = {
        ...state.flaggedQuestionIds,
        [questionId]: !state.flaggedQuestionIds[questionId],
      };

      if (typeof window !== "undefined" && state.assessment) {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${state.assessment.id}`,
          JSON.stringify({
            answers: state.answers,
            flaggedQuestionIds: updatedFlags,
            currentQuestionIndex: state.currentQuestionIndex,
            remainingSeconds: state.remainingSeconds,
            isStarted: state.isStarted,
          })
        );
      }

      return { flaggedQuestionIds: updatedFlags };
    });
  },

  goToQuestion: (index: number) => {
    const { assessment } = get();
    if (!assessment) return;
    if (index >= 0 && index < assessment.questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, assessment } = get();
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  decrementTimer: () => {
    set((state) => {
      const nextRemaining = Math.max(state.remainingSeconds - 1, 0);

      // Autosave remaining time every 5 seconds
      if (nextRemaining % 5 === 0 && typeof window !== "undefined" && state.assessment) {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${state.assessment.id}`,
          JSON.stringify({
            answers: state.answers,
            flaggedQuestionIds: state.flaggedQuestionIds,
            currentQuestionIndex: state.currentQuestionIndex,
            remainingSeconds: nextRemaining,
            isStarted: state.isStarted,
          })
        );
      }

      return {
        remainingSeconds: nextRemaining,
        isSubmitModalOpen: nextRemaining === 0 ? true : state.isSubmitModalOpen,
      };
    });
  },

  openSubmitModal: () => set({ isSubmitModalOpen: true }),
  closeSubmitModal: () => set({ isSubmitModalOpen: false }),
  setSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
  setSubmitted: (isSubmitted: boolean) => set({ isSubmitted }),

  evaluateAssessment: () => {
    const { assessment, answers } = get();
    if (!assessment) return null;

    let correctCount = 0;
    const competencyMap: Record<string, { total: number; correct: number; name: string }> = {};

    assessment.questions.forEach((q) => {
      if (!competencyMap[q.competencyId]) {
        competencyMap[q.competencyId] = {
          total: 0,
          correct: 0,
          name: q.competencyName || q.competencyId,
        };
      }
      competencyMap[q.competencyId].total += 1;
      if (answers[q.id] === q.correctOptionId) {
        correctCount += 1;
        competencyMap[q.competencyId].correct += 1;
      }
    });

    const totalQuestions = assessment.questions.length;
    const answeredCount = Object.keys(answers).length;
    const overallScore = Math.round((correctCount / totalQuestions) * 100);

    const competencyScores = Object.entries(competencyMap).map(([compId, data]) => {
      const score = Math.round((data.correct / data.total) * 100);
      return {
        competencyId: compId,
        competencyName: data.name,
        total: data.total,
        correct: data.correct,
        score,
        status: score >= 75 ? ("Achieved" as const) : score >= 50 ? ("Developing" as const) : ("Priority" as const),
      };
    });

    const result: AssessmentEvaluationResult = {
      id: `eval-${Date.now()}`,
      assessmentId: assessment.id,
      title: assessment.title,
      submittedAt: new Date().toISOString(),
      totalQuestions,
      answeredCount,
      correctCount,
      overallScore,
      competencyScores,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(`sih_last_assessment_result_${assessment.id}`, JSON.stringify(result));
    }

    set({ lastEvaluationResult: result, isSubmitted: true });
    return result;
  },

  resetAssessment: () => {
    const { assessment } = get();
    if (typeof window !== "undefined" && assessment) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${assessment.id}`);
    }
    set({
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestionIds: {},
      remainingSeconds: 600,
      isStarted: false,
      isSubmitting: false,
      isSubmitted: false,
      isSubmitModalOpen: false,
    });
  },

  clearStorage: () => {
    const { assessment } = get();
    if (typeof window !== "undefined" && assessment) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${assessment.id}`);
    }
  },
}));
