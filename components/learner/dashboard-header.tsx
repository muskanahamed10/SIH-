"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  name: string;
  role: string;
  cadre: string;
  department: string;
  lastAssessmentDate?: string;
}

export function DashboardHeader({
  name,
  role,
  cadre,
  department,
  lastAssessmentDate,
}: DashboardHeaderProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning");
    if (hour < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {name}
          </h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-200 font-semibold px-2.5 py-0.5">
            {cadre}
          </Badge>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-700">
          {role} <span className="text-slate-400">•</span> <span className="text-slate-500">{department}</span>
        </p>

        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          {t("contextMessage")}
        </p>

        {lastAssessmentDate && (
          <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
            <span>{t("lastAssessmentDate")}</span>
            <strong className="text-slate-800 font-semibold">{lastAssessmentDate}</strong>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link href={`/${locale}/learner/assessment`}>
          <Button className="bg-[#0B2545] hover:bg-[#134074] text-white shadow-xs px-4 py-2 text-xs font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>{t("startAssessmentCta")}</span>
          </Button>
        </Link>
      </div>
    </section>
  );
}
