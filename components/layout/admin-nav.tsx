"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { BarChart3, Database, GitBranch, CheckCircle2, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const navItems = [
    { href: `/${locale}/admin/dashboard`, label: t("analytics"), icon: BarChart3 },
    { href: `/${locale}/admin/competencies`, label: t("competencies"), icon: Database },
    { href: `/${locale}/admin/roles`, label: t("roles"), icon: GitBranch },
    { href: `/${locale}/admin/mcq-review`, label: t("mcqReview"), icon: CheckCircle2 },
    { href: `/${locale}/admin/team-gaps`, label: t("teamGaps"), icon: Grid3X3 },
  ];

  return (
    <nav className="border-b bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
