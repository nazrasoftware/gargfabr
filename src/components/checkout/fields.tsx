"use client";

import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/** Floating-label field with a stitched underline that sews in on focus. */
export function Field({
  label,
  className,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode }) {
  return (
    <label className={clsx("group relative block", className)}>
      <input
        {...props}
        placeholder=" "
        className="peer h-16 w-full rounded-2xl bg-cotton-2 px-4 pb-2 pt-6 text-[1rem] outline-none ring-1 ring-indigo/12 transition focus:ring-2 focus:ring-indigo"
      />
      <span className="pointer-events-none absolute left-4 top-5 origin-left text-muted transition-all duration-300 peer-focus:top-2.5 peer-focus:scale-[0.78] peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:scale-[0.78]">
        {label}
        {props.required && <span className="text-madder"> *</span>}
      </span>
      {hint && <span className="mt-1.5 block px-1 text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({ label, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={clsx("relative block", className)}>
      <textarea
        {...props}
        placeholder=" "
        className="peer min-h-32 w-full resize-y rounded-2xl bg-cotton-2 px-4 pb-3 pt-7 outline-none ring-1 ring-indigo/12 transition focus:ring-2 focus:ring-indigo"
      />
      <span className="pointer-events-none absolute left-4 top-5 origin-left text-muted transition-all duration-300 peer-focus:top-2.5 peer-focus:scale-[0.78] peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:scale-[0.78]">
        {label}
        {props.required && <span className="text-madder"> *</span>}
      </span>
    </label>
  );
}

export function Select({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return (
    <label className={clsx("relative block", className)}>
      <select
        {...props}
        className="h-16 w-full appearance-none rounded-2xl bg-cotton-2 px-4 pb-2 pt-6 outline-none ring-1 ring-indigo/12 transition focus:ring-2 focus:ring-indigo"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute left-4 top-2.5 origin-left scale-[0.78] text-muted">
        {label}
        {props.required && <span className="text-madder"> *</span>}
      </span>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">▾</span>
    </label>
  );
}

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/** Open WhatsApp in a new tab; fall back to same-tab if the popup is blocked. */
export function openWhatsApp(url: string) {
  // Note: passing "noopener" makes window.open return null, so detach manually.
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
  else window.location.href = url;
}
