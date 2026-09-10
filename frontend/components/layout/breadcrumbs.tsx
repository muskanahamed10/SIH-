"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";

const segmentLabelKeyMap: Record<string, string> = {
  learner: "dashboard",
  dashboard: "dashboard",
  competency: "myCompetency",
  competencies: "competencies",
  assessments: "assessments",
  assessment: "assessments",
  "assessment-results": "assessments",
  reassessment: "assessments",
  "learning-path": "learningPath",
  recommendations: "recommendations",
  resources: "resources",
  practice: "practice",
  progress: "progress",
  profile: "profile",
  "quiz-generator": "quizGenerator",
  explore: "explore",
  learning: "myLearning",
  achievement: "achievement",
  admin: "adminDashboard",
  adminDashboard: "adminDashboard",
  manager: "managerDashboard",
  managerDashboard: "managerDashboard",
  team: "team",
  "team-gaps": "teamGaps",
  roles: "roles",
  questions: "questions",
  "mcq-review": "mcqReview",
  analytics: "analytics",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  // Split path into segments and remove empty parts or locale
  const rawSegments = pathname.split("/").filter(Boolean);
  const pathSegments = rawSegments[0] === locale ? rawSegments.slice(1) : rawSegments;

  if (pathSegments.length === 0) {
    return null;
  }

  // Determine display segments:
  // 1. When on /learner or /learner/dashboard, show "Dashboard" so both left sidebar and top breadcrumb appear as Dashboard.
  // 2. When on sub-pages like /learner/competency, /learner/assessments, strip the internal 'learner' routing prefix
  //    so "learner/dashboard" is not fixed in the breadcrumbs when opening any other page.
  let displaySegments: { segment: string; href: string }[] = [];

  const firstSeg = pathSegments[0];

  if (firstSeg === "learner") {
    if (pathSegments.length === 1 || (pathSegments.length === 2 && pathSegments[1] === "dashboard")) {
      displaySegments = [{ segment: "dashboard", href: `/${locale}/learner` }];
    } else {
      const subSegments = pathSegments.slice(1);
      displaySegments = subSegments.map((seg, idx) => {
        const subPath = subSegments.slice(0, idx + 1).join("/");
        return {
          segment: seg,
          href: `/${locale}/learner/${subPath}`,
        };
      });
    }
  } else if (firstSeg === "admin") {
    if (pathSegments.length === 1 || (pathSegments.length === 2 && pathSegments[1] === "dashboard")) {
      displaySegments = [{ segment: "adminDashboard", href: `/${locale}/admin` }];
    } else {
      const subSegments = pathSegments.slice(1);
      displaySegments = subSegments.map((seg, idx) => ({
        segment: seg,
        href: `/${locale}/admin/${subSegments.slice(0, idx + 1).join("/")}`,
      }));
    }
  } else if (firstSeg === "manager") {
    if (pathSegments.length === 1 || (pathSegments.length === 2 && pathSegments[1] === "dashboard")) {
      displaySegments = [{ segment: "managerDashboard", href: `/${locale}/manager` }];
    } else {
      const subSegments = pathSegments.slice(1);
      displaySegments = subSegments.map((seg, idx) => ({
        segment: seg,
        href: `/${locale}/manager/${subSegments.slice(0, idx + 1).join("/")}`,
      }));
    }
  } else {
    displaySegments = pathSegments.map((seg, idx) => ({
      segment: seg,
      href: `/${locale}/${pathSegments.slice(0, idx + 1).join("/")}`,
    }));
  }

  function getLabel(segment: string): string {
    const key = segmentLabelKeyMap[segment];
    if (key) {
      try {
        return t(key as any);
      } catch {
        // Fallback below
      }
    }
    if (segment === "1" || segment.match(/^[0-9]+$/)) {
      return `#${segment}`;
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <li className="inline-flex items-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-800 rounded px-1 py-0.5"
            aria-label={t("home")}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span className="sr-only sm:not-sr-only">{t("home")}</span>
          </Link>
        </li>

        {displaySegments.map((item, index) => {
          const isLast = index === displaySegments.length - 1;
          const label = getLabel(item.segment);

          return (
            <li key={item.href} className="inline-flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              {isLast ? (
                <span
                  className="font-semibold text-slate-900 px-1 py-0.5"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-500 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-800 rounded px-1 py-0.5"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
