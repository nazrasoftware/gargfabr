import clsx from "clsx";
import type { ReactNode } from "react";

/** Infinite marquee (pure CSS, pauses on hover). */
export function Marquee({
  items,
  className,
  speed = 40,
  separator,
}: {
  items: ReactNode[];
  className?: string;
  speed?: number;
  separator?: ReactNode;
}) {
  const row = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((it, i) => (
        <div key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 sm:px-10">{it}</span>
          {separator}
        </div>
      ))}
    </div>
  );
  return (
    <div className={clsx("group flex overflow-hidden", className)}>
      <div
        className="flex w-max group-hover:[animation-play-state:paused]"
        style={{ animation: `gf-marquee ${speed}s linear infinite` }}
      >
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

export function StitchStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={clsx("h-4 w-4 shrink-0", className)} aria-hidden>
      <path
        d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z"
        fill="currentColor"
      />
    </svg>
  );
}
