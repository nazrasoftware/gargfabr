"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import { Reveal } from "@/components/motion/Reveal";

const MODES = {
  summer: {
    label: "Warm nights",
    hi: "गर्मी",
    bg: "#F2E2C4",
    title: "A light cover for warm nights.",
    body: "Pure cotton breathes, so the quilt works as a light covering in warmer weather, without trapping heat.",
  },
  winter: {
    label: "Mild winters",
    hi: "सर्दी",
    bg: "#D9DFEA",
    title: "Gentle warmth, without the weight.",
    body: "In mild winters it gives soft, even warmth without feeling as heavy as a thick winter blanket.",
  },
} as const;
type Mode = keyof typeof MODES;

export function Seasons() {
  const [mode, setMode] = useState<Mode>("winter");
  const m = MODES[mode];

  return (
    <motion.section
      className="relative overflow-hidden py-16 lg:py-36"
      animate={{ backgroundColor: m.bg }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Comfort through the seasons"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow text-madder">
              Comfort through the seasons <span className="font-hindi normal-case tracking-normal text-sand-deep">· हर मौसम</span>
            </p>
          </Reveal>

          {/* toggle */}
          <div className="mt-8 inline-flex rounded-full bg-cotton/70 p-1.5 ring-1 ring-indigo/10 backdrop-blur" role="tablist" aria-label="Season">
            {(Object.keys(MODES) as Mode[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={mode === k}
                onClick={() => setMode(k)}
                className={clsx("relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors", mode === k ? "text-cotton" : "text-indigo")}
              >
                {mode === k && (
                  <motion.span layoutId="season-pill" className="absolute inset-0 rounded-full bg-indigo" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">
                  {MODES[k].label} <span className="font-hindi">· {MODES[k].hi}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="relative mt-10 min-h-[15rem] sm:min-h-[13rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="display-lg max-w-[14ch] text-[clamp(2.3rem,5vw,5rem)]">{m.title}</h2>
                <p className="lede mt-6 max-w-md text-indigo-soft">{m.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Breathable by nature", "Pure cotton filling, not synthetic."],
              ["Lightweight warmth", "Warm without the weight."],
              ["All-season", "Light in summer, cosy in mild winter."],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="rounded-3xl bg-cotton/60 p-5 ring-1 ring-indigo/8 backdrop-blur"
              >
                <p className="font-serif text-lg leading-tight">{t}</p>
                <p className="mt-1.5 text-sm text-muted">{d}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">Comfort depends on your climate and the quilt you choose.</p>
        </div>

        {/* celestial illustration */}
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <SkyArt mode={mode} />
        </div>
      </div>
    </motion.section>
  );
}

function SkyArt({ mode }: { mode: Mode }) {
  const sun = mode === "summer";
  return (
    <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden>
      {/* orbit */}
      <circle cx="250" cy="250" r="210" fill="none" stroke="#1F2A44" strokeOpacity="0.15" strokeDasharray="4 8" />
      <motion.g animate={{ rotate: sun ? 0 : 180 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }} style={{ transformOrigin: "250px 250px" }}>
        {/* sun at top */}
        <g transform="translate(250 40)">
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <path key={i} d="M0 -46 L0 -36" stroke="#B5523B" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30})`} />
            ))}
          </motion.g>
          <circle r="28" fill="#B5523B" />
        </g>
        {/* moon at bottom */}
        <g transform="translate(250 460) rotate(180)">
          <path d="M14 -28 A30 30 0 1 0 14 28 A24 24 0 1 1 14 -28 Z" fill="#1F2A44" />
          {[
            [40, -30],
            [-46, 12],
            [30, 34],
          ].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r="2.4" fill="#1F2A44" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + i, repeat: Infinity }} />
          ))}
        </g>
      </motion.g>

      {/* the quilt on a bed: it billows in summer, lies snug in winter */}
      <g transform="translate(250 290)">
        <rect x="-150" y="20" width="300" height="70" rx="18" fill="#1F2A44" opacity="0.1" />
        <rect x="-150" y="-30" width="300" height="34" rx="14" fill="#FBF9F4" stroke="#1F2A44" strokeOpacity="0.2" />
        <rect x="-120" y="-60" width="90" height="38" rx="16" fill="#FBF9F4" stroke="#1F2A44" strokeOpacity="0.25" />
        <motion.path
          animate={{
            d: sun
              ? "M-160 -10 C -80 -60, 60 -40, 160 -20 L 170 50 C 60 64, -60 64, -170 50 Z"
              : "M-160 -24 C -80 -34, 60 -34, 160 -24 L 166 50 C 60 58, -60 58, -166 50 Z",
            fill: sun ? "#F4F1EA" : "#1F2A44",
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          stroke="#1F2A44"
          strokeOpacity="0.25"
        />
        <motion.g animate={{ opacity: 1 }} stroke={sun ? "#B5523B" : "#C9B28F"} strokeWidth="1.5" strokeDasharray="5 5" fill="none">
          <path d="M-140 10 C -60 4, 60 4, 150 10" />
          <path d="M-145 32 C -60 28, 60 28, 155 32" />
        </motion.g>
        {/* breathing air lines (summer) */}
        <AnimatePresence>
          {sun &&
            [-80, 0, 80].map((x, i) => (
              <motion.path
                key={x}
                d={`M${x} -70 c 8 -12 -8 -22 0 -34 c 8 -12 -8 -22 0 -34`}
                stroke="#B5523B"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 0.8, 0], y: [10, -20, -40] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
        </AnimatePresence>
      </g>
    </svg>
  );
}
