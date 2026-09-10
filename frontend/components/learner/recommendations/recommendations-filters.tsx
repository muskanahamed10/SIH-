"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Filter, Search, X, Clock, Layers, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendationsFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  competencyFilter: string;
  onCompetencyChange: (val: string) => void;
  difficultyFilter: "all" | "Beginner" | "Intermediate" | "Advanced";
  onDifficultyChange: (val: "all" | "Beginner" | "Intermediate" | "Advanced") => void;
  durationFilter: "all" | "<30" | "30-60" | ">60";
  onDurationChange: (val: "all" | "<30" | "30-60" | ">60") => void;
  sortBy: "recommended" | "duration" | "gap" | "progress";
  onSortByChange: (val: "recommended" | "duration" | "gap" | "progress") => void;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export function RecommendationsFilters({
  searchQuery,
  onSearchChange,
  competencyFilter,
  onCompetencyChange,
  difficultyFilter,
  onDifficultyChange,
  durationFilter,
  onDurationChange,
  sortBy,
  onSortByChange,
  totalCount,
  filteredCount,
  onReset,
}: RecommendationsFiltersProps) {
  const t = useTranslations("learningRecommendations.filters");

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    competencyFilter !== "all" ||
    difficultyFilter !== "all" ||
    durationFilter !== "all" ||
    sortBy !== "recommended";

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/80 shadow-xs space-y-4 text-xs">
      {/* Search Bar + Result Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 font-medium text-xs shadow-xs focus:ring-2 focus:ring-[#0B2545] focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-slate-600">
          <span className="font-semibold text-[11px] text-slate-500 whitespace-nowrap">
            {t("showingResults", { count: filteredCount, total: totalCount })}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2.5 text-[11px] font-bold text-rose-700 hover:text-rose-800 hover:bg-rose-50 gap-1 rounded-lg"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t("resetFilters")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-slate-200/80">
        {/* Competency Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>{t("competencyLabel")}</span>
          </label>
          <select
            aria-label={t("competencyLabel")}
            value={competencyFilter}
            onChange={(e) => onCompetencyChange(e.target.value)}
            className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#0B2545] focus:outline-none transition-all"
          >
            <option value="all">{t("allCompetencies")}</option>
            <option value="comp-stat-comp">Statistical Computing (Python)</option>
            <option value="comp-stat-model">Statistical Modeling</option>
            <option value="comp-data-vis">Data Visualization</option>
            <option value="comp-data-quality">Data Quality</option>
            <option value="comp-data-analysis">Data Analysis</option>
            <option value="comp-survey-method">Survey Methodology</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-500" />
            <span>{t("difficultyLabel")}</span>
          </label>
          <select
            aria-label={t("difficultyLabel")}
            value={difficultyFilter}
            onChange={(e) =>
              onDifficultyChange(e.target.value as "all" | "Beginner" | "Intermediate" | "Advanced")
            }
            className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#0B2545] focus:outline-none transition-all"
          >
            <option value="all">{t("allDifficulties")}</option>
            <option value="Beginner">{t("beginner")}</option>
            <option value="Intermediate">{t("intermediate")}</option>
            <option value="Advanced">{t("advanced")}</option>
          </select>
        </div>

        {/* Duration Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{t("durationLabel")}</span>
          </label>
          <select
            aria-label={t("durationLabel")}
            value={durationFilter}
            onChange={(e) =>
              onDurationChange(e.target.value as "all" | "<30" | "30-60" | ">60")
            }
            className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#0B2545] focus:outline-none transition-all"
          >
            <option value="all">{t("allDurations")}</option>
            <option value="<30">{t("under30")}</option>
            <option value="30-60">{t("between30and60")}</option>
            <option value=">60">{t("over60")}</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-500" />
            <span>{t("sortLabel")}</span>
          </label>
          <select
            aria-label={t("sortLabel")}
            value={sortBy}
            onChange={(e) =>
              onSortByChange(
                e.target.value as "recommended" | "duration" | "gap" | "progress"
              )
            }
            className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#0B2545] focus:outline-none transition-all"
          >
            <option value="recommended">{t("sortRecommended")}</option>
            <option value="gap">{t("sortGap")}</option>
            <option value="duration">{t("sortDuration")}</option>
            <option value="progress">{t("sortProgress")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
