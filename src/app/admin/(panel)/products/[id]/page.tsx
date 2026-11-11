import { notFound } from "next/navigation";
import { read } from "@/lib/db";
import { PageHead } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Edit product" };

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const product = (await read("products")).find((p) => p.id === id);
  if (!product) notFound();
  return (
    <>
      <PageHead title={product.name} sub={`/shop/${product.slug}`} />
      <ProductForm product={product} />
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
