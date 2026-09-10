"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  UploadCloud,
  FileSearch,
  Database,
  Sparkles,
  CheckCircle2,
  Loader2,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuizGeneratorStore } from "@/stores/quiz-generator-store";
import { QuizProcessingStage } from "@/types";

interface PipelineStageDef {
  key: QuizProcessingStage;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function RagPipelineStepper() {
  const t = useTranslations("quizGenerator.pipeline");
  const {
    processingStage,
    stageProgress,
    stageLogs,
    uploadedFile,
    setStep,
    isProcessing,
  } = useQuizGeneratorStore();

  const stages: PipelineStageDef[] = [
    {
      key: "uploading",
      title: t("uploadingTitle"),
      description: t("uploadingDesc"),
      icon: UploadCloud,
    },
    {
      key: "extracting",
      title: t("extractingTitle"),
      description: t("extractingDesc"),
      icon: FileSearch,
    },
    {
      key: "retrieving",
      title: t("retrievingTitle"),
      description: t("retrievingDesc"),
      icon: Database,
    },
    {
      key: "generating",
      title: t("generatingTitle"),
      description: t("generatingDesc"),
      icon: Sparkles,
    },
    {
      key: "ready",
      title: t("readyTitle"),
      description: t("readyDesc"),
      icon: CheckCircle2,
    },
  ];

  const stageOrder: QuizProcessingStage[] = [
    "uploading",
    "extracting",
    "retrieving",
    "generating",
    "ready",
  ];

  const currentStageIndex = stageOrder.indexOf(
    processingStage === "idle" ? "uploading" : processingStage
  );

  return (
    <div
      role="region"
      aria-label="AI Quiz Generation Processing States"
      className="max-w-3xl mx-auto space-y-6"
    >
      <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-100 text-blue-900">
                    <Loader2 className={`w-4 h-4 text-blue-700 ${isProcessing ? "animate-spin" : ""}`} />
                  </span>
                  <span>{t("pipelineTitle")}</span>
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-900 text-[10px] font-bold">
                  {stageProgress}% Complete
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-1">
                {uploadedFile ? `Processing ${uploadedFile.fileName} via RAG Pipeline` : "Processing document..."}
              </CardDescription>
            </div>

            {processingStage === "ready" && (
              <Button
                size="sm"
                onClick={() => setStep(4)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold gap-1.5 shadow-xs"
              >
                <span>View Generated MCQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          <div className="mt-4 space-y-1.5">
            <Progress value={stageProgress} className="h-2.5 bg-slate-200" />
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Step 3 of 4: RAG Content Synthesis</span>
              <span>
                {processingStage === "ready"
                  ? "All 5 stages completed"
                  : `Executing: ${stages[currentStageIndex]?.title || "Initializing"}`}
              </span>
            </div>
          </div>
        </CardHeader>

        {/* The 5 Sequential Processing States */}
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="space-y-3">
            {stages.map((stageDef, idx) => {
              const Icon = stageDef.icon;
              const isCurrent = processingStage === stageDef.key && isProcessing;
              const isCompleted = currentStageIndex > idx || processingStage === "ready";
              

              return (
                <div
                  key={stageDef.key}
                  data-testid={`processing-state-${stageDef.key}`}
                  className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isCurrent
                      ? "border-blue-400 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20"
                      : isCompleted
                      ? "border-emerald-200 bg-emerald-50/40 text-slate-800"
                      : "border-slate-200 bg-slate-50/40 text-slate-400 opacity-70"
                  }`}
                >
                  {/* Status Circle */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isCurrent
                        ? "bg-blue-600 text-white shadow-xs ring-4 ring-blue-100"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Icon className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs sm:text-sm font-extrabold ${
                          isCurrent
                            ? "text-blue-950"
                            : isCompleted
                            ? "text-emerald-950"
                            : "text-slate-600"
                        }`}
                      >
                        {stageDef.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          isCurrent
                            ? "bg-blue-100 text-blue-900 border-blue-300 animate-pulse"
                            : isCompleted
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {isCurrent ? "Active" : isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {stageDef.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Telemetry Log Terminal */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>RAG Pipeline Telemetry Console</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Session ID: #mospi-rag-session
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto space-y-1.5 border border-slate-800">
              {stageLogs.length === 0 ? (
                <p className="text-slate-500 italic">Initializing pipeline workers...</p>
              ) : (
                stageLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-blue-400 select-none">[{log.timestamp}]</span>
                    <span className="text-emerald-400 font-bold uppercase text-[10px] select-none">
                      [{log.stage}]
                    </span>
                    <span className="text-slate-300 flex-1">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
