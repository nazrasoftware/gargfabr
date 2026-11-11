import type { Metadata } from "next";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Policies", description: "Shipping, returns, quilt care and privacy at Garg Fabrication." };

// NOTE: placeholder policy wording. The client must confirm the return/exchange terms before launch.
export default async function PoliciesPage() {
  const s = await getSettings();
  const sections = [
    {
      id: "shipping",
      t: "Shipping",
      b: [
        `${s.deliveryText}.`,
        `Delivery is free on orders above ₹${s.freeShippingAbove.toLocaleString("en-IN")}; otherwise a flat ₹${s.shippingFee} applies.`,
        "Every order is confirmed with you on WhatsApp before it ships.",
      ],
    },
    {
      id: "returns",
      t: "Returns & exchange",
      b: [
        "If your quilt arrives damaged or you received the wrong item, message us on WhatsApp within 48 hours of delivery with photos and we'll make it right.",
        "Because every piece is handmade, small variations in stitching and finish are natural and are not considered defects.",
      ],
    },
    {
      id: "care",
      t: "Quilt care",
      b: [
        "Cotton quilts: dry clean recommended for the first wash. Air in the shade every few weeks and store folded in a breathable cotton bag.",
        "Polyester quilts: gentle machine wash, cold. Dry flat in shade.",
      ],
    },
    {
      id: "privacy",
      t: "Privacy",
      b: [
        "We use your name, phone number and address only to process and deliver your order and to reply to your enquiries. We never sell your details.",
        `To ask for your details to be removed, write to ${s.email}.`,
      ],
    },
  ];
  return (
    <div className="bg-cotton pb-16">
      <div className="mx-auto grid max-w-[1200px] gap-9 px-4 pt-36 sm:px-8 sm:pt-44 lg:grid-cols-[240px_1fr]">
        <nav className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <ul className="space-y-3">
            {sections.map((x) => (
              <li key={x.id}>
                <a href={`#${x.id}`} className="text-muted hover:text-madder">
                  {x.t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h1 className="display-lg">Policies</h1>
          {sections.map((x) => (
            <section key={x.id} id={x.id} className="scroll-mt-28 pt-10">
              <h2 className="display-sm">{x.t}</h2>
              <div className="stitch-x mt-4 w-24 text-madder" />
              {x.b.map((p) => (
                <p key={p} className="mt-4 max-w-2xl leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
