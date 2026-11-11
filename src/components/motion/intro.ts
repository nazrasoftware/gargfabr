"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __gfReady?: boolean;
  }
}

export function signalIntroDone() {
  window.__gfReady = true;
  window.dispatchEvent(new Event("gf:ready"));
}

/** True once the preloader has lifted (or immediately when it is skipped). */
export function useIntroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.__gfReady) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener("gf:ready", on);
    return () => window.removeEventListener("gf:ready", on);
  }, []);
  return ready;
}
