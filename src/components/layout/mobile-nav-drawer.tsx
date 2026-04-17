"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import type { HeaderCategoryNav } from "@/lib/storefront";

type MobileNavDrawerProps = {
  menuTitle: string;
  allProductsLabel: string;
  allCategoriesLabel: string;
  categories: HeaderCategoryNav[];
};

function CategoryBlock({
  category,
  onNavigate,
}: {
  category: HeaderCategoryNav;
  onNavigate: () => void;
}) {
  const subs = category.children;

  if (!subs?.length) {
    return (
      <a
        href={category.href}
        className="block border-b border-white/10 px-4 py-3.5 text-base text-white/95 transition hover:bg-white/10"
        onClick={onNavigate}
      >
        {category.label}
      </a>
    );
  }

  return (
    <details className="border-b border-white/10 [&[open]_summary_.acc-icon]:rotate-45">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-base text-white marker:content-[''] [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{category.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="acc-icon size-5 shrink-0 text-white/60 transition-transform duration-200"
          aria-hidden
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <div className="border-t border-white/10 bg-black/15">
        {subs.map((sub) => (
          <a
            key={sub.id}
            href={sub.href}
            className="block border-b border-white/10 py-3 pl-8 pr-4 text-[15px] text-white/90 last:border-b-0 hover:bg-white/10"
            onClick={onNavigate}
          >
            {sub.label}
          </a>
        ))}
      </div>
    </details>
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
        className="flex size-10 shrink-0 items-center justify-center rounded-md text-white md:hidden hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
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
              aria-hidden={!open}
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
                    className="flex size-10 items-center justify-center rounded-md text-white transition hover:bg-white/10"
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
