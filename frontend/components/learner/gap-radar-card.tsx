"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
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

interface GapRadarCardProps {
  data: CompetencyRadarItem[];
}

export function GapRadarCard({ data }: GapRadarCardProps) {
  const t = useTranslations("dashboard.radar");
  const locale = useLocale();

  return (
    <Card className="p-6 shadow-xs border-slate-200 flex flex-col justify-between">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href={`/${locale}/learner/competency`}
          className="text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          <span>View Competency</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Real Recharts Radar Chart */}
      <div className="w-full h-80 sm:h-96 py-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="competency"
              tick={{ fill: "#1e293b", fontSize: 11, fontWeight: 600 }}
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
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-800">
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
                        <span className="text-slate-400">Deficit:</span>
                        <span className={item.demonstrated < item.required ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                          {item.demonstrated < item.required
                            ? `-${item.required - item.demonstrated} pts`
                            : `+${item.demonstrated - item.required} pts (Surplus)`}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Required Competency Polygon */}
            <Radar
              name={t("required")}
              dataKey="required"
              stroke="#d97706"
              fill="#d97706"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            {/* Demonstrated Competency Polygon */}
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

      {/* Accessible High-Contrast Custom Legend */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#0B2545] shrink-0" aria-hidden="true" />
            <span>{t("demonstrated")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#D97706] shrink-0" aria-hidden="true" />
            <span>{t("required")}</span>
          </div>
        </div>
        <Link
          href={`/${locale}/learner/competency`}
          className="text-xs font-semibold text-blue-900 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          <span>Deep Gap Analysis</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
}
