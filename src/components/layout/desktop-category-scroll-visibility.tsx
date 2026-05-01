"use client";

import { useEffect, useRef, type ReactNode } from "react";

type DesktopCategoryScrollVisibilityProps = {
  children: ReactNode;
};

export function DesktopCategoryScrollVisibility({
  children,
}: DesktopCategoryScrollVisibilityProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const lastYRef = useRef(0);
  const latestYRef = useRef(0);
  const isHiddenRef = useRef(false);
  const tickingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const velocityRef = useRef(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    bar.style.transform = "translateY(0)";

    const VELOCITY_THRESHOLD = 4;
    const HIDE_THRESHOLD = 80;

    const setHidden = (hide: boolean) => {
      const el = barRef.current;
      if (!el || hide === isHiddenRef.current) return;
      isHiddenRef.current = hide;

      if (hide) {
        // Slide UP so it disappears behind the navbar above it.
        // translateY(-100%) moves it up by its own height, tucking it
        // cleanly under the main nav rather than flying off-screen.
        el.style.transition = "transform 180ms cubic-bezier(0.4, 0, 1, 1)";
        el.style.transform = "translateY(-100%)";
      } else {
        // Spring reveal downward back into position
        el.style.transition = "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)";
        el.offsetHeight; // force reflow so transition fires from -100%
        el.style.transform = "translateY(0)";
      }
    };

    const processScroll = () => {
      tickingRef.current = false;
      const currentY = latestYRef.current;
      const delta = currentY - lastYRef.current;

      velocityRef.current = velocityRef.current * 0.6 + delta * 0.4;

      if (currentY <= HIDE_THRESHOLD) {
        setHidden(false);
        lastYRef.current = currentY;
        velocityRef.current = 0;
        return;
      }

      if (velocityRef.current > VELOCITY_THRESHOLD && !isHiddenRef.current) {
        setHidden(true);
      } else if (velocityRef.current < -VELOCITY_THRESHOLD && isHiddenRef.current) {
        setHidden(false);
      }

      lastYRef.current = currentY;
    };

    const onScroll = () => {
      latestYRef.current = window.scrollY;
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafIdRef.current = requestAnimationFrame(processScroll);
      }
    };

    lastYRef.current = window.scrollY;
    latestYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="relative z-30 hidden md:block">
      <div
        ref={barRef}
        style={{ willChange: "transform" }}
        className="pointer-events-auto relative z-40 border-t border-white/15 bg-header"
      >
        {children}
      </div>
    </div>
  );
}