"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Check, Minus, Plus, Truck, HandHeart, Banknote } from "lucide-react";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { imageIndexForColor, inr } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import { useCart } from "@/components/cart/store";
import { QuiltArt } from "@/components/ui/QuiltArt";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "./ProductCard";
import { BedFit } from "./BedFit";
import { WhatsAppIcon } from "@/components/site/Footer";

export function ProductView({
  product,
  related,
  whatsapp,
  deliveryText,
}: {
  product: Product;
  related: Product[];
  whatsapp: string;
  deliveryText: string;
}) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[Math.min(1, product.sizes.length - 1)]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [slide, setSlide] = useState(0);
  const [barVisible, setBarVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const isPillow = product.category === "pillow-covers";
  const cat = CATEGORIES.find((c) => c.id === product.category);

  const slides: { key: string; label: string }[] = [
    ...(product.images.length ? product.images.map((_, i) => ({ key: `img${i}`, label: `Photo ${i + 1}` })) : [{ key: "art", label: "Product" }]),
    ...(!isPillow ? [{ key: "bed", label: "On your bed" }] : []),
    { key: "made", label: "Being made" },
  ];

  // keep the active thumbnail in view inside the strip (horizontal only, never moves the page)
  useEffect(() => {
    const row = thumbsRef.current;
    const el = row?.children[slide] as HTMLElement | undefined;
    if (row && el) row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [slide]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    if (ctaRef.current) io.observe(ctaRef.current);
    return () => io.disconnect();
  }, []);

  const onAdd = () => {
    if (!color || !size) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        color: color.name,
        hex: color.hex,
        sizeId: size.id,
        sizeLabel: size.label,
        dims: size.dims,
        price: size.price,
        image: product.images[imageIndexForColor(product.images, color?.name)],
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const waText = `Hello! I'd like to order:\n${product.name}\nColour: ${color?.name}\nSize: ${size?.label} (${size?.dims})\nQuantity: ${qty}\nPrice: ${inr((size?.price ?? 0) * qty)}`;

  return (
    <div className="bg-cotton">
      <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-28 sm:px-8 lg:pt-32">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:text-madder">
            Shop
          </Link>{" "}
          /{" "}
          <Link href={`/shop?c=${product.category}`} className="hover:text-madder">
            {cat?.label}
          </Link>{" "}
          / <span className="text-indigo">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          {/* ───── gallery ───── */}
          <div className="w-full lg:sticky lg:top-24 lg:w-[min(100%,max(24rem,calc(100svh-15rem)))] lg:self-start lg:justify-self-center">
            <div className="relative aspect-square overflow-hidden rounded-[36px] bg-raw" data-cursor={slides.length > 1 ? "Drag" : undefined}>
              <div className="quilt-grid absolute inset-0 opacity-60" />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={slides[slide].key + (slides[slide].key === "art" ? color?.hex : "")}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  drag={slides.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) setSlide((s) => (s + 1) % slides.length);
                    if (info.offset.x > 60) setSlide((s) => (s - 1 + slides.length) % slides.length);
                  }}
                >
                  <Slide k={slides[slide].key} product={product} color={color?.hex ?? "#DCCBAE"} sizeId={size?.id ?? "m"} />
                </motion.div>
              </AnimatePresence>
              <span className="absolute left-5 top-5 rounded-full bg-cotton/85 px-3 py-1.5 text-xs font-medium backdrop-blur">
                {slides[slide].label}
              </span>
            </div>
            {slides.length > 1 && (
              <div ref={thumbsRef} className="-mx-1 mt-4 flex gap-3 overflow-x-auto scroll-smooth px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setSlide(i)}
                    className={clsx(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-raw ring-1 transition sm:h-24 sm:w-24 lg:h-[4.5rem] lg:w-[4.5rem]",
                      i === slide ? "ring-2 ring-madder" : "ring-indigo/10 opacity-70 hover:opacity-100",
                    )}
                    aria-label={`Show ${s.label}`}
                  >
                    <Thumb k={s.key} product={product} color={color?.hex ?? "#DCCBAE"} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ───── info ───── */}
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow text-madder">
              {cat?.label} {product.gsm ? `· ${product.gsm} gsm` : ""}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display-lg mt-4 text-[clamp(2.4rem,4.6vw,4.6rem)]"
            >
              {product.name}
            </motion.h1>
            <p className="lede mt-4 text-muted">{product.tagline}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={(size?.price ?? 0) * qty}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="display-md tabular-nums"
                >
                  {inr((size?.price ?? 0) * qty)}
                </motion.span>
              </AnimatePresence>
              {size?.compareAt && <span className="text-muted line-through">{inr(size.compareAt * qty)}</span>}
              <span className="text-sm text-muted">incl. taxes</span>
            </div>

            <div className="stitch-x mt-8 w-full text-indigo/25" />

            {/* colour */}
            <div className="mt-8">
              <p className="flex justify-between text-sm">
                <span className="font-medium">Colour</span>
                <span className="text-muted">{color?.name}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Colour">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    role="radio"
                    aria-checked={c.name === color?.name}
                    onClick={() => {
                      setColor(c);
                      setSlide(imageIndexForColor(product.images, c.name));
                    }}
                    className="group flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 ring-1 ring-indigo/15 transition hover:ring-indigo/40"
                  >
                    <span className="relative h-8 w-8 rounded-full ring-1 ring-indigo/15" style={{ background: c.hex }}>
                      {c.name === color?.name && (
                        <motion.span layoutId="pv-swatch" className="absolute -inset-1 rounded-full border-[1.5px] border-dashed border-madder" />
                      )}
                    </span>
                    <span className="text-sm">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* size */}
            <div className="mt-8">
              <p className="flex justify-between text-sm">
                <span className="font-medium">Size</span>
                {!isPillow && (
                  <button className="text-muted underline decoration-dashed underline-offset-4 hover:text-madder" onClick={() => setSlide(slides.findIndex((s) => s.key === "bed"))}>
                    See it on your bed
                  </button>
                )}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3" role="radiogroup" aria-label="Size">
                {product.sizes.map((s) => {
                  const on = s.id === size?.id;
                  return (
                    <button
                      key={s.id}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setSize(s)}
                      className={clsx(
                        "relative overflow-hidden rounded-2xl p-3 text-left ring-1 transition sm:p-4",
                        on ? "text-cotton ring-indigo" : "ring-indigo/15 hover:ring-indigo/40",
                      )}
                    >
                      {on && <motion.span layoutId="pv-size" className="absolute inset-0 bg-indigo" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                      <span className="relative block font-serif text-lg">{s.label}</span>
                      <span className={clsx("relative mt-0.5 block text-xs", on ? "text-cotton/75" : "text-muted")}>{s.dims}</span>
                      {s.bed && <span className={clsx("relative block text-xs", on ? "text-cotton/75" : "text-muted")}>{s.bed}</span>}
                      <span className="relative mt-2 block text-sm tabular-nums">{inr(s.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* qty + CTA */}
            <div ref={ctaRef} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center justify-between rounded-full px-2 ring-1 ring-indigo/15 sm:w-36">
                <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-raw" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <AnimatePresence mode="popLayout">
                  <motion.span key={qty} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} className="tabular-nums">
                    {qty}
                  </motion.span>
                </AnimatePresence>
                <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-raw" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1">
                <Button onClick={onAdd} variant="accent" size="lg" className="w-full" magnetic={false}>
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                        <Check size={18} /> Added to cart
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        Add to cart · {inr((size?.price ?? 0) * qty)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </div>
            <a
              href={waLink(whatsapp, waText)}
              target="_blank"
              rel="noopener"
              className="mt-3 flex h-14 items-center justify-center gap-2 rounded-full bg-[#1f8f4e] font-medium text-white transition hover:bg-[#187a42]"
            >
              <WhatsAppIcon /> Order directly on WhatsApp
            </a>

            <ul className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-muted">
              {[
                [HandHeart, "Handmade by women artisans"],
                [Banknote, "Cash on delivery"],
                [Truck, "6–8 day delivery"],
              ].map(([Icon, t]) => {
                const I = Icon as typeof Truck;
                return (
                  <li key={t as string} className="flex flex-col items-center gap-2 rounded-2xl bg-cotton-2 p-3 ring-1 ring-indigo/8">
                    <I size={20} className="text-madder" strokeWidth={1.5} />
                    {t as string}
                  </li>
                );
              })}
            </ul>

            <Accordion
              className="mt-10"
              defaultOpen={0}
              items={[
                {
                  q: "Details",
                  a: (
                    <>
                      <p>{product.description}</p>
                      <p className="mt-3">
                        <b className="text-indigo">Material:</b> {product.material}
                        {product.gsm ? (
                          <>
                            {" "}
                            · <b className="text-indigo">Weight:</b> {product.gsm} gsm
                          </>
                        ) : null}
                      </p>
                    </>
                  ),
                },
                ...(!isPillow
                  ? [
                      {
                        q: "Inside the quilt",
                        a: "A soft cover, a filling layer and a breathable backing, hand-quilted together with running stitches so the filling stays even.",
                      },
                    ]
                  : []),
                { q: "Care", a: product.care },
                {
                  q: "Delivery & handmade note",
                  a: `${deliveryText}. Because every piece is handmade, small variations in stitching and finish are natural and make each one unique.`,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* made-by band */}
      <section className="relative mx-4 overflow-hidden rounded-[36px] bg-indigo-deep text-cotton sm:mx-8">
        <div className="absolute inset-0 opacity-60">
          <VideoLoop name="hands" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-deep via-indigo-deep/70 to-transparent" />
        <div className="relative max-w-xl px-6 py-20 sm:px-12 sm:py-28">
          <p className="font-hindi text-xl text-sand">हाथ से बना</p>
          <p className="display-md mt-3">Made by hands like these.</p>
          <p className="mt-4 text-cotton/75">Every piece is stitched by one of more than 500 women artisans in Rajasthan.</p>
          <div className="mt-8">
            <Button href="/story" variant="light">
              Meet the makers →
            </Button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8 lg:py-32">
          <Reveal>
            <h2 className="display-md">You may also like</h2>
          </Reveal>
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* sticky mobile buy bar */}
      <AnimatePresence>
        {barVisible && (
          <motion.div
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "120%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-full bg-indigo p-2 pl-5 text-cotton shadow-2xl lg:hidden"
          >
            <span className="min-w-0 flex-1 truncate text-sm">
              {size?.label} · {color?.name}
            </span>
            <span className="font-serif tabular-nums">{inr((size?.price ?? 0) * qty)}</span>
            <button onClick={onAdd} className="h-11 rounded-full bg-madder px-5 text-sm font-medium">
              {added ? "Added ✓" : "Add"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slide({ k, product, color, sizeId }: { k: string; product: Product; color: string; sizeId: string }) {
  if (k.startsWith("img")) {
    const src = product.images[Number(k.slice(3))];
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={product.name} className="h-full w-full object-cover" draggable={false} />;
  }
  if (k === "bed") return <BedFit sizeId={sizeId} color={color} sizes={product.sizes} />;
  if (k === "made") return <VideoLoop name="needle" />;
  return (
    <div className="grid h-full w-full place-items-center p-10">
      <QuiltArt color={color} kind={product.category === "pillow-covers" ? "pillow" : "quilt"} />
    </div>
  );
}

function Thumb({ k, product, color }: { k: string; product: Product; color: string }) {
  if (k.startsWith("img")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.images[Number(k.slice(3))]} alt="" className="h-full w-full object-cover" />;
  }
  if (k === "made") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/media/needle.jpg" alt="" className="h-full w-full object-cover" />;
  }
  if (k === "bed")
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full p-3" aria-hidden>
        <rect x="22" y="12" width="56" height="76" rx="6" fill="#FBF9F4" stroke="#1F2A44" strokeOpacity="0.3" />
        <rect x="14" y="30" width="72" height="62" rx="5" fill={color} stroke="#1F2A44" strokeOpacity="0.3" />
      </svg>
    );
  return <QuiltArt color={color} kind={product.category === "pillow-covers" ? "pillow" : "quilt"} tag={false} float={false} />;
}
