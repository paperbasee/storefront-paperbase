"use client";

import { Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "@/i18n/routing";
import { formatMoney } from "@/lib/format";
import type { ProductVariant } from "@/types/product";
import { cn } from "@/lib/utils";

type ProductDetailBuySectionProps = {
  productPublicId: string;
  productName: string;
  unitPrice: string;
  imageUrl: string | null;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  variants: ProductVariant[];
};

export function ProductDetailBuySection({
  productPublicId,
  productName,
  unitPrice,
  imageUrl,
  stockStatus,
  variants,
}: ProductDetailBuySectionProps) {
  const t = useTranslations("product");
  const tDetail = useTranslations("productDetail");
  const locale = useLocale() as "en" | "bn";
  const { addItem, openCartPanel } = useCart();
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  const optionsByAttribute = useMemo(() => {
    const grouped = new Map<
      string,
      { attribute_name: string; values: Array<{ value_public_id: string; value: string }> }
    >();
    for (const variant of variants) {
      for (const option of variant.options) {
        const existing = grouped.get(option.attribute_slug);
        if (!existing) {
          grouped.set(option.attribute_slug, {
            attribute_name: option.attribute_name,
            values: [{ value_public_id: option.value_public_id, value: option.value }],
          });
          continue;
        }
        if (!existing.values.some((item) => item.value_public_id === option.value_public_id)) {
          existing.values.push({ value_public_id: option.value_public_id, value: option.value });
        }
      }
    }
    return grouped;
  }, [variants]);

  const selectedVariant = useMemo(() => {
    if (!variants.length || !Object.keys(selectedValues).length) {
      return undefined;
    }
    return variants.find((variant) =>
      variant.options.every((option) => selectedValues[option.attribute_slug] === option.value_public_id),
    );
  }, [selectedValues, variants]);

  const effectiveStockStatus = selectedVariant?.stock_status ?? stockStatus;
  const effectivePrice = selectedVariant?.price ?? unitPrice;
  const inStock = effectiveStockStatus !== "out_of_stock";

  const payload = () => ({
    product_public_id: productPublicId,
    variant_public_id: selectedVariant?.public_id,
    name: productName,
    price: effectivePrice,
    image_url: imageUrl,
    variant_details: selectedVariant
      ? selectedVariant.options.map((opt) => `${opt.attribute_name}: ${opt.value}`).join(", ")
      : undefined,
  });

  const handleAdd = () => {
    if (!inStock) return;
    addItem(payload(), 1);
    openCartPanel();
  };

  function handleOrderNow() {
    if (!inStock) return;
    addItem(payload(), 1);
    router.push("/checkout");
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: productName, url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user dismissed share sheet or clipboard blocked */
    }
  }

  return (
    <div className="space-y-5">
      {[...optionsByAttribute.entries()].map(([slug, data]) => (
        <div key={slug}>
          <p className="mb-2.5 text-[11px] font-bold tracking-wide text-neutral-500 uppercase">
            {data.attribute_name}
          </p>
          <div className="flex flex-wrap gap-2">
            {data.values.map((value) => {
              const selected = selectedValues[slug] === value.value_public_id;
              return (
                <button
                  key={value.value_public_id}
                  type="button"
                  onClick={() =>
                    setSelectedValues((prev) => ({
                      ...prev,
                      [slug]: value.value_public_id,
                    }))
                  }
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-text transition-colors",
                    selected
                      ? "border-emerald-600 ring-1 ring-emerald-600"
                      : "border-neutral-200 hover:border-neutral-300",
                  )}
                >
                  {value.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-sm font-semibold text-emerald-700">{formatMoney(effectivePrice, locale)}</p>
      <p className="text-xs text-neutral-500">
        {effectiveStockStatus === "low_stock" ? "Low stock available" : tDetail("chooseOptionsHint")}
      </p>

      <div className="space-y-3 pt-1">
        <button
          type="button"
          disabled={!inStock}
          onClick={handleOrderNow}
          className={cn(
            "flex h-12 w-full items-center justify-center rounded-md px-4 text-sm font-bold tracking-wide text-white uppercase",
            "bg-emerald-600 hover:bg-emerald-700",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {inStock ? t("orderNow") : t("outOfStock")}
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={!inStock}
            onClick={handleAdd}
            className={cn(
              "flex h-12 min-w-0 flex-1 items-center justify-center rounded-md border border-neutral-200 bg-white px-3 text-sm font-semibold text-text transition-colors",
              "hover:border-neutral-300 hover:bg-primary/[0.04]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {t("addToCart")}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex size-12 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white text-text transition-colors hover:border-neutral-300 hover:bg-primary/[0.04]"
            aria-label={tDetail("shareProduct")}
          >
            <Share2 className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

    </div>
  );
}
