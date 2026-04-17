"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

type ProductCardAddButtonProps = {
  product: Product;
  productName: string;
};

export function ProductCardAddButton({ product, productName }: ProductCardAddButtonProps) {
  const t = useTranslations("product");
  const { addItem } = useCart();
  const disabled = product.stock_status === "out_of_stock";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        addItem({
          product_public_id: product.public_id,
          name: productName,
          price: product.price,
          image_url: product.image_url,
        })
      }
      className={cn(
        "flex h-8 w-full items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-white transition-colors duration-200 ease-out sm:h-9 sm:gap-1.5 sm:text-[13px]",
        "bg-primary hover:bg-primary/90",
        "disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500",
      )}
    >
      <ShoppingCart className="size-3.5 shrink-0 stroke-[2] sm:size-4 md:size-4" aria-hidden />
      <span>{disabled ? t("outOfStock") : t("addToCart")}</span>
    </button>
  );
}
