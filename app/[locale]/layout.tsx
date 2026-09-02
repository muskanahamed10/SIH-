import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Official Statistical System | AI-Enabled Competency & Learning Gap Platform",
  description: "Ministry of Statistics and Programme Implementation (MoSPI) - SIH 2026 Problem Statement 101",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
