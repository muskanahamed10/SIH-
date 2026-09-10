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
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg",
        "border border-blue-900/80 bg-blue-950/60 text-white transition-all shadow-2xs backdrop-blur-xs select-none",
        className
      )}
    >
      <Languages className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
      <div className="flex items-center gap-1 text-[11px] sm:text-xs">
        {/* English */}
        <button
          type="button"
          onClick={() => switchLocale("en")}
          data-testid="language-btn-en"
          aria-pressed={currentLocale === "en"}
          title="Switch to English"
          className={cn(
            "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1",
            currentLocale === "en"
              ? "text-amber-300 font-extrabold underline decoration-amber-400 decoration-2 underline-offset-2"
              : "text-blue-200/80 hover:text-white font-medium"
          )}
        >
          English
        </button>

        <span className="text-blue-400/50 text-[10px]" aria-hidden="true">|</span>

        {/* Hindi */}
        <button
          type="button"
          onClick={() => switchLocale("hi")}
          data-testid="language-btn-hi"
          aria-pressed={currentLocale === "hi"}
          title="हिन्दी में बदलें (Switch to Hindi)"
          className={cn(
            "transition-colors font-devanagari focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1",
            currentLocale === "hi"
              ? "text-amber-300 font-extrabold underline decoration-amber-400 decoration-2 underline-offset-2"
              : "text-blue-200/80 hover:text-white font-medium"
          )}
        >
          हिन्दी
        </button>

        <span className="text-blue-400/50 text-[10px]" aria-hidden="true">|</span>

        {/* Telugu */}
        <button
          type="button"
          onClick={() => switchLocale("te")}
          data-testid="language-btn-te"
          aria-pressed={currentLocale === "te"}
          title="తెలుగులోకి మార్చండి (Switch to Telugu)"
          className={cn(
            "transition-colors font-telugu focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded px-1",
            currentLocale === "te"
              ? "text-amber-300 font-extrabold underline decoration-amber-400 decoration-2 underline-offset-2"
              : "text-blue-200/80 hover:text-white font-medium"
          )}
        >
          తెలుగు
        </button>
      </div>
    </div>
  );
}
