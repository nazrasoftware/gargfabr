"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * Muted looping clip that only downloads when near the viewport and only plays
 * while visible. Picks the small encode on phones and a portrait encode when given.
 */
export function VideoLoop({
  name,
  portrait,
  className,
  poster,
  eager = false,
  rate = 1,
}: {
  name: string; // e.g. "hands" → /media/hands.mp4, /media/hands-sm.mp4, /media/hands.jpg
  portrait?: string; // optional portrait encode for small screens
  className?: string;
  poster?: string;
  eager?: boolean;
  rate?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const chosen = small ? (portrait ? `/media/${portrait}.mp4` : `/media/${name}-sm.mp4`) : `/media/${name}.mp4`;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc((s) => s ?? chosen);
          v.playbackRate = rate;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: eager ? "100% 0px" : "25% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [name, portrait, eager, rate]);

  useEffect(() => {
    const v = ref.current;
    if (v && src) {
      v.load();
      v.playbackRate = rate;
      v.play().catch(() => {});
    }
  }, [src, rate]);

  return (
    <video
      ref={ref}
      className={clsx("h-full w-full object-cover", className)}
      poster={poster ?? `/media/${name}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      disablePictureInPicture
    >
      {src && <source src={src} type="video/mp4" />}
    </video>
  );
}
