import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { PlaceholderPageShell } from "@/components/layout/placeholder-page-shell";
import { routing, type Locale } from "@/i18n/routing";

export type PlaceholderTitleKey =
  | "account"
  | "cart"
  | "wishlist"
  | "blog"
  | "information"
  | "aboutUs"
  | "contactUs"
  | "privacyPolicy"
  | "returnRefund"
  | "cancellationPolicy";

export async function placeholderMetadata(locale: string, titleKey: PlaceholderTitleKey): Promise<Metadata> {
  if (!routing.locales.includes(locale as Locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "placeholderPages" });
  const common = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t(`titles.${titleKey}`)} · ${common("brand")}`,
    description: t("message"),
  };
}

export async function renderPlaceholderPage(locale: string, titleKey: PlaceholderTitleKey) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "placeholderPages" });
  const states = await getTranslations({ locale, namespace: "states" });

  return (
    <PlaceholderPageShell
      title={t(`titles.${titleKey}`)}
      message={t("message")}
      backLabel={states("goHome")}
    />
  );
}
