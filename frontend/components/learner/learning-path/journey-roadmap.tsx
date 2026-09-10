"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Clock, Lock, ArrowRight, CheckCircle2, Sparkles, Terminal, BarChart2, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LearningPathItem } from "@/types";

interface JourneyRoadmapProps {
  items: LearningPathItem[];
}

export function JourneyRoadmap({ items }: JourneyRoadmapProps) {
  const t = useTranslations("personalizedLearningPath.roadmap");

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "NOW":
        return <Terminal className="w-4 h-4 text-emerald-600" />;
      case "NEXT":
        return <BarChart2 className="w-4 h-4 text-blue-600" />;
      case "LATER":
      default:
        return <Cpu className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStageColors = (stage: string) => {
    switch (stage) {
      case "NOW":
        return {
          container: "border-emerald-300 bg-gradient-to-b from-emerald-50/90 to-white ring-2 ring-emerald-500/20 shadow-sm",
          badge: "bg-emerald-700 text-white font-extrabold",
          text: "text-emerald-950",
          node: "bg-emerald-600 text-white ring-4 ring-emerald-100",
        };
      case "NEXT":
        return {
          container: "border-blue-200 bg-gradient-to-b from-blue-50/60 to-white shadow-xs",
          badge: "bg-[#0B2545] text-white font-bold",
          text: "text-blue-950",
          node: "bg-[#0B2545] text-white ring-4 ring-blue-100",
        };
      case "LATER":
      default:
        return {
          container: "border-slate-200 bg-slate-50/60 shadow-xs",
          badge: "bg-slate-500 text-white font-medium",
          text: "text-slate-800",
          node: "bg-slate-400 text-white ring-4 ring-slate-100",
        };
    }
  };

  return (
    <div
      role="region"
      aria-label="Visual Learning Journey Roadmap"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t("title")}</span>
            </h2>
            <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold">
              NOW → NEXT → LATER
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {t("subtitle")}
          </p>
        </div>

        <span className="text-xs text-slate-400 font-medium self-start sm:self-auto">
          3 Milestone Progression
        </span>
      </div>

      {/* Horizontal / Responsive Stepper Journey */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {items.map((item, index) => {
          const colors = getStageColors(item.stage);
          const isNow = item.stage === "NOW";
          const isNext = item.stage === "NEXT";

          return (
            <div key={item.id} className="relative flex flex-col justify-between" data-testid={`roadmap-item-${item.stage.toLowerCase()}`}>
              {/* Card Container */}
              <div
                data-testid={`roadmap-card-${item.stage.toLowerCase()}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between h-full space-y-3 ${colors.container}`}
              >
                <div className="space-y-2">
                  {/* Top Meta: Step + Stage Badge + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colors.node}`}>
                        {index + 1}
                      </div>
                      <Badge className={`text-[10px] px-2 py-0.5 ${colors.badge}`}>
                        {item.stage}
                      </Badge>
                    </div>

                    {isNow ? (
                      <span className="relative flex h-2.5 w-2.5" title="Active Stage">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    ) : item.status === "LOCKED" ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>

                  {/* Course Title & Competency */}
                  <div className="space-y-1">
                    <h3 className={`text-sm sm:text-base font-extrabold leading-snug ${colors.text}`}>
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      {getStageIcon(item.stage)}
                      <span>{item.competencyName}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Meta & Progress */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.durationMinutes} mins</span>
                    </span>

                    <span className="font-bold text-slate-700">
                      {item.progress > 0 ? `${item.progress}%` : item.status === "LOCKED" ? "Locked" : "Up Next"}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isNow
                          ? "bg-emerald-600"
                          : isNext
                          ? "bg-blue-600"
                          : "bg-slate-300"
                      }`}
                      style={{ width: `${Math.max(item.progress, 0)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Connecting arrow visible between cards on desktop */}
              {index < items.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs items-center justify-center text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
