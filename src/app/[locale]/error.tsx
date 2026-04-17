"use client";

import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  const t = useTranslations("errors");
  const states = useTranslations("states");

  return (
    <PageContainer>
      <div className="card mt-8 space-y-4">
        <h1 className="text-xl font-semibold text-text">{t("title")}</h1>
        <p className="text-sm text-text/80">{t("description")}</p>
        <p className="text-xs text-text/60">{error.message}</p>
        <Button variant="primary" onClick={reset}>
          {states("retry")}
        </Button>
      </div>
    </PageContainer>
  );
}
