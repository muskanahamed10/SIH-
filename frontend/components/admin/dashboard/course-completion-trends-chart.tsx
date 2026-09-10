"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCourseCompletionTrends } from "@/mocks/data/admin";

export function CourseCompletionTrendsChart() {
  const t = useTranslations("admin.dashboard.courseCompletionTrends");

  const trendData = mockCourseCompletionTrends.map((c) => ({
    month: c.month,
    enrolled: c.enrolled,
    completed: c.completed,
    quizzes: c.quizzes,
    hours: c.learningHours
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
            <Badge className="bg-blue-50 text-blue-900 border-blue-200 text-[10px] font-bold">
              iGOT Karmayogi
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border-emerald-200">
            {t("syncStatus")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="enrolledGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#134074" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#134074" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 11 }}
                domain={[0, 1600]}
              />
              <Tooltip
                formatter={(val: number | string, name: string) => [
                  `${val} ${name === "enrolled" ? "enrolled" : "completed"}`,
                  name === "enrolled" ? t("coursesEnrolled") : t("coursesCompleted")
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
                    {value === "enrolled" ? t("coursesEnrolled") : t("coursesCompleted")}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="enrolled"
                name="enrolled"
                stroke="#134074"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#enrolledGrad)"
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="completed"
                stroke="#15803d"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#completedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Callout Bar */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Badge className="bg-[#0B2545] text-white text-[10px] font-bold">
              {t("learningHoursStat")}
            </Badge>
            <span className="font-semibold text-slate-700">{t("avgHoursStat")}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            {t("completionSurge")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
