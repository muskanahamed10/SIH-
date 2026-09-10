"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useResources, useCompetencies } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, ArrowRight } from "lucide-react";

export default function ResourcesBrowserPage() {
  const t = useTranslations("common");
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedComp, setSelectedComp] = React.useState("all");

  const { data: competencies } = useCompetencies();
  const { data: resources, isLoading } = useResources({
    search: searchTerm,
    competencyId: selectedComp,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          iGOT Karmayogi & Official Learning Repository
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore curated courses, NSSTA handbooks, and statistical computing modules aligned with the Indian Statistical Cadre competency framework.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search resources by title, method, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedComp}
          onChange={(e) => setSelectedComp(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Competency Domains</option>
          {competencies?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Cards Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-slate-500">{t("loading")}</div>
      ) : resources?.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">No learning resources found matching your query.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources?.map((res) => (
            <Card key={res.id} className="flex flex-col justify-between border-slate-200 hover:shadow-md transition">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-1">
                  <Badge variant="gov" className="text-[10px]">
                    {res.source === "igot_karmayogi" ? "iGOT Karmayogi" : "MoSPI Internal"}
                  </Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {res.durationHours} hrs
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 mt-2 line-clamp-2">
                  {res.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {res.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between border-t pt-2 border-slate-100">
                  <span>Domain:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">
                    {res.competencyName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target Level:</span>
                  <Badge variant="outline" className="text-[10px]">
                    Level {res.targetLevel}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-slate-100">
                <Link href={`/${locale}/learner/resources/${res.id}`} className="w-full">
                  <Button size="sm" className="w-full bg-[#0B2545] hover:bg-[#134074] text-white text-xs gap-1.5">
                    <span>View Details & Access</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
