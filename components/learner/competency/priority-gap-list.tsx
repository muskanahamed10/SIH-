"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PriorityGapItem {
  id: string;
  rank: number;
  competencyName: string;
  requiredScore: number;
  currentScore: number;
  gapPoints: number;
  priority: "High" | "Medium" | "Low";
  aiInsight: string;
  recommendedResource: string;
}

interface PriorityGapListProps {
  gaps: PriorityGapItem[];
}

export function PriorityGapList({ gaps }: PriorityGapListProps) {
  const t = useTranslations("myCompetency.priorityGapsSection");
  const priorityT = useTranslations("common.priority");
  const locale = useLocale();

  const getBadgeStyle = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <Card className="p-6 shadow-xs border-slate-200 flex flex-col justify-between h-full">
      <div>
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>{t("title")}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("subtitle")}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {t("deficitsCount", { count: gaps.length })}
          </span>
        </div>

        <div className="space-y-3.5 mt-4">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {gap.rank}. {gap.competencyName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                    <span>
                      {t("required")} <strong className="text-slate-800 font-bold">{gap.requiredScore}%</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {t("current")} <strong className="text-slate-800 font-bold">{gap.currentScore}%</strong>
                    </span>
                    <span>•</span>
                    <span className="font-bold text-rose-700">
                      {t("gap")} {gap.gapPoints} points
                    </span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shrink-0 ${getBadgeStyle(
                    gap.priority
                  )}`}
                >
                  {priorityT(gap.priority.toLowerCase() as "high" | "medium" | "low")}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50/90 p-2.5 rounded border border-slate-100 leading-relaxed italic">
                “{gap.aiInsight}”
              </p>

              <div className="pt-1 flex justify-end">
                <Link
                  href={`/${locale}/learner/recommendations?competencyId=${gap.id}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 text-blue-950 hover:bg-blue-50 border-blue-200 font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{t("viewRecommendedLearning")}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
