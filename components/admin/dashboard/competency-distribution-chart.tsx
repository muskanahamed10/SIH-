"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockCompetencyDistributionDomains,
  mockProficiencyLevelDistribution
} from "@/mocks/data/admin";

export function CompetencyDistributionChart() {
  const t = useTranslations("admin.dashboard.competencyDistribution");
  const [activeTab, setActiveTab] = React.useState<"domains" | "levels">("domains");

  const domainData = mockCompetencyDistributionDomains.map((d) => ({
    name: d.domain,
    demonstrated: d.demonstrated,
    benchmark: d.benchmark,
    deficit: d.deficit,
    officers: d.officersCount
  }));

  const levelData = mockProficiencyLevelDistribution.map((l) => ({
    name: l.level,
    percentage: l.percentage,
    officers: l.officersCount,
    description: l.description
  }));

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
            <Badge variant="outline" className="text-[10px] font-semibold text-slate-500">
              Recharts Visualizer
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </CardDescription>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("domains")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === "domains"
                ? "bg-[#0B2545] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("tabDomains")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("levels")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === "levels"
                ? "bg-[#0B2545] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("tabLevels")}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {activeTab === "domains" ? (
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={domainData}
                margin={{ top: 15, right: 20, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  formatter={(value: number | string, name: string) => [
                    `${value}%`,
                    name === "demonstrated" ? t("demonstratedScore") : t("targetBenchmark")
                  ]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-slate-700">
                      {value === "demonstrated" ? t("demonstratedScore") : t("targetBenchmark")}
                    </span>
                  )}
                />
                <Bar
                  dataKey="demonstrated"
                  name="demonstrated"
                  fill="#0B2545"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="benchmark"
                  name="benchmark"
                  fill="#94a3b8"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={levelData}
                layout="vertical"
                margin={{ top: 15, right: 30, left: 40, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 50]}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#1e293b", fontSize: 11, fontWeight: 600 }}
                  width={130}
                />
                <Tooltip
                  formatter={(val: number | string) => [`${val}%`, t("percentageOfCadre")]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px"
                  }}
                />
                <Bar
                  dataKey="percentage"
                  fill="#134074"
                  radius={[0, 6, 6, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend / Insight strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#0B2545]" />
              <span className="font-semibold text-slate-700">{t("demonstratedScore")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#94a3b8]" />
              <span className="font-semibold text-slate-700">{t("targetBenchmark")}</span>
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            Critical Shortfall: Statistical Computing (-32% deficit)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
