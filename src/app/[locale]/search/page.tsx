import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/common/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { routing, type Locale } from "@/i18n/routing";
import { getStorefrontCombinedSearch } from "@/lib/products";

type SearchPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const { q = "" } = await searchParams;
  const t = await getTranslations("nav");
  const response = q.trim().length >= 2 ? await getStorefrontCombinedSearch(q.trim()) : null;

  return (
    <div className="bg-surface py-8">
      <PageContainer>
        <h1 className="text-2xl font-semibold text-text">{t("products")}</h1>
        <p className="mt-2 text-sm text-neutral-600">{q ? `Results for "${q}"` : "Type at least 2 characters."}</p>
        {response?.products?.length ? (
          <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {response.products.map((product) => (
              <ProductCard
                key={product.public_id}
                product={{
                  ...product,
                  extra_data: product.extra_data ?? {},
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-neutral-600">No products found.</p>
        )}
      </PageContainer>
    </div>
  );
}
