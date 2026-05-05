import type { Metadata } from "next";

import { placeholderMetadata, renderPlaceholderPage } from "@/lib/placeholder-route";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  return placeholderMetadata(locale, "aboutUs");
}

export default async function AboutUsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  return renderPlaceholderPage(locale, "aboutUs");
}
