"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";
import { Marquee, StitchStar } from "@/components/ui/Marquee";
import { cartCount, useCart } from "@/components/cart/store";
import { useLenis } from "@/components/motion/SmoothScroll";

export const NAV = [
  { href: "/shop", label: "Shop", hi: "दुकान" },
  { href: "/story", label: "Our Story", hi: "कहानी" },
  { href: "/journal", label: "Journal", hi: "पत्रिका" },
  { href: "/bulk-orders", label: "Bulk Orders", hi: "थोक" },
  { href: "/contact", label: "Contact", hi: "संपर्क" },
];

export function Header({ announcement }: { announcement: string }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 240 && y > prev && !menu);
  });

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    if (menu) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu, lenis]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* announcement */}
        <motion.div
          className="overflow-hidden bg-indigo-deep text-cotton"
          animate={{ height: scrolled ? 0 : "auto" }}
          transition={{ duration: 0.4 }}
        >
          {/* phones: scrolling ticker; larger screens (and reduced motion): static line */}
          <div className="sm:hidden motion-reduce:hidden">
            <Marquee
              items={announcement.split("·").map((t) => t.trim()).filter(Boolean)}
              speed={24}
              separator={<StitchStar className="h-2.5 w-2.5 text-sand" />}
              className="py-2 text-[0.72rem] tracking-wide text-cotton/85"
            />
          </div>
          <p className="hidden px-4 py-2 text-center text-[0.72rem] tracking-wide text-cotton/85 sm:block motion-reduce:block">{announcement}</p>
        </motion.div>

        <div
          className={clsx(
            "transition-[background-color,backdrop-filter,box-shadow] duration-500",
            scrolled || menu ? "bg-cotton/80 shadow-[0_1px_0_var(--line)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-5 sm:h-[72px] sm:px-8">
            <Link href="/" aria-label="Garg Fabrication home" className="relative z-10">
              <Logo className="[&_.logo-sub]:hidden sm:[&_.logo-sub]:block" />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.map((n) => {
                const active = pathname.startsWith(n.href);
                return (
                  <Link key={n.href} href={n.href} className="group relative px-4 py-2 text-[0.92rem]">
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-500 ease-[var(--ease-silk)] group-hover:-translate-y-full">
                        {n.label}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-0 block translate-y-full font-hindi text-madder transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-y-0"
                      >
                        {n.hi}
                      </span>
                    </span>
                    {active && (
                      <motion.span
                        layoutId="nav-stitch"
                        className="stitch-x absolute bottom-0.5 left-4 right-4 text-madder"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="relative z-10 flex shrink-0 items-center gap-2.5">
              <CartButton />
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-indigo/15 sm:h-11 sm:w-11 lg:hidden"
                aria-label={menu ? "Close menu" : "Open menu"}
                aria-expanded={menu}
              >
                <span className="relative h-3 w-5">
                  <motion.span
                    className="absolute left-0 top-0 h-[1.5px] w-5 bg-indigo"
                    animate={menu ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                  />
                  <motion.span
                    className="absolute bottom-0 left-0 h-[1.5px] w-5 bg-indigo"
                    animate={menu ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menu} pathname={pathname} />
    </>
  );
}

function CartButton() {
  const lines = useCart((s) => s.lines);
  const bump = useCart((s) => s.bump);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(lines) : 0;

  return (
    <motion.button
      key={bump}
      type="button"
      onClick={() => setOpen(true)}
      animate={bump ? { scale: [1, 1.18, 0.94, 1], rotate: [0, -8, 6, 0] } : undefined}
      transition={{ duration: 0.6 }}
      className="relative flex h-10 items-center gap-1.5 rounded-full bg-indigo pl-3.5 pr-1.5 text-cotton sm:h-11 sm:gap-2 sm:pl-4"
      aria-label={`Open cart, ${count} items`}
      data-cursor="Cart"
    >
      <span className="text-[0.85rem]">Cart</span>
      <span className="grid h-7 min-w-7 place-items-center rounded-full bg-cotton px-2 sm:h-8 sm:min-w-8 text-[0.8rem] font-semibold tabular-nums text-indigo">
        {count}
      </span>
    </motion.button>
  );
}

function MobileMenu({ open, pathname }: { open: boolean; pathname: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col bg-cotton pt-28 lg:hidden"
          initial={{ clipPath: "circle(0% at 92% 4%)" }}
          animate={{ clipPath: "circle(150% at 92% 4%)" }}
          exit={{ clipPath: "circle(0% at 92% 4%)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          data-lenis-prevent
        >
          <div className="quilt-grid pointer-events-none absolute inset-0 opacity-60" />
          <nav className="relative flex flex-1 flex-col px-6" aria-label="Mobile">
            {[{ href: "/", label: "Home", hi: "घर" }, ...NAV].map((n, i) => (
              <motion.div
                key={n.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={n.href}
                  className={clsx(
                    "flex items-baseline justify-between border-b border-dashed border-indigo/15 py-4",
                    pathname === n.href && "text-madder",
                  )}
                >
                  <span className="display-md text-[2.4rem]">{n.label}</span>
                  <span className="font-hindi text-lg text-sand-deep">{n.hi}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            className="relative mx-6 mb-8 overflow-hidden rounded-[28px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <video src="/media/needle-sm.mp4" autoPlay muted loop playsInline className="h-32 w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-indigo-deep/80 to-transparent p-4">
              <p className="font-serif text-lg italic text-cotton">Made by her, for your home.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
