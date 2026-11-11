"use client";

import { useId } from "react";

/** Arch mark: Rajasthani jharokha outline, diamond running-stitch lattice, one red cross-stitch. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  const inner = "M24 55 H5.2 V33.4 C5.2 31.6 6.9 31.6 6.9 29.7 C6.9 27.4 5.7 26.4 6.5 23.8 C7.6 20.4 10.4 19.6 11 16.9 C11.7 14.3 14.6 14.3 16.4 12.7 C19 11.3 22 8.9 24 5.6 C26 8.9 29 11.3 31.6 12.7 C33.4 14.3 36.3 14.3 37 16.9 C37.6 19.6 40.4 20.4 41.5 23.8 C42.3 26.4 41.1 27.4 41.1 29.7 C41.1 31.6 42.8 31.6 42.8 33.4 V55 Z";
  return (
    <svg viewBox="0 0 48 60" className={className} aria-hidden>
      <defs>
        <clipPath id={id}>
          <path d={inner} />
        </clipPath>
      </defs>
      <path d="M2 58 V33 C2 31 4 31 4 29 C4 26 2.6 25 3.6 22 C4.8 18 8 17 8.6 14 C9.4 11 13 11 15 9 C18 7.5 22 5 24 2 C26 5 30 7.5 33 9 C35 11 38.6 11 39.4 14 C40 17 43.2 18 44.4 22 C45.4 25 44 26 44 29 C44 31 46 31 46 33 V58 Z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d={inner} fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <g clipPath={`url(#${id})`} stroke="currentColor" strokeWidth="0.45" strokeDasharray="1.5 1.3" opacity="0.55" fill="none">
        <path d="M-64 0 L0 64"/><path d="M-64 0 L-128 64"/><path d="M-55 0 L9 64"/><path d="M-55 0 L-119 64"/><path d="M-46 0 L18 64"/><path d="M-46 0 L-110 64"/><path d="M-37 0 L27 64"/><path d="M-37 0 L-101 64"/><path d="M-28 0 L36 64"/><path d="M-28 0 L-92 64"/><path d="M-19 0 L45 64"/><path d="M-19 0 L-83 64"/><path d="M-10 0 L54 64"/><path d="M-10 0 L-74 64"/><path d="M-1 0 L63 64"/><path d="M-1 0 L-65 64"/><path d="M8 0 L72 64"/><path d="M8 0 L-56 64"/><path d="M17 0 L81 64"/><path d="M17 0 L-47 64"/><path d="M26 0 L90 64"/><path d="M26 0 L-38 64"/><path d="M35 0 L99 64"/><path d="M35 0 L-29 64"/><path d="M44 0 L108 64"/><path d="M44 0 L-20 64"/><path d="M53 0 L117 64"/><path d="M53 0 L-11 64"/><path d="M62 0 L126 64"/><path d="M62 0 L-2 64"/><path d="M71 0 L135 64"/><path d="M71 0 L7 64"/><path d="M80 0 L144 64"/><path d="M80 0 L16 64"/><path d="M89 0 L153 64"/><path d="M89 0 L25 64"/><path d="M98 0 L162 64"/><path d="M98 0 L34 64"/><path d="M107 0 L171 64"/><path d="M107 0 L43 64"/><path d="M116 0 L180 64"/><path d="M116 0 L52 64"/>
      </g>
      <g stroke="#B5523B" strokeLinecap="round" fill="none">
        <path d="M38.3 36.2 L41.1 39 M41.1 36.2 L38.3 39" strokeWidth="1.3" />
        <path d="M41.6 35 L44.2 31" strokeWidth="1.1" />
      </g>
    </svg>
  );
}
