import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal, SplitWords } from "@/components/motion/Reveal";

export function Collections({ products }: { products: Product[] }) {
  return (
    <section className="relative bg-cotton py-16 lg:py-40" aria-label="Collections">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow text-madder">
                The collection <span className="font-hindi normal-case tracking-normal text-sand-deep">· संग्रह</span>
              </p>
            </Reveal>
            <SplitWords as="h2" text="Choose your quilt." className="display-lg mt-5 block" italicWords={["quilt"]} />
          </div>
          <Reveal delay={0.15} className="flex flex-col items-start gap-4 lg:items-end lg:pb-3">
            <p className="max-w-sm text-muted lg:text-right">
              Three sizes for every bed. White, beige and navy: colours that sit quietly in any room.
            </p>
            <Link href="/shop" className="group inline-flex items-center gap-2 font-medium">
              View all products
              <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo text-cotton transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <div key={p.id} className={i === 1 ? "lg:translate-y-16" : undefined}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
