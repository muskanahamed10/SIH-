"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, Clock, Award, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UpcomingAssessmentSummary } from "@/types";

interface UpcomingAssessmentCardProps {
  assessment?: UpcomingAssessmentSummary | null;
}

export function UpcomingAssessmentCard({ assessment }: UpcomingAssessmentCardProps) {
  const t = useTranslations("dashboard.upcomingAssessment");
  const locale = useLocale();

  if (!assessment) {
    return (
      <Card className="p-6 shadow-xs border-slate-200 text-center space-y-3 flex flex-col justify-between">
        <div className="space-y-2 py-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" aria-hidden="true" />
          <h2 className="font-bold text-base text-slate-900 tracking-tight">
            {t("noUpcomingTitle")}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t("noUpcomingDesc")}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs border-slate-200 bg-white flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {assessment.type}
              </span>
              <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-300 font-bold text-[10px]">
                {t("dueIn", { days: assessment.daysRemaining })}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mt-1">
              {assessment.title}
            </CardTitle>
          </div>
          <Badge variant="gov" className="text-xs">
            MoSPI Cadre
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-500 mt-0.5">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{t("competencyEvaluated")}</span>
            <strong className="text-blue-900 font-semibold">{assessment.competency}</strong>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>{t("dueDate")} <strong className="text-slate-900">{assessment.dueDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>{assessment.durationMinutes} {t("mins")} • {assessment.questionCount} {t("questions")}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2.5 rounded border border-amber-100">
          {t("syllabusNotice")}
        </p>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
        <Link href={`/${locale}/learner/assessment/${assessment.id}`} className="w-full sm:flex-1">
          <Button className="w-full bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold py-2 flex items-center justify-center gap-1.5 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>{t("startAssessment")}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </Link>
        <Link href={`/${locale}/learner/practice`} className="w-full sm:w-auto">
          <Button variant="outline" className="w-full text-xs font-semibold text-slate-700 hover:bg-slate-50 border-slate-300 py-2 flex items-center justify-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
            <span>{t("practiceFirst")}</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
