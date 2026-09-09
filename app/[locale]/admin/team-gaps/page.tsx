"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TeamCompetencyHeatmap } from "@/components/admin/team-competency-heatmap";

export default function TeamCompetencyHeatmapPage() {
  const locale = useLocale();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-14">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/${locale}/admin/dashboard`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Department Head Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-semibold text-slate-700 bg-white">
            MoSPI Cadre Capacity Diagnostic Matrix
          </Badge>
          <Badge className="bg-[#0B2545] text-white text-[11px] font-bold">
            ISS & SSS Directorate Oversight
          </Badge>
        </div>
      </div>

      {/* Main Heatmap Matrix Component */}
      <TeamCompetencyHeatmap />
    </div>
  );
}
