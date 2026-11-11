"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import clsx from "clsx";

type Variant = "solid" | "accent" | "ghost" | "light";

const styles: Record<Variant, string> = {
  solid: "bg-indigo text-cotton hover:bg-indigo-deep",
  accent: "bg-madder text-cotton hover:bg-madder-deep",
  ghost: "bg-transparent text-indigo ring-1 ring-inset ring-indigo/25 hover:ring-indigo/60",
  light: "bg-cotton text-indigo hover:bg-white",
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  size?: "md" | "lg";
  icon?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
  "aria-label"?: string;
};

/**
 * Pill button with: magnetic pull (desktop), ink-ripple from the click point,
 * and a text roll on hover. Renders <Link> when href is given.
 */
export function Button(props: ButtonProps) {
  const { children, variant = "solid", className, magnetic = true, size = "md", icon, href, type = "button", ...rest } = props;
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18 });
  const y = useSpring(my, { stiffness: 260, damping: 18 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; s: number }[]>([]);

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };
  const onDown = (e: MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const s = Math.max(r.width, r.height) * 2.2;
    const id = Date.now();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top, s }]);
    setTimeout(() => setRipples((rs) => rs.filter((rp) => rp.id !== id)), 700);
  };

  const inner = (
    <>
      <span className="relative z-10 block overflow-hidden">
        <span className="flex items-center gap-2 transition-transform duration-500 ease-[var(--ease-silk)] group-hover:-translate-y-full">
          {children}
          {icon}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 flex translate-y-full items-center gap-2 transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-y-0"
        >
          {children}
          {icon}
        </span>
      </span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{ left: r.x - r.s / 2, top: r.y - r.s / 2, width: r.s, height: r.s }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </>
  );

  const cls = clsx(
    "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-tight transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
    size === "lg" ? "h-14 px-8 text-[0.98rem]" : "h-12 px-6 text-[0.92rem]",
    styles[variant],
    className,
  );

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onMouseDown={onDown}
      className={clsx("inline-flex", className?.includes("w-full") && "w-full")}
    >
      {href !== undefined ? (
        <Link href={href} {...rest} className={cls}>
          {inner}
        </Link>
      ) : (
        <button type={type} {...rest} className={cls}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
