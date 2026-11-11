"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import clsx from "clsx";

/*
 * ANATOMY · the layer diagram the client asked for.
 * Pinned: an isometric quilt separates into its layers as you scroll,
 * labels sew in, then the layers press back together into one quilt.
 */

const CX = 300;
const HW = 220; // half width
const HH = 110; // half height (2:1 isometric)

const top = (y: number) => `M${CX - HW} ${y} L${CX} ${y - HH} L${CX + HW} ${y} L${CX} ${y + HH} Z`;
const left = (y: number, t: number) => `M${CX - HW} ${y} L${CX} ${y + HH} L${CX} ${y + HH + t} L${CX - HW} ${y + t} Z`;
const right = (y: number, t: number) => `M${CX} ${y + HH} L${CX + HW} ${y} L${CX + HW} ${y + t} L${CX} ${y + HH + t} Z`;

const STEPS = [
  { k: "01", title: "Soft cotton cover", body: "The top layer you see and feel: soft, breathable cotton fabric." },
  { k: "02", title: "Pure cotton filling", body: "The heart of the quilt. Pure cotton at 250 gsm: warm, never heavy." },
  { k: "03", title: "Breathable backing", body: "A cotton base that lets air move, so you stay comfortable." },
  { k: "04", title: "Hand-quilted together", body: "Running stitches by hand hold every layer evenly in place." },
];

