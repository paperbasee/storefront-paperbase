import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SupportTicketForm } from "@/components/support/support-ticket-form";
import { PageContainer } from "@/components/layout/page-container";
import { routing, type Locale } from "@/i18n/routing";

type SupportPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SupportPage({ params }: SupportPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("support");

  return (
    <div className="bg-card py-8">
      <PageContainer>
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>
          <div className="mt-6">
            <SupportTicketForm />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
