"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "@/hooks/use-sidebar";
import { GovHeader } from "./gov-header";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, isCollapsed, toggleMobile, closeMobile, toggleCollapse } = useSidebar();
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      <GovHeader onToggleSidebar={toggleMobile} />
      <div className="flex-1 flex w-full">
        <AdminSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={closeMobile}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t bg-white py-6 text-center text-xs text-slate-500 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
              <p>{t("footer.copyright")}</p>
              <p className="mt-1 text-slate-400">{t("footer.adminNotice")}</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
