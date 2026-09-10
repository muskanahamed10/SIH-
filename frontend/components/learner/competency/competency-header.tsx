"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Brain, Award, Building2, UserCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompetencyHeaderProps {
  name: string;
  role: string;
  department: string;
  cadre: string;
}

export function CompetencyHeader({
  name,
  role,
  department,
  cadre,
}: CompetencyHeaderProps) {
  const t = useTranslations("myCompetency");
  const locale = useLocale();

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-6">
      <div className="space-y-2.5 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
          <span>{t("engineBadge")}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t("title")}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Learner & Cadre Metadata Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <UserCircle2 className="w-3.5 h-3.5 text-blue-800" aria-hidden="true" />
            <span>{t("learner")}</span>
            <strong className="text-slate-900">{name}</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <span>{t("role")}</span>
            <strong className="text-slate-900">{role}</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <Building2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{department}</span>
          </div>

          <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-200 text-[10px] font-bold">
            {cadre}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <Link href={`/${locale}/learner/assessment`}>
          <Button className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>{t("startBaselineCta")}</span>
          </Button>
        </Link>

        <Link href={`/${locale}/explore`}>
          <Button variant="outline" className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-4 py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700" aria-hidden="true" />
            <span>{t("exploreLearningCta")}</span>
          </Button>
        </Link>
      </div>
    </section>
  );
}
