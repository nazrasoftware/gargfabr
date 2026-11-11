import type { Inquiry, Order } from "./types";
import { inr } from "./format";

export const waLink = (number: string, text: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export function orderMessage(o: Order) {
  const lines = [
    `*New order · ${o.number}*`,
    "",
    ...o.items.map(
      (i) => `• ${i.name} (${i.color}, ${i.sizeLabel} ${i.dims}) × ${i.qty} = ${inr(i.price * i.qty)}`,
    ),
    "",
    `Subtotal: ${inr(o.subtotal)}`,
    `Delivery: ${o.shipping ? inr(o.shipping) : "Free"}`,
    `*Total: ${inr(o.total)}*`,
    `Payment: ${o.payment === "cod" ? "Cash on delivery" : "UPI (please share payment link)"}`,
    "",
    `*Deliver to*`,
    o.customer.name,
    o.customer.phone,
    `${o.customer.address}, ${o.customer.city}, ${o.customer.state} – ${o.customer.pincode}`,
    o.customer.note ? `Note: ${o.customer.note}` : "",
  ];
  return lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n").trim();
}

export function inquiryMessage(q: Inquiry) {
  if (q.type === "bulk") {
    return [
      `*Bulk order enquiry*`,
      "",
      `Name: ${q.name}`,
      q.organisation ? `Organisation: ${q.organisation}` : "",
      `Phone: ${q.phone}`,
      q.email ? `Email: ${q.email}` : "",
      q.city ? `City: ${q.city}` : "",
      q.products?.length ? `Products: ${q.products.join(", ")}` : "",
      q.quantity ? `Quantity: ${q.quantity}` : "",
      q.timeline ? `Needed by: ${q.timeline}` : "",
      "",
      q.message,
    ]
      .filter(Boolean)
      .join("\n");
  }
  return [`*Website enquiry*`, "", `Name: ${q.name}`, `Phone: ${q.phone}`, q.email ? `Email: ${q.email}` : "", "", q.message]
    .filter(Boolean)
    .join("\n");
}
