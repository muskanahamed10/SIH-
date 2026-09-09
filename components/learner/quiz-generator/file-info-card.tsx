"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  FileText,
  Calendar,
  Layers,
  HardDrive,
  Hash,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuizGeneratorStore } from "@/stores/quiz-generator-store";

export function FileInfoCard() {
  const t = useTranslations("quizGenerator.fileInfo");
  const {
    uploadedFile,
    setStep,
    startProcessingAndGeneration,
    isProcessing,
    config,
  } = useQuizGeneratorStore();

  if (!uploadedFile) {
    return (
      <div className="p-8 text-center text-slate-500 border border-dashed rounded-2xl">
        <p className="text-sm">No file uploaded. Please upload learning material in Step 1.</p>
        <Button size="sm" onClick={() => setStep(1)} className="mt-3 text-xs">
          Return to Upload
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-slate-200 shadow-md overflow-hidden rounded-2xl">
        {/* Card Header */}
        <CardHeader className="bg-gradient-to-r from-blue-900 to-[#0B2545] text-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase">
                    Verified PDF
                  </Badge>
                  <span className="text-xs text-blue-200">
                    Step 2: Uploaded File Information
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  {uploadedFile.fileName}
                </h2>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-medium gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t("replaceButton")}</span>
            </Button>
          </div>
        </CardHeader>

        {/* Card Body with Detailed Technical Metadata */}
        <CardContent className="p-6 space-y-5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-slate-400" />
                <span>{t("fileSize")}</span>
              </span>
              <p className="text-sm font-extrabold text-slate-900">
                {uploadedFile.fileSizeFormatted}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>{t("fileFormat")}</span>
              </span>
              <p className="text-sm font-extrabold text-slate-900">
                PDF Document
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                <span>{t("pageCount")}</span>
              </span>
              <p className="text-sm font-extrabold text-slate-900">
                {uploadedFile.pageCount} Pages
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{t("uploadDate")}</span>
              </span>
              <p className="text-sm font-extrabold text-slate-900">
                {uploadedFile.uploadedAt}
              </p>
            </div>
          </div>

          {/* Checksum & Document Security */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-600">Integrity Checksum:</span>
              <code className="bg-white px-2 py-0.5 rounded border text-[11px] font-mono text-slate-800">
                {uploadedFile.checksum}
              </code>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200">
              Valid SHA-256
            </Badge>
          </div>

          {/* Document Summary / Description */}
          {uploadedFile.summary && (
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700">Document Scope & Description:</span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {uploadedFile.summary}
              </p>
            </div>
          )}

          {/* Target Competencies */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              Identified Competency Coverage:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(uploadedFile.competenciesIdentified || [config.competencyFocus]).map((comp) => (
                <Badge key={comp} className="bg-blue-50 text-blue-900 border-blue-200 text-xs font-semibold">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Card Footer: Action to proceed to generation */}
        <CardFooter className="bg-slate-50 p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Targeting <strong>{config.questionCount} diagnostic MCQs</strong> aligned with MoSPI SSS Cadre.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
              className="text-xs w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isProcessing}
              onClick={() => startProcessingAndGeneration()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold gap-1.5 shadow-sm w-full sm:w-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t("proceedToGenerate")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
