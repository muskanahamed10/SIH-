import * as React from "react";
import Link from "next/link";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "gov" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-slate-300 bg-white/60",
        className
      )}
      role="status"
    >
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        <Icon className="w-6 h-6 text-slate-500" aria-hidden="true" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action &&
            (action.href ? (
              <Button asChild variant={action.variant || "gov"} size="sm">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button
                variant={action.variant || "gov"}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Button asChild variant="outline" size="sm">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
