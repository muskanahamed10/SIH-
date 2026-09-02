"use client";

import { useTranslations } from "next-intl";
import { useLearnerProfile, useRoles } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle2 } from "lucide-react";

export default function LearnerProfilePage() {
  const t = useTranslations("common");
  const { data: profile, isLoading } = useLearnerProfile();
  const { data: roles } = useRoles();

  if (isLoading || !profile) {
    return <div className="p-8 text-center text-sm text-slate-500">{t("loading")}</div>;
  }

  const { user, activeTargetRole } = profile;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Statistical Cadre Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your official cadre credentials and configure your target role for personalized competency diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Officer Card */}
        <Card className="md:col-span-1 border-slate-200">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full bg-blue-900 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-sm">
              RV
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mt-3">
              {user.name}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {user.email}
            </CardDescription>
            <div className="pt-2">
              <Badge variant="gov">{user.cadre}</Badge>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-3 border-t pt-4">
            <div>
              <span className="text-slate-400 block">Designation</span>
              <span className="font-semibold text-slate-800">{user.designation}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Department</span>
              <span className="font-semibold text-slate-800">{user.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block">System Access Role</span>
              <span className="font-semibold text-slate-800 uppercase">{user.systemRole}</span>
            </div>
          </CardContent>
        </Card>

        {/* Target Role Selector */}
        <Card className="md:col-span-2 border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-900" />
              <CardTitle className="text-lg font-bold text-slate-900">
                Target Role Configuration
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Selecting a target role recalibrates your GapRadar benchmark and personalizes your learning timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles?.map((role) => {
              const isSelected = role.id === activeTargetRole?.id;
              return (
                <div
                  key={role.id}
                  className={`p-4 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? "border-blue-700 bg-blue-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{role.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {role.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                        {role.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-800 shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="pt-2 border-t border-slate-100 flex justify-end">
            <Button size="sm" className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold">
              Update Target Role
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
