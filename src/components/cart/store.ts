"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  color: string;
  hex: string;
  sizeId: string;
  sizeLabel: string;
  dims: string;
  price: number;
  image?: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  open: boolean;
  bump: number; // increments on add, drives the cart-icon bounce
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

// Storage can throw (private mode, blocked site data): fail soft.
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  setItem: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
  removeItem: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      bump: 0,
      add: (line, qty = 1) =>
        set((s) => {
          const key = `${line.productId}|${line.color}|${line.sizeId}`;
          const exists = s.lines.find((l) => l.key === key);
          const lines = exists
            ? s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
            : [...s.lines, { ...line, key, qty }];
          return { lines, bump: s.bump + 1, open: true };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "gf-cart",
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ lines: s.lines }),
      skipHydration: true,
    },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty * l.price, 0);
