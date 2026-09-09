"use client";

import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CompetencyDetailItem } from "@/types";

interface CompetencyComparisonTableProps {
  competencies: CompetencyDetailItem[];
}

export function CompetencyComparisonTable({ competencies }: CompetencyComparisonTableProps) {
  const t = useTranslations("myCompetency.tableSection");

  const getStatusBadge = (status: "Priority" | "Developing" | "Achieved") => {
    switch (status) {
      case "Priority":
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] font-bold">{t("priority")}</Badge>;
      case "Developing":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold">{t("developing")}</Badge>;
      case "Achieved":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">{t("achieved")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="p-6 shadow-xs border-slate-200 space-y-4">
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t("subtitle")}
        </p>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-xs text-slate-700">{t("competency")}</TableHead>
              <TableHead className="font-bold text-xs text-slate-700 text-right">{t("required")}</TableHead>
              <TableHead className="font-bold text-xs text-slate-700 text-right">{t("demonstrated")}</TableHead>
              <TableHead className="font-bold text-xs text-slate-700 text-right">{t("gap")}</TableHead>
              <TableHead className="font-bold text-xs text-slate-700 text-center">{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competencies.map((comp) => {
              const isAbove = comp.demonstratedScore >= comp.requiredScore;
              return (
                <TableRow key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="font-semibold text-xs text-slate-900">
                    {comp.name}
                  </TableCell>
                  <TableCell className="text-right font-medium text-xs text-slate-600">
                    {comp.requiredScore}%
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs text-slate-900">
                    {comp.demonstratedScore}%
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {isAbove ? (
                      <span className="text-emerald-700 font-semibold">— ({t("aboveRequirement")})</span>
                    ) : (
                      <span className="text-rose-700 font-bold">{comp.gap} points</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(comp.status)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Stacked Cards View */}
      <div className="sm:hidden space-y-3">
        {competencies.map((comp) => {
          const isAbove = comp.demonstratedScore >= comp.requiredScore;
          return (
            <div key={comp.id} className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-sm text-slate-900">{comp.name}</p>
                {getStatusBadge(comp.status)}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">{t("required")}</span>
                  <span className="font-semibold text-slate-700">{comp.requiredScore}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">{t("demonstrated")}</span>
                  <span className="font-bold text-slate-900">{comp.demonstratedScore}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">{t("gap")}</span>
                  <span className={isAbove ? "text-emerald-700 font-semibold" : "text-rose-700 font-bold"}>
                    {isAbove ? "—" : `${comp.gap} pts`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
