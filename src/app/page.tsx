import { redirect } from "next/navigation";

import { getStorefrontStorePublic } from "@/lib/storefront";

export default async function RootPage() {
  const store = await getStorefrontStorePublic();
  const locale = store.language === "bn" ? "bn" : "en";
  redirect(`/${locale}`);
}
