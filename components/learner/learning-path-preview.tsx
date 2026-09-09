"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Route, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLearningPathItem } from "@/types";

interface LearningPathPreviewProps {
  learningPath: {
    now: DashboardLearningPathItem;
    next: DashboardLearningPathItem;
    later: DashboardLearningPathItem;
  };
}

export function LearningPathPreview({ learningPath }: LearningPathPreviewProps) {
  const t = useTranslations("dashboard.learningPath");
  const locale = useLocale();

  const getStatusBadge = (status: "In Progress" | "Not Started" | "Planned") => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-900 border-blue-200";
      case "Not Started":
        return "bg-amber-100 text-amber-900 border-amber-200";
      case "Planned":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const phases = [
    {
      phaseKey: "now",
      badgeText: t("now"),
      badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
      containerColor: "border-rose-200 bg-rose-50/30",
      item: learningPath.now,
      ctaLabel: "Continue Module",
    },
    {
      phaseKey: "next",
      badgeText: t("next"),
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      containerColor: "border-amber-200 bg-amber-50/30",
      item: learningPath.next,
      ctaLabel: "Start Next",
    },
    {
      phaseKey: "later",
      badgeText: t("later"),
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      containerColor: "border-slate-200 bg-slate-50/40",
      item: learningPath.later,
      ctaLabel: "View Details",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Route className="w-5 h-5 text-blue-900" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <Link href={`/${locale}/learner/learning-path`}>
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-900 hover:text-blue-950 hover:bg-blue-50 flex items-center gap-1">
            <span>{t("viewFull")}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <div
            key={phase.phaseKey}
            className={`p-5 rounded-xl border-2 shadow-xs space-y-3 flex flex-col justify-between ${phase.containerColor}`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Badge className={`font-bold text-[11px] px-2.5 py-0.5 uppercase tracking-wider ${phase.badgeColor}`}>
                  {phase.badgeText}
                </Badge>
                <Badge variant="outline" className={`text-[10px] font-semibold ${getStatusBadge(phase.item.status)}`}>
                  {phase.item.status}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {phase.item.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {phase.item.competency}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>{phase.item.duration}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href={`/${locale}/learner/learning-path`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold bg-white hover:bg-slate-50 border-slate-300 text-slate-800 flex items-center justify-center gap-1 shadow-2xs"
                >
                  <span>{phase.ctaLabel}</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
