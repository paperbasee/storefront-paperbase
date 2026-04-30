"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BannerImageSlide = {
  public_id: string;
  image_url: string | null;
  order: number;
};

type BannerImageSliderProps = {
  title: string;
  headlineFallback: string;
  images: BannerImageSlide[];
  priority?: boolean;
  height?: number;
  showTitleOverlay?: boolean;
  viewportClassName?: string;
};

const AUTO_SLIDE_MS = 4500;

export function BannerImageSlider({
  title,
  headlineFallback,
  images,
  priority = false,
  height = 1200,
  showTitleOverlay = false,
  viewportClassName = "h-[220px] sm:h-[280px] md:h-[380px] lg:h-[460px]",
}: BannerImageSliderProps) {
  const slides = useMemo(
    () => images.filter((item) => Boolean(item.image_url)),
    [images],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <div className={`relative w-full overflow-hidden ${viewportClassName}`}>
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={slide.public_id || `${slide.order}-${idx}`} className="relative h-full w-full shrink-0">
            <Image
              src={slide.image_url!}
              alt={title?.trim() ? title : headlineFallback}
              fill
              priority={priority && idx === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {showTitleOverlay && title?.trim() ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent px-4 pb-4 pt-10 text-white md:px-6 md:pb-6">
          <p className="text-pretty text-base font-semibold leading-snug md:text-lg">{title}</p>
        </div>
      ) : null}

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous banner image"
            onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next banner image"
            onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {slides.map((slide, dotIdx) => (
              <button
                key={`${slide.public_id}-dot`}
                type="button"
                aria-label={`Go to banner image ${dotIdx + 1}`}
                onClick={() => setIndex(dotIdx)}
                className={`h-1.5 rounded-full transition ${
                  dotIdx === index ? "w-5 bg-white" : "w-2.5 bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
