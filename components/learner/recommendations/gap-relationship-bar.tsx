"use client";

import { useTranslations } from "next-intl";
import { Radar, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GapChip {
  competencyId: string;
  competencyName: string;
  gapPoints: number;
  priority: string;
}

interface GapRelationshipBarProps {
  gapChips: GapChip[];
  selectedCompetencyId?: string;
  onSelectCompetency: (id: string) => void;
}

export function GapRelationshipBar({
  gapChips,
  selectedCompetencyId,
  onSelectCompetency,
}: GapRelationshipBarProps) {
  const t = useTranslations("learningRecommendations.gapRelationship");

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-2 text-xs text-slate-700 font-bold shrink-0">
        <Radar className="w-4 h-4 text-blue-800" aria-hidden="true" />
        <span>{t("title")}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectCompetency("all")}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
            !selectedCompetencyId || selectedCompetencyId === "all"
              ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          {t("filterAll")}
        </button>

        {gapChips.map((chip) => {
          const isSelected = selectedCompetencyId === chip.competencyId;

          return (
            <button
              key={chip.competencyId}
              type="button"
              onClick={() => onSelectCompetency(chip.competencyId)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                  : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-amber-400" aria-hidden="true" />}
              <span>{chip.competencyName}</span>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold px-1.5 py-0 ${
                  isSelected
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {t("gapLabel")} {chip.gapPoints}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
