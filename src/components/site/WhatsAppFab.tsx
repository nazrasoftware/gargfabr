"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Footer";

/** Floating WhatsApp button that appears after the hero. */
export function WhatsAppFab({ number }: { number: string }) {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 700));
  return (
    <motion.a
      href={waLink(number, "Hello Garg Fabrication! I have a question about your quilts.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#1f8f4e] pl-4 pr-4 text-white shadow-[0_10px_30px_-8px_rgba(20,27,46,.45)] sm:bottom-7 sm:right-7"
      initial={false}
      animate={{ scale: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      whileTap={{ scale: 0.92 }}
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,margin] duration-500 group-hover:ml-2 group-hover:max-w-40">
        Ask us anything
      </span>
    </motion.a>
  );
}
