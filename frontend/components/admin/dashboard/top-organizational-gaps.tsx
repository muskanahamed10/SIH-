"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  BookOpen,
  TrendingDown
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTopOrganizationalGaps } from "@/mocks/data/admin";

export function TopOrganizationalGaps() {
  const t = useTranslations("admin.dashboard.topOrganizationalGaps");
  const [dispatchedDirectives, setDispatchedDirectives] = React.useState<Record<string, boolean>>({});

  const gaps = mockTopOrganizationalGaps;

  const handleDispatch = (gapId: string) => {
    setDispatchedDirectives((prev) => ({ ...prev, [gapId]: true }));
    setTimeout(() => {
      setDispatchedDirectives((prev) => ({ ...prev, [gapId]: false }));
    }, 4000);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Badge className="bg-rose-100 text-rose-900 border-rose-300 font-extrabold text-[10px]">{t("priorityCritical")}</Badge>;
      case "High":
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-[10px]">{t("priorityHigh")}</Badge>;
      case "Moderate":
      default:
        return <Badge className="bg-blue-50 text-blue-900 border-blue-200 font-semibold text-[10px]">{t("priorityModerate")}</Badge>;
    }
  };

  return (
    <Card
      role="region"
      aria-label={t("title")}
      className="border-slate-200 shadow-xs bg-white rounded-2xl"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-extrabold text-slate-900">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              {t("subtitle")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        {gaps.map((gap) => {
          const isDispatched = dispatchedDirectives[gap.id];

          return (
            <div
              key={gap.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
            >
              {/* Header: Rank, Name, Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    #{gap.rank}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {gap.competencyName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{gap.category}</span>
                      <span>•</span>
                      <span className="font-semibold text-rose-700">
                        {gap.affectedOfficers.toLocaleString()} {t("affectedOfficers")} ({gap.affectedPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge variant="outline" className="text-rose-700 border-rose-200 bg-rose-50 text-xs font-bold gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-{gap.averageDeficit} {t("levelsDeficitSuffix")}</span>
                  </Badge>
                  {getPriorityBadge(gap.priority)}
                </div>
              </div>

              {/* Remedial Course Recommendation Strip */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {t("recommendedCourse")}
                    </span>
                    <span className="font-bold text-slate-900">
                      {gap.recommendedCourse.title}
                    </span>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      Provider: {gap.recommendedCourse.provider} • Duration: {gap.recommendedCourse.duration}
                    </span>
                  </div>
                </div>

                {/* Dispatch Training Directive Action */}
                <Button
                  size="sm"
                  variant={isDispatched ? "outline" : "default"}
                  onClick={() => handleDispatch(gap.id)}
                  className={`text-xs font-bold gap-1.5 shrink-0 self-start md:self-auto ${
                    isDispatched
                      ? "border-emerald-300 text-emerald-800 bg-emerald-50"
                      : "bg-[#0B2545] hover:bg-[#134074] text-white"
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("directiveDispatched")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t("dispatchDirective")}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Remedial Action Text */}
              <div className="text-[11px] text-slate-600 leading-relaxed bg-slate-50/40 p-2 rounded-md border border-slate-100">
                <span className="font-bold text-slate-700">{t("actionDirective")}: </span>
                <span>{gap.remedialAction}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
