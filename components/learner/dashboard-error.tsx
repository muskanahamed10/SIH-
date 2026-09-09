"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  onRetry: () => void;
}

export function DashboardError({ onRetry }: DashboardErrorProps) {
  const t = useTranslations("dashboard.error");

  return (
    <div
      role="alert"
      className="p-8 my-8 rounded-xl border border-rose-200 bg-rose-50 text-center space-y-4 max-w-xl mx-auto shadow-xs"
    >
      <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" aria-hidden="true" />
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-rose-950">
          {t("title")}
        </h2>
        <p className="text-xs text-rose-800">
          Please check your network connectivity or official directory access and try again.
        </p>
      </div>
      <Button
        onClick={onRetry}
        className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2 mx-auto shadow-xs"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t("tryAgain")}</span>
      </Button>
    </div>
  );
}
