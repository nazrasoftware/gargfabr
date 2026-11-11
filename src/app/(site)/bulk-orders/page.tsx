import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { SplitWords, Reveal } from "@/components/motion/Reveal";
import { VideoLoop } from "@/components/ui/VideoLoop";
import { Marquee, StitchStar } from "@/components/ui/Marquee";

export const metadata: Metadata = {
  title: "Bulk orders & gifting",
  description: "Handmade quilts in bulk for hotels, homestays, weddings, hostels and corporate gifting. Enquire on WhatsApp.",
};

export default function BulkPage() {
  return (
    <div className="bg-cotton">
      <section className="relative overflow-hidden pt-32 sm:pt-40">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-14 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow text-madder">
                Bulk & gifting <span className="font-hindi normal-case tracking-normal text-sand-deep">· थोक ऑर्डर</span>
              </p>
            </Reveal>
            <SplitWords as="h1" text="Handmade, at scale." className="display-xl mt-5 block max-w-[10ch] text-[clamp(3rem,7vw,7rem)]" italicWords={["scale"]} trigger="mount" />
            <Reveal delay={0.3}>
              <p className="lede mt-6 max-w-md text-muted">
                With a network of 500+ women artisans, we take on larger orders for hospitality, events and gifting. The same care goes into every piece.
              </p>
            </Reveal>
            <div className="arch relative mt-10 hidden aspect-[4/5] w-full max-w-sm overflow-hidden lg:block">
              <VideoLoop name="spread" />
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-3 text-sm lg:max-w-md">
              {["Hotels & homestays", "Weddings & events", "Corporate gifting", "Hostels & institutions"].map((t, i) => (
                <Reveal key={t} delay={0.1 * i} as="li">
                  <span className="flex items-center gap-2 rounded-2xl bg-raw px-4 py-3">
                    <StitchStar className="h-3 w-3 text-madder" />
                    {t}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={0.2}>
            <div className="rounded-[36px] bg-cotton-2 p-6 ring-1 ring-indigo/10 sm:p-10">
              <h2 className="display-sm">Tell us what you need</h2>
              <p className="mb-8 mt-2 text-muted">We usually reply on WhatsApp within a working day.</p>
              <InquiryForm type="bulk" />
            </div>
          </Reveal>
        </div>
      </section>
      <div className="border-y border-dashed border-indigo/20 py-5">
        <Marquee
          speed={40}
          className="font-serif text-2xl italic"
          items={["Custom sizes on request", "Consistent colours across batches", "Delivered across India", "Handmade by women artisans"]}
          separator={<StitchStar className="text-madder" />}
        />
      </div>
    </div>
  );
}
