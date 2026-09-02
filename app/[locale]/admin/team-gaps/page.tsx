"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useTeamCompetencies } from "@/hooks/use-queries";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function TeamCompetencyHeatmapPage() {
  const t = useTranslations("common");
  const { data: teamData, isLoading } = useTeamCompetencies();
  const [filterSearch, setFilterSearch] = React.useState("");

  if (isLoading || !teamData) {
    return <div className="p-8 text-center text-sm text-slate-500">{t("loading")}</div>;
  }

  const filtered = teamData.filter(
    (m) =>
      m.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
      m.department.toLowerCase().includes(filterSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const competencyHeaders = teamData[0]?.competencies.map((c) => ({
    id: c.competencyId,
    name: c.competencyName,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Departmental Competency Heatmap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual matrix mapping individual officers against required competency levels across divisions.
          </p>
        </div>
      </div>

      {/* Legend & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700">Legend:</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-medium">
            Critical Gap (&gt;= 2 levels)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-medium">
            Moderate Gap (1 level)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium">
            Meets Requirement
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-medium">
            Exceeds Benchmark
          </span>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search officer or department..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
      </div>

      {/* Heatmap Table */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="p-3 sticky left-0 bg-slate-100 z-10 min-w-[200px]">Officer & Cadre</th>
                <th className="p-3 min-w-[150px]">Department</th>
                {competencyHeaders.map((h) => (
                  <th key={h.id} className="p-3 text-center min-w-[120px]">
                    {h.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((member) => (
                <tr key={member.userId} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-semibold text-slate-900 sticky left-0 bg-white z-10 whitespace-nowrap">
                    <div>{member.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{member.role}</div>
                  </td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">{member.department}</td>
                  {member.competencies.map((comp) => {
                    let cellBg = "bg-slate-100 text-slate-700";
                    if (comp.status === "critical") cellBg = "bg-rose-100 text-rose-900 border-rose-200";
                    else if (comp.status === "moderate") cellBg = "bg-amber-100 text-amber-900 border-amber-200";
                    else if (comp.status === "meets") cellBg = "bg-emerald-100 text-emerald-900 border-emerald-200";
                    else if (comp.status === "exceeds") cellBg = "bg-blue-100 text-blue-900 border-blue-200";

                    return (
                      <td key={comp.competencyId} className="p-2 text-center">
                        <div
                          className={`py-1 px-2 rounded border font-semibold inline-block text-[11px] ${cellBg}`}
                          title={`Current: Level ${comp.currentLevel}, Required: Level ${comp.requiredLevel}`}
                        >
                          L{comp.currentLevel} / L{comp.requiredLevel}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
