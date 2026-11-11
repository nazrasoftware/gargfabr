"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, BookOpen, Settings, ExternalLink, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { logout } from "@/app/admin/actions";

const ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingBag },
  { href: "/admin/inquiries", label: "Enquiries", Icon: MessageSquare },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/journal", label: "Journal", Icon: BookOpen },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const links = (
    <nav className="flex flex-col gap-1">
      {ITEMS.map(({ href, label, Icon, exact }) => {
        const active = exact ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={clsx("relative flex items-center gap-3 rounded-2xl px-4 py-3 text-[0.95rem] transition", active ? "text-cotton" : "text-indigo/75 hover:bg-indigo/5")}
          >
            {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-2xl bg-indigo" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <Icon size={18} strokeWidth={1.6} className="relative" />
            <span className="relative">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
  const footer = (
    <div className="mt-auto space-y-1 border-t border-dashed border-indigo/15 pt-4">
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-indigo/70 hover:bg-indigo/5">
        <ExternalLink size={16} /> View website
      </Link>
      <form action={logout}>
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-indigo/70 hover:bg-indigo/5">
          <LogOut size={16} /> Sign out
        </button>
      </form>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-svh flex-col bg-cotton p-5 shadow-[1px_0_0_var(--line)] lg:flex">
        <Link href="/admin" className="mb-8 px-2">
          <Logo compact />
        </Link>
        {links}
        {footer}
      </aside>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-cotton/90 px-4 py-3 shadow-[0_1px_0_var(--line)] backdrop-blur lg:hidden">
        <Logo compact />
        <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-indigo/15" aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-x-0 top-[64px] z-30 flex flex-col bg-cotton p-4 shadow-xl lg:hidden">
          {links}
          {footer}
        </div>
      )}
    </>
  );
}
