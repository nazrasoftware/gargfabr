"use client";

import { motion } from "motion/react";
import { useId } from "react";
import clsx from "clsx";
import { isDark, shade } from "@/lib/format";

/**
 * Illustrated product render: a folded quilt stack (or pillow) drawn in the
 * selected colour, hand-quilted diamond stitching, kraft "handmade" tag.
 * Used whenever a product has no photography yet, and as an art motif.
 */
export function QuiltArt({
  color = "#DCCBAE",
  kind = "quilt",
  className,
  tag = true,
  float = true,
}: {
  color?: string;
  kind?: "quilt" | "pillow";
  className?: string;
  tag?: boolean;
  float?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const dark = isDark(color);
  const top = shade(color, dark ? 0.12 : 0.35);
  const front = color;
  const side = shade(color, -0.16);
  const fold = shade(color, dark ? -0.25 : -0.1);
  const stitch = dark ? shade(color, 0.45) : shade(color, -0.32);
  const t = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

  if (kind === "pillow") {
    return (
      <svg viewBox="0 0 400 320" className={clsx("h-full w-full", className)} aria-hidden>
        <defs>
          <radialGradient id={`pg${id}`} cx="45%" cy="40%" r="70%">
            <stop offset="0%" stopColor={top} />
            <stop offset="100%" stopColor={side} />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="276" rx="150" ry="14" fill="#1F2A44" opacity="0.08" />
        <motion.g animate={float ? { y: [0, -6, 0] } : undefined} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          {/* back pillow */}
          <motion.path
            d="M118 92 Q 160 76 250 84 Q 318 80 330 96 Q 346 160 334 222 Q 320 236 250 232 Q 160 240 124 228 Q 104 160 118 92 Z"
            animate={{ fill: side }}
            transition={t}
            transform="translate(26 -18) rotate(4 220 160)"
          />
          <path
            d="M78 104 Q 130 84 220 94 Q 300 88 318 106 Q 336 170 322 240 Q 306 256 220 250 Q 128 260 86 246 Q 62 172 78 104 Z"
            fill={`url(#pg${id})`}
            stroke={stitch}
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <path
            d="M92 116 Q 140 100 220 108 Q 292 102 306 118 Q 320 172 308 232 Q 294 242 220 238 Q 136 246 100 234 Q 80 172 92 116 Z"
            fill="none"
            stroke={stitch}
            strokeOpacity="0.55"
            strokeWidth="1.2"
            strokeDasharray="3 5"
          />
          <circle cx="200" cy="172" r="4" fill={stitch} opacity="0.6" />
        </motion.g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 320" className={clsx("h-full w-full", className)} aria-hidden>
      <defs>
        <clipPath id={`top${id}`}>
          <path d="M72 128 L 296 128 L 344 86 L 120 86 Z" />
        </clipPath>
        <linearGradient id={`fr${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={front} />
          <stop offset="1" stopColor={shade(color, -0.07)} />
        </linearGradient>
      </defs>
      <ellipse cx="208" cy="262" rx="160" ry="16" fill="#1F2A44" opacity="0.09" />
      <motion.g animate={float ? { y: [0, -7, 0] } : undefined} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}>
        {/* side */}
        <motion.path d="M296 128 L 344 86 L 344 192 Q 344 200 336 206 L 296 240 Z" animate={{ fill: side }} transition={t} />
        {/* front with fold bulges */}
        <motion.path d="M72 128 L 296 128 L 296 240 L 72 240 Q 62 240 62 230 L 62 138 Q 62 128 72 128 Z" animate={{ fill: front }} transition={t} />
        {[156, 184, 212].map((yy) => (
          <motion.path
            key={yy}
            d={`M64 ${yy} Q 180 ${yy + 5} 296 ${yy}`}
            fill="none"
            animate={{ stroke: fold }}
            transition={t}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {[142, 170, 198, 226].map((yy) => (
          <path key={yy} d={`M70 ${yy} L 290 ${yy}`} stroke={stitch} strokeOpacity="0.45" strokeWidth="1.1" strokeDasharray="3 5" />
        ))}
        {/* top face */}
        <motion.path d="M72 128 L 296 128 L 344 86 L 120 86 Z" animate={{ fill: top }} transition={t} />
        <g clipPath={`url(#top${id})`} stroke={stitch} strokeWidth="1.2" strokeDasharray="4 4" opacity="0.7">
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={`a${i}`} d={`M${40 + i * 26} 140 L ${90 + i * 26} 76`} />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={`b${i}`} d={`M${40 + i * 26} 76 L ${120 + i * 26} 140`} />
          ))}
        </g>
        <path d="M72 128 L 296 128 L 344 86" fill="none" stroke={shade(color, -0.2)} strokeWidth="1.2" opacity="0.5" />
        {/* handmade tag */}
        {tag && (
          <g transform="translate(250 150) rotate(-8)">
            <path d="M-46 -38 C -30 -30 -12 -18 0 0" stroke="#7A6446" strokeWidth="1" fill="none" />
            <path d="M0 0 h56 a4 4 0 0 1 4 4 v26 a4 4 0 0 1 -4 4 h-56 l-10 -17 z" fill="#C9A878" />
            <circle cx="0" cy="17" r="2.6" fill="#7A6446" opacity="0.6" />
            <text x="30" y="21" textAnchor="middle" fontSize="9.5" fill="#3E2F1C" fontFamily="var(--font-tiro), serif">
              हस्तनिर्मित
            </text>
          </g>
        )}
      </motion.g>
    </svg>
  );
}
