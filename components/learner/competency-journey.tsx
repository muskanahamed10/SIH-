"use client";

import { useTranslations } from "next-intl";
import {
  UserCheck,
  ListChecks,
  FileCheck2,
  Cpu,
  Radar,
  Sparkles,
  BookOpen,
  RotateCcw,
  TrendingUp,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function CompetencyJourney() {
  const t = useTranslations("myCompetency");

  const stages = [
    {
      id: "role",
      icon: UserCheck,
      step: "01",
      title: t("stages.role.title"),
      description: t("stages.role.description"),
      color: "bg-blue-50 text-blue-900 border-blue-200",
      badge: "Cadre Baseline",
    },
    {
      id: "required",
      icon: ListChecks,
      step: "02",
      title: t("stages.required.title"),
      description: t("stages.required.description"),
      color: "bg-slate-50 text-slate-900 border-slate-200",
      badge: "Standardized",
    },
    {
      id: "assessment",
      icon: FileCheck2,
      step: "03",
      title: t("stages.assessment.title"),
      description: t("stages.assessment.description"),
      color: "bg-amber-50 text-amber-900 border-amber-200",
      badge: "Diagnostic",
    },
    {
      id: "gapAnalysis",
      icon: Cpu,
      step: "04",
      title: t("stages.gapAnalysis.title"),
      description: t("stages.gapAnalysis.description"),
      color: "bg-rose-50 text-rose-900 border-rose-200",
      badge: "AI Engine",
    },
    {
      id: "gapRadar",
      icon: Radar,
      step: "05",
      title: t("stages.gapRadar.title"),
      description: t("stages.gapRadar.description"),
      color: "bg-indigo-50 text-indigo-900 border-indigo-200",
      badge: "Visualization",
    },
    {
      id: "recommendations",
      icon: Sparkles,
      step: "06",
      title: t("stages.recommendations.title"),
      description: t("stages.recommendations.description"),
      color: "bg-purple-50 text-purple-900 border-purple-200",
      badge: "Personalized",
    },
    {
      id: "learning",
      icon: BookOpen,
      step: "07",
      title: t("stages.learning.title"),
      description: t("stages.learning.description"),
      color: "bg-emerald-50 text-emerald-900 border-emerald-200",
      badge: "iGOT Catalog",
    },
    {
      id: "reassessment",
      icon: RotateCcw,
      step: "08",
      title: t("stages.reassessment.title"),
      description: t("stages.reassessment.description"),
      color: "bg-cyan-50 text-cyan-900 border-cyan-200",
      badge: "Evaluation",
    },
    {
      id: "improvement",
      icon: TrendingUp,
      step: "09",
      title: t("stages.improvement.title"),
      description: t("stages.improvement.description"),
      color: "bg-teal-50 text-teal-900 border-teal-200",
      badge: "Impact",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t("journeyTitle")}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t("journeySubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <Card
              key={stage.id}
              className={`p-4 rounded-xl border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${stage.color}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest">
                    Step {stage.step}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-current/20 shadow-2xs">
                    {stage.badge}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/90 shadow-xs border border-current/10 shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight tracking-tight">
                      {stage.title}
                    </h3>
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </div>

              {idx < stages.length - 1 && (
                <div className="pt-3 flex justify-end opacity-40">
                  <ArrowRight className="w-4 h-4 hidden md:block" aria-hidden="true" />
                  <ArrowDown className="w-4 h-4 md:hidden" aria-hidden="true" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
