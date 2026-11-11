"use client";

import { motion } from "motion/react";
import type { SizeOption } from "@/lib/types";
import { isDark, shade } from "@/lib/format";

/*
 * Top-down "will it fit my bed?" diagram.
 * Mattress sizes are typical Indian sizes (inches). Quilt size animates on change.
 */
const BEDS: Record<string, { w: number; h: number; name: string }> = {
  s: { w: 36, h: 72, name: "Single bed · 36 × 72 in" },
  m: { w: 60, h: 75, name: "Double / Queen · 60 × 75 in" },
  l: { w: 72, h: 78, name: "King bed · 72 × 78 in" },
};

function parse(dims: string) {
  const m = dims.match(/(\d+)\s*[×x*]\s*(\d+)/);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : { w: 60, h: 90 };
}

export function BedFit({ sizeId, color, sizes }: { sizeId: string; color: string; sizes: SizeOption[] }) {
  const size = sizes.find((s) => s.id === sizeId) ?? sizes[0];
  // quilt dims are W × L as given: "60 × 90" → 60 wide, 90 long; "100 × 90" → 100 wide, 90 long
  const q = parse(size.dims);
  const bed = BEDS[sizeId] ?? BEDS.m;
  const S = 3.2; // px per inch in a 500×500 box
  const cx = 250;
  const bedTop = 70;
  const bw = bed.w * S;
  const bh = bed.h * S;
  const qw = q.w * S;
  const qh = q.h * S * 0.86; // drape: part of the length tucks/folds at the pillow end
  const stitch = isDark(color) ? shade(color, 0.4) : shade(color, -0.3);

  return (
    <div className="relative grid h-full w-full place-items-center p-6">
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-label={`${size.label} quilt ${size.dims} on a ${bed.name}`}>
        {/* bed frame */}
        <motion.rect
          animate={{ x: cx - bw / 2 - 10, width: bw + 20, height: bh + 24 }}
          y={bedTop - 14}
          rx="16"
          fill="#A68A62"
          opacity="0.35"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* mattress */}
        <motion.rect
          animate={{ x: cx - bw / 2, width: bw, height: bh }}
          y={bedTop}
          rx="10"
          fill="#FBF9F4"
          stroke="#1F2A44"
          strokeOpacity="0.2"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* pillows */}
        <motion.rect
          animate={{ x: cx - bw / 2 + 10, width: bw / (bed.w > 40 ? 2 : 1) - 20 + (bed.w > 40 ? 5 : 0) }}
          y={bedTop + 10}
          height="36"
          rx="14"
          fill="#fff"
          stroke="#1F2A44"
          strokeOpacity="0.2"
          transition={{ duration: 0.8 }}
        />
        {bed.w > 40 && (
          <motion.rect
            animate={{ x: cx + 5, width: bw / 2 - 15 }}
            y={bedTop + 10}
            height="36"
            rx="14"
            fill="#fff"
            stroke="#1F2A44"
            strokeOpacity="0.2"
            transition={{ duration: 0.8 }}
          />
        )}
        {/* quilt */}
        <motion.g
          animate={{ x: cx - qw / 2, y: bedTop + 56 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.rect
            animate={{ width: qw, height: Math.min(qh, 420 - bedTop), fill: color }}
            rx="12"
            stroke="#1F2A44"
            strokeOpacity="0.25"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            opacity="0.94"
          />
          <motion.rect
            animate={{ width: qw - 16, height: Math.min(qh, 420 - bedTop) - 16 }}
            x="8"
            y="8"
            rx="8"
            fill="none"
            stroke={stitch}
            strokeDasharray="5 5"
            strokeWidth="1.3"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* fold-back at the top */}
          <motion.rect animate={{ width: qw }} height="22" rx="10" fill={shade(color, isDark(color) ? 0.15 : -0.08)} transition={{ duration: 0.8 }} />
        </motion.g>

        {/* width measure */}
        <motion.g animate={{ x: 0 }}>
          <motion.line
            animate={{ x1: cx - qw / 2, x2: cx + qw / 2 }}
            y1="470"
            y2="470"
            stroke="#B5523B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            transition={{ duration: 0.8 }}
          />
          <text x={cx} y="492" textAnchor="middle" fontSize="15" fill="#1F2A44" fontFamily="var(--font-dm-sans)">
            Quilt {size.dims}
          </text>
        </motion.g>
        <text x={cx} y="38" textAnchor="middle" fontSize="14" fill="#5D6478" fontFamily="var(--font-dm-sans)">
          {bed.name}
        </text>
      </svg>
    </div>
  );
}
