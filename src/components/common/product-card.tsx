import { getLocale } from "next-intl/server";

import { ProductCardAddButton } from "@/components/common/product-card-add-button";
import { ProductCardGallery } from "@/components/common/product-card-gallery";
import { Link } from "@/i18n/routing";
import { formatMoneyParts } from "@/lib/format";
import { getProductCardImageUrls } from "@/lib/product-card-meta";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  locale?: Locale;
  priority?: boolean;
};

export async function ProductCard({ product, locale: localeProp, priority }: ProductCardProps) {
  const locale = localeProp ?? ((await getLocale()) as Locale);
  const href = `/products/${product.slug}`;
  const imageUrls = getProductCardImageUrls(product);
  const brand = product.brand?.trim() ?? "";

  return (
    <article className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-[14px] border border-neutral-200/90 bg-surface text-left antialiased shadow-sm ring-1 ring-neutral-950/5">
      <div className="shrink-0 overflow-hidden rounded-t-[14px]">
        <ProductCardGallery urls={imageUrls} alt={product.name} href={href} priority={priority} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-3 pt-3">
        <Link
          href={href}
          className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:ring-offset-2"
        >
          <h3 className="line-clamp-2 text-[16px] font-light leading-snug tracking-normal text-text sm:text-[17px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2.5 flex items-center gap-x-1 overflow-hidden text-[14px] font-light leading-snug tracking-normal sm:text-[15px]">
          <span className="shrink-0 font-medium tabular-nums text-primary">
            {formatMoneyParts(product.price, locale).map((part, i) =>
              part.type === "currency" ? (
                <span key={i} className="font-bold">
                  {part.value}
                </span>
              ) : (
                <span key={i}>{part.value}</span>
              ),
            )}
          </span>
          {brand ? (
            <>
              <span className="select-none font-medium text-neutral-700" aria-hidden>
                ·
              </span>
              <span className="text-neutral-600">{brand}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-auto px-4 pb-4">
        <ProductCardAddButton product={product} productName={product.name} variant="card" />
      </div>
    </article>
  );
}
