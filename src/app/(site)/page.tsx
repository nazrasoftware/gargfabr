import { getPosts, getProducts } from "@/lib/data";
import { Hero } from "@/components/home/Hero";
import { Journey } from "@/components/home/Journey";
import { Anatomy } from "@/components/home/Anatomy";
import { Collections } from "@/components/home/Collections";
import { Women } from "@/components/home/Women";
import { Seasons } from "@/components/home/Seasons";
import { BulkBand, Faq, Founders, JournalTeaser, Manifesto, TrustMarquee } from "@/components/home/Sections";

/*
 * Home page narrative, in order:
 *  1 Hero: arch window opens into a full-bleed film
 *  2 Trust strip
 *  3 Manifesto: words light up as you read
 *  4 Journey: 5 handmade steps (pinned horizontal on desktop)
 *  5 Anatomy: layer diagram explodes and re-forms
 *  6 Collection: choose your quilt
 *  7 Women: 500+ counter, artisan films, leadership
 *  8 Seasons: interactive summer / winter
 *  9 Founders · 10 Bulk band · 11 Journal · 12 FAQ
 */
export default async function Home() {
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  return (
    <>
      <Hero />
      <TrustMarquee />
      <Manifesto />
      <Journey />
      <Anatomy />
      <Collections products={products} />
      <Women />
      <Seasons />
      <Founders />
      <BulkBand />
      <JournalTeaser posts={posts} />
      <Faq />
    </>
  );
}
