"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, PlayCircle, Circle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CadreCompetencyTrackerProps {
  stages: {
    name: string;
    status: "completed" | "in_progress" | "not_started";
    label: string;
  }[];
}

export function CadreCompetencyTracker({ stages }: CadreCompetencyTrackerProps) {
  const t = useTranslations("personalizedLearningPath.cadreTracker");

  const getStatusIcon = (status: "completed" | "in_progress" | "not_started") => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case "in_progress":
        return <PlayCircle className="w-5 h-5 text-blue-800 shrink-0 animate-pulse" />;
      case "not_started":
        return <Circle className="w-5 h-5 text-slate-300 shrink-0" />;
    }
  };

  const getStatusText = (status: "completed" | "in_progress" | "not_started", name: string) => {
    if (name === "improvement" && status === "not_started") return t("notMeasured");
    switch (status) {
      case "completed":
        return t("completed");
      case "in_progress":
        return t("inProgress");
      case "not_started":
        return t("notStarted");
    }
  };

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          {t("title")}
        </h2>
        <span className="text-[11px] text-slate-500 font-medium">
          Stage 2 of 5 Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === "completed";
          const isInProgress = stage.status === "in_progress";

          return (
            <div
              key={stage.name}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all ${
                isInProgress
                  ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-800/10 shadow-xs"
                  : isCompleted
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-slate-50/60 border-slate-200 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Step {idx + 1}
                </span>
                {getStatusIcon(stage.status)}
              </div>

              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {stage.label}
                </h3>
                <span
                  className={`text-[11px] font-semibold block ${
                    isCompleted
                      ? "text-emerald-700"
                      : isInProgress
                      ? "text-blue-900"
                      : "text-slate-400"
                  }`}
                >
                  {getStatusText(stage.status, stage.name)}
                </span>
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
