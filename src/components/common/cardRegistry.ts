import { ProductCard } from "@/components/common/product-card";
import { ShelfProductCard } from "@/components/common/ShelfProductCard";

export const CARD_REGISTRY = {
  classic: ProductCard,
  shelf: ShelfProductCard,
} as const;

export type CardVariantKey = keyof typeof CARD_REGISTRY;
