"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Award, AlertTriangle, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KpiCardsProps {
  overallCompetency: number;
  priorityGapsCount: number;
  learningProgress: number;
  completedCoursesCount: number;
}

export function KpiCards({
  overallCompetency,
  priorityGapsCount,
  learningProgress,
  completedCoursesCount,
}: KpiCardsProps) {
  const t = useTranslations("dashboard.kpis");
  const locale = useLocale();

  const cards = [
    {
      id: "kpi-overall",
      title: t("overall"),
      value: `${overallCompetency}%`,
      subtext: t("overallDesc"),
      href: `/${locale}/learner/competency`,
      icon: Award,
      iconColor: "text-blue-700 bg-blue-50 border-blue-200",
      valueColor: "text-slate-900",
    },
    {
      id: "kpi-gaps",
      title: t("gaps"),
      value: `${priorityGapsCount}`,
      subtext: t("gapsDesc"),
      href: `/${locale}/learner/competency`,
      icon: AlertTriangle,
      iconColor: "text-amber-700 bg-amber-50 border-amber-200",
      valueColor: "text-amber-700",
    },
    {
      id: "kpi-progress",
      title: t("progress"),
      value: `${learningProgress}%`,
      subtext: t("progressDesc"),
      href: `/${locale}/learning`,
      icon: TrendingUp,
      iconColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      valueColor: "text-emerald-700",
    },
    {
      id: "kpi-completed",
      title: t("completed"),
      value: `${completedCoursesCount} Courses`,
      subtext: t("completedDesc"),
      href: `/${locale}/learning`,
      icon: CheckCircle2,
      iconColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
      valueColor: "text-indigo-900",
    },
  ];

  return (
    <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.id} href={card.href} className="group block focus-visible:outline-none">
            <Card className="p-5 shadow-xs border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-blue-900 transition-colors">
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
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-900/80 group-hover:text-blue-900">
                <span>View details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          </Link>
        );
      })}
    </section>
  );
}
