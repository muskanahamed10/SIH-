"use client";

import { useTranslations } from "next-intl";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { CompetencyRadarItem } from "@/types";

export interface GapRadarProps {
  data: CompetencyRadarItem[];
  title?: string;
  subtitle?: string;
}

export function GapRadar({ data, title, subtitle }: GapRadarProps) {
  const t = useTranslations("myCompetency.radar");

  return (
    <Card className="p-6 shadow-xs border-slate-200 flex flex-col justify-between h-full">
      <div className="pb-3 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {title || t("title")}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {subtitle || t("subtitle")}
        </p>
      </div>

      {/* Real Recharts Radar Chart */}
      <div className="w-full h-80 sm:h-96 py-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="competency"
              tick={{ fill: "#0f172a", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              stroke="#cbd5e1"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as CompetencyRadarItem;
                  const isAbove = item.demonstrated >= item.required;
                  const diff = Math.abs(item.required - item.demonstrated);

                  return (
                    <div className="bg-slate-950 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-800">
                      <p className="font-bold text-amber-400 border-b border-slate-800 pb-1">
                        {item.competency}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">{t("required")}:</span>
                        <strong className="text-amber-300 font-bold">{item.required}%</strong>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-300">{t("demonstrated")}:</span>
                        <strong className="text-white font-bold">{item.demonstrated}%</strong>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400">Status:</span>
                        <span className={isAbove ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                          {isAbove ? `Above Requirement (+${diff} pts)` : `Gap: ${diff} points`}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Required Competency Series */}
            <Radar
              name={t("required")}
              dataKey="required"
              stroke="#d97706"
              fill="#d97706"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            {/* Demonstrated Competency Series */}
            <Radar
              name={t("demonstrated")}
              dataKey="demonstrated"
              stroke="#0b2545"
              fill="#0b2545"
              fillOpacity={0.45}
              strokeWidth={2.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible Legend */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#0B2545] shrink-0" aria-hidden="true" />
          <span>{t("demonstrated")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#D97706] shrink-0" aria-hidden="true" />
          <span>{t("required")}</span>
        </div>
      </div>
    </Card>
  );
}
