"use client";

import { AnimatePresence, animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { Reveal, SplitWords, StitchDraw } from "@/components/motion/Reveal";
import { useLenis } from "@/components/motion/SmoothScroll";

/*
 * NOTE: the two portrait clips have no audio track. Captions here use the
 * brand's own words. When the client supplies each woman's name and quote
 * (with consent), add them to ARTISANS below.
 */
const ARTISANS = [
  { video: "artisan-1", name: "Artisan", place: "Garg Fabrication workshop", hi: "कारीगर" },
  { video: "artisan-2", name: "Artisan", place: "Garg Fabrication workshop", hi: "कारीगर" },
];

export function Women() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [180, -140]);
  const bigX = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"]);

  return (
    <section id="women" ref={ref} className="relative overflow-hidden bg-indigo-deep py-16 text-cotton lg:py-40" aria-label="Our women">
      <div className="quilt-grid pointer-events-none absolute inset-0 opacity-30 invert" />

      {/* drifting Hindi watermark */}
      <motion.p
        style={{ x: bigX }}
        className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap font-hindi text-[22vw] leading-none text-cotton/[0.035]"
        aria-hidden
      >
        एक-एक टाँका
      </motion.p>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal>
          <p className="eyebrow text-sand">
            Empowering women <span className="font-hindi normal-case tracking-normal">· हमारी महिलाएँ</span>
          </p>
        </Reveal>

        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[auto_1fr] lg:gap-16">
          <Counter to={500} />
          <div className="pb-4">
            <SplitWords
              as="h2"
              text="women, one stitch at a time."
              className="display-md block max-w-[15ch]"
              italicWords={["stitch"]}
            />
            <StitchDraw className="mt-5 h-3 w-64 text-madder" />
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <motion.div style={{ y: y1 }} className="lg:col-span-4">
            <Portrait a={ARTISANS[0]} onOpen={() => setOpen(ARTISANS[0].video)} />
          </motion.div>

          <div className="flex flex-col justify-center lg:col-span-4 lg:px-4">
            <Reveal>
              <svg viewBox="0 0 40 30" className="h-8 w-10 text-madder" aria-hidden>
                <path d="M0 30V18C0 8 6 2 16 0l2 4c-6 2-9 6-9 12h7v14zm22 0V18c0-10 6-16 16-18l2 4c-6 2-9 6-9 12h7v14z" fill="currentColor" />
              </svg>
              <p className="display-sm mt-6 text-[clamp(1.5rem,2.2vw,2.1rem)] leading-snug">
                For us, every quilt represents more than craftsmanship. It represents a woman&apos;s skill, dedication, and contribution to her
                family&apos;s future.
              </p>
              <p className="mt-6 text-sm text-cotton/60">Garg Fabrication</p>
            </Reveal>
          </div>

          <motion.div style={{ y: y2 }} className="lg:col-span-4">
            <Portrait a={ARTISANS[1]} onOpen={() => setOpen(ARTISANS[1].video)} />
          </motion.div>
        </div>

        {/* leadership + pillars */}
        <div className="mt-10 grid gap-9 border-t border-dashed border-cotton/20 pt-10 lg:mt-40 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow text-sand">Led by</p>
            <p className="display-md mt-4">Babita Gupta</p>
            <p className="mt-2 text-cotton/60">Co-Founder & Operations Head · from Ringas, Rajasthan</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="lede text-cotton/80">
              What began with a small team has grown into a network of over 500 rural women associated with us on a contract basis. Our women-centric
              model lets women from surrounding villages earn through their skills while continuing to manage their homes.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Meaningful work", "Paid for skill, close to home."],
                ["Skill development", "Craft passed on and sharpened."],
                ["Financial independence", "An income of her own."],
              ].map(([t, d], i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.8 }}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-dashed border-cotton/20 p-5 transition-colors hover:border-madder hover:bg-cotton/[0.03]"
                >
                  <span className="font-serif text-sm text-madder">0{i + 1}</span>
                  <p className="mt-3 font-serif text-xl">{t}</p>
                  <p className="mt-1 text-sm text-cotton/60">{d}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <Lightbox video={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <p ref={ref} className="font-serif text-[clamp(7rem,26vw,22rem)] font-[300] leading-[0.8] tracking-[-0.05em] tabular-nums" aria-label={`${to}+`}>
      {n}
      <span className="text-madder">+</span>
    </p>
  );
}

function Portrait({ a, onOpen }: { a: (typeof ARTISANS)[number]; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group block w-full text-left" data-cursor="Play" aria-label="Play artisan film">
      <div className="arch relative aspect-[3/4] overflow-hidden bg-indigo">
        <div className="h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-105">
          <VideoLoop name={a.video} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep/70 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full bg-cotton/90 text-indigo transition-transform duration-500 group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-cotton/70">
        <span className="font-hindi text-sand">{a.hi}</span> · {a.place}
      </p>
    </button>
  );
}

function Lightbox({ video, onClose }: { video: string | null; onClose: () => void }) {
  const lenis = useLenis();
  useEffect(() => {
    if (video) lenis?.stop();
    else lenis?.start();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [video, lenis, onClose]);
  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-indigo-deep/90 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-label="Artisan film"
        >
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-black"
            initial={{ scale: 0.85, y: 40, clipPath: "inset(20% 20% 20% 20% round 200px)" }}
            animate={{ scale: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video src={`/media/${video}.mp4`} autoPlay loop muted playsInline controls className="aspect-video w-full" />
          </motion.div>
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-cotton text-indigo transition hover:rotate-90"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
