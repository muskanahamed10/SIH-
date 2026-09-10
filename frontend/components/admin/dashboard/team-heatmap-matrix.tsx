"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockHeatmapDivisions } from "@/mocks/data/admin";

export function TeamHeatmapMatrix() {
  const t = useTranslations("admin.dashboard.teamHeatmap");
  const [filterDivision, setFilterDivision] = React.useState<string>("all");

  const divisions = mockHeatmapDivisions;
  const filteredDivisions =
    filterDivision === "all"
      ? divisions
      : divisions.filter((d) => d.divisionCode === filterDivision);

  const getScoreBadgeClass = (score: number) => {
    if (score >= 85) return "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold";
    if (score >= 80) return "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
    if (score >= 65) return "bg-amber-50 text-amber-900 border-amber-200 font-semibold";
    return "bg-rose-100 text-rose-900 border-rose-300 font-extrabold";
  };

  return (
    <Card
      role="region"
      aria-label={t("title")}
      className="border-slate-200 shadow-xs bg-white rounded-2xl"
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg font-extrabold text-slate-900">
              {t("title")}
            </CardTitle>
            <Badge className="bg-[#0B2545] text-white text-[10px] font-bold">
              5 Directorates
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </CardDescription>
        </div>

        {/* Division Filter Chips */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setFilterDivision("all")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              filterDivision === "all"
                ? "bg-[#0B2545] text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t("filterAll")}
          </button>
          {divisions.map((d) => (
            <button
              key={d.divisionCode}
              type="button"
              onClick={() => setFilterDivision(d.divisionCode)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                filterDivision === d.divisionCode
                  ? "bg-blue-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {d.shortName}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Responsive Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 font-extrabold">{t("division")}</th>
                <th className="p-3 text-center">{t("officers")}</th>
                <th className="p-3 text-center">{t("methods")}</th>
                <th className="p-3 text-center">{t("sampling")}</th>
                <th className="p-3 text-center">{t("dataManagement")}</th>
                <th className="p-3 text-center">{t("computing")}</th>
                <th className="p-3 text-center">{t("standards")}</th>
                <th className="p-3 text-center">{t("visualization")}</th>
                <th className="p-3 text-center font-extrabold bg-slate-100/80">{t("avgScore")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDivisions.map((dept) => (
                <tr key={dept.divisionCode} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{dept.divisionName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({dept.shortName})</span>
                  </td>
                  <td className="p-3 text-center font-semibold text-slate-600">
                    {dept.officerCount}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs ${getScoreBadgeClass(dept.scores.methods)}`}>
                      {dept.scores.methods}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs ${getScoreBadgeClass(dept.scores.sampling)}`}>
                      {dept.scores.sampling}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs ${getScoreBadgeClass(dept.scores.dataManagement)}`}>
                      {dept.scores.dataManagement}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs ${getScoreBadgeClass(dept.scores.computing)}`}>
                      {dept.scores.computing}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs ${getScoreBadgeClass(dept.scores.standards)}`}>
                      {dept.scores.standards}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs ${getScoreBadgeClass(dept.scores.visualization)}`}>
                      {dept.scores.visualization}%
                    </span>
                  </td>
                  <td className="p-3 text-center font-extrabold text-sm text-slate-900 bg-slate-50/80">
                    {dept.averageScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Thresholds:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span className="text-slate-600">{t("legendExceeds")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-400" />
              <span className="text-slate-600">{t("legendMeets")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-400" />
              <span className="text-slate-600">{t("legendModerate")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500" />
              <span className="text-slate-600 font-bold">{t("legendCritical")}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            National Statistical Cadre Capacity Diagnostic Matrix (2026)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
