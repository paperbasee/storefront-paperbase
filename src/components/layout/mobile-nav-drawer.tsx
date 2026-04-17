"use client";

import { useEffect, useId, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { Link } from "@/i18n/routing";
import type { HeaderCategoryNav } from "@/lib/storefront";

/** Locale-prefixed navigation (same as desktop mega nav); raw `/categories/...` 404s with `localePrefix: "always"`. */
function CategoryNavLink({
  href,
  className,
  style,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
}) {
  const isAppPath = href.startsWith("/") && !href.startsWith("//");
  if (isAppPath) {
    return (
      <Link href={href} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} style={style} onClick={onClick}>
      {children}
    </a>
  );
}

type MobileNavDrawerProps = {
  menuTitle: string;
  allProductsLabel: string;
  allCategoriesLabel: string;
  categories: HeaderCategoryNav[];
};

const MOBILE_SUB_INDENT_REM = 2;

function ExpandIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-5 shrink-0 text-white/60 transition-transform duration-200"
      style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SubAccordionItem({
  node,
  depth,
  onNavigate,
}: {
  node: HeaderCategoryNav;
  depth: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const subs = node.children;
  const indentRem = MOBILE_SUB_INDENT_REM + depth * 0.75;

  if (!subs?.length) {
    return (
      <CategoryNavLink
        href={node.href}
        className="block border-b border-white/10 py-3 pr-4 text-[15px] text-white/90 last:border-b-0 hover:bg-white/10"
        style={{ paddingLeft: `${indentRem}rem` }}
        onClick={onNavigate}
      >
        {node.label}
      </CategoryNavLink>
    );
  }

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <div className="flex items-center">
        <CategoryNavLink
          href={node.href}
          className="min-w-0 flex-1 py-3 text-[15px] text-white/90 hover:bg-white/10"
          style={{ paddingLeft: `${indentRem}rem` }}
          onClick={onNavigate}
        >
          {node.label}
        </CategoryNavLink>
        <button
          type="button"
          aria-label={open ? `Collapse ${node.label}` : `Expand ${node.label}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-11 shrink-0 items-center justify-center hover:bg-white/10"
        >
          <ExpandIcon open={open} />
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-black/15">
          <MobileCategorySubtree nodes={subs} depth={depth + 1} onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
}

function MobileCategorySubtree({
  nodes,
  depth,
  onNavigate,
}: {
  nodes: HeaderCategoryNav[];
  depth: number;
  onNavigate: () => void;
}) {
  return (
    <>
      {nodes.map((node) => (
        <SubAccordionItem key={node.id} node={node} depth={depth} onNavigate={onNavigate} />
      ))}
    </>
  );
}

function CategoryBlock({
  category,
  onNavigate,
}: {
  category: HeaderCategoryNav;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const subs = category.children;

  if (!subs?.length) {
    return (
      <CategoryNavLink
        href={category.href}
        className="block border-b border-white/10 px-4 py-3.5 text-base text-white/95 transition hover:bg-white/10"
        onClick={onNavigate}
      >
        {category.label}
      </CategoryNavLink>
    );
  }

  return (
    <div className="border-b border-white/10">
      <div className="flex items-center">
        <CategoryNavLink
          href={category.href}
          className="min-w-0 flex-1 px-4 py-3.5 text-base text-white/95 hover:bg-white/10"
          onClick={onNavigate}
        >
          {category.label}
        </CategoryNavLink>
        <button
          type="button"
          aria-label={open ? `Collapse ${category.label}` : `Expand ${category.label}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-12 shrink-0 items-center justify-center hover:bg-white/10"
        >
          <ExpandIcon open={open} />
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-black/15">
          <MobileCategorySubtree nodes={subs} depth={0} onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-5"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function MobileNavDrawer({
  menuTitle,
  allProductsLabel,
  allCategoriesLabel,
  categories,
}: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const headingId = useId();
  const panelId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white md:hidden hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        aria-label={menuTitle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-5"
          aria-hidden
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isClient
        ? createPortal(
            <div
              className={`fixed inset-0 z-[100] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
              inert={open ? undefined : true}
            >
              <button
                type="button"
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
                aria-label="Close menu"
                tabIndex={open ? 0 : -1}
                onClick={close}
              />

              <aside
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={headingId}
                inert={open ? undefined : true}
                className={`absolute left-0 top-0 flex h-full w-[min(82vw,20rem)] max-w-[320px] flex-col bg-header text-white shadow-2xl transition-transform duration-300 ease-out ${
                  open ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <header className="flex shrink-0 items-center justify-between border-b border-white/15 px-4 py-3">
                  <h2 id={headingId} className="text-lg font-bold text-white">
                    {menuTitle}
                  </h2>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
                    aria-label="Close menu"
                    onClick={close}
                  >
                    <CloseIcon />
                  </button>
                </header>

                <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <a
                    href="#products"
                    className="block border-b border-white/10 px-4 py-3.5 text-base font-medium text-white/95 transition hover:bg-white/10"
                    onClick={close}
                  >
                    {allProductsLabel}
                  </a>

                  {categories.map((category) => (
                    <CategoryBlock key={category.id} category={category} onNavigate={close} />
                  ))}

                  <button
                    type="button"
                    className="w-full border-b border-white/10 px-4 py-3.5 text-left text-base text-white/95 transition hover:bg-white/10"
                    onClick={close}
                  >
                    {allCategoriesLabel}
                  </button>
                </nav>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
