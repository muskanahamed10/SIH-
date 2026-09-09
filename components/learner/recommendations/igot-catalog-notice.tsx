"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Info, ShieldCheck, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function IgotCatalogNotice() {
  const t = useTranslations("learningRecommendations.catalogNotice");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      role="region"
      aria-label="iGOT Catalog Information"
      className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 shadow-xs space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {t("title")}
              </h2>
              <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-semibold text-[10px] hover:bg-amber-100">
                {t("demoBadge")}
              </Badge>
              <Badge variant="outline" className="bg-white/80 text-slate-700 border-slate-300 text-[10px] font-medium">
                {t("apiReadyBadge")}
              </Badge>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              {t("description")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="text-xs font-bold text-[#0B2545] hover:text-[#134074] underline underline-offset-4 self-start sm:self-center shrink-0"
        >
          {isOpen ? t("hideArchitecture") : t("viewArchitecture")}
        </button>
      </div>

      {isOpen && (
        <div className="pt-3 border-t border-amber-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 animate-in fade-in-50">
          <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-amber-100">
            <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900">{t("prototypeLayer")}</span>
              <p className="text-slate-600 leading-relaxed">
                {t("prototypeLayerDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-amber-100">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900">{t("productionCutover")}</span>
              <p className="text-slate-600 leading-relaxed">
                {t("productionCutoverDesc")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
