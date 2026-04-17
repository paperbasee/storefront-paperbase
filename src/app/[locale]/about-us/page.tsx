import type { Metadata } from "next";

import { placeholderMetadata, renderPlaceholderPage } from "@/lib/placeholder-route";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return placeholderMetadata(locale, "aboutUs");
}

export default async function AboutUsPage({ params }: PageProps) {
  const { locale } = await params;
  return renderPlaceholderPage(locale, "aboutUs");
}
