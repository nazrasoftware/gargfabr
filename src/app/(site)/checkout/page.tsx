import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const s = await getSettings();
  return <CheckoutForm shippingFee={s.shippingFee} freeShippingAbove={s.freeShippingAbove} />;
}
