import { connection } from "next/server";
import { PageHead } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "New product" };

export default async function NewProduct() {
  await connection();
  return (
    <>
      <PageHead title="New product" />
      <ProductForm />
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
