import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CheckoutPaymentStub } from "@/components/checkout/checkout-payment-stub";
import { PageContainer } from "@/components/layout/page-container";
import { routing, type Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "checkout" });

  return {
    title: t("paymentMetaTitle"),
    description: t("paymentMetaDescription"),
  };
}

export default async function CheckoutPaymentPage({ params }: PageProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <PageContainer>
        <CheckoutPaymentStub />
      </PageContainer>
    </div>
  );
}
