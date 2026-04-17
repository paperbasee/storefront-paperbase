import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductDetailAccordions } from "@/components/product/product-detail-accordions";
import { ProductDetailBuySection } from "@/components/product/product-detail-buy-section";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/common/product-card";
import { PageContainer } from "@/components/layout/page-container";
import { Link, routing, type Locale } from "@/i18n/routing";
import { categoryDisplayName } from "@/lib/category-display";
import { formatMoney, parseDecimal } from "@/lib/format";
import {
  getStorefrontProductDetail,
  getStorefrontProductSlugs,
  getStorefrontRelatedProducts,
} from "@/lib/products";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getStorefrontProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    return {};
  }

  const product = await getStorefrontProductDetail(slug);
  if (!product) {
    return {};
  }

  return {
    title: `${product.name} · Sarar Global`,
    description: product.description || product.name,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const activeLocale = locale as Locale;

  const [product, relatedProducts] = await Promise.all([
    getStorefrontProductDetail(slug),
    getStorefrontRelatedProducts(slug),
  ]);
  if (!product) {
    notFound();
  }

  const tDetail = await getTranslations("productDetail");
  const productName = product.name;
  const unitPrice = product.price;
  const discountPercent =
    product.original_price != null && parseDecimal(product.original_price) > 0
      ? Math.max(
          1,
          Math.round((1 - parseDecimal(product.price) / parseDecimal(product.original_price)) * 100),
        )
      : null;
  const detailBullets = [product.description];

  const accordionItems = [{ id: "product-details", title: tDetail("sectionProductDetails"), body: "" }];

  const categoryLabel = categoryDisplayName(product.category_name);
  const galleryImages = product.images.length
    ? product.images.map((item) => item.image_url || "/placeholders/hero.svg")
    : [product.image_url || "/placeholders/hero.svg"];

  return (
    <div className="bg-surface">
      <section className="bg-white pb-16 lg:pb-24">
        <PageContainer>
          <nav className="py-4 text-sm text-neutral-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-emerald-700">
                  {tDetail("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden className="text-neutral-400">
                <ChevronRight className="size-3.5" strokeWidth={2} />
              </li>
              <li>
                <Link href="/#products" className="transition-colors hover:text-emerald-700">
                  {tDetail("breadcrumbProducts")}
                </Link>
              </li>
              <li aria-hidden className="text-neutral-400">
                <ChevronRight className="size-3.5" strokeWidth={2} />
              </li>
              <li className="text-neutral-500">{categoryLabel}</li>
              <li aria-hidden className="text-neutral-400">
                <ChevronRight className="size-3.5" strokeWidth={2} />
              </li>
              <li className="max-w-[min(100%,28rem)] truncate font-medium text-text">{productName}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <div className="min-w-0 lg:max-w-none">
              <ProductGallery
                images={galleryImages}
                productName={productName}
                discountPercent={discountPercent}
              />
            </div>

            <div className="flex min-w-0 flex-col gap-5 lg:ps-2 xl:ps-6">
              <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-[1.75rem] lg:leading-snug">
                {productName}
              </h1>

              <div className="flex flex-col gap-1 text-xs text-neutral-500 sm:flex-row sm:flex-wrap sm:gap-x-6">
                <span>
                  {tDetail("skuLabel")} {product.public_id}
                </span>
              </div>

              <div className="space-y-4 border-b border-neutral-100 pb-8">
                {product.original_price != null ? (
                  <div>
                    <p className="price-display-eyebrow">{tDetail("nowLabel")}</p>
                    <p className="price-display-hero mt-1.5">{formatMoney(unitPrice, activeLocale)}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                        <span className="price-display-eyebrow-neutral">{tDetail("wasLabel")}</span>
                        <span className="price-display-compare">
                          {formatMoney(product.original_price, activeLocale)}
                        </span>
                      </div>
                      {discountPercent != null ? (
                        <span className="price-display-discount-pill">
                          {tDetail("priceDiscount", { percent: discountPercent })}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="price-display-hero">{formatMoney(unitPrice, activeLocale)}</p>
                )}
              </div>

              <ProductDetailBuySection
                productPublicId={product.public_id}
                productName={productName}
                unitPrice={unitPrice}
                imageUrl={product.image_url}
                stockStatus={product.stock_status}
                variants={product.variants}
              />

              <div className="pt-2">
                <ProductDetailAccordions
                  items={accordionItems}
                  bulletParagraphs={detailBullets}
                  bulletItemId="product-details"
                  defaultOpenId="product-details"
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-neutral-100 bg-surface py-10">
          <PageContainer>
            <h2 className="mb-5 text-xl font-semibold text-text">{tDetail("breadcrumbProducts")}</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts.map((related) => (
                <ProductCard key={related.public_id} product={related} />
              ))}
            </div>
          </PageContainer>
        </section>
      ) : null}
    </div>
  );
}
