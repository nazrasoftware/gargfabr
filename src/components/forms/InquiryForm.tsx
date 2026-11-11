"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useTransition } from "react";
import clsx from "clsx";
import { submitInquiry } from "@/app/actions";
import { Field, Select, TextArea, openWhatsApp } from "@/components/checkout/fields";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/site/Footer";

const PRODUCTS = ["Cotton Quilts", "Polyester Quilts", "Pillow Covers", "Custom / other"];

export function InquiryForm({ type }: { type: "bulk" | "contact" }) {
  const [picked, setPicked] = useState<string[]>(type === "bulk" ? ["Cotton Quilts"] : []);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = (fd: FormData) => {
    setError("");
    start(async () => {
      const res = await submitInquiry({
        type,
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        organisation: String(fd.get("organisation") ?? ""),
        city: String(fd.get("city") ?? ""),
        products: picked,
        quantity: String(fd.get("quantity") ?? ""),
        timeline: String(fd.get("timeline") ?? ""),
        message: String(fd.get("message") ?? ""),
      });
      if (!res.ok) return setError(res.error);
      setDone(res.waUrl);
      openWhatsApp(res.waUrl);
    });
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[32px] bg-indigo p-8 text-center text-cotton sm:p-12"
          >
            <svg viewBox="0 0 120 120" className="mx-auto h-20 w-20" aria-hidden>
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke="#C9B28F" strokeWidth="2" strokeDasharray="6 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
              <motion.path d="M38 62 L54 77 L84 45" fill="none" stroke="#B5523B" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.5 }} />
            </svg>
            <p className="display-sm mt-6">Thank you, we&apos;ve got your message.</p>
            <p className="mt-3 text-cotton/70">If WhatsApp didn&apos;t open, tap below to send it to us directly.</p>
            <a href={done} target="_blank" rel="noopener" className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-[#1f8f4e] px-7 font-medium text-white">
              <WhatsAppIcon /> Open WhatsApp
            </a>
          </motion.div>
        ) : (
          <motion.form key="form" action={submit} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Your name" required autoComplete="name" />
              {type === "bulk" ? <Field name="organisation" label="Business / organisation" autoComplete="organization" /> : <Field name="email" label="Email (optional)" type="email" />}
              <Field name="phone" label="WhatsApp number" required type="tel" inputMode="tel" autoComplete="tel" />
              {type === "bulk" ? <Field name="city" label="City" autoComplete="address-level2" /> : null}
              {type === "bulk" && <Field name="email" label="Email (optional)" type="email" className="sm:col-span-2" />}
            </div>

            {type === "bulk" && (
              <>
                <fieldset>
                  <legend className="mb-3 mt-4 text-sm font-medium">What are you looking for?</legend>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCTS.map((p) => {
                      const on = picked.includes(p);
                      return (
                        <motion.button
                          type="button"
                          key={p}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setPicked((x) => (on ? x.filter((y) => y !== p) : [...x, p]))}
                          className={clsx(
                            "rounded-full px-4 py-2.5 text-sm ring-1 transition",
                            on ? "bg-indigo text-cotton ring-indigo" : "ring-indigo/15 hover:ring-indigo/40",
                          )}
                          aria-pressed={on}
                        >
                          {on ? "✓ " : "+ "}
                          {p}
                        </motion.button>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select name="quantity" label="Approx. quantity" defaultValue="50–100 pieces">
                    {["20–50 pieces", "50–100 pieces", "100–500 pieces", "500+ pieces"].map((q) => (
                      <option key={q}>{q}</option>
                    ))}
                  </Select>
                  <Select name="timeline" label="Needed by" defaultValue="Within 1 month">
                    {["Within 2 weeks", "Within 1 month", "In 2–3 months", "Flexible"].map((q) => (
                      <option key={q}>{q}</option>
                    ))}
                  </Select>
                </div>
              </>
            )}

            <TextArea
              name="message"
              label={type === "bulk" ? "Tell us about your requirement (sizes, colours, branding…)" : "Your message"}
              required={type === "contact"}
            />

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="rounded-2xl bg-madder/10 px-4 py-3 text-sm text-madder-deep" role="alert">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button type="submit" variant="accent" size="lg" className="w-full" magnetic={false} disabled={pending}>
              <span className="flex items-center gap-2">
                <WhatsAppIcon className="h-5 w-5" />
                {pending ? "Sending…" : type === "bulk" ? "Send enquiry on WhatsApp" : "Send on WhatsApp"}
              </span>
            </Button>
            <p className="text-center text-xs text-muted">Your details are saved so we can follow up, then WhatsApp opens with your message ready to send.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
