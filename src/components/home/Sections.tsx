import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { Marquee, StitchStar } from "@/components/ui/Marquee";
import { Reveal, ScrubText, SplitWords, Parallax } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { VideoLoop } from "@/components/ui/VideoLoop";

/* ───────────── Trust strip ───────────── */
export function TrustMarquee() {
  const items = [
    "500+ women artisans",
    "Handmade in Rajasthan",
    "Pure cotton filling",
    "250 gsm · light as a breath",
    "Delivered in 6–8 days",
    "Cash on delivery",
  ];
  return (
    <div className="relative z-10 -mt-px border-y border-dashed border-indigo/20 bg-cotton py-5">
      <Marquee
        speed={45}
        className="font-serif text-[clamp(1.25rem,2.2vw,2rem)] italic"
        items={items}
        separator={<StitchStar className="text-madder" />}
      />
    </div>
  );
}

/* ───────────── Manifesto (words light up as you read) ───────────── */
export function Manifesto() {
  return (
    <section className="relative bg-cotton py-16 lg:py-44" aria-label="Who we are">
      <div className="mx-auto grid max-w-[1440px] gap-9 px-4 sm:px-8 lg:grid-cols-[1fr_2.4fr]">
        <div className="flex flex-col gap-6">
          <p className="eyebrow text-madder">
            Every piece has a story <span className="font-hindi normal-case tracking-normal text-sand-deep">· कहानी</span>
          </p>
          <div className="arch hidden aspect-[3/4] w-48 overflow-hidden lg:block">
            <VideoLoop name="needle" />
          </div>
        </div>
        <ScrubText
          className="display-md text-[clamp(1.75rem,3.5vw,3.6rem)] leading-[1.12]"
          accent={["hand", "her", "own"]}
          text="Every Garg quilt is finished by hand — by one woman among more than 500 from the villages around Jaipur, who earns through her craft while still running her home. Because each piece is made with individual care, small variations in stitch give every quilt a character of its own."
        />
      </div>
    </section>
  );
}

/* ───────────── Founders ───────────── */
export function Founders() {
  const people = [
    { name: "Sushil Gupta", role: "Founder & Director", from: "Jaipur, Rajasthan", mono: "सु" },
    { name: "Babita Gupta", role: "Co-Founder & Operations Head", from: "Ringas, Rajasthan", mono: "ब" },
  ];
  return (
    <section className="relative bg-cotton py-16 lg:py-40" aria-label="Founders">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-9 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow text-madder">
                The family behind it <span className="font-hindi normal-case tracking-normal text-sand-deep">· परिवार</span>
              </p>
            </Reveal>
            <SplitWords as="h2" text="Rooted in Rajasthan." className="display-lg mt-5 block max-w-[10ch]" italicWords={["Rajasthan"]} />
            <Reveal delay={0.2}>
              <p className="lede mt-8 max-w-md text-muted">
                We take pride in bringing traditional Indian textile craftsmanship into homes, with products that pair timeless techniques with
                everyday comfort.
              </p>
            </Reveal>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {people.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.15}>
                <div className="group">
                  <div className="arch relative grid aspect-[3/4] place-items-center overflow-hidden bg-raw">
                    <div className="quilt-grid absolute inset-0 opacity-70 transition-transform duration-[1.5s] group-hover:scale-110" />
                    <span className="relative font-hindi text-[7rem] leading-none text-indigo/85 transition-transform duration-700 group-hover:scale-110">
                      {p.mono}
                    </span>
                    <span className="absolute bottom-6 rounded-full bg-cotton/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                      Portrait coming soon
                    </span>
                  </div>
                  <p className="display-sm mt-5">{p.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {p.role} · {p.from}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Bulk band ───────────── */
export function BulkBand() {
  return (
    <section className="relative overflow-hidden bg-madder py-14 text-cotton lg:py-28" aria-label="Bulk orders">
      <Marquee
        speed={60}
        className="font-serif text-[clamp(3rem,9vw,8rem)] font-[330] leading-none opacity-20"
        items={["Hotels", "Homestays", "Weddings", "Corporate gifting", "Hostels", "NGOs"]}
        separator={<StitchStar className="h-8 w-8" />}
      />
      <div className="relative mx-auto mt-8 flex max-w-[1440px] flex-col items-start gap-8 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-cotton/80">Bulk & gifting · थोक</p>
          <h2 className="display-md mt-4 max-w-[18ch]">Ordering for a hotel, a wedding or a team?</h2>
          <p className="lede mt-4 max-w-lg text-cotton/80">Tell us what you need. We&apos;ll reply on WhatsApp with pricing and timelines.</p>
        </div>
        <Button href="/bulk-orders" variant="light" size="lg">
          Start a bulk enquiry →
        </Button>
      </div>
    </section>
  );
}

/* ───────────── Journal teaser ───────────── */
export function JournalTeaser({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="bg-cotton py-16 lg:py-36" aria-label="Journal">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <SplitWords as="h2" text="From the journal." className="display-lg block" italicWords={["journal"]} />
          <Link href="/journal" className="hidden shrink-0 font-medium underline decoration-dashed underline-offset-8 sm:block">
            All stories →
          </Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12}>
              <Link href={`/journal/${p.slug}`} className="group block" data-cursor="Read">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-raw">
                  {p.cover && (
                    <Parallax speed={0.08} className="absolute inset-0 scale-110">
                      <Image
                        src={p.cover}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-105"
                      />
                    </Parallax>
                  )}
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted">{fmtDate(p.publishedAt)}</p>
                <h3 className="display-sm mt-2 text-[1.5rem] transition-colors group-hover:text-madder">{p.title}</h3>
                <p className="mt-2 text-muted">{p.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
export const FAQ_ITEMS = [
  { q: "How long does delivery take?", a: "Orders are delivered across India in 6–8 working days through our courier partner DTDC." },
  { q: "Do I need an account to order?", a: "No. Add to cart, fill in your address and place the order. We confirm every order with you on WhatsApp." },
  { q: "Can I pay cash on delivery?", a: "Yes, cash on delivery is available. You can also choose UPI and we'll share a payment link on WhatsApp." },
  {
    q: "Is the cotton quilt really pure cotton?",
    a: "Our cotton quilts use pure cotton filling. That is what makes them breathable and light. Our polyester quilts are a separate, easy-care range.",
  },
  {
    q: "Which size fits my bed?",
    a: "Small (60 × 90 in) suits a single bed, Medium (100 × 90 in) a double bed, and Large (108 × 92 in) a king bed.",
  },
  {
    q: "Why does my quilt look slightly different from the photo?",
    a: "Each quilt is made by hand, so small variations in stitching and finish are natural. They give every piece its own character.",
  },
  { q: "Do you take bulk or custom orders?", a: "Yes, for hotels, homestays, weddings and corporate gifting. Use the Bulk Orders form and we'll reply on WhatsApp." },
];

export function Faq() {
  return (
    <section className="bg-cotton pb-16 lg:pb-40" aria-label="Questions">
      <div className="mx-auto grid max-w-[1440px] gap-9 px-4 sm:px-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow text-madder">
            Questions <span className="font-hindi normal-case tracking-normal text-sand-deep">· सवाल</span>
          </p>
          <h2 className="display-lg mt-5 max-w-[10ch]">Good to know.</h2>
        </div>
        <Accordion items={FAQ_ITEMS} defaultOpen={0} />
      </div>
    </section>
  );
}
