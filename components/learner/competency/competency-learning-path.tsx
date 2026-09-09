"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Route, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompetencyLearningPathProps {
  now: string;
  next: string;
  later: string;
}

export function CompetencyLearningPath({ now, next, later }: CompetencyLearningPathProps) {
  const t = useTranslations("myCompetency.learningPathSection");
  const locale = useLocale();

  const stages = [
    {
      id: "now",
      phase: t("now"),
      title: now,
      statusBadge: "Active Priority",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      cardColor: "border-amber-200 bg-amber-50/40",
      step: "01",
    },
    {
      id: "next",
      phase: t("next"),
      title: next,
      statusBadge: "Queued",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-200",
      cardColor: "border-slate-200 bg-white",
      step: "02",
    },
    {
      id: "later",
      phase: t("later"),
      title: later,
      statusBadge: "Planned",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      cardColor: "border-slate-200 bg-white",
      step: "03",
    },
  ];

  return (
    <Card className="p-6 shadow-xs border-slate-200 space-y-4">
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Route className="w-5 h-5 text-blue-800" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        <Link href={`/${locale}/learner/learning-path`}>
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-900 hover:text-blue-950 hover:bg-blue-50 flex items-center gap-1.5 self-start sm:self-auto">
            <span>{t("viewFull")}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((st) => (
          <div
            key={st.id}
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${st.cardColor}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  {st.phase}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeColor}`}>
                  {st.statusBadge}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">
                {st.title}
              </h3>

              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Sequential Cadre Milestone</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Step {st.step}</span>
              <CheckCircle2 className="w-4 h-4 text-slate-300" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
