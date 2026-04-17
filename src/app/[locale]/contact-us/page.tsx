import type { Metadata } from "next";

import { placeholderMetadata, renderPlaceholderPage } from "@/lib/placeholder-route";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return placeholderMetadata(locale, "contactUs");
}

export default async function ContactUsPage({ params }: PageProps) {
  const { locale } = await params;
  return renderPlaceholderPage(locale, "contactUs");
}