export function Anatomy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  const [step, setStep] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(v < 0.3 ? 0 : v < 0.48 ? 1 : v < 0.66 ? 2 : 3);
  });

  // explode 0.08→0.4, hold, compress 0.72→0.92
  const env = useTransform(p, [0.06, 0.4, 0.72, 0.92], [0, 1, 1, 0]);
  const yTop = useTransform(env, [0, 1], [0, -150]);
  const yFill = useTransform(env, [0, 1], [0, -18]);
  const yBack = useTransform(env, [0, 1], [0, 120]);
  const labels = useTransform(p, [0.3, 0.42, 0.7, 0.76], [0, 1, 1, 0]);
  const threads = useTransform(p, [0.55, 0.68, 0.78, 0.86], [0, 1, 1, 0]);
  const final = useTransform(p, [0.88, 0.97], [0, 1]);
  const rot = useTransform(p, [0, 1], [-4, 4]);

  return (
    <section ref={ref} className="relative h-[340vh] bg-raw grain" aria-label="Anatomy of a quilt">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-6 px-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* copy */}
          <div className="relative z-10 order-2 lg:order-1">
            <p className="eyebrow text-madder">
              Anatomy of a quilt <span className="font-hindi normal-case tracking-normal text-sand-deep">· परतें</span>
            </p>
            <h2 className="display-md mt-4 max-w-[13ch] text-[clamp(1.9rem,4.2vw,4.25rem)]">
              Three layers, <span className="italic">one</span> breath of warmth.
            </h2>
            <ol className="mt-6 hidden space-y-1 lg:mt-10 lg:block">
              {STEPS.map((s, i) => (
                <li key={s.k} className="relative">
                  <div className={clsx("flex gap-5 py-3 transition-opacity duration-500", i === step ? "opacity-100" : "opacity-30")}>
                    <span className="font-serif text-sm tabular-nums text-madder">{s.k}</span>
                    <div>
                      <p className="display-sm text-[1.35rem]">{s.title}</p>
                      <motion.p
                        className="overflow-hidden text-muted"
                        animate={{ height: i === step ? "auto" : 0, opacity: i === step ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="block pt-1.5">{s.body}</span>
                      </motion.p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {/* mobile: single active step */}
            <div className="mt-5 min-h-[6.5rem] lg:hidden">
              <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <p className="font-serif text-sm text-madder">
                  {STEPS[step].k} / 04
                </p>
                <p className="display-sm mt-1 text-[1.35rem]">{STEPS[step].title}</p>
                <p className="mt-1 text-muted">{STEPS[step].body}</p>
              </motion.div>
            </div>
          </div>

          {/* diagram */}
          <div className="relative order-1 lg:order-2">
            <motion.svg viewBox="0 0 600 560" className="mx-auto max-h-[62svh] w-full max-w-[600px]" style={{ rotate: rot }} aria-hidden>
              <defs>
                <pattern id="puff" width="26" height="26" patternUnits="userSpaceOnUse">
                  <circle cx="7" cy="7" r="6" fill="#ffffff" />
                  <circle cx="20" cy="18" r="7" fill="#ffffff" />
                  <circle cx="18" cy="5" r="3" fill="#F1EADF" />
                  <circle cx="6" cy="20" r="3" fill="#F1EADF" />
                </pattern>
                <clipPath id="topClip">
                  <path d={top(276)} />
                </clipPath>
              </defs>

              {/* shadow */}
              <ellipse cx={CX} cy={420} rx={250} ry={60} fill="#1F2A44" opacity="0.08" />

              {/* back layer */}
              <motion.g style={{ y: yBack }}>
                <path d={left(320, 8)} fill="#141B2E" />
                <path d={right(320, 8)} fill="#0E1322" />
                <path d={top(320)} fill="#1F2A44" />
                <path d={top(320)} fill="none" stroke="#C9B28F" strokeOpacity="0.4" strokeDasharray="4 5" />
                <Label progress={labels} x={CX + HW - 10} y={322} tx={560} ty={420} text="Backing" sub="Breathable cotton" />
              </motion.g>

              {/* filling */}
              <motion.g style={{ y: yFill }}>
                <path d={left(284, 34)} fill="#E7DED0" />
                <path d={right(284, 34)} fill="#D9CDBA" />
                <path d={top(284)} fill="#FBF9F4" />
                <path d={top(284)} fill="url(#puff)" />
                <Label progress={labels} x={CX + HW - 10} y={290} tx={590} ty={232} text="Filling" sub="Pure cotton · 250 gsm" />
              </motion.g>

              {/* top fabric */}
              <motion.g style={{ y: yTop }}>
                <path d={left(276, 6)} fill="#CDBB9C" />
                <path d={right(276, 6)} fill="#BBA683" />
                <path d={top(276)} fill="#E8DCC6" />
                <g clipPath="url(#topClip)" stroke="#B5523B" strokeWidth="1.3" strokeDasharray="5 5" opacity="0.85">
                  {/* iso diagonals: y = c − x/2 and y = d + x/2, spaced evenly across the face */}
                  {Array.from({ length: 11 }).map((_, i) => {
                    const c = 316 + 22 * (i + 0.5);
                    return <path key={`a${i}`} d={`M80 ${c - 40} L520 ${c - 260}`} />;
                  })}
                  {Array.from({ length: 11 }).map((_, i) => {
                    const d = 16 + 22 * (i + 0.5);
                    return <path key={`b${i}`} d={`M80 ${d + 40} L520 ${d + 260}`} />;
                  })}
                </g>
                <Label progress={labels} x={CX - HW + 20} y={270} tx={30} ty={232} text="Cover" sub="Soft cotton fabric" anchor="start" />
              </motion.g>

              {/* hand-stitch threads piercing the layers */}
              <motion.g style={{ opacity: threads }} stroke="#B5523B" strokeWidth="1.6" strokeDasharray="6 5">
                {[-120, -40, 40, 120].map((dx) => (
                  <motion.path key={dx} d={`M${CX + dx} 110 L ${CX + dx} 460`} />
                ))}
              </motion.g>

              {/* final caption */}
              <motion.g style={{ opacity: final }}>
                <text x={CX} y={520} textAnchor="middle" fontFamily="var(--font-fraunces)" fontSize="22" fill="#1F2A44" fontStyle="italic">
                  = one light, breathable quilt
                </text>
              </motion.g>
            </motion.svg>

            {/* spec chips */}
            <div className="mt-2 flex justify-center gap-2 sm:gap-3">
              {[
                ["250", "gsm cotton"],
                ["200", "gsm polyester"],
                ["100%", "handmade"],
              ].map(([a, b]) => (
                <div key={b} className="rounded-2xl bg-cotton/80 px-3 py-2 text-center ring-1 ring-indigo/10 backdrop-blur sm:px-4">
                  <p className="font-serif text-lg leading-none sm:text-xl">{a}</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Label({
  progress,
  x,
  y,
  tx,
  ty,
  text,
  sub,
  anchor = "end",
}: {
  progress: MotionValue<number>;
  x: number;
  y: number;
  tx: number;
  ty: number;
  text: string;
  sub: string;
  anchor?: "start" | "end";
}) {
  return (
    <motion.g style={{ opacity: progress }}>
      <motion.path
        d={`M${x} ${y} L ${tx} ${ty}`}
        stroke="#1F2A44"
        strokeWidth="1"
        strokeDasharray="3 4"
        style={{ pathLength: progress }}
      />
      <circle cx={x} cy={y} r="4" fill="#B5523B" />
      <text x={tx} y={ty - 22} textAnchor={anchor} fontFamily="var(--font-fraunces)" fontSize="22" fill="#1F2A44">
        {text}
      </text>
      <text x={tx} y={ty - 4} textAnchor={anchor} fontFamily="var(--font-dm-sans)" fontSize="12.5" fill="#5D6478">
        {sub}
      </text>
    </motion.g>
  );
}
