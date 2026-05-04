"use client";

import { useLocale } from "next-intl";

import { ProductCardAddButton } from "@/components/common/product-card-add-button";
import { ProductCardGallery } from "@/components/common/product-card-gallery";
import { Link } from "@/i18n/routing";
import { formatMoney } from "@/lib/format";
import { getProductCardImageUrls } from "@/lib/product-card-meta";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";

type ShelfProductCardProps = {
  product: Product;
  locale?: Locale;
  priority?: boolean;
  aosDelay?: number;
};

export function ShelfProductCard({
  product,
  locale: localeProp,
  priority,
  aosDelay = 100,
}: ShelfProductCardProps) {
  const intlLocale = useLocale() as Locale;
  const locale = localeProp ?? intlLocale;
  const href = `/products/${product.slug}`;
  const imageUrls = getProductCardImageUrls(product);
  const isDiscounted =
    product.original_price != null && Number(product.original_price) > Number(product.price);

  return (
    <article
      suppressHydrationWarning
      data-aos="fade-up"
      data-aos-delay={String(aosDelay)}
      className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-card antialiased"
    >
      <div className="relative shrink-0 overflow-hidden">
        <ProductCardGallery urls={imageUrls} alt={product.name} href={href} priority={priority} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-1 px-3 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-normal tabular-nums text-foreground [font-size:clamp(18px,6.25vw,24px)]">
              {formatMoney(product.price, locale)}
            </span>
            {isDiscounted ? (
              <span className="text-header line-through [font-size:clamp(10px,1.5vw,14px)]">
                {formatMoney(product.original_price!, locale)}
              </span>
            ) : null}
          </div>

          <Link
            href={href}
            className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2"
          >
            <h3 className="line-clamp-2 font-light uppercase leading-tight tracking-wide text-foreground [font-size:clamp(10px,1.6vw,16px)]">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto w-full min-w-0 shrink-0 px-0 pb-3 pt-2">
          <div className="block w-full min-w-0 [&_button]:w-full">
            <ProductCardAddButton product={product} variant="card" afterAddBehavior="checkout" />
          </div>
        </div>
      </div>
    </article>
  );
}
