"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { CottonArt } from "./JourneyArt";

type Chapter = {
  n: string;
  hi: string;
  title: string;
  body: string;
  media: ReactNode;
  shape: "arch" | "round";
  tint: string;
};

/*
 * To drop in AI-generated story images later: put the file in /public/media/ai/
 * and replace a chapter's `media` with <img src="/media/ai/…" className="h-full w-full object-cover" />.
 */
const CHAPTERS: Chapter[] = [
  {
    n: "०१",
    hi: "कपास",
    title: "Pure cotton",
    body: "It begins with pure cotton filling: soft, breathable and chosen for comfort.",
    media: <CottonArt />,
    shape: "arch",
    tint: "bg-raw",
  },
  {
    n: "०२",
    hi: "बिछाना",
    title: "Laid out by hand",
    body: "Two pairs of hands spread every layer flat and even on the workshop floor.",
    media: <VideoLoop name="spread" />,
    shape: "round",
    tint: "bg-indigo",
  },
  {
    n: "०३",
    hi: "सिलाई",
    title: "Stitched, line by line",
    body: "Hand quilting holds the cotton in place, so the quilt stays light and even for years.",
    media: <VideoLoop name="needle" />,
    shape: "arch",
    tint: "bg-indigo",
  },
  {
    n: "०४",
    hi: "परख",
    title: "Every thread checked",
    body: "Loose threads trimmed, edges finished, and each quilt checked by eye before it leaves.",
    media: <VideoLoop name="finish" />,
    shape: "round",
    tint: "bg-indigo",
  },
  {
    n: "०५",
    hi: "आपके घर",
    title: "Folded, and on its way",
    body: "Packed with care and delivered across India in 6–8 working days.",
    media: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/media/journey-step5.webp"
        alt="A woman's hands folding a finished white quilt beside kraft paper, jute twine and a blank tag"
        loading="lazy"
        className="h-full w-full object-cover"
      />
    ),
    shape: "arch",
    tint: "bg-raw",
  },
];

export function Journey() {
  return (
    <section id="journey" className="relative bg-cotton" aria-label="From cotton to your bed">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-28 sm:px-8 lg:pb-0 lg:pt-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow text-madder">
                The journey <span className="font-hindi normal-case tracking-normal text-sand-deep">· सफ़र</span>
              </p>
            </Reveal>
            <SplitWords as="h2" text="From cotton to your bed." className="display-lg mt-5 block max-w-[14ch]" italicWords={["bed"]} />
          </div>
          <Reveal delay={0.2} className="max-w-sm text-muted lg:pb-3">
            Five steps, all by hand. Scroll to follow a quilt from raw cotton to your doorstep.
          </Reveal>
        </div>
      </div>
      <HorizontalTrack />
      <VerticalStory />
    </section>
  );
}

/* ───────────── Desktop: pinned horizontal scroll with a thread running through ───────────── */

function HorizontalTrack() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);
  const thread = useTransform(smooth, [0, 1], [0.02, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(CHAPTERS.length - 1, Math.floor(v * CHAPTERS.length * 0.999)));
  });

  return (
    <div ref={section} className="relative hidden lg:block" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="relative flex items-center gap-[6vw] pl-[8vw] pr-[12vw] will-change-transform">
          {/* the thread */}
          <svg
            className="pointer-events-none absolute left-0 top-[9%] h-24 w-full"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d="M0 50 C 60 10, 120 90, 200 50 S 340 10, 400 50 S 540 90, 600 50 S 740 10, 800 50 S 940 90, 1000 50" stroke="#C9B28F" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" vectorEffect="non-scaling-stroke" />
            <motion.path
              d="M0 50 C 60 10, 120 90, 200 50 S 340 10, 400 50 S 540 90, 600 50 S 740 10, 800 50 S 940 90, 1000 50"
              stroke="#B5523B"
              strokeWidth="2"
              style={{ pathLength: thread }}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {CHAPTERS.map((c, i) => (
            <article key={c.n} className="relative z-10 flex h-[74vh] w-[min(64vw,980px)] shrink-0 items-center gap-10">
              <div
                className={clsx(
                  "relative h-full w-[54%] shrink-0 overflow-hidden",
                  c.shape === "arch" ? "arch" : "rounded-[40px]",
                  c.tint,
                )}
                data-cursor={i > 0 && i < 4 ? "Watch" : undefined}
              >
                {c.media}
              </div>
              <div className="relative flex-1">
                <span
                  className="block font-hindi text-[9rem] leading-none text-transparent"
                  style={{ WebkitTextStroke: "1.2px #A68A62" }}
                  aria-hidden
                >
                  {c.n}
                </span>
                <p className="eyebrow mt-2 text-madder">
                  Step {i + 1} <span className="font-hindi normal-case tracking-normal text-sand-deep">· {c.hi}</span>
                </p>
                <h3 className="display-md mt-4">{c.title}</h3>
                <p className="lede mt-4 max-w-[22rem] text-muted">{c.body}</p>
              </div>
            </article>
          ))}
        </motion.div>

        {/* progress HUD */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="display-sm tabular-nums">
              {String(active + 1).padStart(2, "0")}
              <span className="text-muted"> / {String(CHAPTERS.length).padStart(2, "0")}</span>
            </span>
            <span className="text-sm text-muted">{CHAPTERS[active].title}</span>
          </div>
          <div className="flex gap-2">
            {CHAPTERS.map((c, i) => (
              <motion.span
                key={c.n}
                className="h-[3px] rounded-full bg-indigo"
                animate={{ width: i === active ? 40 : 12, opacity: i === active ? 1 : 0.2 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Mobile: a vertical story with sticky step numbers ───────────── */

function VerticalStory() {
  return (
    <div className="relative px-4 pb-14 sm:px-8 lg:hidden">
      <div className="absolute bottom-24 left-[2.15rem] top-0 w-px sm:left-[3.15rem]" style={{ backgroundImage: "linear-gradient(to bottom, #C9B28F 55%, transparent 0)", backgroundSize: "1px 9px" }} />
      <ol className="space-y-16">
        {CHAPTERS.map((c, i) => (
          <MobileStep key={c.n} c={c} i={i} />
        ))}
      </ol>
    </div>
  );
}

function MobileStep({ c, i }: { c: Chapter; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [80, 28]);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "-20% 0px" });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <li ref={ref} className="relative pl-14">
      <motion.span
        className="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full bg-cotton font-hindi text-sm ring-1 ring-sand"
        animate={visible ? { backgroundColor: "#B5523B", color: "#F7F3EC" } : undefined}
        transition={{ duration: 0.5 }}
      >
        {c.n}
      </motion.span>
      <p className="eyebrow pt-2 text-madder">
        Step {i + 1} <span className="font-hindi normal-case tracking-normal text-sand-deep">· {c.hi}</span>
      </p>
      <h3 className="display-md mt-3 text-[2.1rem]">{c.title}</h3>
      <p className="mt-3 text-muted">{c.body}</p>
      <motion.div
        style={{ scale, borderRadius: c.shape === "round" ? radius : undefined }}
        className={clsx("relative mt-6 aspect-[4/5] overflow-hidden", c.shape === "arch" && "arch", c.tint)}
      >
        {c.media}
      </motion.div>
    </li>
  );
}
