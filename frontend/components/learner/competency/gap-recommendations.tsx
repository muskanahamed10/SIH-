"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Play, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecommendationCardItem {
  id: string;
  title: string;
  competency: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  source: string;
  reason: string;
  resourceId: string;
}

interface GapRecommendationsProps {
  recommendations: RecommendationCardItem[];
}

export function GapRecommendations({ recommendations }: GapRecommendationsProps) {
  const t = useTranslations("myCompetency.recommendationsSection");
  const locale = useLocale();

  return (
    <Card className="p-6 shadow-xs border-slate-200 space-y-4">
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href={`/${locale}/learner/recommendations`}>
            <Button size="sm" className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>View Recommendations</span>
            </Button>
          </Link>
          <Link href={`/${locale}/explore`}>
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              Browse All
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-200 text-[10px] font-bold">
                  {rec.competency}
                </Badge>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {rec.difficulty}
                </span>
              </div>

              {/* Explicit Karmayogi Integration Indicator */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-semibold">
                <Sparkles className="w-3 h-3 text-amber-600" aria-hidden="true" />
                <span>Recommended for your competency gap</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">
                {rec.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>{rec.durationMinutes} min</span>
                </span>
                <span>•</span>
                <span>
                  Source: <strong className="text-blue-900 font-semibold">{rec.source}</strong>
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed italic">
                “{rec.reason}”
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link href={`/${locale}/learner/resources/${rec.resourceId || "rec-stat-model-101"}`}>
                <Button className="w-full bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold h-8 flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" aria-hidden="true" />
                  <span>{t("startLearning")}</span>
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
