import clsx from "clsx";

/** Wordmark: "Garg Fabrication" + descriptor, so the name never reads as metalwork. */
export function Logo({ className, light = false, compact = false }: { className?: string; light?: boolean; compact?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", light ? "text-cotton" : "text-indigo", className)}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
        {/* jharokha arch with a running stitch inside */}
        <path d="M6 37 V18 C6 9 13 4 20 2 C27 4 34 9 34 18 V37 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 37 V19.5 C11 13 15 9.5 20 8 C25 9.5 29 13 29 19.5 V37" fill="none" stroke="#B5523B" strokeWidth="1.4" strokeDasharray="2.6 2.4" />
        <path d="M14 26 h12 M14 31 h12" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.22rem] font-[450] tracking-[-0.02em]">
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
