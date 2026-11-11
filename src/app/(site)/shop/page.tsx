import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/data";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { SplitWords, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Shop handmade quilts",
  description: "Handmade cotton quilts, polyester quilts and pillow covers in white, beige and navy. Three sizes for every bed.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="bg-cotton pb-20">
      <section className="relative overflow-hidden pt-36 sm:pt-44">
        <div className="quilt-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
          <Reveal>
            <p className="eyebrow text-madder">
              Shop <span className="font-hindi normal-case tracking-normal text-sand-deep">· दुकान</span>
            </p>
          </Reveal>
          <SplitWords as="h1" text="Quilts, made by hand." className="display-xl mt-5 block max-w-[12ch]" italicWords={["hand"]} trigger="mount" />
          <Reveal delay={0.3}>
            <p className="lede mt-6 max-w-lg text-muted">
              Pure cotton or easy-care polyester. Small, medium or large. Each one stitched by a woman artisan in Rajasthan.
            </p>
          </Reveal>
        </div>
      </section>
      <Suspense fallback={<div className="mx-auto mt-10 h-[60vh] max-w-[1440px] px-4 sm:px-8" />}>
        <ShopGrid products={products} />
      </Suspense>
    </div>
  );
}
