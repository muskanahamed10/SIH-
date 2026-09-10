"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Clock,
  BookOpen,
  ArrowRight,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LearningPathItem } from "@/types";
import { useLearningPathStore } from "@/stores/learning-path-store";

interface LearningTimelineProps {
  items: LearningPathItem[];
}

export function LearningTimeline({ items }: LearningTimelineProps) {
  const t = useTranslations("personalizedLearningPath.timeline");
  const connectionT = useTranslations("personalizedLearningPath.competencyConnection");
  const locale = useLocale();
  const { startLearningItem } = useLearningPathStore();

  // Track expanded milestones
  const [expandedMilestones, setExpandedMilestones] = React.useState<Record<string, boolean>>({
    "path-item-1": true,
  });

  const toggleMilestones = (id: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStageBadge = (stage: "NOW" | "NEXT" | "LATER") => {
    switch (stage) {
      case "NOW":
        return (
          <Badge className="bg-emerald-700 text-white font-extrabold text-xs px-2.5 shadow-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span>{t("now")}</span>
          </Badge>
        );
      case "NEXT":
        return <Badge className="bg-[#0B2545] text-white font-bold text-xs px-2.5">{t("next")}</Badge>;
      case "LATER":
      default:
        return <Badge className="bg-slate-500 text-white font-medium text-xs px-2.5">{t("later")}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical Priority":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-bold text-[10px] hover:bg-rose-100 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{t("criticalPriority")}</span>
          </Badge>
        );
      case "High Priority":
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-[10px] hover:bg-amber-100">
            {t("highPriority")}
          </Badge>
        );
      case "Medium Priority":
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-medium text-[10px] hover:bg-slate-100">
            {t("mediumPriority")}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string, stage: string) => {
    if (status === "COMPLETED") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px] gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{t("completedStatus")}</span>
        </Badge>
      );
    }
    if (status === "IN_PROGRESS" || stage === "NOW") {
      return (
        <Badge className="bg-blue-100 text-blue-900 border-blue-300 font-bold text-[10px] gap-1">
          <Play className="w-2.5 h-2.5 fill-blue-700" />
          <span>{t("statusInProgress")}</span>
        </Badge>
      );
    }
    if (status === "LOCKED" || stage === "LATER") {
      return (
        <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-normal text-[10px] gap-1">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>{t("lockedStatus")}</span>
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-medium text-[10px]">
        {t("upNextStatus")}
      </Badge>
    );
  };

  return (
    <section aria-label="Personalized Progression Timeline" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {t("progressionTimelineTitle")}
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          {t("roadmapSubtitle")}
        </span>
      </div>

      {/* Vertical Spine Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-600 before:to-slate-300">
        {items.map((item, index) => {
          const isNow = item.stage === "NOW";
          const isInProgress = item.status === "IN_PROGRESS" || isNow;
          const isLocked = item.status === "LOCKED";
          const isMilestoneOpen = !!expandedMilestones[item.id];

          return (
            <div key={item.id} className="relative group" data-testid={`timeline-item-${item.stage.toLowerCase()}`}>
              {/* Spine Node Circle */}
              <div
                className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs transition-colors ${
                  isNow
                    ? "bg-emerald-600 text-white ring-emerald-100 shadow-md"
                    : isInProgress
                    ? "bg-blue-800 text-white"
                    : isLocked
                    ? "bg-slate-300 text-slate-600"
                    : "bg-[#0B2545] text-white"
                }`}
              >
                {index + 1}
              </div>

              {/* Course Card */}
              <Card
                data-testid={`timeline-card-${item.stage.toLowerCase()}`}
                className={`p-5 sm:p-6 shadow-xs border transition-all space-y-4 rounded-2xl ${
                  isNow
                    ? "border-emerald-300 bg-white ring-2 ring-emerald-500/20 shadow-md"
                    : item.stage === "NEXT"
                    ? "border-blue-200 bg-white shadow-xs hover:border-blue-300"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                }`}
              >
                {/* 1. Header: Stage + Step + Priority + Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getStageBadge(item.stage)}
                    <span className="text-xs font-bold text-slate-400">Step {index + 1} of {items.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getPriorityBadge(item.priority)}
                    {getStatusBadge(item.status, item.stage)}
                  </div>
                </div>

                {/* 2. Course Title & AI Reason */}
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60">
                    &ldquo;{item.reason}&rdquo;
                  </p>
                </div>

                {/* 3. Metadata Strip: Competency, Duration, Source, Gap */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pt-0.5">
                  <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 text-[11px] font-semibold text-blue-900">
                    <span className="text-blue-600 font-normal">{t("competency")}</span>
                    <span>{item.competencyName}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.durationMinutes} {t("mins")}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-amber-900">
                    <span className="text-slate-500 font-normal">{t("source")}</span>
                    <span>{item.source}</span>
                  </div>

                  <div className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                    {t("gap")} {item.gapPoints} pts
                  </div>
                </div>

                {/* 4. Progress Indicator */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <span>{t("progressLabel")}</span>
                    </span>
                    <strong className="font-extrabold text-slate-900 text-[11px]">
                      {item.progress > 0
                        ? `${item.progress}% (${t("statusInProgress")})`
                        : isLocked
                        ? t("lockedStatus")
                        : t("upNextStatus")}
                    </strong>
                  </div>
                  <Progress
                    value={item.progress}
                    className={`h-2 ${isNow ? "bg-emerald-100" : "bg-slate-200"}`}
                  />
                </div>

                {/* 5. Milestones Checklist (Expandable) */}
                {item.milestones && item.milestones.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleMilestones(item.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-slate-950 focus:outline-none"
                      aria-expanded={isMilestoneOpen}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t("milestonesTitle")} ({item.milestones.filter((m) => m.completed).length}/{item.milestones.length})</span>
                      </span>
                      <span className="text-slate-500">
                        {isMilestoneOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isMilestoneOpen && (
                      <div className="space-y-1.5 pt-1.5 border-t border-slate-200/60 animate-in fade-in-50">
                        {item.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-2 text-[11px] text-slate-700">
                            {milestone.completed ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className={milestone.completed ? "line-through text-slate-500" : "font-medium"}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. Competency -> Learning Connection Strip */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{connectionT("connectionTitle")}</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-2 font-medium text-slate-700 text-[11px]">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.competencyName}: Req {item.requiredScore}% vs Cur {item.currentScore}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-blue-900">
                      {connectionT("recommendedLearning")}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <Link
                      href={`/${locale}/learner/practice/${item.competencyId}`}
                      className="hover:underline text-blue-800 font-semibold"
                    >
                      {connectionT("targetedPractice")}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <Link
                      href={`/${locale}/learner/reassessment/${item.competencyId}`}
                      className="hover:underline text-amber-900 font-semibold"
                    >
                      {connectionT("cadreReassessment")}
                    </Link>
                  </div>
                </div>

                {/* 7. Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {isNow ? (
                      <Link
                        href={`/${locale}/learner/resources/${item.resourceId}`}
                        onClick={() => startLearningItem(item.id)}
                        className="w-full sm:w-auto"
                      >
                        <Button className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold h-9 px-5 shadow-xs flex items-center justify-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t("continueLearningCta")}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/${locale}/learner/resources/${item.resourceId}`}
                        className="w-full sm:w-auto"
                      >
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold h-9 px-4 flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t("viewResource")}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}

                    <Link href={`/${locale}/learner/practice/${item.competencyId}`}>
                      <Button variant="outline" size="sm" className="text-xs h-9 border-blue-200 text-blue-900 hover:bg-blue-50 font-semibold">
                        Practice
                      </Button>
                    </Link>

                    <Link href={`/${locale}/learner/reassessment/${item.competencyId}`}>
                      <Button variant="outline" size="sm" className="text-xs h-9 border-amber-200 text-amber-900 hover:bg-amber-50 font-semibold">
                        Reassess
                      </Button>
                    </Link>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                    {isNow ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Active Stage Objective</span>
                      </span>
                    ) : isLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Prerequisites Required</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Queued After Step 1</span>
                      </>
                    )}
                  </span>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
