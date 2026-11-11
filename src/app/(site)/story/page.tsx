import type { Metadata } from "next";
import { Journey } from "@/components/home/Journey";
import { Women } from "@/components/home/Women";
import { Founders, BulkBand } from "@/components/home/Sections";
import { StoryHero } from "@/components/story/StoryHero";
import { ScrubText } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Our story",
  description: "How a small team in Rajasthan grew into a network of 500+ women artisans making handmade Jaipuri quilts.",
};

export default function StoryPage() {
  return (
    <>
      <StoryHero />
      <section className="bg-cotton py-16 lg:py-40">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-8">
          <ScrubText
            className="display-md text-[clamp(1.75rem,3.4vw,3.4rem)] leading-[1.15]"
            accent={["woman", "tradition", "hands"]}
            text="At Garg Fabrication, we believe every woman deserves the chance to grow, earn and build a more independent future. Craftsmanship here is more than a process — it is a tradition shaped by skilled hands and years of dedication."
          />
        </div>
      </section>
      <Women />
      <Journey />
      <Founders />
      <BulkBand />
    </>
  );
}
