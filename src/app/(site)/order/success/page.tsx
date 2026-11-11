import type { Metadata } from "next";
import { OrderSuccess } from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default function Page() {
  return <OrderSuccess />;
}
