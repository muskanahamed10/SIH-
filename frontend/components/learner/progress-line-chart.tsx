"use client";

import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressHistoryPoint } from "@/types";

interface ProgressLineChartProps {
  data: ProgressHistoryPoint[];
}

export function ProgressLineChart({ data }: ProgressLineChartProps) {
  const t = useTranslations("dashboard.progress");

  return (
    <Card className="p-6 shadow-xs border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-900" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-900" aria-hidden="true" />
            <span>{t("demonstratedScore")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden="true" />
            <span>Target (80%)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="assessment"
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              ticks={[0, 25, 50, 75, 100]}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ProgressHistoryPoint;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 border border-slate-800">
                      <p className="font-bold text-amber-400">{item.assessment}</p>
                      <p className="text-[11px] text-slate-400">{item.date}</p>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800">
                        <span className="text-slate-300">Demonstrated:</span>
                        <strong className="text-white font-bold">{item.score}%</strong>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">Target Benchmark:</span>
                        <strong className="text-amber-400 font-bold">{item.target}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={80} stroke="#d97706" strokeDasharray="4 4" label={{ value: "Target Benchmark", fill: "#d97706", fontSize: 10, position: "insideTopRight" }} />
            <Line
              type="monotone"
              dataKey="score"
              name={t("demonstratedScore")}
              stroke="#0b2545"
              strokeWidth={3}
              dot={{ fill: "#0b2545", r: 4, stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#d97706", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-slate-400 italic flex items-center gap-1.5 pt-1">
        <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
        <span>{t("mockDisclaimer")}</span>
      </p>
    </Card>
  );
}
