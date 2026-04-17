import { BadgeCheck, Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { ProductCardAddButton } from "@/components/common/product-card-add-button";
import { ProductCardCarousel } from "@/components/common/product-card-carousel";
import { Link } from "@/i18n/routing";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

function cardGalleryImages(product: Product): string[] {
  if (product.image_url) {
    return [product.image_url, product.image_url, product.image_url, product.image_url];
  }
  return ["/placeholders/hero.svg", "/placeholders/hero.svg", "/placeholders/hero.svg", "/placeholders/hero.svg"];
}

export async function ProductCard({ product }: ProductCardProps) {
  const tCard = await getTranslations("productCard");
  const locale = (await getLocale()) as Locale;
  const activePrice = product.price;
  const href = `/products/${product.slug}`;

  const soldCount = 0;
  const rating = 5;
  const ratingLabel = tCard("ratingValue", { value: rating.toFixed(1) });
  const location = product.category_name;
  const storeName = product.brand ?? tCard("stores.sararOfficial");

  return (
    <article
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm",
      )}
    >
      <ProductCardCarousel
        images={cardGalleryImages(product)}
        productName={product.name}
        href={href}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-1 px-2 pb-2 pt-1.5 md:gap-1 md:px-2 md:pb-2 md:pt-1.5">
        <Link
          href={href}
          className="min-h-[2.125rem] min-w-0 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-white md:min-h-[2.375rem]"
        >
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-tight text-neutral-800 transition-colors hover:text-primary md:text-sm md:leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex min-h-[1.875rem] shrink-0 flex-col justify-start gap-0 text-[10px] leading-tight text-neutral-600 sm:min-h-[2.5rem] sm:justify-center sm:gap-0.5 sm:text-xs md:min-h-[1.75rem] md:justify-start md:gap-0 md:leading-tight">
          <div className="flex min-w-0 flex-nowrap items-center gap-x-1.5 sm:gap-x-2 md:gap-x-1.5">
            <span className="shrink-0 font-bold tabular-nums text-primary">
              {formatMoney(activePrice, locale)}
            </span>
            <span className="hidden h-3 w-px shrink-0 bg-neutral-200 sm:block" aria-hidden />
            <span className="shrink-0 tabular-nums text-neutral-600">{tCard("sold", { count: soldCount })}</span>
          </div>
          <span className="block truncate text-neutral-500 sm:min-h-[1.25rem] md:min-h-0">{location}</span>
        </div>

        <div className="flex min-h-[1.25rem] shrink-0 flex-nowrap items-center gap-x-2 overflow-hidden text-[10px] leading-tight text-neutral-700 sm:min-h-[1.5rem] sm:gap-x-4 sm:text-xs md:min-h-[1.25rem] md:gap-x-2 md:leading-tight">
          <span className="inline-flex shrink-0 items-center gap-0.5 sm:gap-1 md:gap-0.5">
            <Star className="size-3 shrink-0 fill-rating text-rating sm:size-3.5 md:size-3" strokeWidth={0} aria-hidden />
            <span className="font-medium tabular-nums">{ratingLabel}</span>
          </span>
          {Boolean(product.brand) ? (
            <span className="inline-flex min-w-0 items-center gap-0.5 text-primary sm:gap-1 md:gap-0.5">
              <BadgeCheck className="size-3.5 shrink-0 sm:size-4 md:size-3.5" strokeWidth={2} aria-hidden />
              <span className="min-w-0 truncate font-medium">{storeName}</span>
            </span>
          ) : (
            <span className="min-w-0 truncate font-medium text-primary">{storeName}</span>
          )}
        </div>

        <div className="mt-auto shrink-0 pt-0 md:pt-0">
          <ProductCardAddButton product={product} productName={product.name} />
        </div>
      </div>
    </article>
  );
}
