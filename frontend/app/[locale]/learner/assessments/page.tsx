"use client";

import { useTranslations, useLocale } from "next-intl";
import { useAssessments } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AssessmentsPage() {
  const t = useTranslations("assessment");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data: assessments, isLoading } = useAssessments();

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-500">{commonT("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t("title")}</h1>
        <p className="text-sm text-slate-500 mt-1">
          Formal competency diagnostic tests for Indian Statistical Service & Subordinate Statistical Service cadres.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments?.map((asm) => (
          <Card key={asm.id} className="border-slate-200 hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="gov">Diagnostic</Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {asm.durationMinutes} mins
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 mt-2">
                {asm.title}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {asm.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between border-t pt-2 border-slate-100">
                <span>Total Questions:</span>
                <strong className="text-slate-800">{asm.totalQuestions} MCQs</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Passing Benchmark:</span>
                <strong className="text-slate-800">{asm.passingPercentage}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Evaluated Competencies:</span>
                <strong className="text-slate-800">{asm.competencyIds.length} Domains</strong>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild className="w-full bg-[#0B2545] hover:bg-[#134074] text-white font-semibold text-xs">
                <Link href={`/${locale}/learner/assessments/${asm.id}`}>
                  <span>Start Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
