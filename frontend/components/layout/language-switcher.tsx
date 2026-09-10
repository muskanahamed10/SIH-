"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchLocale = (nextLocale: "en" | "hi" | "te") => {
    if (nextLocale === currentLocale) return;
    const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : "";
    const segments = pathname.split("/");

    let targetPath = "";
    if (segments[1] === "en" || segments[1] === "hi" || segments[1] === "te") {
      segments[1] = nextLocale;
      targetPath = segments.join("/");
    } else {
      targetPath = `/${nextLocale}${pathname}`;
    }

    router.push(`${targetPath}${queryString}`);
  };

  return (
    <div
      data-testid="language-switcher"
      role="group"
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-lg",
        "border border-blue-500/60 bg-blue-950/90 text-white transition-all shadow-2xs backdrop-blur-xs select-none",
        className
      )}
    >
      <Languages className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-0.5" aria-hidden="true" />
      <select
        value={currentLocale}
        onChange={(e) => switchLocale(e.target.value as "en" | "hi" | "te")}
        aria-label="Language options"
        className="bg-transparent text-white font-bold text-[11px] sm:text-xs border-none outline-none cursor-pointer focus:ring-0 px-1 py-1"
      >
        <option value="hi" className="bg-[#0B2545] text-white font-devanagari">
          हिन्दी (Hindi)
        </option>
        <option value="te" className="bg-[#0B2545] text-white font-telugu">
          తెలుగు (Telugu)
        </option>
        <option value="en" className="bg-[#0B2545] text-white">
          English
        </option>
      </select>
    </div>
  );
}
