"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { useAddToCartDialogStore } from "@/lib/store/add-to-cart-dialog-store";
import { useCart } from "@/hooks/useCart";
import { resolveStorefrontImageUrl, storefrontImageUnoptimized } from "@/lib/storefront-image";
import { parseVariantAttributePairs } from "@/lib/variant-details";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatVariantLine(details: string | undefined): string {
  const pairs = parseVariantAttributePairs(details);
  if (pairs.length === 0) return "";

  // If there's only one label (e.g. "Size"), display "SIZE: BLACK · S"
  const labels = new Set(pairs.map((p) => p.label).filter(Boolean));
  if (labels.size === 1) {
    const label = [...labels][0]!;
    const values = pairs.map((p) => p.value).filter(Boolean);
    if (values.length === 0) return "";
    return `${label.toUpperCase()}: ${values.join(" · ")}`;
  }

  // Otherwise show "COLOR: BLACK · SIZE: S"
  return pairs
    .map((p) => (p.label ? `${p.label.toUpperCase()}: ${p.value}` : p.value))
    .filter(Boolean)
    .join(" · ");
}

export function AddToCartDialogHost() {
  const common = useTranslations("common");
  const tCheckout = useTranslations("checkout");
  const t = useTranslations("addToCartDialog");

  const open = useAddToCartDialogStore((s) => s.open);
  const product = useAddToCartDialogStore((s) => s.product);
  const closeDialog = useAddToCartDialogStore((s) => s.closeDialog);

  const { itemCount } = useCart();

  if (!open || !product) return null;

  const imageSrc = resolveStorefrontImageUrl(product.image_url);
  const variantLine = formatVariantLine(product.variant_details);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("dialogAria")}
      onClick={closeDialog}
    >
      <div
        className={cn(
          "relative w-full max-w-[520px] overflow-hidden rounded-lg bg-card text-foreground shadow-2xl",
          "sm:rounded-lg",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeDialog}
          aria-label={common("close")}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <X className="size-5" strokeWidth={2} aria-hidden />
        </button>

        <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-success">
              <Check className="size-4 text-white" strokeWidth={2.5} aria-hidden />
            </span>
            <span>{t("title")}</span>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="64px"
                className="object-contain p-2"
                unoptimized={storefrontImageUnoptimized(imageSrc)}
              />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold leading-snug">{product.name}</p>
              {variantLine ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{variantLine}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href="/cart"
              onClick={closeDialog}
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "w-full justify-center rounded-none border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t("viewCartWithCount", { count: itemCount })}
            </Link>

            <Link
              href="/checkout"
              onClick={closeDialog}
              className={cn(
                buttonVariants({ variant: "accent", size: "md" }),
                "w-full justify-center rounded-none",
              )}
            >
              {t("checkOut")}
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={closeDialog}
              className="w-full rounded-none bg-transparent text-muted-foreground underline decoration-muted-foreground/50 underline-offset-4 hover:bg-transparent hover:text-foreground hover:decoration-muted-foreground"
            >
              {tCheckout("continueShopping")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

