import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  weight: "400",
  subsets: ["devanagari", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gargfabrication.com"),
  title: {
    default: "Garg Fabrication · Handmade Jaipuri Quilts by 500+ Women Artisans",
    template: "%s · Garg Fabrication",
  },
  description:
    "Light, breathable Jaipuri quilts with pure cotton filling, hand-stitched by more than 500 women artisans from the villages around Jaipur, Rajasthan. Delivered across India.",
  keywords: ["Jaipuri razai", "handmade cotton quilt", "lightweight quilt", "Jaipur quilt", "hand quilted razai"],
  openGraph: {
    type: "website",
    siteName: "Garg Fabrication",
    images: ["/media/hands.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${tiro.variable}`}>
      <body className="min-h-dvh">
        {/* Shared jharokha-arch mask (objectBoundingBox so it fits any box) */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <clipPath id="gf-arch" clipPathUnits="objectBoundingBox">
              <path d="M0,1 V0.36 C0,0.17 0.2,0.06 0.5,0 C0.8,0.06 1,0.17 1,0.36 V1 Z" />
            </clipPath>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
