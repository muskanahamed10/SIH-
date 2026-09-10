"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriorityCompetencyGapItem } from "@/types";

interface PriorityGapsProps {
  gaps: PriorityCompetencyGapItem[];
}

export function PriorityGaps({ gaps }: PriorityGapsProps) {
  const t = useTranslations("dashboard.priorityGaps");
  const dashboardT = useTranslations("dashboard");
  const locale = useLocale();

  const getBadgeStyle = (priority: "critical" | "high" | "moderate") => {
    switch (priority) {
      case "critical":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "high":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "moderate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  if (!gaps || gaps.length === 0) {
    return (
      <Card className="p-6 shadow-xs border-slate-200 text-center space-y-3">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" aria-hidden="true" />
        <h3 className="font-bold text-base text-slate-900">{t("emptyTitle")}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{t("emptyDesc")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-xs border-slate-200 flex flex-col justify-between">
      <div>
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("subtitle")}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {gaps.length} {t("title")}
          </span>
        </div>

        <div className="space-y-3.5 mt-4">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 leading-tight">
                    {gap.competencyName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t("current")} <strong className="text-slate-800 font-semibold">{gap.currentScore}%</strong>
                    {" • "}
                    {t("required")} <strong className="text-slate-800 font-semibold">{gap.requiredScore}%</strong>
                    {" • "}
                    <span className="font-bold text-rose-700">
                      {t("gap")} {gap.gapPoints} {t("points")}
                    </span>
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shrink-0 ${getBadgeStyle(gap.priorityLevel)}`}
                >
                  {gap.priorityLevel}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded border border-slate-100 leading-relaxed">
                {gap.explanation}
              </p>

              <div className="pt-1 flex justify-end">
                <Link href={`/${locale}/learner/recommendations?competencyId=${gap.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 text-blue-900 hover:text-blue-950 hover:bg-blue-50 border-blue-200 font-semibold flex items-center gap-1.5"
                  >
                    <span>{t("viewLearning")}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4">
        <Link href={`/${locale}/learner/competency`}>
          <Button
            variant="ghost"
            className="w-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-between"
          >
            <span>{dashboardT("viewAllGapsCta")}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
