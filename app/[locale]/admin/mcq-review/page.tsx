"use client";

import { useTranslations } from "next-intl";
import { useMCQReviewQueue, useApproveMCQ, useRejectMCQ } from "@/hooks/use-queries";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Edit3, FileText, Sparkles } from "lucide-react";

export default function MCQReviewAdminPage() {
  const t = useTranslations("admin");
  const commonT = useTranslations("common");
  const { data: queue, isLoading } = useMCQReviewQueue();
  const approveMutation = useApproveMCQ();
  const rejectMutation = useRejectMCQ();

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-500">{commonT("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI-Generated MCQ Subject Matter Expert (SME) Review
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, edit, validate, and approve diagnostic assessment items extracted by AI from uploaded MoSPI circulars, manuals, and statistical reports.
          </p>
        </div>
        <Badge variant="warning" className="text-xs">
          {queue?.length || 0} Questions Pending Validation
        </Badge>
      </div>

      <div className="space-y-6">
        {queue?.map((item) => {
          const { question } = item;
          return (
            <Card key={item.id} className="border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="gov" className="text-[10px]">
                      {question.competencyName}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {item.sourceDocumentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>{t("confidence")}: {Math.round(item.aiConfidence * 100)}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Source Snippet */}
                <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-md text-xs text-slate-700 italic">
                  <strong>Source Material Snippet:</strong> {item.extractedSnippet}
                </div>

                {/* Question */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {question.questionText}
                  </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.options.map((opt) => {
                    const isCorrect = opt.id === question.correctOptionId;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-md border text-xs flex items-center justify-between ${
                          isCorrect
                            ? "border-emerald-500 bg-emerald-50/60 text-emerald-950 font-semibold"
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        <span>{opt.text}</span>
                        {isCorrect && (
                          <Badge variant="success" className="text-[9px] uppercase ml-1">
                            Correct Answer
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3 bg-slate-50 rounded-md border border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-800 block mb-1">Official Methodology Rationale:</strong>
                  {question.explanation}
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-slate-600 border-slate-300 hover:text-slate-900 gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t("edit")}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rejectMutation.mutate(item.id)}
                  className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{t("reject")}</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => approveMutation.mutate(item.id)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t("approve")}</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
