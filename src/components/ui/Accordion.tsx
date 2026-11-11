"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import clsx from "clsx";

export function Accordion({
  items,
  className,
  dark = false,
  defaultOpen = -1,
}: {
  items: { q: string; a: ReactNode }[];
  className?: string;
  dark?: boolean;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={className}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={clsx("relative", dark ? "text-cotton" : "text-indigo")}>
            <div className="stitch-x w-full opacity-30" />
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="display-sm text-[clamp(1.15rem,1.7vw,1.5rem)] transition-transform duration-500 group-hover:translate-x-2">
                {it.q}
              </span>
              <span
                className={clsx(
                  "relative grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 transition-colors duration-300",
                  dark ? "ring-cotton/30" : "ring-indigo/20",
                  isOpen && "bg-madder text-cotton ring-madder",
                )}
              >
                <motion.span
                  className="absolute h-[1.5px] w-3.5 bg-current"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.span
                  className="absolute h-3.5 w-[1.5px] bg-current"
                  animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className={clsx("max-w-2xl pb-7 leading-relaxed", dark ? "text-cotton/75" : "text-muted")}>{it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <div className="stitch-x w-full opacity-30" />
    </div>
  );
}
