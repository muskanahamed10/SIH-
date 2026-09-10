"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  ComposedChart,
  Bar,
  Line,
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
  mockAssessmentPerformanceTrends,
  mockScoreTierDistribution
} from "@/mocks/data/admin";

export function AssessmentPerformanceChart() {
  const t = useTranslations("admin.dashboard.assessmentPerformance");

  const trendData = mockAssessmentPerformanceTrends.map((p) => ({
    month: p.month,
    volume: p.assessmentsCount,
    score: p.averageScore,
    passRate: p.passRate
  }));

  const tiers = mockScoreTierDistribution;

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
            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
              88.4% Pass Rate
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </CardDescription>
        </div>

        <span className="text-[11px] text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          6-Month Progression (Apr–Sep 2026)
        </span>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Composed Chart: Volume (Bar) + Avg Score (Line) */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendData}
              margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fill: "#64748b", fontSize: 11 }}
                domain={[0, 1200]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[60, 85]}
                tick={{ fill: "#15803d", fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                formatter={(val: number | string, name: string) => [
                  name === "volume" ? `${val} tests` : `${val}%`,
                  name === "volume" ? t("assessmentsVolume") : t("averageScore")
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px"
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
                formatter={(value) => (
                  <span className="text-xs font-semibold text-slate-700">
                    {value === "volume" ? t("assessmentsVolume") : t("averageScore")}
                  </span>
                )}
              />
              <Bar
                yAxisId="left"
                dataKey="volume"
                name="volume"
                fill="#cbd5e1"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="score"
                name="score"
                stroke="#15803d"
                strokeWidth={3}
                dot={{ r: 4, fill: "#15803d", strokeWidth: 2, stroke: "#ffffff" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Score Tier Distribution Row */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{t("scoreDistribution")}</span>
            <span className="text-[11px] text-slate-400">Total 4,120 Evaluations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tiers.map((tier) => (
              <div
                key={tier.tier}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">{tier.tier}</span>
                  <span className="text-xs font-extrabold" style={{ color: tier.color }}>
                    {tier.percentage}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">{tier.range}</div>
                <div className="text-[11px] font-semibold text-slate-900">
                  {tier.count.toLocaleString()} tests
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
