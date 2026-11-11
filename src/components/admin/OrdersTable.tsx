"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";
import { ChevronDown, Search } from "lucide-react";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { fmtDateTime, inr } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import { setOrderStatus } from "@/app/admin/actions";
import { Empty, Pill } from "./ui";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "all" || o.status === filter) &&
        (!s || o.number.toLowerCase().includes(s) || o.customer.name.toLowerCase().includes(s) || o.customer.phone.includes(s)),
    );
  }, [orders, filter, q]);

  const change = (id: string, status: OrderStatus) =>
    start(async () => {
      await setOrderStatus(id, status);
      router.refresh();
    });

  const exportCsv = () => {
    const rows = [
      ["Order", "Date", "Name", "Phone", "City", "State", "PIN", "Items", "Total", "Payment", "Status"],
      ...list.map((o) => [
        o.number,
        o.createdAt,
        o.customer.name,
        o.customer.phone,
        o.customer.city,
        o.customer.state,
        o.customer.pincode,
        o.items.map((i) => `${i.name} ${i.color} ${i.sizeLabel} x${i.qty}`).join(" | "),
        String(o.total),
        o.payment,
        o.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "garg-orders.csv";
    a.click();
  };

  if (orders.length === 0) return <Empty>No orders yet. Place a test order from the website to see it here.</Empty>;

  return (
    <div className={clsx(pending && "opacity-70 transition-opacity")}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...ORDER_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={clsx("rounded-full px-3.5 py-2 text-sm capitalize transition", filter === s ? "bg-indigo text-cotton" : "bg-cotton ring-1 ring-indigo/10 hover:ring-indigo/30")}
            >
              {s} {s !== "all" && <span className="opacity-60">{orders.filter((o) => o.status === s).length}</span>}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, #" className="h-10 w-56 rounded-full bg-cotton pl-9 pr-4 text-sm outline-none ring-1 ring-indigo/10 focus:ring-indigo" />
          </label>
          <button onClick={exportCsv} className="h-10 rounded-full bg-cotton px-4 text-sm ring-1 ring-indigo/10 hover:ring-indigo/30">
            Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {list.map((o) => {
          const isOpen = open === o.id;
          return (
            <div key={o.id} className="overflow-hidden rounded-2xl bg-cotton ring-1 ring-indigo/8">
              <button onClick={() => setOpen(isOpen ? null : o.id)} className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-5 py-4 text-left sm:grid-cols-[110px_1.4fr_1fr_100px_110px_24px]">
                <span className="font-medium">{o.number}</span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate">{o.customer.name}</span>
                  <span className="block text-xs text-muted">{o.customer.phone}</span>
                </span>
                <span className="hidden text-sm text-muted sm:block">{fmtDateTime(o.createdAt)}</span>
                <span className="hidden tabular-nums sm:block">{inr(o.total)}</span>
                <span>
                  <Pill tone={o.status}>{o.status}</Pill>
                </span>
                <ChevronDown size={16} className={clsx("hidden transition-transform sm:block", isOpen && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="grid gap-6 border-t border-dashed border-indigo/10 px-5 py-5 lg:grid-cols-3">
                      <div>
                        <p className="eyebrow mb-2 text-muted">Items</p>
                        <ul className="space-y-1.5 text-sm">
                          {o.items.map((i, k) => (
                            <li key={k} className="flex justify-between gap-3">
                              <span>
                                {i.name} · {i.color} · {i.sizeLabel} {i.dims.includes("×") ? `(${i.dims})` : ""} × {i.qty}
                              </span>
                              <span className="tabular-nums">{inr(i.price * i.qty)}</span>
                            </li>
                          ))}
                          <li className="flex justify-between border-t border-dashed border-indigo/10 pt-1.5 text-muted">
                            <span>Delivery</span>
                            <span>{o.shipping ? inr(o.shipping) : "Free"}</span>
                          </li>
                          <li className="flex justify-between font-medium">
                            <span>Total · {o.payment === "cod" ? "Cash on delivery" : "UPI"}</span>
                            <span>{inr(o.total)}</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="eyebrow mb-2 text-muted">Deliver to</p>
                        <p className="text-sm leading-relaxed">
                          {o.customer.name}
                          <br />
                          {o.customer.address}
                          <br />
                          {o.customer.city}, {o.customer.state} – {o.customer.pincode}
                          <br />
                          {o.customer.phone} {o.customer.email && `· ${o.customer.email}`}
                        </p>
                        {o.customer.note && <p className="mt-2 rounded-xl bg-raw px-3 py-2 text-sm">“{o.customer.note}”</p>}
                      </div>
                      <div className="space-y-3">
                        <p className="eyebrow text-muted">Status</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ORDER_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => change(o.id, s)}
                              className={clsx("rounded-full px-3 py-1.5 text-xs capitalize ring-1 transition", o.status === s ? "bg-indigo text-cotton ring-indigo" : "ring-indigo/15 hover:ring-indigo/40")}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <a
                          href={waLink(o.customer.phone.replace(/\D/g, "").length === 10 ? `91${o.customer.phone.replace(/\D/g, "")}` : o.customer.phone, `Namaste ${o.customer.name.split(" ")[0]}! Thank you for your order ${o.number} from Garg Fabrication.`)}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex h-10 items-center rounded-full bg-[#1f8f4e] px-4 text-sm text-white"
                        >
                          Message customer on WhatsApp
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {list.length === 0 && <Empty>No orders match.</Empty>}
      </div>
    </div>
  );
}
