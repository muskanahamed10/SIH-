import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";

export interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  delta?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  variant?: "default" | "gov" | "warning" | "success" | "critical";
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  delta,
  variant = "default",
  className,
}: StatCardProps) {
  const iconColor = {
    default: "text-slate-600 bg-slate-100",
    gov: "text-blue-900 bg-blue-50",
    warning: "text-amber-600 bg-amber-50",
    success: "text-emerald-700 bg-emerald-50",
    critical: "text-rose-700 bg-rose-50",
  }[variant];

  return (
    <Card className={cn("border-slate-200 shadow-xs bg-white", className)}>
      <CardHeader className="p-4 pb-1">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </CardDescription>
          {Icon && (
            <div className={cn("p-1.5 rounded-md", iconColor)}>
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        {delta && (
          <div className="flex items-center gap-1.5 text-xs font-medium mb-1">
            <span
              className={cn(
                delta.isPositive ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {delta.isPositive ? "+" : ""}
              {delta.value}
            </span>
            {delta.label && (
              <span className="text-slate-400 text-[11px]">{delta.label}</span>
            )}
          </div>
        )}
        {description && (
          <p className="text-[11px] text-slate-500 leading-normal">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
