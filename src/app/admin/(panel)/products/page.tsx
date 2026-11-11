import Link from "next/link";
import { read } from "@/lib/db";
import { inr } from "@/lib/format";
import { CATEGORIES } from "@/lib/types";
import { Empty, PageHead, Pill, PrimaryLink } from "@/components/admin/ui";
import { QuiltArt } from "@/components/ui/QuiltArt";

export const metadata = { title: "Products" };

export default async function ProductsAdmin() {
  const products = await read("products");
  return (
    <>
      <PageHead title="Products" sub={`${products.length} products`} action={<PrimaryLink href="/admin/products/new">+ Add product</PrimaryLink>} />
      {products.length === 0 ? (
        <Empty>No products yet.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/admin/products/${p.id}`} className="group overflow-hidden rounded-3xl bg-cotton ring-1 ring-indigo/8 transition hover:-translate-y-0.5 hover:ring-indigo/25">
              <div className="relative grid aspect-[16/10] place-items-center bg-raw">
                {p.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-2/3">
                    <QuiltArt color={p.colors[0]?.hex} kind={p.category === "pillow-covers" ? "pillow" : "quilt"} float={false} />
                  </div>
                )}
                <span className="absolute right-3 top-3">
                  <Pill tone={p.active ? "live" : "hidden"}>{p.active ? "Live" : "Hidden"}</Pill>
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted">{CATEGORIES.find((c) => c.id === p.category)?.label}</p>
                <p className="mt-1 font-serif text-xl">{p.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {p.sizes.length} sizes · {p.colors.length} colours · from {inr(Math.min(...p.sizes.map((s) => s.price)))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
