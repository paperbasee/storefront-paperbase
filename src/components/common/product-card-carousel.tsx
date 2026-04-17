"use client";

import Image from "next/image";
import { useState } from "react";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type ProductCardCarouselProps = {
  images: string[];
  productName: string;
  href: string;
};

export function ProductCardCarousel({ images, productName, href }: ProductCardCarouselProps) {
  const slides = images.length > 0 ? images : ["/vercel.svg"];
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, slides.length - 1);
  const src = slides[safeIndex] ?? slides[0];

  return (
    <div className="relative aspect-[5/4] w-full shrink-0 bg-white md:aspect-square">
      <Link
        href={href}
        className="relative block size-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <Image
          src={src}
          alt={productName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 md:p-2"
        />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1 md:bottom-1.5 md:gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            tabIndex={0}
            aria-label={`Image ${index + 1} of ${slides.length}`}
            aria-current={index === safeIndex ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActive(index);
            }}
            className={cn(
              "pointer-events-auto size-2 rounded-full transition-colors",
              index === safeIndex ? "bg-primary" : "bg-neutral-300 hover:bg-neutral-400",
            )}
          />
        ))}
      </div>
    </div>
  );
}
