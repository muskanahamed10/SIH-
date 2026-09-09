"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CompetencyPerformanceItem } from "@/types";
import { calculateDeterministicGap, GapPriority } from "@/lib/competency-gap";

interface CompetencyPerformanceTableProps {
  performance: CompetencyPerformanceItem[];
}

export function CompetencyPerformanceTable({
  performance,
}: CompetencyPerformanceTableProps) {
  const t = useTranslations("assessmentResults.performance");

  const getPriorityBadge = (priority: GapPriority) => {
    switch (priority) {
      case "Critical":
        return (
          <Badge className="bg-rose-100 text-rose-900 border-rose-300 font-extrabold text-[11px] gap-1 hover:bg-rose-100 shadow-2xs">
            <ShieldAlert className="w-3 h-3 text-rose-700 shrink-0" aria-hidden="true" />
            <span>{t("critical")}</span>
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-orange-100 text-orange-900 border-orange-300 font-bold text-[11px] gap-1 hover:bg-orange-100">
            <AlertTriangle className="w-3 h-3 text-orange-700 shrink-0" aria-hidden="true" />
            <span>{t("high")}</span>
          </Badge>
        );
      case "Moderate":
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-[11px] gap-1 hover:bg-amber-100">
            <TrendingUp className="w-3 h-3 text-amber-700 shrink-0" aria-hidden="true" />
            <span>{t("moderate")}</span>
          </Badge>
        );
      case "Low":
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-300 font-semibold text-[11px] gap-1 hover:bg-slate-100">
            <CheckCircle2 className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
            <span>{t("low")}</span>
          </Badge>
        );
    }
  };

  const getStatusBadge = (required: number, current: number, statusText: string) => {
    const isMet = current >= required;

    if (isMet) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px] gap-1 hover:bg-emerald-100">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          <span>{current > required ? t("aboveRequirement") : t("achieved")}</span>
        </Badge>
      );
    }

    if (statusText === "Critical Gap" || statusText === "Priority Gap") {
      return (
        <Badge className="bg-rose-50 text-rose-800 border-rose-200 font-semibold text-[10px] gap-1 hover:bg-rose-50">
          <AlertCircle className="w-3 h-3 text-rose-600" aria-hidden="true" />
          <span>{statusText === "Critical Gap" ? t("criticalGap") : t("priorityGap")}</span>
        </Badge>
      );
    }

    return (
      <Badge className="bg-amber-50 text-amber-900 border-amber-200 font-semibold text-[10px] gap-1 hover:bg-amber-50">
        <TrendingUp className="w-3 h-3 text-amber-700" aria-hidden="true" />
        <span>{t("developing")}</span>
      </Badge>
    );
  };

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 self-start sm:self-auto font-medium">
          Deterministic Cadre Calibration
        </Badge>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700">{t("colCompetency")}</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-center">{t("colRequired")}</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-center">{t("colDemonstrated")}</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-center">{t("colGap")}</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-center">{t("colPriority")}</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-right">{t("colStatus")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performance.map((item) => {
              const calc = calculateDeterministicGap(item.requiredScore, item.demonstratedScore);
              const isMet = calc.current >= calc.required;

              return (
                <TableRow key={item.competencyId} className="hover:bg-slate-50/70">
                  <TableCell className="font-bold text-xs text-slate-900">
                    {item.competencyName}
                  </TableCell>
                  <TableCell className="text-xs text-center text-slate-600 font-semibold">
                    {calc.required}%
                  </TableCell>
                  <TableCell className="text-xs text-center font-bold text-slate-900">
                    {calc.current}%
                  </TableCell>
                  <TableCell className="text-xs text-center font-extrabold">
                    {isMet ? (
                      <span className="text-emerald-700 font-bold">0%</span>
                    ) : (
                      <span className={calc.priority === "Critical" ? "text-rose-700" : "text-amber-800"}>
                        {calc.gap}%
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {getPriorityBadge(calc.priority)}
                  </TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(calc.required, calc.current, calc.statusText)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-3">
        {performance.map((item) => {
          const calc = calculateDeterministicGap(item.requiredScore, item.demonstratedScore);
          const isMet = calc.current >= calc.required;

          return (
            <div
              key={item.competencyId}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">{item.competencyName}</span>
                  <div className="mt-1">{getStatusBadge(calc.required, calc.current, calc.statusText)}</div>
                </div>
                <div>{getPriorityBadge(calc.priority)}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200/60 bg-white p-2.5 rounded-lg border">
                <div>
                  <span className="text-[10px] text-slate-500 block">{t("colRequired")}</span>
                  <strong className="text-slate-800">{calc.required}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{t("colDemonstrated")}</span>
                  <strong className="text-slate-900">{calc.current}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{t("colGap")}</span>
                  <strong className={isMet ? "text-emerald-700" : calc.priority === "Critical" ? "text-rose-700 font-extrabold" : "text-amber-800"}>
                    {calc.gap}%
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
