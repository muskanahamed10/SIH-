"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Download,
  Calendar,
  Info,
  CheckCircle,
  Building2,
  Users2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DepartmentHeadHeader() {
  const t = useTranslations("admin.dashboard.header");
  const [exported, setExported] = React.useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 4000);
  };

  return (
    <section
      role="region"
      aria-label="Department Head Overview Header"
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
    >
      {/* Top Credentials Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-[#0B2545] text-white hover:bg-[#134074] text-xs font-bold px-3 py-1 flex items-center gap-1.5 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-blue-200" />
            <span>{t("departmentHeadBadge")}</span>
          </Badge>

          <Badge variant="outline" className="text-slate-700 border-slate-300 bg-slate-50 text-xs font-semibold px-2.5 py-1">
            {t("divisionBadge")}
          </Badge>

          <Badge className="bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-medium px-2.5 py-1 flex items-center gap-1">
            <Users2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t("cadreOversight")}</span>
          </Badge>
        </div>

        {/* Demo Data Notice */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-semibold">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{t("demoDataNotice")}</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
              <ShieldCheck className="w-6 h-6 text-blue-900" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("title")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Executive Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs font-semibold gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            {exported ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-500" />
                <span>{t("exportCadreReport")}</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold gap-1.5 shadow-xs"
          >
            <Calendar className="w-4 h-4 text-blue-200" />
            <span>{t("scheduleDiagnostic")}</span>
          </Button>
        </div>
      </div>

      {/* Toast Feedback on Export */}
      {exported && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t("exportToast")}</span>
        </div>
      )}
    </section>
  );
}
