"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { inr } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/site/Footer";

type Last = { number: string; total: number; name: string; waUrl: string; items: number };

export function OrderSuccess() {
  const [o, setO] = useState<Last | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gf-last-order");
      if (raw) setO(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <div className="relative grid min-h-svh place-items-center overflow-hidden bg-cotton px-4 pb-20 pt-32">
      <div className="quilt-grid pointer-events-none absolute inset-0 opacity-60" />
      {/* falling stitch-crosses */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute top-0 font-serif text-madder"
          style={{ left: `${(i * 53) % 100}%`, fontSize: 12 + (i % 4) * 6 }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: "105vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 4 + (i % 5), delay: 0.6 + i * 0.12, ease: "easeIn" }}
          aria-hidden
        >
          ✦
        </motion.span>
      ))}

      <div className="relative max-w-xl text-center">
        <svg viewBox="0 0 120 120" className="mx-auto h-28 w-28" aria-hidden>
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#1F2A44"
            strokeWidth="2"
            strokeDasharray="6 6"
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: "60px 60px" }}
          />
          <motion.path
            d="M38 62 L54 77 L84 45"
            fill="none"
            stroke="#B5523B"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
          />
        </svg>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-6 font-hindi text-xl text-sand-deep">
          धन्यवाद
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="display-lg mt-2"
        >
          Thank you{o?.name ? `, ${o.name.split(" ")[0]}` : ""}.
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}>
          {o ? (
            <p className="lede mt-5 text-muted">
              Order <b className="text-indigo">{o.number}</b> · {inr(o.total)} has been placed. Send it to us on WhatsApp so we can confirm it with you right
              away.
            </p>
          ) : (
            <p className="lede mt-5 text-muted">Your order has been placed. We&apos;ll be in touch on WhatsApp shortly.</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {o?.waUrl && (
              <motion.a
                href={o.waUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-[#1f8f4e] px-7 font-medium text-white"
                animate={{ boxShadow: ["0 0 0 0 rgba(31,143,78,.45)", "0 0 0 16px rgba(31,143,78,0)"] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                <WhatsAppIcon /> Send order on WhatsApp
              </motion.a>
            )}
            <Button href="/shop" variant="ghost" size="lg">
              Continue shopping
            </Button>
          </div>
          <p className="mt-8 text-sm text-muted">Delivery in 6–8 working days via DTDC. Every quilt is handmade, and yours is on its way.</p>
        </motion.div>
      </div>
    </div>
  );
}
