"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  /** Plain text body when `bulletParagraphs` is not used */
  body: string;
};

type ProductDetailAccordionsProps = {
  items: AccordionItem[];
  /** When set, the matching item id renders as a bullet list instead of `body` */
  bulletParagraphs?: string[];
  bulletItemId?: string;
  defaultOpenId?: string | null;
};

export function ProductDetailAccordions({
  items,
  bulletParagraphs,
  bulletItemId = "product-details",
  defaultOpenId = bulletItemId,
}: ProductDetailAccordionsProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="border-t border-neutral-200">
      {items.map((item) => {
        const open = openId === item.id;
        const bullets =
          bulletParagraphs && item.id === bulletItemId ? bulletParagraphs.filter((p) => p.trim().length > 0) : null;

        return (
          <div key={item.id} className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-4 text-start transition-colors hover:bg-primary/[0.04]"
            >
              <span className="text-sm font-bold tracking-wide text-text uppercase">{item.title}</span>
              {open ? (
                <ChevronUp className="size-5 shrink-0 text-text" strokeWidth={2} aria-hidden />
              ) : (
                <ChevronDown className="size-5 shrink-0 text-neutral-400" strokeWidth={2} aria-hidden />
              )}
            </button>
            {open ? (
              <div className="pb-5">
                {bullets?.length ? (
                  <ul className="list-disc space-y-2.5 ps-5 text-sm leading-relaxed text-text/85 marker:text-emerald-600">
                    {bullets.map((paragraph, index) => (
                      <li key={index}>{paragraph}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed text-text/85">{item.body}</p>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
