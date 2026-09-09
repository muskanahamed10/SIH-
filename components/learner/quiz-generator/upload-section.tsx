"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  UploadCloud,
  FileText,
  Sparkles,
  Sliders,
  HelpCircle,
  FolderOpen,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuizGeneratorStore } from "@/stores/quiz-generator-store";
import { mockSampleMaterials } from "@/mocks/data/quiz-generator";
import { UploadedMaterialInfo } from "@/types";

export function UploadSection() {
  const t = useTranslations("quizGenerator.upload");
  const {
    setUploadedFile,
    selectSampleMaterial,
    config,
    updateConfig,
  } = useQuizGeneratorStore();

  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleProcessFile = (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const formattedSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    const newFileInfo: UploadedMaterialInfo = {
      id: `upload-${Date.now()}`,
      fileName: file.name,
      fileSizeBytes: file.size,
      fileSizeFormatted: formattedSize,
      fileType: isPdf ? "application/pdf" : file.type || "application/octet-stream",
      pageCount: Math.max(12, Math.floor(file.size / (85 * 1024))), // Realistic page estimate
      uploadedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      checksum: `sha256:mospi_user_${Date.now().toString(36)}`,
      summary: "User uploaded statistical learning document for RAG-based diagnostic MCQ extraction.",
      competenciesIdentified: [
        config.competencyFocus || "Survey Methodology",
        "Official Statistics Standards",
      ],
    };

    setUploadedFile(newFileInfo);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone & Config Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Drag & Drop Zone */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-blue-600" />
                    <span>{t("dropzoneTitle")}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {t("dropzoneSubtitle")}
                  </CardDescription>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200 text-[10px] font-bold">
                  PDF Primary Format
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              {/* Drop area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/80 scale-[1.01]"
                    : "border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-blue-800 flex items-center justify-center shadow-xs">
                  <FileText className="w-7 h-7 text-blue-700" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    {t("dragPrompt")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("formatSupport")}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs font-semibold gap-1.5 border-slate-300 pointer-events-none"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t("browseFiles")}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample MoSPI Materials Quick-Pick */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t("sampleHeading")}</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Official MoSPI Documentation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mockSampleMaterials.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => selectSampleMaterial(sample)}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-xs transition-all text-left flex flex-col justify-between space-y-2 group focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="p-1 rounded bg-red-50 text-red-700 font-bold text-[10px]">
                        PDF
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {sample.fileSizeFormatted}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-900 line-clamp-2 leading-snug">
                      {sample.title}
                    </h4>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{sample.pageCount} Pages</span>
                    <span className="font-bold text-blue-700 group-hover:underline">
                      {t("useSample")} →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Generation Configuration Settings */}
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>{t("configTitle")}</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {t("configSubtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 text-xs">
              {/* Question Count */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  {t("questionCountLabel")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => updateConfig({ questionCount: num })}
                      className={`py-2 rounded-lg border font-bold text-xs transition-all ${
                        config.questionCount === num
                          ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {num} MCQs
                    </button>
                  ))}
                </div>
              </div>

              {/* Competency Focus */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  {t("competencyFocusLabel")}
                </label>
                <select
                  value={config.competencyFocus}
                  onChange={(e) => updateConfig({ competencyFocus: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Survey Methodology">Survey Methodology</option>
                  <option value="Sampling Theory & Design">Sampling Theory & Design</option>
                  <option value="Official Statistics Standards">Official Statistics Standards</option>
                  <option value="Data Quality & Validation">Data Quality & Validation</option>
                  <option value="Data Analysis & Statistics">Data Analysis & Statistics</option>
                  <option value="Statistical Computing (Python)">Statistical Computing (Python)</option>
                </select>
              </div>

              {/* Target Cadre */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  {t("cadreLabel")}
                </label>
                <input
                  type="text"
                  readOnly
                  value="Subordinate Statistical Service (SSS)"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600 font-medium cursor-not-allowed"
                />
              </div>

              {/* Help Callout */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] leading-relaxed space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Grounding Note</span>
                </span>
                <p>
                  Questions will be grounded strictly within the contents of the uploaded PDF manual with verbatim section citations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
