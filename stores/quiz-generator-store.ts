"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  QuizProcessingStage,
  GeneratedMCQ,
  UploadedMaterialInfo,
  QuizGenerationConfig,
  SampleLearningMaterial,
} from "@/types";
import { getAiQuizGeneratorService } from "@/lib/services/ai-quiz-generator.service";

export interface ProcessingLogEntry {
  stage: QuizProcessingStage;
  timestamp: string;
  message: string;
}

export interface QuizGeneratorState {
  currentStep: 1 | 2 | 3 | 4;
  uploadedFile: UploadedMaterialInfo | null;
  config: QuizGenerationConfig;
  processingStage: QuizProcessingStage | "idle";
  stageProgress: number; // 0 to 100
  stageLogs: ProcessingLogEntry[];
  generatedQuestions: GeneratedMCQ[];
  isProcessing: boolean;
  error: string | null;
  difficultyFilter: "all" | "Beginner" | "Intermediate" | "Advanced";
  competencyFilter: "all" | string;

  // Actions
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setUploadedFile: (file: UploadedMaterialInfo) => void;
  selectSampleMaterial: (sample: SampleLearningMaterial) => void;
  updateConfig: (patch: Partial<QuizGenerationConfig>) => void;
  startProcessingAndGeneration: () => Promise<void>;
  reset: () => void;
  setDifficultyFilter: (diff: "all" | "Beginner" | "Intermediate" | "Advanced") => void;
  setCompetencyFilter: (comp: "all" | string) => void;
}

const defaultConfig: QuizGenerationConfig = {
  questionCount: 5,
  competencyFocus: "Survey Methodology",
  targetCadre: "Subordinate Statistical Service (SSS)",
  difficultyPreference: "balanced",
};

export const useQuizGeneratorStore = create<QuizGeneratorState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      uploadedFile: null,
      config: defaultConfig,
      processingStage: "idle",
      stageProgress: 0,
      stageLogs: [],
      generatedQuestions: [],
      isProcessing: false,
      error: null,
      difficultyFilter: "all",
      competencyFilter: "all",

      setStep: (step) => set({ currentStep: step }),

      setUploadedFile: (file) =>
        set({
          uploadedFile: file,
          currentStep: 2,
          error: null,
        }),

      selectSampleMaterial: (sample) => {
        const fileInfo: UploadedMaterialInfo = {
          id: sample.id,
          fileName: sample.fileName,
          fileSizeBytes: sample.fileSizeBytes,
          fileSizeFormatted: sample.fileSizeFormatted,
          fileType: "application/pdf",
          pageCount: sample.pageCount,
          uploadedAt: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          checksum: `sha256:mospi_${sample.id.replace(/-/g, "_")}_verified`,
          summary: sample.description,
          competenciesIdentified: sample.competencies,
        };

        set({
          uploadedFile: fileInfo,
          currentStep: 2,
          config: {
            ...get().config,
            competencyFocus: sample.competencies[0] || "Survey Methodology",
          },
          error: null,
        });
      },

      updateConfig: (patch) =>
        set((state) => ({
          config: { ...state.config, ...patch },
        })),

      startProcessingAndGeneration: async () => {
        const { uploadedFile, config } = get();
        if (!uploadedFile) {
          set({ error: "Please upload or select a document first." });
          return;
        }

        set({
          currentStep: 3,
          isProcessing: true,
          processingStage: "uploading",
          stageProgress: 10,
          stageLogs: [],
          error: null,
        });

        try {
          const service = getAiQuizGeneratorService();
          const questions = await service.processAndGenerateQuiz(
            uploadedFile,
            config,
            (stage, progress, message) => {
              const now = new Date().toLocaleTimeString("en-IN", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              set((state) => ({
                processingStage: stage,
                stageProgress: progress,
                stageLogs: [
                  ...state.stageLogs,
                  { stage, timestamp: now, message },
                ],
              }));
            }
          );

          set({
            generatedQuestions: questions,
            processingStage: "ready",
            stageProgress: 100,
            isProcessing: false,
          });
        } catch (err) {
          set({
            isProcessing: false,
            error: err instanceof Error ? err.message : "Failed to generate questions",
          });
        }
      },

      reset: () =>
        set({
          currentStep: 1,
          uploadedFile: null,
          config: defaultConfig,
          processingStage: "idle",
          stageProgress: 0,
          stageLogs: [],
          generatedQuestions: [],
          isProcessing: false,
          error: null,
          difficultyFilter: "all",
          competencyFilter: "all",
        }),

      setDifficultyFilter: (diff) => set({ difficultyFilter: diff }),
      setCompetencyFilter: (comp) => set({ competencyFilter: comp }),
    }),
    {
      name: "sih_quiz_generator_state_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        uploadedFile: state.uploadedFile,
        config: state.config,
        generatedQuestions: state.generatedQuestions,
        currentStep: state.currentStep === 3 ? 2 : state.currentStep,
      }),
    }
  )
);
