"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/i18n/routing";
import type { HeaderCategoryNav } from "@/lib/storefront";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 160;

/** Same typography for button vs link (UA button styles can otherwise differ from anchors). */
const categoryBarItemClass =
  "inline-flex min-h-10 max-w-none items-center rounded-md px-2 py-1.5 text-base font-medium leading-tight whitespace-nowrap md:px-2.5";

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
  newBadgeLabel: string;
};

function flattenCategoryLinks(nodes: HeaderCategoryNav[]): { id: string; href: string; label: string }[] {
  const out: { id: string; href: string; label: string }[] = [];
  function walk(node: HeaderCategoryNav) {
    out.push({ id: node.id, href: node.href, label: node.label });
    for (const child of node.children ?? []) walk(child);
  }
  for (const n of nodes) walk(n);
  return out;
}

function CategoryNavFlatStack({ items }: { items: HeaderCategoryNav[] }) {
  const links = flattenCategoryLinks(items);
  if (!links.length) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-2 text-sm">
      {links.map((link) => (
        <NavHref
          key={link.id}
          href={link.href}
          className="block font-normal leading-snug text-text transition-colors hover:text-primary"
        >
          {link.label}
        </NavHref>
      ))}
    </div>
  );
}

export function DesktopCategoryMegaNav({
  categories,
  ariaLabel,
  browseEyebrow,
  newBadgeLabel,
}: DesktopCategoryMegaNavProps) {
  const tNav = useTranslations("nav");
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
                        "cursor-pointer gap-1 border-0 bg-transparent text-white/90 transition-colors",
                        "hover:bg-white/10 hover:text-white",
                        "focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                        isOpen && "bg-white/15 text-white",
                      )}
                      aria-expanded={isOpen}
                      aria-controls={showPanel && active?.id === category.id ? panelId : undefined}
                      id={`desktop-cat-trigger-${category.id}`}
                    >
                      <span>{category.label}</span>
                      <ChevronDown
                        className={cn(
                          "pointer-events-none size-3 shrink-0 opacity-90 transition-transform duration-200 ease-out",
                          isOpen && "-rotate-180",
                        )}
                        strokeWidth={1.75}
                        aria-hidden
                      />
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
                "origin-top overflow-hidden rounded-lg border border-black/[0.06] bg-white text-text shadow-[0_24px_48px_-12px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.04]",
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
                    {tNav("megaMenuSeeAllFromCategory")}
                  </NavHref>
                </div>

                <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {activeChildren.map((item) => (
                    <section key={item.id} className="min-w-0">
                      <NavHref
                        href={item.href}
                        className="block pb-3 text-base font-semibold uppercase tracking-wide text-neutral-950 outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2"
                      >
                        <span className="inline-flex flex-wrap items-center gap-2">
                          {item.label}
                          {item.isNew ? (
                            <Badge className="bg-success px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                              {newBadgeLabel}
                            </Badge>
                          ) : null}
                        </span>
                      </NavHref>
                      {item.children?.length ? (
                        <div className="pt-1">
                          <CategoryNavFlatStack items={item.children} />
                        </div>
                      ) : item.description ? (
                        <p className="mt-3 text-sm leading-snug text-neutral-600">{item.description}</p>
                      ) : null}
                    </section>
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
