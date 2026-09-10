"use client";

import { useCompetencies } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function CompetenciesAdminPage() {
  const { data: competencies } = useCompetencies();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            National Statistical Competency Matrix
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative competency definitions, 5-level behavioral indicators, and official standards.
          </p>
        </div>
        <Button className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Competency</span>
        </Button>
      </div>

      <div className="space-y-4">
        {competencies?.map((comp) => (
          <Card key={comp.id} className="border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="gov" className="text-xs font-mono">
                    {comp.code}
                  </Badge>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {comp.name}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs mt-1 leading-relaxed">
                {comp.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 border-t border-slate-100 pt-3">
                {comp.levels.map((lvl) => (
                  <div key={lvl.level} className="p-2.5 rounded-md bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>Level {lvl.level}</span>
                      <span className="text-blue-900 font-semibold">{lvl.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-3">
                      {lvl.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
