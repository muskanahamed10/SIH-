"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Clock, AlertTriangle } from "lucide-react";

interface AssessmentTimerProps {
  remainingSeconds: number;
  onTick: () => void;
  onTimeUp?: () => void;
}

export function AssessmentTimer({
  remainingSeconds,
  onTick,
  onTimeUp,
}: AssessmentTimerProps) {
  const t = useTranslations("baselineAssessment.runner");

  React.useEffect(() => {
    if (remainingSeconds <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, onTick, onTimeUp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  const isLowTime = remainingSeconds <= 120 && remainingSeconds > 0;

  return (
    <div
      role="timer"
      aria-label={`Time remaining: ${formattedMinutes} minutes and ${formattedSeconds} seconds`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
        isLowTime
          ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
          : "bg-slate-100 text-slate-800 border border-slate-200"
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
      )}
      <span className="font-mono text-sm tracking-tight">
        {formattedMinutes}:{formattedSeconds}
      </span>
      <span className="text-[11px] font-medium opacity-80">{t("remaining")}</span>
    </div>
  );
}
