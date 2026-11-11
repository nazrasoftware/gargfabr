"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Settings } from "@/lib/types";
import { saveSettings } from "@/app/admin/actions";
import { Card, inputCls, labelCls } from "./ui";

export function SettingsForm({ settings: s }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const f = (name: keyof Settings, label: string, hint?: string, type = "text") => (
    <div>
      <label className={labelCls}>{label}</label>
      <input name={name} type={type} defaultValue={String(s[name] ?? "")} className={inputCls} />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
  return (
    <form action={action} className="max-w-3xl space-y-6">
      <Card className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-serif text-xl sm:col-span-2">Orders & WhatsApp</h2>
        {f("whatsapp", "WhatsApp number *", "Digits with country code, e.g. 919876543210. Orders and enquiries are sent here.")}
        {f("phone", "Display phone")}
        {f("shippingFee", "Delivery fee (₹)", undefined, "number")}
        {f("freeShippingAbove", "Free delivery above (₹)", undefined, "number")}
      </Card>
      <Card className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-serif text-xl sm:col-span-2">Business details</h2>
        {f("email", "Email")}
        {f("address", "Address")}
        <div className="sm:col-span-2">{f("deliveryText", "Delivery line", "Shown in the footer, product pages and policies.")}</div>
        <div className="sm:col-span-2">{f("announcement", "Announcement bar", "The thin strip at the very top of the website.")}</div>
        {f("instagram", "Instagram URL")}
        {f("facebook", "Facebook URL")}
      </Card>
      <div className="flex items-center gap-4">
        <button disabled={pending} className="h-12 rounded-full bg-indigo px-8 font-medium text-cotton hover:bg-indigo-deep disabled:opacity-60">
          {pending ? "Saving…" : "Save settings"}
        </button>
        <AnimatePresence>
          {state?.saved && !pending && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm text-emerald-700">
              ✓ Saved. The website is updated.
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
