import Link from "next/link";
import { read } from "@/lib/db";
import { fmtDateTime, inr } from "@/lib/format";
import { Card, PageHead, Pill } from "@/components/admin/ui";

export default async function Dashboard() {
  const [orders, inquiries, products, posts] = await Promise.all([read("orders"), read("inquiries"), read("products"), read("posts")]);
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const stats = [
    { k: "New orders", v: orders.filter((o) => o.status === "new").length, href: "/admin/orders" },
    { k: "Total orders", v: orders.length, href: "/admin/orders" },
    { k: "Order value", v: inr(revenue), href: "/admin/orders" },
    { k: "New enquiries", v: inquiries.filter((q) => q.status === "new").length, href: "/admin/inquiries" },
  ];

  return (
    <>
      <PageHead title="Namaste 🙏" sub="Here's what's happening at Garg Fabrication." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.k} href={s.href} className="group rounded-3xl bg-cotton p-5 ring-1 ring-indigo/8 transition hover:-translate-y-0.5 hover:ring-indigo/25">
            <p className="text-sm text-muted">{s.k}</p>
            <p className="mt-2 font-serif text-3xl tabular-nums">{s.v}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-madder">
              View all →
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-muted">No orders yet. They&apos;ll appear here the moment someone checks out.</p>
          ) : (
            <ul className="divide-y divide-dashed divide-indigo/10">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {o.number} · {o.customer.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {fmtDateTime(o.createdAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} items · {o.customer.city}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="tabular-nums">{inr(o.total)}</span>
                    <Pill tone={o.status}>{o.status}</Pill>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-4 font-serif text-xl">At a glance</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">Products live</span>
              <span>
                {products.filter((p) => p.active).length} / {products.length}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Journal stories published</span>
              <span>{posts.filter((p) => p.published).length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Bulk enquiries</span>
              <span>{inquiries.filter((q) => q.type === "bulk").length}</span>
            </li>
          </ul>
          <div className="mt-6 grid gap-2">
            <Link href="/admin/products/new" className="rounded-2xl bg-indigo px-4 py-3 text-center text-sm text-cotton">
              + Add a product
            </Link>
            <Link href="/admin/journal/new" className="rounded-2xl bg-white px-4 py-3 text-center text-sm ring-1 ring-indigo/10">
              + Write a story
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
