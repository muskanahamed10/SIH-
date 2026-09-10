"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LayoutDashboard, Award, Route, BookOpen, CheckSquare, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LearnerNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const navItems = [
    { href: `/${locale}/learner/dashboard`, label: t("dashboard"), icon: LayoutDashboard },
    { href: `/${locale}/learner/assessments`, label: t("assessments"), icon: Award },
    { href: `/${locale}/learner/learning-path`, label: t("learningPath"), icon: Route },
    { href: `/${locale}/learner/resources`, label: t("resources"), icon: BookOpen },
    { href: `/${locale}/learner/practice`, label: t("practice"), icon: CheckSquare },
    { href: `/${locale}/learner/profile`, label: t("profile"), icon: UserCircle },
  ];

  return (
    <nav className="border-b bg-slate-50/80 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href.includes("dashboard") && pathname === `/${locale}`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-[#0B2545] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
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
