import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/common/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { routing, type Locale } from "@/i18n/routing";
import { listProducts } from "@/lib/server/paperbase";
import { getStorefrontCategoryBySlug } from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const [category, products] = await Promise.all([
    getStorefrontCategoryBySlug(slug),
    listProducts({ category: slug }),
  ]);

  return (
    <div className="bg-surface py-8">
      <PageContainer>
        <h1 className="text-2xl font-semibold text-text">{category.name}</h1>
        <p className="mt-2 text-sm text-neutral-600">{category.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.results.map((product) => (
            <ProductCard
              key={product.public_id}
              product={{
                ...product,
                extra_data: product.extra_data ?? {},
              }}
            />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
