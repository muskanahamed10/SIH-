"use client";

import { useTranslations } from "next-intl";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export interface GapRadarDimension {
  dimension: string;
  current: number;
  target: number;
  fullMark: number;
}

interface GapRadarProps {
  data?: GapRadarDimension[];
  currentLabel?: string;
  targetLabel?: string;
}

export function GapRadar({
  data,
  currentLabel = "Current Competency",
  targetLabel = "Target Competency",
}: GapRadarProps) {
  const t = useTranslations("dashboard");

  const defaultData: GapRadarDimension[] = [
    { dimension: t("radarDimensions.dataAnalysis"), current: 3.0, target: 4.0, fullMark: 5.0 },
    { dimension: t("radarDimensions.statisticalModeling"), current: 2.3, target: 4.0, fullMark: 5.0 },
    { dimension: t("radarDimensions.surveyDesign"), current: 4.0, target: 4.0, fullMark: 5.0 },
    { dimension: t("radarDimensions.dataQuality"), current: 2.8, target: 4.5, fullMark: 5.0 },
    { dimension: t("radarDimensions.officialStatistics"), current: 3.2, target: 4.0, fullMark: 5.0 },
    { dimension: t("radarDimensions.dataVisualization"), current: 2.0, target: 3.5, fullMark: 5.0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-80 sm:h-96" role="region" aria-label={t("gapRadarTitle")}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
          <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#1e293b", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} / 5.0`,
              name === "current" ? currentLabel : targetLabel,
            ]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: "12px", fontSize: "12px", fontWeight: 600 }}
            formatter={(value) => (value === "current" ? currentLabel : targetLabel)}
          />
          <Radar
            name="target"
            dataKey="target"
            stroke="#d97706"
            fill="#f59e0b"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="current"
            dataKey="current"
            stroke="#0b2545"
            fill="#134074"
            fillOpacity={0.45}
            strokeWidth={2.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
