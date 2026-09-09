"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Clock,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Video,
  FileText,
  Activity,
  CheckCircle2,
  PlayCircle,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecommendedResource } from "@/types";

interface ResourceCardProps {
  resource: RecommendedResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const t = useTranslations("learningRecommendations.card");
  const locale = useLocale();
  const [isReasoningOpen, setIsReasoningOpen] = React.useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="w-3.5 h-3.5" />;
      case "Document":
        return <FileText className="w-3.5 h-3.5" />;
      case "Practice":
        return <Activity className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
            {t("beginner")}
          </Badge>
        );
      case "Advanced":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] font-bold">
            {t("advanced")}
          </Badge>
        );
      case "Intermediate":
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">
            {t("intermediate")}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High Priority":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-bold text-[10px] hover:bg-rose-100">
            {t("highPriority")}
          </Badge>
        );
      case "Medium Priority":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-bold text-[10px] hover:bg-amber-100">
            {t("mediumPriority")}
          </Badge>
        );
      case "Achieved":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px] hover:bg-emerald-100 gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t("achieved")}</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200 font-medium text-[10px] hover:bg-slate-100">
            {t("recommended")}
          </Badge>
        );
    }
  };

  // Format Duration
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} ${t("mins")}`;
    const hrs = Math.floor(mins / 60);
    const remainder = mins % 60;
    return remainder > 0 ? `${hrs}h ${remainder}m` : `${hrs}h`;
  };

  // Action Button Text
  const getActionText = () => {
    if (resource.progress === 100) return t("reviewCourse");
    if (resource.progress > 0) return t("continueLearning");
    return t("startLearning");
  };

  return (
    <Card className="p-5 sm:p-6 shadow-xs border-slate-200 bg-white hover:border-[#0B2545]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4 rounded-2xl">
      <div className="space-y-3.5">
        {/* Top Header Strip: Difficulty + Learning Type + Priority Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Learning Type */}
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[10px] font-semibold flex items-center gap-1">
              {getTypeIcon(resource.learningType)}
              <span>{resource.learningType}</span>
            </Badge>

            {/* Difficulty Badge */}
            {getDifficultyBadge(resource.difficulty)}

            <span className="text-slate-300 text-xs hidden sm:inline">•</span>

            {/* Estimated Duration */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDuration(resource.durationMinutes)}</span>
            </div>
          </div>

          {getPriorityBadge(resource.priority)}
        </div>

        {/* 1. Course Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-[#0B2545] transition-colors">
            {resource.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* 2. Competency Addressed & Source/Platform Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {/* Competency Addressed */}
          <div className="flex items-center gap-1.5 bg-blue-50/90 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-100 font-medium text-xs">
            <span className="text-blue-700 font-normal">{t("competency")}</span>
            <strong className="font-bold">{resource.competencyName}</strong>
          </div>

          {/* Source / Platform Badge */}
          <div className="flex items-center gap-1.5 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200 text-xs font-semibold text-amber-900">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>{resource.platform || "iGOT Karmayogi"}</span>
            <span className="text-[9px] uppercase px-1 py-0.2 rounded-sm bg-amber-200/80 text-amber-900 font-mono tracking-wider">
              {t("demoBadge")}
            </span>
          </div>
        </div>

        {/* 3. Reason for Recommendation Box */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
              <span>{t("whyRecommended")}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsReasoningOpen(!isReasoningOpen)}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-0.5 focus:outline-none"
              aria-expanded={isReasoningOpen}
            >
              <span>{isReasoningOpen ? t("hideDetails") : t("viewDetails")}</span>
              {isReasoningOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Main Primary Reason Text */}
          <p className="text-xs text-slate-800 font-medium leading-relaxed italic bg-white/60 p-2 rounded-lg border border-blue-100/60">
            &ldquo;{resource.explanation || resource.whyRecommended}&rdquo;
          </p>

          {/* Expandable Gap Details */}
          {isReasoningOpen && resource.detailedReasoning && (
            <div className="pt-2 border-t border-blue-100/80 space-y-2 text-xs text-slate-700 animate-in fade-in-50">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {t("currentScore")}: <strong className="text-slate-900">{resource.detailedReasoning.currentScore}%</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  {t("targetScore")}: <strong className="text-slate-900">{resource.detailedReasoning.requiredScore}%</strong>
                </span>
                <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-bold">
                  {t("gap")}: {resource.detailedReasoning.gapPoints} pts
                </span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {resource.detailedReasoning.rationale}
              </p>
            </div>
          )}
        </div>

        {/* 4. Learning Progress Indicator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <PlayCircle className="w-3 h-3 text-slate-400" />
              <span>{t("progressLabel")}</span>
            </span>
            <span className="font-bold text-slate-800 text-[11px]">
              {resource.progress === 100
                ? t("completedStatus")
                : resource.progress > 0
                ? `${resource.progress}% (${t("inProgressStatus")})`
                : t("notStartedStatus")}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                resource.progress === 100
                  ? "bg-emerald-500"
                  : resource.progress > 0
                  ? "bg-[#0B2545]"
                  : "bg-transparent"
              }`}
              style={{ width: `${resource.progress}%` }}
              role="progressbar"
              aria-valuenow={resource.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* 5. Card Footer: Start / View Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Link href={`/${locale}/learner/resources/${resource.id}`} className="w-full">
          <Button
            className={`w-full text-xs font-bold h-9 shadow-xs flex items-center justify-center gap-1.5 transition-all ${
              resource.progress === 100
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                : "bg-[#0B2545] hover:bg-[#134074] text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>{getActionText()}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
