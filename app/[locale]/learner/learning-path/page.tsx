"use client";

import { useTranslations } from "next-intl";
import { useLearningPath } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, PlayCircle } from "lucide-react";

export default function LearningPathPage() {
  const t = useTranslations("learning");
  const commonT = useTranslations("common");
  const { data: path, isLoading } = useLearningPath();

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-500">{commonT("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t("title")}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {t("subtitle")} for <strong>{path?.targetRoleName}</strong>
            </p>
          </div>
          <Badge variant="gov">Pathway Active</Badge>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Overall Path Completion</span>
            <span className="font-bold text-slate-900">{path?.overallProgress}%</span>
          </div>
          <Progress value={path?.overallProgress || 0} />
        </div>
      </div>

      {/* Timeline Nodes */}
      <div className="relative border-l-2 border-blue-200 ml-4 pl-6 space-y-6">
        {path?.nodes.map((node, index) => (
          <div key={node.id} className="relative group">
            {/* Step marker */}
            <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
              {index + 1}
            </div>

            <Card className="border-slate-200 hover:border-blue-400 transition-all shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="gov" className="text-[10px]">
                    {node.competencyAddressed}
                  </Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {node.estimatedHours} {t("hours")}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 mt-1">
                  {node.resource.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {node.recommendedReason}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Source: <strong className="text-slate-700">{node.resource.source === "igot_karmayogi" ? "iGOT Karmayogi" : "MoSPI"}</strong>
                  </span>
                  <Badge
                    variant={node.status === "completed" ? "success" : node.status === "in_progress" ? "warning" : "secondary"}
                    className="text-[10px]"
                  >
                    {t(`status.${node.status === "in_progress" ? "inProgress" : node.status === "completed" ? "completed" : "notStarted"}`)}
                  </Badge>
                </div>

                {node.status === "in_progress" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Module Progress</span>
                      <span>{node.progress}%</span>
                    </div>
                    <Progress value={node.progress} indicatorClassName="bg-amber-500" />
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button size="sm" className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs gap-1.5">
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{node.status === "in_progress" ? t("continueCourse") : t("startCourse")}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
