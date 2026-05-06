import type { Metadata } from "next";

import { placeholderMetadata, renderPlaceholderPage } from "@/lib/placeholder-route";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  return placeholderMetadata(locale, "returnRefund");
}

export default async function ReturnRefundPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";
  return renderPlaceholderPage(locale, "returnRefund");
}
