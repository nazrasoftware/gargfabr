"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useTransition } from "react";
import clsx from "clsx";
import { Banknote, Smartphone, Lock } from "lucide-react";
import { placeOrder } from "@/app/actions";
import { cartSubtotal, useCart } from "@/components/cart/store";
import { inr } from "@/lib/format";
import { QuiltArt } from "@/components/ui/QuiltArt";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/site/Footer";
import { Field, INDIAN_STATES, Select, TextArea, openWhatsApp } from "./fields";

export function CheckoutForm({ shippingFee, freeShippingAbove }: { shippingFee: number; freeShippingAbove: number }) {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [payment, setPayment] = useState<"cod" | "upi">("cod");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const subtotal = cartSubtotal(lines);
  const shipping = subtotal >= freeShippingAbove || subtotal === 0 ? 0 : shippingFee;
  const total = subtotal + shipping;

  const submit = (fd: FormData) => {
    setError("");
    start(async () => {
      const res = await placeOrder({
        items: lines.map((l) => ({ productId: l.productId, color: l.color, sizeId: l.sizeId, qty: l.qty })),
        customer: {
          name: String(fd.get("name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          email: String(fd.get("email") ?? ""),
          address: String(fd.get("address") ?? ""),
          city: String(fd.get("city") ?? ""),
          state: String(fd.get("state") ?? ""),
          pincode: String(fd.get("pincode") ?? ""),
          note: String(fd.get("note") ?? ""),
        },
        payment,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      try {
        sessionStorage.setItem(
          "gf-last-order",
          JSON.stringify({ number: res.order.number, total: res.order.total, name: res.order.customer.name, waUrl: res.waUrl, items: res.order.items.length }),
        );
      } catch {}
      clear();
      openWhatsApp(res.waUrl);
      router.push("/order/success");
    });
  };

  if (mounted && lines.length === 0 && !pending) {
    return (
      <div className="grid min-h-[80svh] place-items-center bg-cotton px-4 pt-24 text-center">
        <div>
          <div className="mx-auto h-44 w-56">
            <QuiltArt color="#DCCBAE" />
          </div>
          <h1 className="display-md mt-6">Your cart is empty.</h1>
          <p className="mt-3 text-muted">Pick a quilt you love and come back here to check out.</p>
          <div className="mt-8">
            <Button href="/shop" variant="accent">
              Browse quilts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cotton">
      <div className="mx-auto max-w-[1280px] px-4 pb-28 pt-28 sm:px-8 lg:pt-36">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="display-lg">
          Checkout
        </motion.h1>
        <p className="mt-3 flex items-center gap-2 text-muted">
          <Lock size={15} /> No account needed. We&apos;ll confirm your order on WhatsApp.
        </p>

        <form action={submit} className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="space-y-12">
            <Step n="01" title="Your details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Full name" required autoComplete="name" className="sm:col-span-2" />
                <Field name="phone" label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" hint="We'll send order updates on WhatsApp" />
                <Field name="email" label="Email (optional)" type="email" autoComplete="email" />
              </div>
            </Step>

            <Step n="02" title="Delivery address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="address" label="House no., street, area" required autoComplete="street-address" className="sm:col-span-2" />
                <Field name="city" label="City" required autoComplete="address-level2" />
                <Field name="pincode" label="PIN code" required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="postal-code" />
                <Select name="state" label="State" required defaultValue="" className="sm:col-span-2">
                  <option value="" disabled>
                    Select state
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
                <TextArea name="note" label="Note for us (optional)" className="sm:col-span-2" />
              </div>
            </Step>

            <Step n="03" title="Payment">
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                {[
                  { id: "cod" as const, Icon: Banknote, t: "Cash on delivery", d: "Pay when your quilt arrives." },
                  { id: "upi" as const, Icon: Smartphone, t: "UPI", d: "We'll send a payment link on WhatsApp." },
                ].map(({ id, Icon, t, d }) => (
                  <button
                    type="button"
                    key={id}
                    role="radio"
                    aria-checked={payment === id}
                    onClick={() => setPayment(id)}
                    className={clsx(
                      "relative flex gap-4 overflow-hidden rounded-3xl p-5 text-left ring-1 transition",
                      payment === id ? "ring-2 ring-indigo" : "ring-indigo/15 hover:ring-indigo/40",
                    )}
                  >
                    <span className={clsx("grid h-11 w-11 shrink-0 place-items-center rounded-full transition", payment === id ? "bg-indigo text-cotton" : "bg-raw")}>
                      <Icon size={20} strokeWidth={1.6} />
                    </span>
                    <span>
                      <span className="block font-serif text-lg">{t}</span>
                      <span className="block text-sm text-muted">{d}</span>
                    </span>
                    {payment === id && (
                      <motion.span layoutId="pay-dot" className="absolute right-4 top-4 h-3 w-3 rounded-full bg-madder" />
                    )}
                  </button>
                ))}
              </div>
            </Step>
          </div>

          {/* summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[32px] bg-raw p-6 sm:p-8">
              <h2 className="display-sm">Order summary</h2>
              <ul className="mt-6 space-y-4">
                {lines.map((l) => (
                  <li key={l.key} className="flex items-center gap-4">
                    <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-cotton">
                      <QuiltArt color={l.hex} kind={l.category === "pillow-covers" ? "pillow" : "quilt"} tag={false} float={false} />
                      <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-indigo px-1 text-xs text-cotton">{l.qty}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{l.name}</span>
                      <span className="block text-xs text-muted">
                        {l.color} · {l.sizeLabel}
                        {l.dims.includes("×") ? ` · ${l.dims}` : ""}
                      </span>
                    </span>
                    <span className="tabular-nums">{inr(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="stitch-x my-6 w-full text-indigo/25" />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="tabular-nums">{inr(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="tabular-nums">{shipping ? inr(shipping) : "Free"}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-medium">Total</span>
                <span className="display-md tabular-nums">{inr(total)}</span>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto", x: [0, -8, 8, -4, 0] }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-2xl bg-madder/10 px-4 py-3 text-sm text-madder-deep"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-6">
                <Button type="submit" variant="accent" size="lg" className="w-full" magnetic={false} disabled={pending || !mounted}>
                  <span className="flex items-center gap-2">
                    {pending ? (
                      <>
                        <motion.span className="h-4 w-4 rounded-full border-2 border-cotton border-t-transparent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                        Placing order…
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon className="h-5 w-5" /> Place order · {inr(total)}
                      </>
                    )}
                  </span>
                </Button>
              </div>
              <p className="mt-3 text-center text-xs text-muted">
                Your order is saved and sent to us on WhatsApp. By ordering you agree to our{" "}
                <Link href="/policies" className="underline">
                  policies
                </Link>
                .
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-serif text-madder">{n}</span>
        <h2 className="display-sm">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
