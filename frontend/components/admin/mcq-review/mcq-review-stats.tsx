"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ListFilter, Clock, CheckCircle2, XCircle, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMCQReviewStore } from "@/stores/mcq-review-store";

export function MCQReviewStats() {
  const t = useTranslations("admin.mcqReview.stats");
  const { items } = useMCQReviewStore();

  const total = items.length;
  const pending = items.filter((i) => i.status === "pending").length;
  const approved = items.filter((i) => i.status === "approved").length;
  const rejected = items.filter((i) => i.status === "rejected").length;
  const reviewRate = total > 0 ? Math.round(((approved + rejected) / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Total in Queue */}
      <Card className="p-4 rounded-xl border-slate-200 shadow-2xs bg-white space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("total")}</span>
          <ListFilter className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{total}</div>
        <p className="text-[10px] text-slate-400">Total Items in Queue</p>
      </Card>

      {/* Pending Review */}
      <Card className="p-4 rounded-xl border-amber-200 shadow-2xs bg-amber-50/40 space-y-1">
        <div className="flex items-center justify-between text-amber-800">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("pending")}</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-amber-950">{pending}</div>
        <p className="text-[10px] text-amber-700">Awaiting SME Signoff</p>
      </Card>

      {/* Approved */}
      <Card className="p-4 rounded-xl border-emerald-200 shadow-2xs bg-emerald-50/40 space-y-1">
        <div className="flex items-center justify-between text-emerald-800">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("approved")}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{approved}</div>
        <p className="text-[10px] text-emerald-700">Added to Question Bank</p>
      </Card>

      {/* Rejected */}
      <Card className="p-4 rounded-xl border-rose-200 shadow-2xs bg-rose-50/40 space-y-1">
        <div className="flex items-center justify-between text-rose-800">
          <span className="text-[11px] font-bold uppercase tracking-wider">{t("rejected")}</span>
          <XCircle className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-rose-950">{rejected}</div>
        <p className="text-[10px] text-rose-700">Flagged / Archived</p>
      </Card>

      {/* HITL Verification Rate */}
      <Card className="p-4 rounded-xl border-indigo-200 shadow-2xs bg-indigo-50/40 col-span-2 lg:col-span-1 space-y-1">
        <div className="flex items-center justify-between text-indigo-800">
          <span className="text-[11px] font-bold uppercase tracking-wider">HITL Rate</span>
          <Award className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-indigo-950">{reviewRate}%</div>
        <p className="text-[10px] text-indigo-700">Human Reviewed</p>
      </Card>
    </div>
  );
}
