import { getLocale } from "next-intl/server";

import { ProductCardAddButton } from "@/components/common/product-card-add-button";
import { ProductCardGallery } from "@/components/common/product-card-gallery";
import { Link } from "@/i18n/routing";
import { formatMoney } from "@/lib/format";
import { getProductCardImageUrls } from "@/lib/product-card-meta";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  locale?: Locale;
  priority?: boolean;
  aosDelay?: number;
};

export async function ProductCard({ product, locale: localeProp, priority, aosDelay = 100 }: ProductCardProps) {
  const locale = localeProp ?? ((await getLocale()) as Locale);
  const href = `/products/${product.slug}`;
  const imageUrls = getProductCardImageUrls(product);
  const isDiscounted =
    product.original_price != null && Number(product.original_price) > Number(product.price);

  return (
    <article
      suppressHydrationWarning
      data-aos="fade-up"
      data-aos-delay={String(aosDelay)}
      className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-card text-center antialiased"
    >
      <div className="relative shrink-0 overflow-hidden">
        <ProductCardGallery urls={imageUrls} alt={product.name} href={href} priority={priority} />
        <div className="absolute bottom-2 right-2 z-[2] md:bottom-4 md:right-4 lg:bottom-5 lg:right-5">
          <ProductCardAddButton product={product} variant="icon" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-2 pt-4">
        <Link
          href={href}
          className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2"
        >
          <h3 className="line-clamp-2 text-[18px] font-light uppercase leading-tight tracking-wide text-foreground [font-size:clamp(10px,1.6vw,19px)]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="font-normal tabular-nums text-foreground [font-size:clamp(18px,6.25vw,24px)]">
            {formatMoney(product.price, locale)}
          </span>
          {isDiscounted ? (
            <span className="text-header line-through [font-size:clamp(10px,1.5vw,14px)]">
              {formatMoney(product.original_price!, locale)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
