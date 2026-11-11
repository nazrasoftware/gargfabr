"use client";

import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { useId, useRef, type ReactNode, type ElementType } from "react";
import clsx from "clsx";

const silk = [0.22, 1, 0.36, 1] as const;

/** Fade + rise when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "span" | "article";
  once?: boolean;
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 1, ease: silk, delay }}
    >
      {children}
    </M>
  );
}

/** Word-by-word masked rise. Text stays real text for SEO/a11y. */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = "span",
  italicWords = [],
  accentWords = [],
  trigger = "view",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  italicWords?: string[];
  accentWords?: string[];
  trigger?: "view" | "mount";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const show = trigger === "mount" ? true : inView;
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const bare = w.replace(/[.,!?]/g, "");
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
            <motion.span
              className={clsx(
                "inline-block will-change-transform",
                italicWords.includes(bare) && "italic",
                accentWords.includes(bare) && "text-madder",
              )}
              initial={{ y: "110%", rotate: 4 }}
              animate={show ? { y: "0%", rotate: 0 } : undefined}
              transition={{ duration: 1.1, ease: silk, delay: delay + i * stagger }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

/** A running-stitch line that sews itself in when visible. */
export function StitchDraw({
  className,
  d = "M2 6 C 120 1, 240 11, 398 5",
  viewBox = "0 0 400 12",
  delay = 0.2,
  color = "currentColor",
  width = 1.8,
  dash = "7 6",
}: {
  className?: string;
  d?: string;
  viewBox?: string;
  delay?: number;
  color?: string;
  width?: number;
  dash?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const id = useId().replace(/:/g, "");
  return (
    <svg ref={ref} viewBox={viewBox} fill="none" preserveAspectRatio="none" className={className} aria-hidden>
      <mask id={`m${id}`}>
        <motion.path
          d={d}
          stroke="white"
          strokeWidth={width * 3}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay }}
        />
      </mask>
      <path
        d={d}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dash}
        strokeLinecap="round"
        mask={`url(#m${id})`}
      />
    </svg>
  );
}

/** Scroll-scrubbed text: words brighten from faint to full as you read. */
export function ScrubText({ text, className, accent = [] }: { text: string; className?: string; accent?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrubWord
          key={i}
          word={w}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          accent={accent.includes(w.replace(/[.,—]/g, ""))}
        />
      ))}
    </p>
  );
}

function ScrubWord({
  word,
  progress,
  range,
  accent,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={clsx(accent && "italic text-madder")}>
      {word}{" "}
    </motion.span>
  );
}

/** Gentle parallax on scroll. */
export function Parallax({ children, speed = 0.15, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
