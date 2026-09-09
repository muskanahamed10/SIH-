import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  errorDetails?: string;
  className?: string;
}

export function ErrorState({
  title = "An unexpected error occurred",
  description = "We were unable to load the requested information. Please check your network connection and try again.",
  onRetry,
  retryLabel = "Try Again",
  errorDetails,
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-xl border border-rose-200 bg-rose-50/50",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3.5">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-rose-950 tracking-tight">
        {title}
      </h3>

      <p className="mt-1 text-xs sm:text-sm text-rose-800/80 max-w-md leading-relaxed">
        {description}
      </p>

      {errorDetails && (
        <div className="mt-3 w-full max-w-md text-left">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="text-[11px] font-medium text-rose-700 hover:text-rose-900 underline focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
          >
            {showDetails ? "Hide technical details" : "Show technical details"}
          </button>
          {showDetails && (
            <pre className="mt-2 p-2.5 bg-rose-100/80 rounded text-[10px] text-rose-900 overflow-x-auto font-mono">
              {errorDetails}
            </pre>
          )}
        </div>
      )}

      {onRetry && (
        <div className="mt-5">
          <Button
            variant="destructive"
            size="sm"
            onClick={onRetry}
            className="gap-2 bg-rose-700 hover:bg-rose-800 text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{retryLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
