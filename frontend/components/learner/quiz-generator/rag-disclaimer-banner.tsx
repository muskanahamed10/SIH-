"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Cpu } from "lucide-react";

export function RagDisclaimerBanner() {
  const t = useTranslations("quizGenerator.disclaimer");

  return (
    <div
      role="region"
      aria-label="AI and RAG Architecture Information"
      className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 text-slate-800 text-xs shadow-xs space-y-2"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-100 text-blue-900 shrink-0 mt-0.5">
          <Cpu className="w-4 h-4 text-blue-800" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-blue-950 text-xs sm:text-sm">
              {t("title")}
            </span>
            <span className="bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded text-[10px] font-bold">
              {t("badge")}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {t("description")}
          </p>
        </div>
      </div>
    </div>
  );
}
