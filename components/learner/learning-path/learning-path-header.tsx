"use client";

import { useTranslations } from "next-intl";
import { UserCircle, Building2, Milestone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LearningPathHeaderProps {
  learnerName: string;
  role: string;
  cadre: string;
  department: string;
}

export function LearningPathHeader({
  learnerName,
  role,
  cadre,
  department,
}: LearningPathHeaderProps) {
  const t = useTranslations("personalizedLearningPath.header");

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("title")}
            </h1>
            <Badge className="bg-[#0B2545] text-white font-bold text-[10px] gap-1 px-2.5">
              <Milestone className="w-3 h-3 text-amber-400" />
              <span>AI Tailored Pathway</span>
            </Badge>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Compact Officer Metadata Block */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-700">
            <UserCircle className="w-4 h-4 text-blue-800" aria-hidden="true" />
            <span className="text-slate-500">{t("learner")}</span>
            <strong className="text-slate-900">{learnerName}</strong>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-700">
            <span className="text-slate-500">{t("role")}</span>
            <strong className="text-slate-900">{role}</strong>
            <span className="text-slate-400">({cadre})</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-700">
            <Building2 className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span className="text-slate-500">{t("department")}</span>
            <strong className="text-slate-900">{department}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
}
