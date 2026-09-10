"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMCQReviewStore } from "@/stores/mcq-review-store";
import { ResponsibleAiHitlBanner } from "@/components/admin/mcq-review/responsible-ai-hitl-banner";
import { MCQReviewStats } from "@/components/admin/mcq-review/mcq-review-stats";
import { MCQReviewCard } from "@/components/admin/mcq-review/mcq-review-card";
import { MCQEditDialog } from "@/components/admin/mcq-review/mcq-edit-dialog";

export default function MCQReviewAdminPage() {
  const t = useTranslations("admin.mcqReview");
  const locale = useLocale();
  const {
    items,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    resetQueue,
  } = useMCQReviewStore();

  // Filter items by status and search query
  const filteredItems = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const textMatch = item.question.questionText.toLowerCase().includes(q);
      const docMatch = item.sourceDocumentName.toLowerCase().includes(q);
      const compMatch = (item.question.competencyName || "").toLowerCase().includes(q);
      return textMatch || docMatch || compMatch;
    }
    return true;
  });

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const approvedCount = items.filter((i) => i.status === "approved").length;
  const rejectedCount = items.filter((i) => i.status === "rejected").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/admin/dashboard`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-medium text-slate-600 bg-white">
            Dr. K. S. Murthy • Senior Statistical Advisor (SME)
          </Badge>
          <Badge className="bg-[#0B2545] text-white text-[11px]">
            MoSPI / NSSTA Question Review Board
          </Badge>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-800">
                <FileCheck className="w-5 h-5 text-indigo-700" />
              </span>
              <span>{t("title")}</span>
            </h1>
            <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[11px] font-bold">
              {pendingCount} Pending Review
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetQueue}
          className="text-xs font-semibold gap-1.5 border-slate-300 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo Queue</span>
        </Button>
      </div>

      {/* Responsible AI Human-in-the-Loop Governance Banner */}
      <ResponsibleAiHitlBanner />

      {/* Queue Review Statistics */}
      <MCQReviewStats />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              statusFilter === "all"
                ? "bg-[#0B2545] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Items ({items.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              statusFilter === "approved"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              statusFilter === "rejected"
                ? "bg-rose-700 text-white shadow-xs"
                : "bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or manuals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Filter className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No questions match the current filter</p>
            <p className="text-xs text-slate-400">Try changing status filter or clearing your search term.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <MCQReviewCard key={item.id} item={item} index={idx} />
          ))
        )}
      </div>

      {/* Edit Modal Dialog */}
      <MCQEditDialog />
    </div>
  );
}
