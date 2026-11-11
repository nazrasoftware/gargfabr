import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SplitWords, Reveal } from "@/components/motion/Reveal";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/site/Footer";

export const metadata: Metadata = { title: "Contact", description: "Talk to Garg Fabrication on WhatsApp, phone or email." };

export default async function ContactPage() {
  const s = await getSettings();
  const cards = [
    { k: "WhatsApp", v: s.phone, href: waLink(s.whatsapp, "Hello Garg Fabrication!") },
    { k: "Email", v: s.email, href: `mailto:${s.email}` },
    { k: "Visit", v: s.address, href: undefined },
  ];
  return (
    <div className="bg-cotton">
      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-16 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow text-madder">
              Contact <span className="font-hindi normal-case tracking-normal text-sand-deep">· संपर्क</span>
            </p>
          </Reveal>
          <SplitWords as="h1" text="Say namaste." className="display-xl mt-5 block text-[clamp(3rem,8vw,8rem)]" italicWords={["namaste"]} trigger="mount" />
          <Reveal delay={0.3}>
            <p className="lede mt-6 max-w-md text-muted">Questions about sizes, colours, delivery or an order? We&apos;re happiest on WhatsApp.</p>
          </Reveal>
          <div className="mt-10 space-y-3">
            {cards.map((c, i) => (
              <Reveal key={c.k} delay={0.1 * i}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener" className="group flex items-center justify-between rounded-3xl bg-raw px-6 py-5 transition hover:bg-indigo hover:text-cotton">
                    <span>
                      <span className="eyebrow block text-[0.65rem] opacity-70">{c.k}</span>
                      <span className="mt-1 block font-serif text-xl">{c.v}</span>
                    </span>
                    {c.k === "WhatsApp" ? <WhatsAppIcon className="h-6 w-6" /> : <span className="transition-transform group-hover:translate-x-1">→</span>}
                  </a>
                ) : (
                  <div className="rounded-3xl bg-raw px-6 py-5">
                    <span className="eyebrow block text-[0.65rem] opacity-70">{c.k}</span>
                    <span className="mt-1 block font-serif text-xl">{c.v}</span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.2}>
          <div className="rounded-[36px] bg-cotton-2 p-6 ring-1 ring-indigo/10 sm:p-10">
            <h2 className="display-sm">Send us a message</h2>
            <p className="mb-8 mt-2 text-muted">It opens in WhatsApp, ready to send.</p>
            <InquiryForm type="contact" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
