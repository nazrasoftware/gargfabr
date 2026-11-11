"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitWords } from "@/components/motion/Reveal";

/** Collage of stills that drift apart at different speeds as you scroll. */
const TILES = [
  { src: "/media/spread-2.jpg", cls: "left-[3%] top-[44%] w-[24vw] max-w-[340px] aspect-[4/5] rounded-[28px]", speed: -120 },
  { src: "/media/needle-2.jpg", cls: "right-[6%] top-[12%] w-[24vw] max-w-[300px] aspect-square arch", speed: -260 },
  { src: "/media/finish-2.jpg", cls: "right-[14%] bottom-[-6%] w-[30vw] max-w-[380px] aspect-[4/3] rounded-[28px]", speed: -60 },
  { src: "/media/hands-2.jpg", cls: "left-[30%] bottom-[-10%] w-[18vw] max-w-[240px] aspect-[3/4] arch", speed: -320 },
];

export function StoryHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={ref} className="relative h-[120svh] overflow-hidden bg-cotton" aria-label="Our story">
      <div className="quilt-grid pointer-events-none absolute inset-0 opacity-60" />
      {TILES.map((t, i) => (
        <Tile key={t.src} t={t} i={i} progress={scrollYProgress} />
      ))}
      <motion.div style={{ y: titleY }} className="relative z-10 flex h-svh flex-col items-center justify-center px-4 text-center">
        <p className="font-hindi text-2xl text-sand-deep">हमारी कहानी</p>
        <SplitWords
          as="h1"
          text="Empowering women, one stitch at a time."
          className="display-xl mt-4 block max-w-[13ch] text-[clamp(3rem,8.5vw,9rem)] [text-shadow:0_2px_30px_rgba(247,243,236,.9)]"
          italicWords={["stitch"]}
          trigger="mount"
        />
      </motion.div>
    </section>
  );
}

function Tile({
  t,
  i,
  progress,
}: {
  t: (typeof TILES)[number];
  i: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [0, t.speed]);
  return (
    <motion.div
      style={{ y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + i * 0.12, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute hidden overflow-hidden opacity-90 md:block ${t.cls}`}
    >
      <Image src={t.src} alt="" fill sizes="35vw" className="object-cover" priority={i < 2} />
    </motion.div>
  );
}
