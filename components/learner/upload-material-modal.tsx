"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadMaterialModal({ isOpen, onClose }: UploadMaterialModalProps) {
  const t = useTranslations("dashboard.uploadModal");
  const locale = useLocale();

  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileSize, setFileSize] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [questionCount, setQuestionCount] = React.useState("10");
  const [targetRole, setTargetRole] = React.useState("sso");

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSimulateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setIsSuccess(false);
    }
  };

  const handleUseDemoFile = () => {
    setFileName("MoSPI_GCES_Field_Manual_2025-26.pdf");
    setFileSize("4.2 MB");
    setIsSuccess(false);
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFileName(null);
    setFileSize(null);
    setIsProcessing(false);
    setIsSuccess(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-900">
                <UploadCloud className="w-4 h-4 text-blue-900" aria-hidden="true" />
              </span>
              <h2 id="upload-modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
                {t("title")}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {!isSuccess ? (
            <>
              {/* Dropzone */}
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 bg-slate-50/40 transition cursor-pointer relative"
                onClick={() => document.getElementById("study-file-input")?.click()}
              >
                <input
                  id="study-file-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="sr-only"
                  onChange={handleSimulateFileSelect}
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2.5" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-800">
                  {t("dropzoneTitle")}
                </p>
                <p className="text-xs text-blue-800 font-medium mt-0.5">
                  {t("dropzoneSubtitle")}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  {t("supportedFormats")}
                </p>
              </div>

              {/* Demo quick file loader for demo purposes */}
              {!fileName && (
                <div className="flex items-center justify-between text-xs p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                  <span className="text-slate-600">Need a sample file to test?</span>
                  <button
                    type="button"
                    onClick={handleUseDemoFile}
                    className="font-bold text-blue-900 hover:underline text-xs"
                  >
                    Load MoSPI Field Manual (PDF)
                  </button>
                </div>
              )}

              {/* Selected File Display */}
              {fileName && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-blue-800 shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {fileName}
                      </p>
                      <span className="text-[10px] text-slate-500">{fileSize}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-rose-600 p-1"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Configuration options */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t("selectRole")}
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full p-2 rounded-md border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    <option value="sso">Senior Statistical Officer (SSO)</option>
                    <option value="jso">Junior Statistical Officer (JSO)</option>
                    <option value="ad">Assistant Director (AD)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t("questionCountLabel")}
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    className="w-full p-2 rounded-md border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions (Standard)</option>
                    <option value="15">15 Questions (Diagnostic)</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            /* Success View */
            <div className="text-center py-4 space-y-4">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t("successTitle")}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  {t("successDesc")}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Source Document:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[180px]">{fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Competency:</span>
                  <span className="font-semibold text-blue-900">Survey Methodology & Design</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cadre Standard:</span>
                  <Badge variant="gov" className="text-[10px]">MoSPI Official</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          {!isSuccess ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                {t("close")}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!fileName || isProcessing}
                onClick={handleGenerate}
                className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold gap-1.5 shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("generating")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t("generateCta")}</span>
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs"
              >
                Upload Another
              </Button>
              <Link href={`/${locale}/learner/practice`}>
                <Button
                  size="sm"
                  onClick={onClose}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  <span>{t("startPracticeCta")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
