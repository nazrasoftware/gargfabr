import Link from "next/link";
import type { Settings } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { waLink } from "@/lib/whatsapp";
import { FooterWordmark } from "./FooterWordmark";

export function Footer({ settings }: { settings: Settings }) {
  const cols = [
    {
      title: "Shop",
      links: [
        { href: "/shop?c=cotton-quilts", label: "Cotton Quilts" },
        { href: "/shop?c=polyester-quilts", label: "Polyester Quilts" },
        { href: "/shop?c=pillow-covers", label: "Pillow Covers" },
        { href: "/bulk-orders", label: "Bulk & Gifting" },
      ],
    },
    {
      title: "Garg Fabrication",
      links: [
        { href: "/story", label: "Our Story" },
        { href: "/story#women", label: "Our Women" },
        { href: "/journal", label: "Journal" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Help",
      links: [
        { href: "/policies#shipping", label: "Shipping" },
        { href: "/policies#returns", label: "Returns & Exchange" },
        { href: "/policies#care", label: "Quilt Care" },
        { href: "/policies#privacy", label: "Privacy" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-indigo-deep text-cotton">
      <div className="quilt-grid pointer-events-none absolute inset-0 opacity-[0.35] invert" />
      <div className="relative mx-auto max-w-[1440px] px-4 pt-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-sm text-cotton/70">
              Light, breathable quilts filled with pure cotton, stitched by hand by more than 500 women from the villages around Jaipur.
            </p>
            <a
              href={waLink(settings.whatsapp, "Hello Garg Fabrication! I'd like to know more about your quilts.")}
              target="_blank"
              rel="noopener"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-cotton px-5 py-3 text-indigo transition hover:bg-white"
            >
              <WhatsAppIcon />
              <span className="font-medium">Chat on WhatsApp</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="eyebrow text-sand">{c.title}</p>
                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group relative inline-block text-cotton/80 transition hover:text-cotton">
                        {l.label}
                        <span className="stitch-x absolute -bottom-1 left-0 w-0 text-madder transition-[width] duration-500 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3">
              <p className="eyebrow text-sand">Reach us</p>
              <p className="mt-4 text-cotton/80">
                {settings.address}
                <br />
                {settings.phone} · {settings.email}
              </p>
            </div>
          </div>
        </div>

        <FooterWordmark />

        <div className="flex flex-col gap-3 border-t border-dashed border-cotton/20 py-6 text-xs text-cotton/55 sm:flex-row sm:items-center sm:justify-between sm:pr-24">
          <p>© {2026} Garg Fabrication · Jaipur, Rajasthan</p>
          <p>{settings.deliveryText}</p>
          <Link href="/admin" className="hover:text-cotton">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3M12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.9 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0" />
    </svg>
  );
}
