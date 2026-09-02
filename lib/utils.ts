import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getGapStatus(current: number, required: number): {
  status: "critical" | "moderate" | "meets" | "exceeds";
  labelKey: string;
  badgeClass: string;
} {
  const diff = current - required;
  if (diff >= 1) {
    return { status: "exceeds", labelKey: "status.exceeds", badgeClass: "bg-blue-100 text-blue-800 border-blue-200" };
  } else if (diff >= 0) {
    return { status: "meets", labelKey: "status.meets", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  } else if (diff === -1) {
    return { status: "moderate", labelKey: "status.moderate", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" };
  } else {
    return { status: "critical", labelKey: "status.critical", badgeClass: "bg-rose-100 text-rose-800 border-rose-200" };
  }
}
