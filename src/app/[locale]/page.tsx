import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/common/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/i18n/routing";
import { getStorefrontHomeCategorySections } from "@/lib/products";
import { getStorefrontBanners } from "@/lib/storefront";

export default async function HomePage() {
  const tHome = await getTranslations("home");
  const [categorySections, banners] = await Promise.all([
    getStorefrontHomeCategorySections(),
    getStorefrontBanners(),
  ]);
  const heroBanner = banners.find((banner) => banner.placement_slots.includes("home_top")) ?? banners[0];
  const heroImage = heroBanner?.image_url ?? "/placeholders/hero.svg";
  const heroAlt = heroBanner?.title ?? tHome("headline");

  return (
    <div className="bg-surface pb-10 pt-4 md:pb-14 md:pt-6">
      <section className="relative mb-10 w-full min-h-[280px] overflow-hidden md:mb-12 md:min-h-[380px]">
        <Image
          src={heroImage}
          alt={heroAlt}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover object-center"
        />
      </section>

      <PageContainer>
        <section id="products" className="space-y-12 md:space-y-14">
          {categorySections.length === 0 ? (
            <p className="card text-sm text-text/80">{tHome("emptyProducts")}</p>
          ) : (
            categorySections.map((section) => (
              <div key={section.slug} className="space-y-4">
                <h2 className="text-2xl font-semibold text-text">{section.name}</h2>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {section.products.map((product) => (
                    <ProductCard key={product.public_id} product={product} />
                  ))}
                </div>
                {section.showViewMore ? (
                  <div className="flex justify-center pt-1">
                    <Link
                      href={`/categories/${section.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-text shadow-sm transition-colors hover:bg-neutral-50"
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
