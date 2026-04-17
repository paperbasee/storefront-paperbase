import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { routing, type Locale } from "@/i18n/routing";
import { getServerPaperbaseConfig } from "@/lib/server/config";
import { getTrackerScriptSrc } from "@/lib/server/tracking";
import { getStorefrontStorePublic } from "@/lib/storefront";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const [t, store] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getStorefrontStorePublic(),
  ]);

  return {
    title: store.seo.default_title || t("title"),
    description: store.seo.default_description || t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const activeLocale = locale as Locale;
  const store = await getStorefrontStorePublic();
  const { publishableKey } = getServerPaperbaseConfig();
  const trackerSrc = getTrackerScriptSrc(store);

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages}>
      <Script src={trackerSrc} strategy="afterInteractive" />
      <Script
        id="paperbase-publishable-key"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.PAPERBASE_PUBLISHABLE_KEY = ${JSON.stringify(publishableKey)};`,
        }}
      />
      <div
        lang={activeLocale}
        className={`${inter.variable} flex min-h-screen flex-col bg-white ${
          activeLocale === "bn" ? "font-bn" : inter.className
        }`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
