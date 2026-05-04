"use client";

import { ProductCardVariantModal } from "@/components/common/product-card-variant-modal";
import type { Product } from "@/types/product";

type ProductCardAddButtonProps = {
  product: Product;
  variant?: "default" | "card" | "icon";
  /** Shelf card: go to checkout after add instead of the success dialog. Classic uses default. */
  afterAddBehavior?: "dialog" | "checkout";
};

/**
 * Renders the "Add to Cart" trigger for a product card.
 * Always opens the variant selection modal — cart items are never added without
 * a resolved variant_public_id.
 */
export function ProductCardAddButton({
  product,
  variant = "default",
  afterAddBehavior = "dialog",
}: ProductCardAddButtonProps) {
  return <ProductCardVariantModal product={product} variant={variant} afterAddBehavior={afterAddBehavior} />;
}
