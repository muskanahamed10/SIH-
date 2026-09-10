"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, Info } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProgressProjectionChartProps {
  progressData: {
    stage: string;
    score: number;
    label: string;
    status: "completed" | "sample";
  }[];
}

export function ProgressProjectionChart({
  progressData,
}: ProgressProjectionChartProps) {
  const t = useTranslations("assessmentResults.progress");

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-900" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold">
            Baseline: 42%
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-900 border-blue-300 font-semibold">
            Target: 80%
          </Badge>
        </div>
      </div>

      {/* Recharts LineChart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData} margin={{ top: 15, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#475569" }}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Competency Level"]}
              labelFormatter={(label) => `Milestone: ${label}`}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            />
            <ReferenceLine
              y={80}
              stroke="#0b2545"
              strokeDasharray="4 4"
              label={{
                value: "Role Requirement (80%)",
                fill: "#0b2545",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5, fill: "#0B2545", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Disclaimers & Disclosures */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          {t("sampleDisclaimer")}
        </p>
      </div>
    </Card>
  );
}
