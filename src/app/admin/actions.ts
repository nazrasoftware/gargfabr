"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { adminPassword, requireAdmin } from "@/lib/auth";
import { UPLOAD_DIR, update } from "@/lib/db";
import { slugify } from "@/lib/format";
import { SESSION_COOKIE, SESSION_TTL_S, createToken } from "@/lib/session";
import {
  CATEGORIES,
  ORDER_STATUSES,
  type Category,
  type ColorOption,
  type InquiryStatus,
  type OrderStatus,
  type Post,
  type Product,
  type Settings,
  type SizeOption,
} from "@/lib/types";

const str = (fd: FormData, k: string, max = 5000) => String(fd.get(k) ?? "").trim().slice(0, max);

/* ───────────── auth ───────────── */

export async function login(_: { error?: string } | undefined, fd: FormData) {
  const pw = str(fd, "password", 200);
  if (pw !== adminPassword()) return { error: "That password isn't right." };
  (await cookies()).set(SESSION_COOKIE, await createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_S,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ───────────── uploads ───────────── */

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

async function saveUploads(files: File[]) {
  const urls: string[] = [];
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  for (const f of files) {
    if (!f || typeof f === "string" || f.size === 0) continue;
    const ext = IMAGE_TYPES[f.type];
    if (!ext) continue;
    if (f.size > 8 * 1024 * 1024) continue;
    const name = `${crypto.randomUUID()}.${ext}`;
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await f.arrayBuffer()));
    urls.push(`/uploads/${name}`);
  }
  return urls;
}

/* ───────────── products ───────────── */

export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 80);
  const name = str(fd, "name", 120);
  if (!name) return;
  const category = (CATEGORIES.some((c) => c.id === str(fd, "category")) ? str(fd, "category") : "cotton-quilts") as Category;

  const colors: ColorOption[] = [];
  fd.getAll("colorName").forEach((n, i) => {
    const hex = String(fd.getAll("colorHex")[i] ?? "").trim();
    const nm = String(n).trim();
    if (nm && /^#[0-9a-f]{6}$/i.test(hex)) colors.push({ name: nm.slice(0, 40), hex });
  });

  const sizes: SizeOption[] = [];
  const labels = fd.getAll("sizeLabel");
  labels.forEach((l, i) => {
    const label = String(l).trim();
    const price = Number(fd.getAll("sizePrice")[i]);
    if (!label || !Number.isFinite(price) || price <= 0) return;
    const compare = Number(fd.getAll("sizeCompare")[i]);
    sizes.push({
      id: slugify(label) || `size-${i}`,
      label: label.slice(0, 40),
      dims: String(fd.getAll("sizeDims")[i] ?? "").trim().slice(0, 40),
      bed: String(fd.getAll("sizeBed")[i] ?? "").trim().slice(0, 40) || undefined,
      price: Math.round(price),
      compareAt: Number.isFinite(compare) && compare > price ? Math.round(compare) : undefined,
    });
  });

  const keepImages = fd.getAll("keepImage").map(String).filter((u) => u.startsWith("/"));
  const uploaded = await saveUploads(fd.getAll("images") as File[]);
  const gsm = Number(str(fd, "gsm"));
  const now = new Date().toISOString();

  await update("products", (all) => {
    const existing = all.find((p) => p.id === id);
    let slug = slugify(str(fd, "slug") || name) || `product-${Date.now()}`;
    if (all.some((p) => p.slug === slug && p.id !== id)) slug = `${slug}-${all.length + 1}`;
    const product: Product = {
      id: existing?.id ?? `p_${crypto.randomUUID().slice(0, 8)}`,
      slug,
      name,
      category,
      tagline: str(fd, "tagline", 200),
      description: str(fd, "description", 4000),
      material: str(fd, "material", 200),
      gsm: Number.isFinite(gsm) && gsm > 0 ? gsm : undefined,
      colors,
      sizes,
      images: [...keepImages, ...uploaded],
      care: str(fd, "care", 1000),
      featured: fd.get("featured") === "on",
      active: fd.get("active") === "on",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const next = existing ? all.map((p) => (p.id === id ? product : p)) : [product, ...all];
    return { next, result: null };
  });
  updateTag("products");
  redirect("/admin/products");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 80);
  await update("products", (all) => ({ next: all.filter((p) => p.id !== id), result: null }));
  updateTag("products");
  redirect("/admin/products");
}

/* ───────────── orders & inquiries ───────────── */

export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status)) return;
  await update("orders", (all) => ({ next: all.map((o) => (o.id === id ? { ...o, status } : o)), result: null }));
}

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  if (!["new", "contacted", "closed"].includes(status)) return;
  await update("inquiries", (all) => ({ next: all.map((q) => (q.id === id ? { ...q, status } : q)), result: null }));
}

/* ───────────── journal ───────────── */

export async function savePost(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 80);
  const title = str(fd, "title", 200);
  if (!title) return;
  const [cover] = await saveUploads([fd.get("coverFile") as File]);
  const now = new Date().toISOString();
  await update("posts", (all) => {
    const existing = all.find((p) => p.id === id);
    let slug = slugify(str(fd, "slug") || title) || `post-${Date.now()}`;
    if (all.some((p) => p.slug === slug && p.id !== id)) slug = `${slug}-${all.length + 1}`;
    const published = fd.get("published") === "on";
    const post: Post = {
      id: existing?.id ?? `post_${crypto.randomUUID().slice(0, 8)}`,
      slug,
      title,
      excerpt: str(fd, "excerpt", 400),
      cover: cover ?? (str(fd, "cover", 300) || undefined),
      body: str(fd, "body", 50000),
      published,
      publishedAt: existing?.published && published ? existing.publishedAt : now,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const next = existing ? all.map((p) => (p.id === id ? post : p)) : [post, ...all];
    return { next, result: null };
  });
  updateTag("posts");
  redirect("/admin/journal");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 80);
  await update("posts", (all) => ({ next: all.filter((p) => p.id !== id), result: null }));
  updateTag("posts");
  redirect("/admin/journal");
}

/* ───────────── settings ───────────── */

export async function saveSettings(_: { saved?: boolean } | undefined, fd: FormData) {
  await requireAdmin();
  const num = (k: string, d: number) => {
    const n = Number(str(fd, k));
    return Number.isFinite(n) && n >= 0 ? Math.round(n) : d;
  };
  await update("settings", (s) => {
    const next: Settings = {
      whatsapp: str(fd, "whatsapp", 20).replace(/\D/g, "") || s.whatsapp,
      phone: str(fd, "phone", 40),
      email: str(fd, "email", 120),
      address: str(fd, "address", 300),
      deliveryText: str(fd, "deliveryText", 200),
      announcement: str(fd, "announcement", 300),
      instagram: str(fd, "instagram", 200),
      facebook: str(fd, "facebook", 200),
      shippingFee: num("shippingFee", s.shippingFee),
      freeShippingAbove: num("freeShippingAbove", s.freeShippingAbove),
    };
    return { next, result: null };
  });
  updateTag("settings");
  return { saved: true };
}
