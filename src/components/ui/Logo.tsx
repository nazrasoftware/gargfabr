import clsx from "clsx";
import { LogoMark } from "./LogoMark";

/** Wordmark: "Garg Fabrication" + descriptor, so the name never reads as metalwork. */
export function Logo({ className, light = false, compact = false }: { className?: string; light?: boolean; compact?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2 sm:gap-2.5", light ? "text-cotton" : "text-indigo", className)}>
      <LogoMark light={light} className="h-9 w-auto shrink-0 sm:h-11" />
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap font-serif text-[1.05rem] font-[450] tracking-[-0.02em] sm:text-[1.22rem]">
          Garg <span className="italic">Fabrication</span>
        </span>
        {!compact && (
          <span className={clsx("logo-sub mt-1 whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.26em]", light ? "text-sand" : "text-muted")}>
            Handmade Jaipuri Quilts
          </span>
        )}
      </span>
    </span>
  );
}
