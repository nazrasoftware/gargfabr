import { connection } from "next/server";
import { PageHead } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "New story" };

export default async function NewPost() {
  await connection();
  return (
    <>
      <PageHead title="New story" />
      <PostForm />
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
