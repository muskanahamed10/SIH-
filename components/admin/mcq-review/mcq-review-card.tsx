"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit3,
  BookOpen,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MCQReviewItem } from "@/types";
import { useMCQReviewStore } from "@/stores/mcq-review-store";

interface MCQReviewCardProps {
  item: MCQReviewItem;
  index: number;
}

export function MCQReviewCard({ item, index }: MCQReviewCardProps) {
  const t = useTranslations("admin.mcqReview.card");
  const { approveMCQ, rejectMCQ, setEditingItem } = useMCQReviewStore();
  const { question } = item;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-0.5 shadow-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-600 text-white font-extrabold text-xs px-2.5 py-0.5 shadow-xs flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-extrabold text-xs px-2.5 py-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </Badge>
        );
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "beginner":
        return <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">Beginner</Badge>;
      case "intermediate":
        return <Badge className="bg-blue-50 text-blue-900 border-blue-200 text-[10px] font-bold">Intermediate</Badge>;
      case "advanced":
      default:
        return <Badge className="bg-purple-50 text-purple-900 border-purple-200 text-[10px] font-bold">Advanced</Badge>;
    }
  };

  const isApproved = item.status === "approved";
  const isRejected = item.status === "rejected";

  return (
    <Card
      data-testid={`mcq-review-card-${item.id}`}
      data-card-index={index + 1}
      className={`border transition-all rounded-2xl overflow-hidden shadow-xs ${
        isApproved
          ? "border-emerald-300 bg-white ring-1 ring-emerald-400/20"
          : isRejected
          ? "border-rose-200 bg-rose-50/20 opacity-80"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* 1. Header: Question #, Status, Competency, Difficulty, Grounding Confidence */}
      <CardHeader className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-xs font-extrabold">
              {index + 1}
            </span>
            <span className="text-xs font-bold text-slate-700">
              Item #{index + 1}
            </span>
            {getStatusBadge(item.status)}
            {getDifficultyBadge(question.difficulty)}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Competency */}
            <Badge className="bg-blue-50 text-blue-900 border-blue-200 text-[11px] font-bold">
              {question.competencyName || "Survey Methodology"}
            </Badge>

            {/* AI Confidence */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>AI Grounding: {Math.round(item.aiConfidence * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="pt-1">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
            {question.questionText}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        {/* 2. Source Document & Source Page Strip */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Source Document:</span>
          </span>
          <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 font-mono text-[10px]">
            {item.sourceDocumentName}
          </Badge>
          <span>•</span>
          <span className="font-bold text-slate-600">Source Page:</span>
          <Badge className="bg-amber-100 text-amber-950 border-amber-300 text-[10px] font-bold">
            {item.sourcePage}
          </Badge>
        </div>

        {/* 3. Options Grid with Highlighted AI Suggested Answer */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
            Assessment Options:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.options.map((opt, optIdx) => {
              const isAiSuggested = opt.id === question.correctOptionId;
              const letter = String.fromCharCode(65 + optIdx);

              return (
                <div
                  key={opt.id}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                    isAiSuggested
                      ? "border-emerald-400 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500/30"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isAiSuggested
                        ? "bg-emerald-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="leading-relaxed block">{opt.text}</span>
                    {isAiSuggested && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-extrabold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>AI Suggested Answer (Option {letter})</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Methodology Explanation */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-950">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>Official Methodology Explanation:</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {question.explanation}
          </p>
        </div>

        {/* Review Audit Stamp if Approved/Rejected */}
        {isApproved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Approved by:</strong> {item.reviewedBy || "Dr. K. S. Murthy (MoSPI / NSSTA Lead SME)"}
              </span>
            </div>
            <span>{item.reviewedAt}</span>
          </div>
        )}

        {isRejected && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>
                <strong>Rejected by SME:</strong> {item.reviewedBy || "Dr. K. S. Murthy"} ({item.reviewedAt})
              </span>
            </div>
            <p className="text-slate-600 italic">
              Reason: {item.rejectionReason || "Ambiguous distractor formulation."}
            </p>
          </div>
        )}
      </CardContent>

      {/* 5. Action Buttons: Approve, Edit, Reject */}
      <CardFooter className="border-t border-slate-100 bg-slate-50/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 font-medium">
          Human verification required prior to national rollout.
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditingItem(item)}
            className="text-xs font-semibold gap-1.5 border-slate-300 hover:bg-slate-100 text-slate-700"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>{t("edit")}</span>
          </Button>

          {/* Reject Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isRejected}
            onClick={() => rejectMCQ(item.id)}
            className={`text-xs font-semibold gap-1.5 ${
              isRejected
                ? "border-rose-300 bg-rose-50 text-rose-700 cursor-not-allowed"
                : "border-rose-200 text-rose-700 hover:bg-rose-50"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{isRejected ? "Rejected" : t("reject")}</span>
          </Button>

          {/* Approve Button */}
          <Button
            type="button"
            size="sm"
            disabled={isApproved}
            onClick={() => approveMCQ(item.id)}
            className={`text-xs font-extrabold gap-1.5 shadow-xs ${
              isApproved
                ? "bg-emerald-700 text-white cursor-not-allowed opacity-90"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isApproved ? "Approved ✓" : t("approve")}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
