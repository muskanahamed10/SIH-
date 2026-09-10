"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, UserCheck, Sparkles, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ResponsibleAiHitlBanner() {
  const t = useTranslations("admin.mcqReview.hitlBanner");

  return (
    <div
      role="region"
      aria-label="Responsible AI Human-in-the-Loop Governance"
      className="p-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-blue-50/80 shadow-xs space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#0B2545] text-white shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {t("title")}
              </h2>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                Human-in-the-Loop (HITL) Protocol
              </Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              {t("description")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 shrink-0 shadow-2xs">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>SME Editorial Authority: Dr. K. S. Murthy</span>
        </div>
      </div>

      <div className="pt-2 border-t border-indigo-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Ungoverned AI Deployment</span>
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>RAG Grounding in Official MoSPI Manuals</span>
        </span>
        <span className="flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>100% SME Review Required</span>
        </span>
      </div>
    </div>
  );
}
