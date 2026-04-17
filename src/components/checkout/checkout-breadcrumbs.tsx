"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/routing";

type CheckoutBreadcrumbsProps = {
  step: "shipping" | "payment";
};

export function CheckoutBreadcrumbs({ step }: CheckoutBreadcrumbsProps) {
  const t = useTranslations("checkout");
  const router = useRouter();

  if (step === "shipping") {
    return (
      <nav aria-label={t("back")} className="mb-8 flex min-w-0 max-w-full items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          {t("back")}
        </button>
      </nav>
    );
  }

  return (
    <nav aria-label={t("back")} className="mb-8 flex min-w-0 max-w-full items-center">
      <Link
        href="/checkout"
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
      >
        <ChevronLeft className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        {t("back")}
      </Link>
    </nav>
  );
}
