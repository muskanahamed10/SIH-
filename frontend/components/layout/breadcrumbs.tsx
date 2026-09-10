"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("breadcrumbs");

  // Split path into segments and remove empty parts or locale
  const segments = pathname.split("/").filter(Boolean);
  const pathSegments = segments[0] === locale ? segments.slice(1) : segments;

  if (pathSegments.length === 0) {
    return null;
  }

  const validKeys = [
    "home",
    "learner",
    "admin",
    "dashboard",
    "competencies",
    "assessments",
    "assessment",
    "learning-path",
    "resources",
    "practice",
    "progress",
    "profile",
    "team",
    "team-gaps",
    "roles",
    "questions",
    "mcq-review",
    "analytics",
  ] as const;

  type BreadcrumbKey = (typeof validKeys)[number];

  const items = pathSegments.map((segment, index) => {
    const href = `/${locale}/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;

    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    if (validKeys.includes(segment as BreadcrumbKey)) {
      label = t(segment as BreadcrumbKey);
    }

    return {
      href,
      label,
      isLast,
    };
  });

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

        {items.map((item) => (
          <li key={item.href} className="inline-flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            {item.isLast ? (
              <span
                className="font-semibold text-slate-900 px-1 py-0.5"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-slate-500 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-800 rounded px-1 py-0.5"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
