import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="display-md text-[2.4rem]">{title}</h1>
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("rounded-3xl bg-cotton p-5 ring-1 ring-indigo/8 sm:p-6", className)}>{children}</div>;
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-11 items-center gap-2 rounded-full bg-indigo px-5 text-sm font-medium text-cotton transition hover:bg-indigo-deep">
      {children}
    </Link>
  );
}

const TONES: Record<string, string> = {
  new: "bg-madder/12 text-madder-deep",
  confirmed: "bg-sky-100 text-sky-800",
  shipped: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-indigo/8 text-muted",
  contacted: "bg-sky-100 text-sky-800",
  closed: "bg-emerald-100 text-emerald-800",
  live: "bg-emerald-100 text-emerald-800",
  hidden: "bg-indigo/8 text-muted",
  draft: "bg-indigo/8 text-muted",
};

export function Pill({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize", TONES[tone] ?? "bg-indigo/8")}>{children}</span>;
}

export const inputCls =
  "h-12 w-full rounded-xl bg-white px-4 text-[0.95rem] outline-none ring-1 ring-indigo/12 transition focus:ring-2 focus:ring-indigo";
export const labelCls = "mb-1.5 block text-sm font-medium";

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border border-dashed border-indigo/20 p-10 text-center text-muted">{children}</div>;
}
