"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles, Terminal, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PythonGapCalloutProps {
  onFilterPython: () => void;
}

export function PythonGapCallout({ onFilterPython }: PythonGapCalloutProps) {
  const t = useTranslations("learningRecommendations.pythonCallout");
  const locale = useLocale();

  return (
    <div
      role="region"
      aria-label="High Priority Competency Callout"
      className="relative overflow-hidden rounded-2xl border-2 border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-blue-50/40 p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] font-bold hover:bg-rose-100 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{t("criticalGapBadge")}</span>
            </Badge>

            <span className="text-slate-400 text-xs">•</span>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Terminal className="w-3.5 h-3.5 text-blue-900" />
              <span>Statistical Computing (Python)</span>
            </div>
          </div>

          {/* Exact Required Explanation */}
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-start sm:items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
              <span>{t("explanation")}</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("subtext")}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
              {t("currentScore")}: <strong className="text-slate-900">38%</strong>
            </span>
            <span className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
              {t("requiredScore")}: <strong className="text-slate-900">75%</strong>
            </span>
            <span className="bg-rose-100/90 border border-rose-200 px-2.5 py-1 rounded-lg text-rose-800 font-bold">
              {t("gapDeficit")}: 37%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
          <Link href={`/${locale}/learner/resources/rec-stat-comp-python-101`} className="w-full sm:w-auto">
            <Button className="w-full bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold h-9 px-4 shadow-xs flex items-center justify-center gap-1.5">
              <span>{t("startPythonCourse")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={onFilterPython}
            className="w-full sm:w-auto text-xs font-semibold h-9 px-4 bg-white/80 border-slate-300 hover:bg-white text-slate-700"
          >
            <span>{t("viewAllPythonCourses")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
