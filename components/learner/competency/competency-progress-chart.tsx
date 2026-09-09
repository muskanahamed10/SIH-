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
} from "recharts";
import { TrendingUp, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProgressPoint {
  stage: string;
  score: number;
}

interface CompetencyProgressChartProps {
  data: ProgressPoint[];
}

export function CompetencyProgressChart({ data }: CompetencyProgressChartProps) {
  const t = useTranslations("myCompetency.progressSection");

  return (
    <Card className="p-6 shadow-xs border-slate-200 space-y-4">
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-700" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          +26% Net Improvement
        </span>
      </div>

      <div className="w-full h-64 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="stage"
              tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#475569", fontSize: 11 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              unit="%"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1 border border-slate-800">
                      <p className="font-bold text-amber-400">{label}</p>
                      <p className="text-white">
                        {t("demonstrated")}:{" "}
                        <strong className="text-emerald-400 font-bold">{payload[0].value}%</strong>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              name={t("demonstrated")}
              stroke="#0b2545"
              strokeWidth={3}
              dot={{ fill: "#d97706", r: 5, strokeWidth: 2, stroke: "#ffffff" }}
              activeDot={{ r: 7, fill: "#0b2545", stroke: "#d97706", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-slate-500 italic flex items-center gap-1.5 pt-2 border-t border-slate-100">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
        <span>{t("disclaimer")}</span>
      </p>
    </Card>
  );
}
