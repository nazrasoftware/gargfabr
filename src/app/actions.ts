"use server";

import { read, update } from "@/lib/db";
import type { Inquiry, InquiryType, Order, OrderItem, PaymentMethod } from "@/lib/types";
import { inquiryMessage, orderMessage, waLink } from "@/lib/whatsapp";

type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

const clean = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);
const phoneOk = (p: string) => p.replace(/\D/g, "").length >= 10;

export type PlaceOrderInput = {
  items: { productId: string; color: string; sizeId: string; qty: number }[];
  customer: Order["customer"];
  payment: PaymentMethod;
};

export async function placeOrder(input: PlaceOrderInput): Promise<Result<{ order: Order; waUrl: string }>> {
  const c = input.customer ?? ({} as Order["customer"]);
  const customer = {
    name: clean(c.name, 80),
    phone: clean(c.phone, 20),
    email: clean(c.email, 120) || undefined,
    address: clean(c.address, 300),
    city: clean(c.city, 60),
    state: clean(c.state, 60),
    pincode: clean(c.pincode, 10),
    note: clean(c.note, 400) || undefined,
  };
  if (!customer.name || !customer.address || !customer.city || !customer.state)
    return { ok: false, error: "Please fill in your name and full address." };
  if (!phoneOk(customer.phone)) return { ok: false, error: "Please enter a valid 10-digit phone number." };
  if (!/^\d{6}$/.test(customer.pincode)) return { ok: false, error: "Please enter a valid 6-digit PIN code." };
  if (!Array.isArray(input.items) || input.items.length === 0) return { ok: false, error: "Your cart is empty." };

  // Never trust client prices: rebuild every line from the catalogue.
  const [products, settings] = await Promise.all([read("products"), read("settings")]);
  const items: OrderItem[] = [];
  for (const line of input.items.slice(0, 50)) {
    const p = products.find((x) => x.id === line.productId && x.active);
    const size = p?.sizes.find((s) => s.id === line.sizeId);
    const color = p?.colors.find((col) => col.name === line.color);
    const qty = Math.max(1, Math.min(99, Math.floor(Number(line.qty) || 1)));
    if (!p || !size || !color) return { ok: false, error: "An item in your cart is no longer available." };
    items.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      color: color.name,
      sizeId: size.id,
      sizeLabel: size.label,
      dims: size.dims,
      price: size.price,
      qty,
    });
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee;
  const payment: PaymentMethod = input.payment === "upi" ? "upi" : "cod";

  const order = await update("orders", (orders) => {
    const number = `GF-${1001 + orders.length}`;
    const o: Order = {
      id: crypto.randomUUID(),
      number,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      payment,
      status: "new",
    };
    return { next: [o, ...orders], result: o };
  });

  return { ok: true, order, waUrl: waLink(settings.whatsapp, orderMessage(order)) };
}

export type InquiryInput = {
  type: InquiryType;
  name: string;
  phone: string;
  email?: string;
  organisation?: string;
  city?: string;
  products?: string[];
  quantity?: string;
  timeline?: string;
  message: string;
};

export async function submitInquiry(input: InquiryInput): Promise<Result<{ waUrl: string }>> {
  const q: Inquiry = {
    id: crypto.randomUUID(),
    type: input.type === "bulk" ? "bulk" : "contact",
    createdAt: new Date().toISOString(),
    name: clean(input.name, 80),
    phone: clean(input.phone, 20),
    email: clean(input.email, 120) || undefined,
    organisation: clean(input.organisation, 120) || undefined,
    city: clean(input.city, 60) || undefined,
    products: Array.isArray(input.products) ? input.products.map((p) => clean(p, 60)).slice(0, 10) : undefined,
    quantity: clean(input.quantity, 60) || undefined,
    timeline: clean(input.timeline, 60) || undefined,
    message: clean(input.message, 2000),
    status: "new",
  };
  if (!q.name) return { ok: false, error: "Please tell us your name." };
  if (!phoneOk(q.phone)) return { ok: false, error: "Please enter a valid 10-digit phone number." };
  if (q.type === "contact" && !q.message) return { ok: false, error: "Please write a short message." };

  await update("inquiries", (all) => ({ next: [q, ...all], result: null }));
  const settings = await read("settings");
  return { ok: true, waUrl: waLink(settings.whatsapp, inquiryMessage(q)) };
}
