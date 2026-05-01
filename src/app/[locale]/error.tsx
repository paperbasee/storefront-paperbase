"use client";

import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { PaperbaseApiError } from "@/lib/api/paperbase-errors";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  const t = useTranslations("errors");
  const states = useTranslations("states");

  const handleRetry = () => {
    // `reset()` retries rendering, but the browser may keep the same navigation state.
    // A hard reload guarantees a fresh request after transient API errors (e.g. 429).
    reset();
    window.location.reload();
  };

  if (error instanceof PaperbaseApiError && error.status === 429) {
    return (
      <PageContainer>
        <div className="flex min-h-[70vh] w-full items-center justify-center py-10">
          <div className="card mx-auto flex w-full max-w-xl flex-col items-center space-y-5 border-border/70 bg-muted/25 text-center">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-text">
              {t("rateLimitedTitle")}
            </h1>
            <p className="text-sm leading-relaxed text-text/80">
              {t("rateLimitedDescription")}
            </p>
          </div>
          <Button variant="secondary" size="md" type="button" onClick={handleRetry}>
            {states("retry")}
          </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const technical =
    typeof error.message === "string" && error.message.trim().length > 0
      ? error.message.trim()
      : null;
  const digest =
    typeof error.digest === "string" && error.digest.trim().length > 0
      ? error.digest.trim()
      : null;
  const showDetails = Boolean(technical || digest);

  return (
    <PageContainer>
      <div className="flex min-h-[70vh] w-full items-center justify-center py-10">
        <div className="card mx-auto flex w-full max-w-xl flex-col items-center space-y-5 border-border/70 bg-muted/25 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-text">{t("title")}</h1>
          <p className="text-sm leading-relaxed text-text/80">{t("description")}</p>
        </div>

        {showDetails ? (
          <details className="group w-full rounded-lg border border-border/60 bg-background/90 text-sm text-center">
            <summary className="cursor-pointer list-none px-4 py-3 font-medium text-text/70 outline-none marker:hidden [&::-webkit-details-marker]:hidden hover:text-text/90">
              <span className="underline decoration-border underline-offset-2 group-open:no-underline">
                {t("detailsSummary")}
              </span>
            </summary>
            <div className="space-y-3 border-t border-border/50 px-4 pb-4 pt-3">
              <p className="text-xs leading-relaxed text-text/55">{t("detailsHint")}</p>
              {digest ? (
                <p className="font-mono text-xs text-text/70">
                  <span className="font-sans text-text/50">{t("digestLabel")}: </span>
                  {digest}
                </p>
              ) : null}
              {technical ? (
                <p className="break-words font-mono text-xs text-text/65">{technical}</p>
              ) : null}
            </div>
          </details>
        ) : null}

        <Button variant="secondary" size="md" type="button" onClick={handleRetry}>
          {states("retry")}
        </Button>
        </div>
      </div>
    </PageContainer>
  );
}
