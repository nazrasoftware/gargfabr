import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { ProductView } from "@/components/shop/ProductView";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return { title: p.name, description: `${p.tagline} ${p.description.slice(0, 120)}` };
}

export default function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-cotton" />}>
      <Product params={params} />
    </Suspense>
  );
}

async function Product({ params }: { params: PageProps<"/shop/[slug]">["params"] }) {
  const { slug } = await params;
  const [product, all, settings] = await Promise.all([getProductBySlug(slug), getProducts(), getSettings()]);
  if (!product) notFound();
  const related = all.filter((p) => p.id !== product.id).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "Garg Fabrication" },
    material: product.material,
    offers: product.sizes.map((s) => ({
      "@type": "Offer",
      name: `${s.label} ${s.dims}`,
      price: s.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductView product={product} related={related} whatsapp={settings.whatsapp} deliveryText={settings.deliveryText} />
    </>
  );
}
