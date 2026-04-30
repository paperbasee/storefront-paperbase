"use client";

import { useEffect } from "react";
import AOS from "aos";

export function AosInit() {
  useEffect(() => {
    const init = () => {
      // Delay init slightly so React hydration finishes before AOS mutates classes.
      window.setTimeout(() => {
        AOS.init({
          duration: 700,
          once: true,
        });
      }, 250);
    };

    if (document.readyState === "complete") {
      init();
      return;
    }

    window.addEventListener("load", init, { once: true });
    return () => window.removeEventListener("load", init);
  }, []);

  return null;
}
