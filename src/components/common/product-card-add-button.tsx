"use client";

import { ProductCardVariantModal } from "@/components/common/product-card-variant-modal";
import type { Product } from "@/types/product";

type ProductCardAddButtonProps = {
  product: Product;
  productName: string;
  variant?: "default" | "card";
};

/**
 * Renders the "Add to Cart" trigger for a product card.
 * Always opens the variant selection modal — cart items are never added without
 * a resolved variant_public_id.
 */
export function ProductCardAddButton({ product, productName, variant = "default" }: ProductCardAddButtonProps) {
  return (
    <ProductCardVariantModal product={product} productName={productName} variant={variant} />
  );
}
