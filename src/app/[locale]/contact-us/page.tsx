import type { Metadata } from "next";

import { placeholderMetadata, renderPlaceholderPage } from "@/lib/placeholder-route";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  return placeholderMetadata(locale, "contactUs");
}

export default async function ContactUsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  return renderPlaceholderPage(locale, "contactUs");
}
