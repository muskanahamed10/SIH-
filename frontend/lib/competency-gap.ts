/**
 * Deterministic Competency Gap & Priority Classification Logic
 * For India''s Official Statistical System - SIH PS101
 */

export type GapPriority = "Critical" | "High" | "Moderate" | "Low";

export interface CompetencyGapCalculation {
  required: number;
  current: number;
  gap: number;
  priority: GapPriority;
  statusText: string;
}

/**
 * Classifies gap percentage into 4 strict priority tiers:
 * - Critical: gap >= 30% (e.g., Python: Current 38%, Required 75%, Gap 37% -> Critical)
 * - High: 20% <= gap < 30%
 * - Moderate: 10% <= gap < 20%
 * - Low: gap < 10% (e.g., Statistics: Current 82%, Required 85%, Gap 3% -> Low)
 */
export function classifyPriority(gap: number): GapPriority {
  if (gap >= 30) return "Critical";
  if (gap >= 20) return "High";
  if (gap >= 10) return "Moderate";
  return "Low";
}

/**
 * Pure deterministic calculation of competency gap and priority
 */
export function calculateDeterministicGap(required: number, current: number): CompetencyGapCalculation {
  const gap = Math.max(0, required - current);
  const priority = classifyPriority(gap);
  let statusText = "Meets Benchmark";

  if (gap >= 30) {
    statusText = "Critical Gap";
  } else if (gap >= 20) {
    statusText = "Priority Gap";
  } else if (gap >= 10) {
    statusText = "Developing";
  } else if (gap > 0) {
    statusText = "Near Benchmark";
  } else if (current > required) {
    statusText = "Above Requirement";
  } else {
    statusText = "Achieved";
  }

  return {
    required,
    current,
    gap,
    priority,
    statusText,
  };
}

/**
 * Deterministic ranking to extract Top N recommended focus areas by largest gap
 */
export function rankTopFocusAreas<T extends { gap: number }>(items: T[], topN: number = 3): T[] {
  return [...items].sort((a, b) => b.gap - a.gap).slice(0, topN);
}
