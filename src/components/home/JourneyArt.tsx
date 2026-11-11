"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { QuiltArt } from "@/components/ui/QuiltArt";

const draw = (delay: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.6, delay, ease: [0.65, 0, 0.35, 1] as const },
});

/** Line-drawn cotton branch that sketches itself, with bolls that puff open. */
export function CottonArt() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const bolls = [
    { x: 150, y: 150, r: 34, d: 0.9 },
    { x: 270, y: 210, r: 40, d: 1.2 },
    { x: 180, y: 300, r: 30, d: 1.5 },
    { x: 290, y: 360, r: 26, d: 1.8 },
  ];
  return (
    <div className="relative grid h-full w-full place-items-center bg-raw">
      <div className="quilt-grid absolute inset-0 opacity-60" />
      <svg ref={ref} viewBox="0 0 400 520" className="relative h-[86%] w-[86%]" fill="none" aria-hidden>
        {inView && (
          <>
            <motion.path d="M200 520 C 210 430, 190 360, 230 280 S 230 160, 170 120" stroke="#1F2A44" strokeWidth="2.2" strokeLinecap="round" {...draw(0)} />
            <motion.path d="M222 300 C 250 280, 268 250, 270 220" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round" {...draw(0.4)} />
            <motion.path d="M214 340 C 190 330, 180 320, 180 300" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round" {...draw(0.6)} />
            <motion.path d="M205 420 C 240 410, 280 390, 290 360" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round" {...draw(0.8)} />
            {/* leaves */}
            <motion.path d="M206 450 C 160 440, 130 410, 120 380 C 160 384, 196 410, 206 450 Z" stroke="#1F2A44" strokeWidth="1.5" fill="#C9B28F" fillOpacity="0.35" {...draw(0.5)} />
            <motion.path d="M226 250 C 270 240, 300 200, 310 170 C 270 176, 236 210, 226 250 Z" stroke="#1F2A44" strokeWidth="1.5" fill="#C9B28F" fillOpacity="0.35" {...draw(0.7)} />
            {bolls.map((b, i) => (
              <motion.g
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 12, delay: b.d }}
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
              >
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle
                    key={a}
                    cx={b.x + Math.cos((a * Math.PI) / 180) * b.r * 0.42}
                    cy={b.y + Math.sin((a * Math.PI) / 180) * b.r * 0.42}
                    r={b.r * 0.55}
                    fill="#FBF9F4"
                    stroke="#1F2A44"
                    strokeWidth="1.3"
                  />
                ))}
                <circle cx={b.x} cy={b.y} r={b.r * 0.4} fill="#FBF9F4" />
                <path
                  d={`M${b.x - b.r * 0.5} ${b.y + b.r * 0.85} L ${b.x} ${b.y + b.r * 0.5} L ${b.x + b.r * 0.5} ${b.y + b.r * 0.85}`}
                  stroke="#96402C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </motion.g>
            ))}
            {/* floating fibres */}
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.circle
                key={`f${i}`}
                r={2 + (i % 3)}
                fill="#FBF9F4"
                stroke="#C9B28F"
                initial={{ cx: 120 + i * 30, cy: 470, opacity: 0 }}
                animate={{ cy: [470, 60], opacity: [0, 0.9, 0], cx: [120 + i * 30, 140 + i * 32 + (i % 2 ? 20 : -20)] }}
                transition={{ duration: 7 + i, repeat: Infinity, delay: 2 + i * 0.8, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}

/** Folded quilt dropping into a kraft parcel tied with a running stitch. */
export function ParcelArt() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} className="relative grid h-full w-full place-items-center overflow-hidden bg-raw">
      <div className="quilt-grid absolute inset-0 opacity-60" />
      <motion.div
        className="absolute left-1/2 top-[14%] w-[78%] -translate-x-1/2"
        initial={{ y: -80, opacity: 0, rotate: -6 }}
        animate={inView ? { y: 0, opacity: 1, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 70, damping: 12, delay: 0.3 }}
      >
        <QuiltArt color="#1F2A44" tag={false} float={false} />
      </motion.div>
      <svg viewBox="0 0 400 240" className="absolute bottom-[8%] w-[86%]" aria-hidden>
        <path d="M40 60 L 360 60 L 340 230 L 60 230 Z" fill="#C9A878" />
        <path d="M40 60 L 360 60 L 360 84 L 40 84 Z" fill="#B8956A" />
        <motion.path
          d="M200 60 L 200 230"
          stroke="#B5523B"
          strokeWidth="3"
          strokeDasharray="10 7"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1.1 }}
        />
        <motion.path
          d="M50 150 L 350 150"
          stroke="#B5523B"
          strokeWidth="3"
          strokeDasharray="10 7"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1.5 }}
        />
        <text x="200" y="205" textAnchor="middle" fontFamily="var(--font-tiro), serif" fontSize="18" fill="#3E2F1C">
          प्यार से भेजा
        </text>
      </svg>
      <motion.div
        className="absolute right-[8%] top-[8%] rounded-full bg-indigo px-4 py-2 text-xs font-medium text-cotton"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : undefined}
        transition={{ type: "spring", delay: 2 }}
      >
        6–8 days
      </motion.div>
    </div>
  );
}
