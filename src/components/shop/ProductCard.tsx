"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { inr } from "@/lib/format";
import { QuiltArt } from "@/components/ui/QuiltArt";

export function ProductCard({ product, index = 0, large = false }: { product: Product; index?: number; large?: boolean }) {
  const [color, setColor] = useState(product.colors[0]);
  const from = Math.min(...product.sizes.map((s) => s.price));
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const img = product.images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, rotate: index % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      className="group relative"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="block"
        data-cursor="View"
        aria-label={`${product.name}, from ${inr(from)}`}
      >
        <div
          className={clsx(
            "relative overflow-hidden rounded-[32px] bg-raw transition-[border-radius] duration-700 ease-[var(--ease-silk)] group-hover:rounded-[48px]",
            large ? "aspect-[4/5]" : "aspect-[4/5]",
          )}
        >
          <div className="quilt-grid absolute inset-0 opacity-50" />
          {/* dashed stitch frame that sews in on hover */}
          <span className="pointer-events-none absolute inset-3 rounded-[24px] border-[1.5px] border-dashed border-indigo/0 transition-all duration-700 group-hover:inset-4 group-hover:rounded-[36px] group-hover:border-indigo/25" />
          <div className="absolute inset-0 grid place-items-center p-6 transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-[1.06]">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={product.name} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={color?.hex}
                  initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.04, rotate: 3 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full"
                >
                  <QuiltArt color={color?.hex} kind={product.category === "pillow-covers" ? "pillow" : "quilt"} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <span className="absolute left-5 top-5 rounded-full bg-cotton/85 px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] backdrop-blur">
            {cat?.short}
          </span>
          {product.gsm && (
            <span className="absolute right-5 top-5 rounded-full bg-indigo px-3 py-1.5 text-[0.7rem] font-medium text-cotton">
              {product.gsm} gsm
            </span>
          )}
          {/* quick view bar */}
          <div className="absolute inset-x-4 bottom-4 flex translate-y-[calc(100%+2rem)] items-center justify-between rounded-full bg-indigo px-5 py-3 text-cotton transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-y-0">
            <span className="text-sm">Choose size & colour</span>
            <span className="text-sm">→</span>
          </div>
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          <h3 className="display-sm text-[1.45rem]">
            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-muted">{product.tagline}</p>
        </div>
        <p className="shrink-0 pt-1 text-right">
          <span className="block text-[0.68rem] uppercase tracking-[0.14em] text-muted">from</span>
          <span className="font-serif text-xl tabular-nums">{inr(from)}</span>
        </p>
      </div>
      {product.colors.length > 1 && (
        <div className="mt-3 flex items-center gap-2 px-1" role="radiogroup" aria-label="Preview colour">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={c.name === color?.name}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColor(c)}
              onMouseEnter={() => setColor(c)}
              className={clsx(
                "relative h-6 w-6 rounded-full ring-1 ring-indigo/20 transition-transform duration-300 hover:scale-110",
                c.name === color?.name && "scale-110",
              )}
              style={{ background: c.hex }}
            >
              {c.name === color?.name && (
                <motion.span layoutId={`sw-${product.id}`} className="absolute -inset-[5px] rounded-full border-[1.5px] border-dashed border-madder" />
              )}
            </button>
          ))}
          <span className="ml-1 text-xs text-muted">{color?.name}</span>
        </div>
      )}
    </motion.article>
  );
}
