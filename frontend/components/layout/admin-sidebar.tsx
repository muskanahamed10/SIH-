"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  BarChart3,
  Grid3X3,
  Database,
  GitBranch,
  CheckCircle2,
  LineChart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: t("adminDashboard"),
      icon: BarChart3,
      exact: true,
      aliases: [`/${locale}/admin/dashboard`],
    },
    {
      href: `/${locale}/admin/team`,
      label: t("team"),
      icon: Grid3X3,
      aliases: [`/${locale}/admin/team-gaps`],
    },
    {
      href: `/${locale}/admin/competencies`,
      label: t("competencyMatrix"),
      icon: Database,
    },
    {
      href: `/${locale}/admin/roles`,
      label: t("roles"),
      icon: GitBranch,
    },
    {
      href: `/${locale}/admin/questions`,
      label: t("questions"),
      icon: CheckCircle2,
      badge: "2",
      aliases: [`/${locale}/admin/mcq-review`],
    },
    {
      href: `/${locale}/admin/analytics`,
      label: t("analytics"),
      icon: LineChart,
    },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between p-3 bg-slate-900 text-slate-200">
      <div className="space-y-4">
        {/* Mobile header close button */}
        <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm text-white">{t("admin")}</span>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Desktop collapse button */}
        <div className="hidden lg:flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("admin")}</span>
            </div>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                "p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition",
                isCollapsed && "mx-auto"
              )}
              aria-label={t("toggleSidebar")}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExactMatch = pathname === item.href;
            const isAliasMatch = item.aliases?.some((a) => pathname.startsWith(a));
            const isSubpathMatch = !item.exact && pathname.startsWith(item.href);
            const isActive = isExactMatch || isAliasMatch || isSubpathMatch;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative",
                  isActive
                    ? "bg-blue-700 text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-800",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom NSSTA Governance card */}
      {!isCollapsed ? (
        <div className="mt-6 p-3 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("nsstaGovernance")}</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {t("cadreReviewCell")}
          </p>
        </div>
      ) : (
        <div className="mt-6 flex justify-center" title={t("nsstaGovernance")}>
          <div className="p-2 rounded-md bg-slate-800 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden lg:block border-r border-slate-800 bg-slate-900 transition-all duration-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-slate-900 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
