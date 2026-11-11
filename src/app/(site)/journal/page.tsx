import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { Reveal, SplitWords } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Journal", description: "Stories of craft, care and the women behind Garg Fabrication." };

export default async function JournalPage() {
  const posts = await getPosts();
  const [first, ...rest] = posts;
  return (
    <div className="bg-cotton pb-20">
      <section className="mx-auto max-w-[1440px] px-4 pt-36 sm:px-8 sm:pt-44">
        <p className="eyebrow text-madder">
          Journal <span className="font-hindi normal-case tracking-normal text-sand-deep">· पत्रिका</span>
        </p>
        <SplitWords as="h1" text="Stories from the workshop." className="display-xl mt-5 block max-w-[12ch]" italicWords={["workshop"]} trigger="mount" />
      </section>

      {first && (
        <Reveal className="mx-auto mt-10 max-w-[1440px] px-4 sm:px-8">
          <Link href={`/journal/${first.slug}`} className="group grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end" data-cursor="Read">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[36px] bg-raw">
              {first.cover && (
                <Image src={first.cover} alt="" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" priority />
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{fmtDate(first.publishedAt)} · Featured</p>
              <h2 className="display-md mt-3 transition-colors group-hover:text-madder">{first.title}</h2>
              <p className="lede mt-4 text-muted">{first.excerpt}</p>
              <span className="mt-6 inline-block underline decoration-dashed underline-offset-8">Read the story →</span>
            </div>
          </Link>
        </Reveal>
      )}

      <div className="mx-auto mt-10 grid max-w-[1440px] gap-x-8 gap-y-10 px-4 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.1}>
            <Link href={`/journal/${p.slug}`} className="group block" data-cursor="Read">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-raw">
                {p.cover && <Image src={p.cover} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />}
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted">{fmtDate(p.publishedAt)}</p>
              <h3 className="display-sm mt-2 text-[1.5rem] transition-colors group-hover:text-madder">{p.title}</h3>
              <p className="mt-2 text-muted">{p.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
      {posts.length === 0 && <p className="mx-auto mt-10 max-w-[1440px] px-4 text-muted sm:px-8">New stories are on their way.</p>}
    </div>
  );
}
