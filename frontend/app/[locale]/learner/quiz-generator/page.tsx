"use client";

import * as React from "react";
import { QuizGeneratorHeader } from "@/components/learner/quiz-generator/quiz-generator-header";
import { RagDisclaimerBanner } from "@/components/learner/quiz-generator/rag-disclaimer-banner";
import { UploadSection } from "@/components/learner/quiz-generator/upload-section";
import { FileInfoCard } from "@/components/learner/quiz-generator/file-info-card";
import { RagPipelineStepper } from "@/components/learner/quiz-generator/rag-pipeline-stepper";
import { GeneratedQuizView } from "@/components/learner/quiz-generator/generated-quiz-view";
import { useQuizGeneratorStore } from "@/stores/quiz-generator-store";

export default function QuizGeneratorPage() {
  const { currentStep } = useQuizGeneratorStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header with Step Stepper */}
      <QuizGeneratorHeader />

      {/* Transparent AI/RAG Architecture Disclaimer */}
      <RagDisclaimerBanner />

      {/* Step Router */}
      <main className="transition-all duration-300">
        {currentStep === 1 && <UploadSection />}
        {currentStep === 2 && <FileInfoCard />}
        {currentStep === 3 && <RagPipelineStepper />}
        {currentStep === 4 && <GeneratedQuizView />}
      </main>
    </div>
  );
}
