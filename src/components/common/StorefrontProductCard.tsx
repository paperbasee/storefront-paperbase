"use client";

import { useEffect, useState } from "react";

import { ProductCard } from "@/components/common/product-card";
import { ShelfProductCard } from "@/components/common/ShelfProductCard";
import { useCardVariant } from "@/lib/theme/useCardVariant";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";

export type StorefrontProductCardProps = {
  product: Product;
  locale?: Locale;
  priority?: boolean;
  aosDelay?: number;
};

/**
 * Picks classic vs shelf layout from the same theme source as the palette
 * (`ThemeProvider` / SWR on `/api/v1/theming`), so dashboard card changes
 * track client-side like colors without relying on ISR for HTML.
 */
export function StorefrontProductCard(props: StorefrontProductCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const variant = useCardVariant();
  /** Until mount, match SSR (theme context has no `localStorage` fallback on the server). */
  const effective = mounted ? variant : "classic";
  if (effective === "shelf") {
    return <ShelfProductCard {...props} />;
  }
  return <ProductCard {...props} />;
}
