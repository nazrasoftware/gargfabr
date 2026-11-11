import Link from "next/link";
import { read } from "@/lib/db";
import { fmtDate } from "@/lib/format";
import { Empty, PageHead, Pill, PrimaryLink } from "@/components/admin/ui";

export const metadata = { title: "Journal" };

export default async function JournalAdmin() {
  const posts = (await read("posts")).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return (
    <>
      <PageHead title="Journal" sub="Stories, updates and care guides." action={<PrimaryLink href="/admin/journal/new">+ New story</PrimaryLink>} />
      {posts.length === 0 ? (
        <Empty>No stories yet.</Empty>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <Link key={p.id} href={`/admin/journal/${p.id}`} className="flex items-center gap-4 rounded-2xl bg-cotton p-3 ring-1 ring-indigo/8 transition hover:ring-indigo/25">
              <span className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-raw">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.cover && <img src={p.cover} alt="" className="h-full w-full object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-lg">{p.title}</span>
                <span className="block truncate text-sm text-muted">{p.excerpt}</span>
              </span>
              <span className="hidden text-sm text-muted sm:block">{fmtDate(p.updatedAt)}</span>
              <Pill tone={p.published ? "live" : "draft"}>{p.published ? "Published" : "Draft"}</Pill>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
