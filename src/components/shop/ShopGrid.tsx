"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { CATEGORIES, type Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ShopGrid({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const active = params.get("c") ?? "all";
  const tabs = [{ id: "all", label: "All" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))];
  const list = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-8">
      <div className="sticky top-[76px] z-20 -mx-4 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0" data-lenis-prevent>
        <div className="inline-flex rounded-full bg-cotton/85 p-1.5 ring-1 ring-indigo/10 backdrop-blur-xl" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => router.replace(t.id === "all" ? "/shop" : `/shop?c=${t.id}`, { scroll: false })}
              className={clsx(
                "relative whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors sm:px-5",
                active === t.id ? "text-cotton" : "text-indigo hover:text-madder",
              )}
            >
              {active === t.id && (
                <motion.span layoutId="shop-tab" className="absolute inset-0 rounded-full bg-indigo" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-10 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="mt-16 text-center text-muted">No products here yet.</p>}
    </div>
  );
}
