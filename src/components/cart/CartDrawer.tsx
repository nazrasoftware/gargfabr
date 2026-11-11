"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { cartSubtotal, useCart } from "./store";
import { inr } from "@/lib/format";
import { QuiltArt } from "@/components/ui/QuiltArt";
import { Button } from "@/components/ui/Button";
import { useLenis } from "@/components/motion/SmoothScroll";

export function CartDrawer({ freeShippingAbove }: { freeShippingAbove: number }) {
  const { lines, open, setOpen, setQty, remove } = useCart();
  const lenis = useLenis();
  const subtotal = cartSubtotal(lines);
  const remaining = Math.max(0, freeShippingAbove - subtotal);
  const pct = Math.min(100, (subtotal / freeShippingAbove) * 100);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-indigo-deep/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Your cart"
            className="fixed bottom-0 right-0 top-0 z-[61] flex w-full max-w-[460px] flex-col bg-cotton shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="display-sm">
                Your cart <span className="font-hindi text-sand-deep">· झोला</span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-indigo/15 transition hover:rotate-90 hover:bg-indigo hover:text-cotton"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {lines.length > 0 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-muted">
                  {remaining > 0 ? (
                    <>
                      Add <b className="text-indigo">{inr(remaining)}</b> more for free delivery
                    </>
                  ) : (
                    <b className="text-madder">You&apos;ve unlocked free delivery ✦</b>
                  )}
                </p>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-indigo/10">
                  <motion.div className="h-full bg-madder" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="h-40 w-52 opacity-80">
                    <QuiltArt color="#DCCBAE" tag={false} />
                  </div>
                  <p className="display-sm mt-4">Your cart is resting.</p>
                  <p className="mt-2 text-muted">A light, handmade quilt is a click away.</p>
                  <div className="mt-6">
                    <Button href="/shop" onClick={() => setOpen(false)}>
                      Browse quilts
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4 pb-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 rounded-3xl bg-cotton-2 p-3 ring-1 ring-indigo/8"
                      >
                        <Link
                          href={`/shop/${l.slug}`}
                          onClick={() => setOpen(false)}
                          className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-raw"
                        >
                          {l.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={l.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <QuiltArt color={l.hex} kind={l.category === "pillow-covers" ? "pillow" : "quilt"} tag={false} float={false} />
                          )}
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-serif text-[1.05rem] leading-tight">{l.name}</p>
                            <button onClick={() => remove(l.key)} className="text-muted transition hover:text-madder" aria-label={`Remove ${l.name}`}>
                              <X size={16} />
                            </button>
                          </div>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                            <span className="inline-block h-3 w-3 rounded-full ring-1 ring-indigo/20" style={{ background: l.hex }} />
                            {l.color} · {l.sizeLabel} {l.dims.includes("×") ? `· ${l.dims}` : ""}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full ring-1 ring-indigo/15">
                              <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease">
                                <Minus size={14} />
                              </button>
                              <motion.span key={l.qty} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-6 text-center text-sm tabular-nums">
                                {l.qty}
                              </motion.span>
                              <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase">
                                <Plus size={14} />
                              </button>
                            </div>
                            <p className="font-medium tabular-nums">{inr(l.price * l.qty)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-dashed border-indigo/20 px-6 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="display-sm tabular-nums">{inr(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">No login needed · Cash on delivery available · Order confirmed on WhatsApp</p>
                <div className="mt-4">
                  <Button href="/checkout" onClick={() => setOpen(false)} size="lg" variant="accent" className="w-full" magnetic={false}>
                    Checkout →
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
