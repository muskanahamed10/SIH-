"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompetencyErrorProps {
  onRetry: () => void;
}

export function CompetencyError({ onRetry }: CompetencyErrorProps) {
  const t = useTranslations("myCompetency.error");

  return (
    <Card className="p-12 text-center border-rose-200 bg-rose-50/30 space-y-4 max-w-lg mx-auto my-12">
      <div className="inline-flex p-3 rounded-full bg-rose-100 text-rose-700">
        <AlertCircle className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-xs text-slate-500">
          The competency intelligence engine encountered an unexpected network disruption while evaluating your cadre record.
        </p>
      </div>

      <Button
        onClick={onRetry}
        className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold px-4 py-2 gap-2 shadow-xs inline-flex items-center"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t("tryAgain")}</span>
      </Button>
    </Card>
  );
}
