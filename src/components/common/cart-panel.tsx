"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";
import { Link, type Locale } from "@/i18n/routing";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

type CartPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function CartPanel({ open, onClose }: CartPanelProps) {
  const t = useTranslations("cart");
  const states = useTranslations("states");
  const common = useTranslations("common");
  const productT = useTranslations("product");
  const locale = useLocale() as Locale;
  const { items, hydrated, subtotal, itemCount, removeItem, increment, decrement, clear } =
    useCart();

  if (!open) {
    return null;
  }

  return (
    <aside className="fixed inset-0 z-50 bg-black/40" onClick={onClose} role="presentation">
      <div
        className="ml-auto flex h-full w-full max-w-md flex-col bg-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-3">
          <h2 className="text-xl font-semibold text-text">{t("title")}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label={common("close")}>
            <X className="size-5 shrink-0" strokeWidth={2} aria-hidden />
          </Button>
        </div>

        {!hydrated ? (
          <p className="text-sm text-text/70">{states("loading")}</p>
        ) : items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-primary/30 p-4 text-sm text-text/80">
            {t("empty")}
          </p>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-auto">
            {items.map((item) => (
              <div
                key={`${item.product_public_id}-${item.variant_public_id ?? "default"}`}
                className="card flex items-center gap-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                  <Image
                    src={item.image_url ?? "/placeholders/hero.svg"}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-text">{item.name}</h3>
                  <p className="price-text text-sm font-semibold">{formatMoney(item.price, locale)}</p>
                  <QuantityStepper
                    quantity={item.quantity}
                    onIncrement={() => increment(item.product_public_id, item.variant_public_id)}
                    onDecrement={() => decrement(item.product_public_id, item.variant_public_id)}
                    increaseLabel={productT("increaseQuantity")}
                    decreaseLabel={productT("decreaseQuantity")}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.product_public_id, item.variant_public_id)}
                >
                  {t("remove")}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-primary/20 pt-4">
          <p className="text-sm text-text/80">{t("items", { count: itemCount })}</p>
          <p className="mb-4 text-lg font-bold price-text">
            {t("subtotal")}: {formatMoney(subtotal, locale)}
          </p>
          <div className="grid gap-2">
            {items.length === 0 ? (
              <Button variant="accent" disabled>
                {t("checkout")}
              </Button>
            ) : (
              <Link
                href="/checkout"
                onClick={onClose}
                className={cn(buttonVariants({ variant: "accent", size: "md" }), "w-full")}
              >
                {t("checkout")}
              </Link>
            )}
            <Button variant="primary" onClick={clear} disabled={items.length === 0}>
              {t("clear")}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
