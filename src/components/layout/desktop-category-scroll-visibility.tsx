"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DesktopCategoryScrollVisibilityProps = {
  children: ReactNode;
};

export function DesktopCategoryScrollVisibility({ children }: DesktopCategoryScrollVisibilityProps) {
  const lastScrollYRef = useRef(0);
  const latestScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);
  const directionRef = useRef<-1 | 0 | 1>(0);
  const accumulatedDeltaRef = useRef(0);
  const tickingRef = useRef(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    isHiddenRef.current = isHidden;
  }, [isHidden]);

  useEffect(() => {
    const processScroll = () => {
      tickingRef.current = false;
      const currentY = latestScrollYRef.current;
      const lastY = lastScrollYRef.current;
      const delta = currentY - lastY;

      if (Math.abs(delta) < 2) {
        lastScrollYRef.current = currentY;
        return;
      }

      if (currentY <= 8) {
        directionRef.current = 0;
        accumulatedDeltaRef.current = 0;
        if (isHiddenRef.current) {
          isHiddenRef.current = false;
          setIsHidden(false);
        }
        lastScrollYRef.current = currentY;
        return;
      }

      const direction: -1 | 1 = delta > 0 ? 1 : -1;
      if (directionRef.current !== direction) {
        directionRef.current = direction;
        accumulatedDeltaRef.current = 0;
      }

      accumulatedDeltaRef.current += Math.abs(delta);

      const hideThreshold = 28;
      const showThreshold = 16;

      if (direction > 0 && !isHiddenRef.current && accumulatedDeltaRef.current >= hideThreshold) {
        isHiddenRef.current = true;
        setIsHidden(true);
        accumulatedDeltaRef.current = 0;
      } else if (direction < 0 && isHiddenRef.current && accumulatedDeltaRef.current >= showThreshold) {
        isHiddenRef.current = false;
        setIsHidden(false);
        accumulatedDeltaRef.current = 0;
      }

      lastScrollYRef.current = currentY;
    };

    const onScroll = () => {
      latestScrollYRef.current = window.scrollY;
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(processScroll);
      }
    };

    lastScrollYRef.current = window.scrollY;
    latestScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "hidden overflow-visible bg-header will-change-transform transition-[transform,opacity,max-height] duration-300 ease-out md:block",
        isHidden
          ? "pointer-events-none max-h-0 -translate-y-2 border-t border-transparent opacity-0"
          : "pointer-events-auto max-h-24 translate-y-0 border-t border-white/15 opacity-100",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
