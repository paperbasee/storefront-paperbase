import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/common/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { getStorefrontHomeCategorySections } from "@/lib/products";
import { getStorefrontBanners } from "@/lib/storefront";

export default async function HomePage() {
  const [tHome, categorySections, homeTopBanners, locale] = await Promise.all([
    getTranslations("home"),
    getStorefrontHomeCategorySections(),
    getStorefrontBanners("home_top"),
    getLocale(),
  ]);
  const heroBanner = homeTopBanners.find((banner) => Boolean(banner.image_url)) ?? null;

  return (
    <div
      className={`bg-surface pb-10 md:pb-14 ${heroBanner?.image_url ? "pt-0" : "pt-4 md:pt-6"}`}
    >
      {heroBanner?.image_url ? (
        <section className="mb-10 w-full md:mb-12">
          <Image
            src={heroBanner.image_url}
            alt={heroBanner.title?.trim() ? heroBanner.title : tHome("headline")}
            width={2400}
            height={1200}
            priority
            sizes="100vw"
            unoptimized
            className="block h-auto w-full max-w-full"
            style={{ width: "100%", height: "auto" }}
          />
        </section>
      ) : null}

      <PageContainer>
        <section id="products" className="space-y-12 md:space-y-16">
          {categorySections.length === 0 ? (
            <p className="card mx-auto max-w-lg text-center text-sm text-text/80">{tHome("emptyProducts")}</p>
          ) : (
            categorySections.map((section) => (
              <div key={section.slug} className="space-y-5 md:space-y-6">
                <header className="mx-auto max-w-4xl px-1 text-center">
                  <h2 className="text-pretty text-2xl font-extrabold tracking-tight text-text md:text-3xl lg:text-4xl">
                    {section.name}
                  </h2>
                  {section.description ? (
                    <p className="mx-auto mt-3 max-w-3xl text-pretty text-base font-medium leading-relaxed text-text/85 md:mt-4 md:text-lg md:leading-relaxed">
                      {section.description}
                    </p>
                  ) : null}
                </header>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {section.products.map((product, productIdx) => (
                    <ProductCard
                      key={product.public_id}
                      product={product}
                      locale={locale as Locale}
                      priority={productIdx < 4}
                    />
                  ))}
                </div>
                {section.showViewMore ? (
                  <div className="flex justify-center pt-1">
                    <Link
                      href={`/categories/${section.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-text shadow-sm transition-colors hover:bg-neutral-50"
                    >
                      {tHome("viewMore")}
                    </Link>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </section>
      </PageContainer>
    </div>
  );
}
