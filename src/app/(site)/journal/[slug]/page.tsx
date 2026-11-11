import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { getPostBySlug, getPosts } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";
import { ReadingProgress } from "@/components/story/ReadingProgress";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  return p ? { title: p.title, description: p.excerpt, openGraph: { images: p.cover ? [p.cover] : [] } } : { title: "Story not found" };
}

export default function PostPage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-cotton" />}>
      <Post params={params} />
    </Suspense>
  );
}

/** Tiny, safe renderer: paragraphs, "## " headings and "> " quotes. No raw HTML. */
function renderBody(body: string) {
  const out: ReactNode[] = [];
  body.split(/\n{2,}|\n(?=## |> )/).forEach((block, i) => {
    const b = block.trim();
    if (!b) return;
    if (b.startsWith("## ")) out.push(<h2 key={i}>{b.slice(3)}</h2>);
    else if (b.startsWith("> ")) out.push(<blockquote key={i}>{b.slice(2)}</blockquote>);
    else out.push(<p key={i}>{b}</p>);
  });
  return out;
}

async function Post({ params }: { params: PageProps<"/journal/[slug]">["params"] }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPostBySlug(slug), getPosts()]);
  if (!post) notFound();
  const next = all.find((p) => p.id !== post.id);

  return (
    <article className="bg-cotton pb-9 sm:pb-16">
      <ReadingProgress />
      <header className="mx-auto max-w-[900px] px-4 pt-28 text-center sm:px-8 sm:pt-44">
        <Link href="/journal" className="eyebrow text-madder">
          ← Journal
        </Link>
        <Reveal>
          <h1 className="display-lg mt-4 sm:mt-6">{post.title}</h1>
          <p className="mt-3 sm:mt-5 text-sm uppercase tracking-[0.16em] text-muted">{fmtDate(post.publishedAt)}</p>
        </Reveal>
      </header>
      {post.cover && (
        <Reveal className="mx-auto mt-6 sm:mt-10 max-w-[1200px] px-4 sm:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[36px] bg-raw">
            <Image src={post.cover} alt="" fill sizes="100vw" className="object-cover" priority />
          </div>
        </Reveal>
      )}
      <div className="prose-gf mx-auto mt-6 sm:mt-10 max-w-[680px] px-4 sm:px-0">
        <p className="!text-[1.35rem] !leading-relaxed !text-indigo">{post.excerpt}</p>
        {renderBody(post.body)}
      </div>
      {next && (
        <div className="mx-auto mt-6 sm:mt-10 max-w-[900px] px-4 sm:px-8">
          <div className="stitch-x w-full text-indigo/25" />
          <Link href={`/journal/${next.slug}`} className="group mt-6 sm:mt-10 block text-center">
            <p className="eyebrow text-muted">Next story</p>
            <p className="display-md mt-3 transition-colors group-hover:text-madder">{next.title} →</p>
          </Link>
        </div>
      )}
    </article>
  );
}
