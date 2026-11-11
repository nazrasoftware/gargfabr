import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { read } from "./db";
import type { Category } from "./types";

// Public, cached reads. Admin mutations call updateTag() with these tags.

export async function getProducts(category?: Category) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  const all = await read("products");
  return all.filter((p) => p.active && (!category || p.category === category));
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  const all = await read("products");
  return all.find((p) => p.slug === slug && p.active) ?? null;
}

export async function getPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const all = await read("posts");
  return all
    .filter((p) => p.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const all = await read("posts");
  return all.find((p) => p.slug === slug && p.published) ?? null;
}

export async function getSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag("settings");
  return read("settings");
}
