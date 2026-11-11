"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** Oversized wordmark that slides up and spreads as the footer arrives. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const ls = useTransform(scrollYProgress, [0, 1], ["-0.08em", "-0.035em"]);
  return (
    <div ref={ref} className="mt-8 sm:mt-16 overflow-hidden">
      <motion.p
        style={{ y, letterSpacing: ls }}
        className="select-none whitespace-nowrap text-center font-serif text-[18.5vw] font-[330] leading-[0.82] text-cotton/95 sm:text-[17.4vw] xl:text-[15.2rem]"
        aria-hidden
      >
        Made by <span className="italic text-madder">her.</span>
      </motion.p>
    </div>
  );
}
