"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRecommendations } from "@/hooks/use-queries";
import { RecommendationsHeader } from "@/components/learner/recommendations/recommendations-header";
import { IgotCatalogNotice } from "@/components/learner/recommendations/igot-catalog-notice";
import { PythonGapCallout } from "@/components/learner/recommendations/python-gap-callout";
import { GapRelationshipBar } from "@/components/learner/recommendations/gap-relationship-bar";
import { PriorityQueueCard } from "@/components/learner/recommendations/priority-queue-card";
import { RecommendationsFilters } from "@/components/learner/recommendations/recommendations-filters";
import { ResourceCard } from "@/components/learner/recommendations/resource-card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RecommendationsPage() {
  const locale = useLocale();
  const t = useTranslations("learningRecommendations");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"gaps" | "strengthen" | "practice" | "meeting" | "all">("all");
  const [competencyFilter, setCompetencyFilter] = React.useState("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState<"all" | "Beginner" | "Intermediate" | "Advanced">("all");
  const [durationFilter, setDurationFilter] = React.useState<"all" | "<30" | "30-60" | ">60">("all");
  const [sortBy, setSortBy] = React.useState<"recommended" | "duration" | "gap" | "progress">("recommended");

  const { data, isLoading, isError, refetch } = useRecommendations({
    search: searchQuery,
    competencyId: competencyFilter,
    difficulty: difficultyFilter,
    durationCategory: durationFilter,
    sortBy,
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setCompetencyFilter("all");
    setDifficultyFilter("all");
    setDurationFilter("all");
    setSortBy("recommended");
    setActiveTab("all");
  };

  const handleFilterPython = () => {
    setCompetencyFilter("comp-stat-comp");
    setActiveTab("all");
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-sm text-slate-500 animate-pulse space-y-4">
        <div className="h-28 bg-slate-100 rounded-2xl max-w-xl mx-auto" />
        <p>{t("loadingMessage")}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 my-12">
        <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">{t("empty.unavailableTitle")}</h2>
          <p className="text-xs text-slate-500">{t("empty.unavailableDesc")}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => refetch()} className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Try Again</span>
          </Button>
          <Link href={`/${locale}/learner/competency`}>
            <Button variant="outline" className="text-xs font-semibold border-slate-300">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>{t("empty.backToCompetency")}</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter resources by active tab category section if not 'all'
  const displayedResources =
    activeTab === "all"
      ? data.resources
      : data.resources.filter((r) => r.categorySection === activeTab);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in-50 duration-200 pb-12">
      {/* 1. Official Header */}
      <RecommendationsHeader
        role={data.role}
        cadre={data.cadre}
        department={data.department}
      />

      {/* 2. Transparent iGOT Catalog Notice (Demo Alignment & Architecture Note) */}
      <IgotCatalogNotice />

      {/* 3. Primary Focused Callout: Python Competency Gap Explanation */}
      <PythonGapCallout onFilterPython={handleFilterPython} />

      {/* 4. Gap Relationship Bar (Quick filter by assessed competency deficit) */}
      <GapRelationshipBar
        gapChips={data.gapChips}
        selectedCompetencyId={competencyFilter}
        onSelectCompetency={(id) => setCompetencyFilter(id)}
      />

      {/* 5. Sequential Priority Queue (NOW / NEXT / LATER) */}
      <PriorityQueueCard orderQueue={data.orderQueue} />

      {/* 6. Curated Category Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-[#0B2545] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("tabs.all")}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gaps")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "gaps"
              ? "bg-[#0B2545] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("tabs.gaps")}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("strengthen")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "strengthen"
              ? "bg-[#0B2545] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("tabs.strengthen")}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("practice")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "practice"
              ? "bg-[#0B2545] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("tabs.practice")}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("meeting")}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "meeting"
              ? "bg-[#0B2545] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t("tabs.meeting")}
        </button>
      </div>

      {/* 7. Comprehensive Search and Filters Control Bar */}
      <RecommendationsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        competencyFilter={competencyFilter}
        onCompetencyChange={setCompetencyFilter}
        difficultyFilter={difficultyFilter}
        onDifficultyChange={setDifficultyFilter}
        durationFilter={durationFilter}
        onDurationChange={setDurationFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={8}
        filteredCount={displayedResources.length}
        onReset={handleResetFilters}
      />

      {/* 8. Course Recommendations Cards Grid */}
      {displayedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{t("empty.noMatchTitle")}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t("empty.noMatchDesc")}
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>{t("filters.resetFilters")}</span>
            </Button>
          </div>
        </div>
      )}

      {/* 9. Bottom Cadre Navigation Footer */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-slate-600">
          {t("footer.notice")}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/${locale}/learner/competency`}>
            <Button variant="outline" className="text-xs font-semibold bg-white border-slate-300">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>{t("footer.backToCompetency")}</span>
            </Button>
          </Link>
          <Link href={`/${locale}/learner/assessment-results/baseline-cadre-2026`}>
            <Button className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold">
              <span>{t("footer.viewAssessmentResults")}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
