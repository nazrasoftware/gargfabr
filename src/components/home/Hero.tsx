"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { SplitWords } from "@/components/motion/Reveal";
import { useIntroReady } from "@/components/motion/intro";
import { useLenis } from "@/components/motion/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { VideoLoop } from "@/components/ui/VideoLoop";

/**
 * HERO · "The window opens"
 * A jharokha-arch window of hand-stitching footage sits beside the headline.
 * Scrolling widens the arch into a full-bleed film, the headline lifts away,
 * and a single line of story fades in over the footage.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroReady();
  const lenis = useLenis();
  const [vp, setVp] = useState({ w: 1440, h: 900, mobile: false });

  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight, mobile: window.innerWidth < 1024 });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Intro: the arch rises up from the floor once the preloader lifts.
  const intro = useMotionValue(0);
  useEffect(() => {
    if (ready) animate(intro, 1, { duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.15 });
  }, [ready, intro]);

  const clip = useTransform([p, intro], ([sp, it]: number[]) => {
    const { w, h, mobile } = vp;
    const e = Math.min(1, Math.max(0, sp / 0.55));
    const k = 1 - Math.pow(1 - e, 2); // ease-out
    // starting arch box
    const a = mobile
      ? { t: h * 0.47, r: 16, b: 16, l: 16 }
      : { t: h * 0.15, r: w * 0.05, b: h * 0.06, l: w * 0.53 };
    const t = a.t * (1 - k);
    const r = a.r * (1 - k);
    const b = a.b * (1 - k);
    const l = a.l * (1 - k);
    const archW = w - r - l;
    const rad = (archW / 2) * (1 - k);
    // intro: the top edge rises from the bottom of the box
    const introTop = t + (h - b - t) * (1 - it);
    return `inset(${introTop}px ${r}px ${b}px ${l}px round ${rad}px ${rad}px ${24 * (1 - k)}px ${24 * (1 - k)}px)`;
  });

  const vidScale = useTransform(p, [0, 0.6], [1.18, 1]);
  const headY = useTransform(p, [0, 0.4], ["0%", "-30%"]);
  const headOpacity = useTransform(p, [0, 0.32], [1, 0]);
  const shade = useTransform(p, [0.35, 0.75], [0.12, 0.55]);
  const storyOpacity = useTransform(p, [0.55, 0.72], [0, 1]);
  const storyY = useTransform(p, [0.55, 0.75], [40, 0]);
  const badgeOpacity = useTransform(p, [0, 0.15], [1, 0]);
  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} className="relative h-[165vh] bg-cotton lg:h-[230vh]" aria-label="Introduction">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="quilt-grid pointer-events-none absolute inset-0 opacity-70" />

        {/* Headline */}
        <motion.div
          style={{ y: headY, opacity: headOpacity }}
          className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-4 pt-[7.5rem] sm:px-8 lg:justify-center lg:pt-16"
        >
          <motion.p
            className="eyebrow flex items-center gap-3 text-muted"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 0.1, duration: 1 }}
          >
            <span className="inline-block h-px w-8 bg-madder" />
            Handmade quilts <span className="font-hindi normal-case tracking-normal text-sand-deep">· हस्तनिर्मित</span>
          </motion.p>
          {ready && (
            <h1 className="display-xl mt-3 text-[clamp(2.55rem,11.2vw,4.6rem)] text-indigo lg:mt-7 lg:max-w-[48vw] lg:text-[min(9.4vw,15.5vh)]">
              <SplitWords text="Light as cotton." trigger="mount" className="block" stagger={0.07} />
              <SplitWords
                text="Made by her."
                trigger="mount"
                className="block"
                delay={0.25}
                stagger={0.07}
                italicWords={["her"]}
                accentWords={["her"]}
              />
            </h1>
          )}
          {!ready && <h1 className="display-xl mt-7 opacity-0">Light as cotton. Made by her.</h1>}
          <motion.p
            className="lede mt-3 hidden max-w-[30rem] text-[0.98rem] text-muted [@media(min-height:780px)]:block lg:mt-8 lg:block lg:text-[clamp(1.05rem,1.25vw,1.25rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Breathable quilts with pure cotton filling, hand-stitched by more than 500 women artisans.
          </motion.p>
          <motion.div
            className="mt-6 sm:mt-10 hidden flex-wrap gap-3 lg:flex"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.85, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button href="/shop" variant="accent" size="lg">
              Shop quilts
            </Button>
            <Button variant="ghost" size="lg" onClick={() => lenis?.scrollTo("#journey", { offset: -40, duration: 2 })}>
              Watch their journey
            </Button>
          </motion.div>
        </motion.div>

        {/* The arch window → full-bleed film */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 z-20" data-cursor="Scroll">
          <motion.div style={{ scale: vidScale }} className="h-full w-full">
            <VideoLoop name="hands" portrait="hands-portrait" eager />
          </motion.div>
          <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-indigo-deep" />
          <motion.div
            style={{ opacity: storyOpacity, y: storyY }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-cotton"
          >
            <p className="font-hindi text-xl text-sand sm:text-2xl">हर रज़ाई की एक कहानी है</p>
            <p className="display-lg mt-3 sm:mt-4">
              Every quilt holds a woman&apos;s <span className="italic">skill</span>, patience and story.
            </p>
          </motion.div>
        </motion.div>

        {/* Rotating seal on the arch */}
        <motion.div
          style={{ opacity: badgeOpacity }}
          className="pointer-events-none absolute left-[calc(53vw-62px)] top-[66vh] z-30 hidden lg:block"
          initial={{ scale: 0, rotate: -90 }}
          animate={ready ? { scale: 1, rotate: 0 } : undefined}
          transition={{ delay: 1.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Seal />
        </motion.div>

        {/* Mobile CTA sits on the arch */}
        <motion.div
          style={{ opacity: badgeOpacity }}
          className="absolute inset-x-0 bottom-8 z-30 flex justify-center gap-2 lg:hidden"
          initial={{ y: 30 }}
          animate={ready ? { y: 0 } : undefined}
          transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button href="/shop" variant="light" magnetic={false}>
            Shop quilts
          </Button>
          <Button
            variant="accent"
            magnetic={false}
            onClick={() => lenis?.scrollTo("#journey", { offset: -40, duration: 2 })}
          >
            Their journey
          </Button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 left-[46vw] z-30 hidden flex-col items-center gap-2 text-indigo lg:flex"
        >
          <span className="eyebrow text-[0.62rem]">Scroll</span>
          <span className="relative h-14 w-px overflow-hidden">
            <motion.span
              className="absolute left-0 top-0 h-full w-px"
              style={{ backgroundImage: "linear-gradient(to bottom, currentColor 55%, transparent 0)", backgroundSize: "1px 7px" }}
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          </span>
          <ArrowDown size={14} />
        </motion.div>
      </div>
    </section>
  );
}

function Seal() {
  const text = " 500+ WOMEN ARTISANS ✦ HANDMADE WITH CARE ✦";
  return (
    <div className="relative h-[124px] w-[124px] rounded-full bg-madder text-cotton shadow-xl">
      <motion.svg
        viewBox="0 0 124 124"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="seal-c" d="M62,62 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text fontSize="9.6" letterSpacing="2.2" fill="currentColor" fontFamily="var(--font-dm-sans)" fontWeight="600">
          <textPath href="#seal-c">{text}</textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-hindi text-2xl">हाथ</span>
      </div>
    </div>
  );
}
