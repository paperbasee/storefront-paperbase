import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SupportTicketForm } from "@/components/support/support-ticket-form";
import { PageContainer } from "@/components/layout/page-container";
import { routing, type Locale } from "@/i18n/routing";

type SupportPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <div className="bg-surface py-8">
      <PageContainer>
        <div className="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-text">Support</h1>
          <p className="mt-2 text-sm text-neutral-600">Submit a support ticket and we will get back to you.</p>
          <div className="mt-6">
            <SupportTicketForm />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
