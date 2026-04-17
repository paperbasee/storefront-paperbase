"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

type CheckoutBreadcrumbsProps = {
  step: "shipping" | "payment";
  onOpenCart: () => void;
};

export function CheckoutBreadcrumbs({ step, onOpenCart }: CheckoutBreadcrumbsProps) {
  const t = useTranslations("checkout");

  const sep = <span className="text-neutral-400">/</span>;

  return (
    <nav
      aria-label="Checkout progress"
      className="mb-8 flex min-w-0 max-w-full flex-wrap items-center gap-2 text-sm"
    >
      <button
        type="button"
        onClick={onOpenCart}
        className="text-neutral-600 underline-offset-2 hover:text-text hover:underline"
      >
        {t("breadcrumbCart")}
      </button>
      {sep}
      {step === "shipping" ? (
        <span className="font-semibold text-text">{t("breadcrumbShipping")}</span>
      ) : (
        <Link href="/checkout" className="text-neutral-600 underline-offset-2 hover:text-text hover:underline">
          {t("breadcrumbShipping")}
        </Link>
      )}
      {sep}
      {step === "payment" ? (
        <span className="font-semibold text-text">{t("breadcrumbPayment")}</span>
      ) : (
        <Link
          href="/checkout/payment"
          className="text-neutral-600 underline-offset-2 hover:text-text hover:underline"
        >
          {t("breadcrumbPayment")}
        </Link>
      )}
    </nav>
  );
}
