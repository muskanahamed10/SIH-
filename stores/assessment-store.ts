import { create } from "zustand";
import { Assessment, Question } from "@/types";

interface AssessmentState {
  assessment: Assessment | null;
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> selectedOptionId
  markedForReview: Record<string, boolean>; // questionId -> boolean
  timeRemainingSeconds: number;
  isStarted: boolean;
  isSubmitted: boolean;

  // Actions
  initAssessment: (assessment: Assessment) => void;
  selectOption: (questionId: string, optionId: string) => void;
  toggleMarkForReview: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  decrementTimer: () => void;
  submitAssessment: () => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  assessment: null,
  currentQuestionIndex: 0,
  answers: {},
  markedForReview: {},
  timeRemainingSeconds: 0,
  isStarted: false,
  isSubmitted: false,

  initAssessment: (assessment: Assessment) =>
    set({
      assessment,
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: {},
      timeRemainingSeconds: assessment.durationMinutes * 60,
      isStarted: true,
      isSubmitted: false,
    }),

  selectOption: (questionId: string, optionId: string) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionId,
      },
    })),

  toggleMarkForReview: (questionId: string) =>
    set((state) => ({
      markedForReview: {
        ...state.markedForReview,
        [questionId]: !state.markedForReview[questionId],
      },
    })),

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

  decrementTimer: () =>
    set((state) => {
      const nextTime = Math.max(state.timeRemainingSeconds - 1, 0);
      return {
        timeRemainingSeconds: nextTime,
        isSubmitted: nextTime === 0 ? true : state.isSubmitted,
      };
    }),

  submitAssessment: () => set({ isSubmitted: true }),

  resetAssessment: () =>
    set({
      assessment: null,
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: {},
      timeRemainingSeconds: 0,
      isStarted: false,
      isSubmitted: false,
    }),
}));
