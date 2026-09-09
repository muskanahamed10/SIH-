"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  Building,
  Info,
  ShieldCheck,
  Flame,
  Brain,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecommendedResource } from "@/types";

interface ResourceDetailViewProps {
  resource: RecommendedResource;
}

export function ResourceDetailView({ resource }: ResourceDetailViewProps) {
  const t = useTranslations("learningRecommendations.resourcePreview");
  const locale = useLocale();
  const [showDemoModal, setShowDemoModal] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200 pb-12">
      {/* Back to Recommendations Link */}
      <div>
        <Link
          href={`/${locale}/learner/recommendations`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToRecommendations")}</span>
        </Link>
      </div>

      {/* Main Resource Card */}
      <Card className="p-6 sm:p-8 shadow-xs border-slate-200 bg-white space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#0B2545] text-white font-bold text-xs px-2.5 py-0.5">
                {resource.competencyName}
              </Badge>
              <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-300">
                {resource.learningType}
              </Badge>
            </div>

            <Badge
              className={`text-xs font-bold ${
                resource.priority === "High Priority"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}
            >
              <Flame className="w-3 h-3 mr-1" />
              <span>{resource.priority}</span>
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {resource.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* 4 Metadata Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("duration")}</span>
            </span>
            <strong className="text-sm font-bold text-slate-900">
              {resource.durationMinutes} minutes
            </strong>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("level")}</span>
            </span>
            <strong className="text-sm font-bold text-slate-900">
              {resource.difficulty}
            </strong>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="text-[11px] font-semibold text-amber-900 block flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>{t("source")}</span>
            </span>
            <strong className="text-sm font-bold text-amber-950">
              {resource.source}
            </strong>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
            <span className="text-[11px] font-semibold text-blue-900 block flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>Provider</span>
            </span>
            <strong className="text-xs font-bold text-blue-950 line-clamp-1">
              {resource.provider}
            </strong>
          </div>
        </div>

        {/* Why this resource was recommended (AI Decision Support) */}
        <div className="p-5 rounded-2xl bg-linear-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <h2 className="text-sm font-extrabold text-blue-950 tracking-tight">
              {t("whyTitle")}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Demonstrated Score: <strong>{resource.detailedReasoning.currentScore}%</strong></span>
            <span>•</span>
            <span>Required Role Target: <strong>{resource.detailedReasoning.requiredScore}%</strong></span>
            <span>•</span>
            <span className="text-rose-700 font-extrabold">
              Competency Gap: {resource.detailedReasoning.gapPoints} points
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {resource.detailedReasoning.rationale}
          </p>
        </div>

        {/* Learning Objectives */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>{t("objectivesTitle")}</span>
          </h2>

          <ul className="space-y-2">
            {resource.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 border border-emerald-200">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
            <span>Integrated with India&apos;s National iGOT Karmayogi Learning Registry</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link href={`/${locale}/learner/practice/${resource.competencyId || "comp-stat-model"}`} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-blue-300 text-blue-900 hover:bg-blue-50 font-bold text-sm px-5 h-11 shadow-xs flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4 text-blue-700" aria-hidden="true" />
                <span>Take Practice</span>
              </Button>
            </Link>

            <Button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-sm px-6 h-11 shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t("continueToIgot")}</span>
              <ExternalLink className="w-4 h-4 text-amber-400" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Demo Modal Dialog */}
      {showDemoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in-50"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                iGOT Karmayogi Integration
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("demoNotice")}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">Course Payload:</span>
              <p className="font-mono text-[11px] text-slate-600">{resource.title} ({resource.id})</p>
              <p className="font-mono text-[11px] text-slate-600">Provider: {resource.provider}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link href={`/${locale}/learner/recommendations`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {t("backToRecommendations")}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemoModal(false)}
                className="text-xs"
              >
                Close
              </Button>
              <Link href={`/${locale}/learner/practice/${resource.competencyId || "comp-stat-model"}`}>
                <Button
                  size="sm"
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold gap-1"
                >
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  <span>Take Practice Quiz</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
