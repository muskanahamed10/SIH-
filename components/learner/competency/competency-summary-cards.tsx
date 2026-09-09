"use client";

import { useTranslations } from "next-intl";
import { Award, ListChecks, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CompetencySummaryCardsProps {
  overallCompetency: number;
  requiredCompetenciesCount: number;
  priorityGapsCount: number;
  assessmentStatus: string;
}

export function CompetencySummaryCards({
  overallCompetency,
  requiredCompetenciesCount,
  priorityGapsCount,
  assessmentStatus,
}: CompetencySummaryCardsProps) {
  const t = useTranslations("myCompetency.cards");

  const cards = [
    {
      id: "card-overall",
      title: t("overall"),
      value: `${overallCompetency}%`,
      subtext: t("overallSub"),
      icon: Award,
      iconColor: "text-blue-700 bg-blue-50 border-blue-200",
      valueColor: "text-slate-900",
    },
    {
      id: "card-required",
      title: t("required"),
      value: `${requiredCompetenciesCount}`,
      subtext: t("requiredSub"),
      icon: ListChecks,
      iconColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
      valueColor: "text-indigo-900",
    },
    {
      id: "card-gaps",
      title: t("gaps"),
      value: `${priorityGapsCount}`,
      subtext: t("gapsSub"),
      icon: AlertTriangle,
      iconColor: "text-amber-700 bg-amber-50 border-amber-200",
      valueColor: "text-amber-700",
    },
    {
      id: "card-status",
      title: t("status"),
      value: assessmentStatus,
      subtext: t("statusSub"),
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      valueColor: "text-emerald-700",
    },
  ];

  return (
    <section aria-label="Competency Summary Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.id} className="p-5 shadow-xs border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <p className={`text-2xl sm:text-3xl font-bold mt-1 tracking-tight ${card.valueColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg border shrink-0 ${card.iconColor}`} aria-hidden="true">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2.5 font-medium truncate">
              {card.subtext}
            </p>
          </Card>
        );
      })}
    </section>
  );
}
