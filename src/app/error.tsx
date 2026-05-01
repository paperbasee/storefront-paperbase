"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { PaperbaseApiError } from "@/lib/api/paperbase-errors";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootErrorPage({ error, reset }: ErrorProps) {
  const isRateLimited = error instanceof PaperbaseApiError && error.status === 429;
  const handleRetry = () => {
    reset();
    window.location.reload();
  };

  return (
    <PageContainer>
      <div className="flex min-h-[70vh] w-full items-center justify-center py-10">
        <div className="card mx-auto flex w-full max-w-xl flex-col items-center space-y-5 border-border/70 bg-muted/25 text-center">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-text">
              {isRateLimited ? "Too many requests" : "This page didn’t load"}
            </h1>
            <p className="text-sm leading-relaxed text-text/80">
              {isRateLimited
                ? "We’re getting a lot of traffic right now. Please wait a moment and try again."
                : "That’s on us, not you. Please try again in a moment—most of the time a quick refresh fixes it."}
            </p>
          </div>

          <Button variant="secondary" size="md" type="button" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

