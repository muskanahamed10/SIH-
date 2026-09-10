"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { UserCircle, Shield, ArrowLeftRight, LogOut, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function UserNav() {
  const t = useTranslations("common.user");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = pathname.includes("/admin");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition focus-visible:ring-2 focus-visible:ring-blue-800"
        aria-label={t("name")}
        aria-expanded={isOpen}
      >
        <div className="h-8 w-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-blue-950">
          {t("initials")}
        </div>
        <div className="hidden md:block text-left leading-tight">
          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <span>{t("name")}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </p>
          <p className="text-[11px] text-slate-500">{t("designation")}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in-50 duration-150">
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
            <p className="font-bold text-xs text-slate-900">{t("name")}</p>
            <p className="text-[11px] text-slate-600 font-medium">{t("designation")}</p>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              <Shield className="w-3 h-3 text-blue-700" />
              <span>{t("cadre")}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{t("department")}</p>
          </div>

          <div className="py-1 text-xs">
            <Link
              href={`/${locale}/learner/profile`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
            >
              <UserCircle className="w-4 h-4 text-slate-500" />
              <span>{t("profile")}</span>
            </Link>

            <Link
              href={isAdmin ? `/${locale}/learner` : `/${locale}/admin`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-500" />
              <span>
                {isAdmin ? navT("learner") : navT("admin")}
              </span>
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push(`/${locale}`);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("signOut")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
