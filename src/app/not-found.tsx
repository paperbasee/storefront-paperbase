import Link from "next/link";

/**
 * Handles requests that never enter `app/[locale]/` (e.g. misconfigured host or
 * middleware bypass). Normal storefront traffic is prefixed with a locale and
 * uses `app/[locale]/not-found.tsx` via the `[...rest]` catch-all.
 */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <p className="font-sans text-7xl font-extrabold tabular-nums tracking-tighter text-primary">404</p>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-text">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
        This page does not exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="inline-flex h-12 min-w-[10rem] items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
