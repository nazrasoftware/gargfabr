import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Inquiry, Order, Post, Product, Settings } from "./types";
import { seedInquiries, seedOrders, seedPosts, seedProducts, seedSettings } from "./seed";

/**
 * Tiny JSON-file store. Good for localhost and a single small server.
 * The interface (read / write / update) is deliberately narrow so it can be
 * swapped for Postgres/SQLite later without touching pages or actions.
 */
type Collections = {
  products: Product[];
  orders: Order[];
  inquiries: Inquiry[];
  posts: Post[];
  settings: Settings;
};
type Name = keyof Collections;

const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const seeds: Collections = {
  products: seedProducts,
  orders: seedOrders,
  inquiries: seedInquiries,
  posts: seedPosts,
  settings: seedSettings,
};

const file = (name: Name) => path.join(DATA_DIR, `${name}.json`);

export async function read<N extends Name>(name: N): Promise<Collections[N]> {
  try {
    const raw = await fs.readFile(file(name), "utf8");
    return JSON.parse(raw) as Collections[N];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await write(name, seeds[name]);
      return structuredClone(seeds[name]);
    }
    throw err;
  }
}

export async function write<N extends Name>(name: N, data: Collections[N]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = file(name);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target);
}

// Serialise writes per collection so two requests can't clobber each other.
const locks = new Map<Name, Promise<unknown>>();

export function update<N extends Name, R>(
  name: N,
  fn: (current: Collections[N]) => Promise<{ next: Collections[N]; result: R }> | { next: Collections[N]; result: R },
): Promise<R> {
  const prev = locks.get(name) ?? Promise.resolve();
  const run = prev.then(async () => {
    const current = await read(name);
    const { next, result } = await fn(current);
    await write(name, next);
    return result;
  });
  locks.set(
    name,
    run.catch(() => undefined),
  );
  return run;
}
