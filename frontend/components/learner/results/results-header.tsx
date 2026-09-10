"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Calendar, FileText, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultsHeaderProps {
  role: string;
  cadre: string;
  department: string;
  title: string;
  status: string;
  completedDate: string;
}

export function ResultsHeader({
  role,
  cadre,
  department,
  title,
  completedDate,
}: ResultsHeaderProps) {
  const t = useTranslations("assessmentResults.header");

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Compact Official Assessment Summary */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
          <UserCircle className="w-4 h-4 text-blue-800" aria-hidden="true" />
          <span className="text-slate-500">{t("role")}</span>
          <strong className="text-slate-900">{role}</strong>
          <span className="text-slate-400">({cadre} • {department})</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
          <FileText className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <span className="text-slate-500">{t("assessment")}</span>
          <strong className="text-slate-900">{title}</strong>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-900 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span>{t("status")}</span>
          <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0">
            {t("statusCompleted")}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
          <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span className="text-slate-500">{t("date")}</span>
          <strong className="text-slate-800">{completedDate}</strong>
        </div>
      </div>
    </Card>
  );
}
