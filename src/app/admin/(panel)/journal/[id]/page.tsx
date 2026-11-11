import { notFound } from "next/navigation";
import { read } from "@/lib/db";
import { PageHead } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "Edit story" };

export default async function EditPost({ params }: PageProps<"/admin/journal/[id]">) {
  const { id } = await params;
  const post = (await read("posts")).find((p) => p.id === id);
  if (!post) notFound();
  return (
    <>
      <PageHead title="Edit story" sub={`/journal/${post.slug}`} />
      <PostForm post={post} />
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
