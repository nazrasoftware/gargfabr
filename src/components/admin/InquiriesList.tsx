"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import clsx from "clsx";
import type { Inquiry, InquiryStatus } from "@/lib/types";
import { fmtDateTime } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import { setInquiryStatus } from "@/app/admin/actions";
import { Empty, Pill } from "./ui";

export function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  const [tab, setTab] = useState<"all" | "bulk" | "contact">("all");
  const [pending, start] = useTransition();
  const router = useRouter();
  const list = inquiries.filter((q) => tab === "all" || q.type === tab);

  if (inquiries.length === 0) return <Empty>No enquiries yet.</Empty>;

  return (
    <div className={clsx(pending && "opacity-70")}>
      <div className="mb-4 flex gap-1.5">
        {(["all", "bulk", "contact"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={clsx("rounded-full px-3.5 py-2 text-sm capitalize", tab === t ? "bg-indigo text-cotton" : "bg-cotton ring-1 ring-indigo/10")}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((q) => (
          <article key={q.id} className="rounded-3xl bg-cotton p-5 ring-1 ring-indigo/8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-lg">
                  {q.name}
                  {q.organisation && <span className="text-muted"> · {q.organisation}</span>}
                </p>
                <p className="text-xs text-muted">
                  {fmtDateTime(q.createdAt)} · {q.phone}
                  {q.email && ` · ${q.email}`}
                  {q.city && ` · ${q.city}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Pill tone={q.type === "bulk" ? "shipped" : "confirmed"}>{q.type}</Pill>
                <Pill tone={q.status}>{q.status}</Pill>
              </div>
            </div>
            {(q.products?.length || q.quantity || q.timeline) && (
              <p className="mt-3 text-sm">
                {q.products?.join(", ")}
                {q.quantity && ` · ${q.quantity}`}
                {q.timeline && ` · ${q.timeline}`}
              </p>
            )}
            {q.message && <p className="mt-3 whitespace-pre-line rounded-2xl bg-raw/60 px-4 py-3 text-sm">{q.message}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(["new", "contacted", "closed"] as InquiryStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    start(async () => {
                      await setInquiryStatus(q.id, s);
                      router.refresh();
                    })
                  }
                  className={clsx("rounded-full px-3 py-1.5 text-xs capitalize ring-1", q.status === s ? "bg-indigo text-cotton ring-indigo" : "ring-indigo/15")}
                >
                  {s}
                </button>
              ))}
              <a
                href={waLink(q.phone.replace(/\D/g, "").length === 10 ? `91${q.phone.replace(/\D/g, "")}` : q.phone, `Namaste ${q.name.split(" ")[0]}! This is Garg Fabrication, replying to your enquiry.`)}
                target="_blank"
                rel="noopener"
                className="ml-auto rounded-full bg-[#1f8f4e] px-3.5 py-1.5 text-xs text-white"
              >
                Reply on WhatsApp
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
