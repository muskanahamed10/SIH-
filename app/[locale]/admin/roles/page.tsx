"use client";

import { useRoles, useCompetencies } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Sliders } from "lucide-react";

export default function RolesMappingAdminPage() {
  const { data: roles } = useRoles();
  const { data: competencies } = useCompetencies();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Role-to-Competency Mapping Matrix
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define mandatory target competency levels (Level 1-5) required for every official designation in the ISS and SSS cadres.
          </p>
        </div>
        <Button className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Cadre Role</span>
        </Button>
      </div>

      <div className="space-y-6">
        {roles?.map((role) => (
          <Card key={role.id} className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {role.name}
                    </CardTitle>
                    <Badge variant="gov" className="text-xs">
                      {role.code}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    {role.cadre}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Edit Requirements</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {role.requiredCompetencies.map((req) => {
                  const comp = competencies?.find((c) => c.id === req.competencyId);
                  return (
                    <div key={req.competencyId} className="p-2.5 rounded-md border border-slate-100 bg-white space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800 truncate">
                          {comp?.name || req.competencyId}
                        </span>
                        <Badge variant="gov" className="text-[10px] ml-1 shrink-0">
                          Req: L{req.requiredLevel}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize block">
                        Priority: {req.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
