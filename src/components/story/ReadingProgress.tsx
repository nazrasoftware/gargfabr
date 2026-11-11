"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** A running stitch along the top that sews itself as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left text-madder"
      style={{ scaleX, backgroundImage: "linear-gradient(to right, currentColor 60%, transparent 0)", backgroundSize: "12px 3px" }}
      aria-hidden
    />
  );
}
