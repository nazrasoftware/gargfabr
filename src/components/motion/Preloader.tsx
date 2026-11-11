"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { signalIntroDone } from "./intro";

/**
 * First visit per session: a needle sews a running stitch under the wordmark,
 * a counter ticks to 100, then the "quilt" lifts away with a soft curved edge.
 */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("gf-intro") === "1";
      sessionStorage.setItem("gf-intro", "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      signalIntroDone();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const total = 1900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          document.documentElement.style.overflow = "";
          setTimeout(signalIntroDone, 350);
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-indigo-deep text-cotton"
          exit={{ clipPath: "ellipse(140% 0% at 50% 0%)" }}
          initial={{ clipPath: "ellipse(140% 140% at 50% 0%)" }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex flex-col items-center px-6">
            <motion.p
              className="font-hindi text-2xl text-sand sm:text-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              हाथ से बना
            </motion.p>
            <div className="mt-3 overflow-hidden">
              <motion.h1
                className="display-md text-center"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                Garg <span className="italic">Fabrication</span>
              </motion.h1>
            </div>

            {/* The stitch + travelling needle */}
            <svg viewBox="0 0 320 24" className="mt-6 w-[260px] sm:w-[320px]" fill="none" aria-hidden>
              <mask id="pre-m">
                <motion.path
                  d="M4 12 C 80 2, 160 22, 316 10"
                  stroke="white"
                  strokeWidth="6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
                />
              </mask>
              <path
                d="M4 12 C 80 2, 160 22, 316 10"
                stroke="#B5523B"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeLinecap="round"
                mask="url(#pre-m)"
              />
              <motion.g
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
                style={{ offsetPath: "path('M4 12 C 80 2, 160 22, 316 10')", offsetRotate: "auto" }}
              >
                <path d="M-14 0 L4 0" stroke="#C9B28F" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="-11" cy="0" r="1.6" fill="none" stroke="#C9B28F" strokeWidth="1" />
              </motion.g>
            </svg>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex items-end justify-between px-6 sm:px-10">
            <span className="eyebrow text-sand/80">Handmade Jaipuri Quilts</span>
            <span className="display-sm tabular-nums">{String(n).padStart(3, "0")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
