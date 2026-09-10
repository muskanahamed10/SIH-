"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { GovHeader } from "./gov-header";
import { AppSidebar } from "./app-sidebar";
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils";

interface AppShellProps {
  role: "learner" | "admin";
  children: React.ReactNode;
}

export function AppShell({ role, children }: AppShellProps) {
  const { isMobileOpen, isCollapsed, toggleMobile, closeMobile, toggleCollapse } = useSidebar();
  const isLearner = role === "learner";

  return (
    <div className={cn("min-h-screen flex flex-col", isLearner ? "bg-slate-50" : "bg-slate-100/70")}>
      {/* Accessibility: Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-900 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Government Navigation Header */}
      <GovHeader onToggleSidebar={toggleMobile} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full">
        {/* Reusable AppSidebar (handles learner & admin) */}
        <AppSidebar
          role={role}
          isMobileOpen={isMobileOpen}
          onCloseMobile={closeMobile}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Scrollable Page Body */}
        <div className="flex-1 flex flex-col min-w-0">
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none"
          >
            {/* Automatic Breadcrumbs Navigation */}
            <Breadcrumbs />

            {/* Child Page Content */}
            {children}
          </main>

          {/* Semantic Footer */}
          <footer
            className="border-t bg-white py-6 text-center text-xs text-slate-500 mt-auto select-none"
            role="contentinfo"
          >
            <div className="max-w-7xl mx-auto px-4">
              <p>© 2026 Ministry of Statistics and Programme Implementation (MoSPI) • Government of India</p>
              <p className="mt-1 text-slate-400">
                {isLearner
                  ? "Integrated with iGOT Karmayogi National Capacity Building Framework • Official Cadre Portal"
                  : "National Statistical Systems Training Academy (NSSTA) • Governance & SME Administration"}
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
