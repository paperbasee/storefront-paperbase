"use client";

import { LayoutGrid } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/i18n/routing";
import type { HeaderCategoryNav } from "@/lib/storefront";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 160;

/** Same typography for button vs link (UA button styles can otherwise differ from anchors). */
const categoryBarItemClass =
  "inline-flex min-h-9 max-w-none items-center rounded-md px-2 py-1.5 text-sm font-medium leading-tight tracking-wide whitespace-nowrap uppercase md:px-2.5";

type NavHrefProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

function NavHref({ href, className, children }: NavHrefProps) {
  const isAppPath = href.startsWith("/") && !href.startsWith("//");
  if (isAppPath) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

type DesktopCategoryMegaNavProps = {
  categories: HeaderCategoryNav[];
  ariaLabel: string;
  browseEyebrow: string;
  shopAllInPrefix: string;
  newBadgeLabel: string;
};

export function DesktopCategoryMegaNav({
  categories,
  ariaLabel,
  browseEyebrow,
  shopAllInPrefix,
  newBadgeLabel,
}: DesktopCategoryMegaNavProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const open = useCallback(
    (id: string) => {
      clearCloseTimer();
      setOpenId(id);
    },
    [clearCloseTimer],
  );

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenId(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function onBlurRoot(event: React.FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) {
      return;
    }
    scheduleClose();
  }

  const active = categories.find((c) => c.id === openId) ?? null;
  const activeChildren = active?.children;
  const showPanel = Boolean(active && activeChildren?.length);

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
      onBlur={onBlurRoot}
    >
      <PageContainer>
        <nav
          className="desktop-category-scroll w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth py-2"
          aria-label={ariaLabel}
        >
          <ul className="flex w-max min-w-full flex-nowrap items-center gap-x-1 md:gap-x-2">
            {categories.map((category) => {
              const expandable = Boolean(category.children?.length);
              const isOpen = openId === category.id;

              return (
                <li
                  key={category.id}
                  className="shrink-0"
                  onMouseEnter={() => {
                    open(category.id);
                  }}
                  onFocusCapture={() => {
                    open(category.id);
                  }}
                >
                  {expandable ? (
                    <button
                      type="button"
                      className={cn(
                        categoryBarItemClass,
                        "cursor-pointer border-0 bg-transparent text-white/90 transition-colors",
                        "hover:bg-white/10 hover:text-white",
                        "focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                        isOpen && "bg-white/15 text-white",
                      )}
                      aria-expanded={isOpen}
                      aria-controls={showPanel && active?.id === category.id ? panelId : undefined}
                      id={`desktop-cat-trigger-${category.id}`}
                    >
                      {category.label}
                    </button>
                  ) : (
                    <NavHref
                      href={category.href}
                      className={cn(
                        categoryBarItemClass,
                        "text-white/90 transition-colors",
                        "hover:bg-white/10 hover:text-white",
                        "focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                      )}
                    >
                      {category.label}
                    </NavHref>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </PageContainer>

      {showPanel && active && activeChildren && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={`desktop-cat-trigger-${active.id}`}
          className="absolute inset-x-0 top-[calc(100%-10px)] z-50 pt-3 pb-6"
        >
          <PageContainer>
            <div
              className={cn(
                "origin-top overflow-hidden rounded-b-2xl border border-black/[0.06] bg-white text-text shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.04]",
                "motion-safe:transition-[opacity,transform] motion-safe:duration-150 motion-safe:ease-out",
              )}
            >
              <div className="max-h-[min(70vh,520px)] overflow-y-auto overscroll-y-contain p-5 sm:p-6">
                <div className="flex flex-col gap-4 border-b border-neutral-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">{browseEyebrow}</p>
                    <p className="text-lg font-semibold tracking-tight text-text sm:text-xl">{active.label}</p>
                  </div>
                  <NavHref
                    href={active.href}
                    className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {shopAllInPrefix} {active.label}
                  </NavHref>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {activeChildren.map((item) => (
                    <NavHref
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "group flex gap-3 rounded-xl border border-transparent p-3 transition-colors",
                        "hover:border-neutral-200 hover:bg-primary/[0.04]",
                        "focus-visible:border-primary/30 focus-visible:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                      )}
                    >
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors group-hover:border-neutral-300 group-hover:text-primary"
                        aria-hidden
                      >
                        <LayoutGrid className="size-5" strokeWidth={1.5} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-text normal-case tracking-normal">{item.label}</span>
                          {item.isNew ? (
                            <Badge className="bg-success px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                              {newBadgeLabel}
                            </Badge>
                          ) : null}
                        </span>
                        {item.description ? (
                          <span className="mt-1 block text-[13px] leading-snug font-normal text-neutral-600 normal-case tracking-normal">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </NavHref>
                  ))}
                </div>
              </div>
            </div>
          </PageContainer>
        </div>
      )}
    </div>
  );
}
