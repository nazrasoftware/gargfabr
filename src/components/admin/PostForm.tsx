"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { Post } from "@/lib/types";
import { deletePost, savePost } from "@/app/admin/actions";
import { Card, inputCls, labelCls } from "./ui";

const STOCK = ["/media/needle.jpg", "/media/spread.jpg", "/media/finish.jpg", "/media/hands.jpg", "/media/artisan-1.jpg", "/media/artisan-2.jpg"];

export function PostForm({ post }: { post?: Post }) {
  const [cover, setCover] = useState(post?.cover ?? "");
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={savePost} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="cover" value={cover} />
      <Card className="space-y-4">
        <div>
          <label className={labelCls}>Title *</label>
          <input name="title" required defaultValue={post?.title} className={`${inputCls} h-14 font-serif text-xl`} />
        </div>
        <div>
          <label className={labelCls}>Short summary</label>
          <input name="excerpt" defaultValue={post?.excerpt} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Story</label>
          <textarea name="body" rows={16} defaultValue={post?.body} className={`${inputCls} h-auto py-3 leading-relaxed`} />
          <p className="mt-2 text-xs text-muted">
            Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading, or <code>&gt; </code> for a quote.
          </p>
        </div>
      </Card>
      <div className="space-y-6">
        <Card>
          <label className="flex items-center justify-between">
            <span>Published</span>
            <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="h-5 w-5 accent-[#1F2A44]" />
          </label>
          <div className="mt-4">
            <label className={labelCls}>URL slug</label>
            <input name="slug" defaultValue={post?.slug} placeholder="auto from title" className={inputCls} />
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-serif text-xl">Cover image</h2>
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-raw">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {(preview || cover) && <img src={preview || cover} alt="" className="h-full w-full object-cover" />}
          </div>
          <p className="mb-2 mt-4 text-sm text-muted">Pick from the workshop footage…</p>
          <div className="grid grid-cols-3 gap-2">
            {STOCK.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => {
                  setCover(s);
                  setPreview(null);
                }}
                className={`aspect-[4/3] overflow-hidden rounded-xl ring-2 ${cover === s && !preview ? "ring-madder" : "ring-transparent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <label className="mt-3 block cursor-pointer rounded-2xl border border-dashed border-indigo/25 p-4 text-center text-sm text-muted hover:border-madder hover:text-madder">
            …or upload your own
            <input type="file" name="coverFile" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => e.target.files?.[0] && setPreview(URL.createObjectURL(e.target.files[0]))} />
          </label>
        </Card>
        <div className="flex gap-3">
          <SaveButton />
          {post && (
            <button
              formAction={deletePost}
              formNoValidate
              onClick={(e) => {
                if (!confirm("Delete this story?")) e.preventDefault();
              }}
              className="h-12 rounded-full px-5 text-sm text-madder ring-1 ring-madder/30 hover:bg-madder/10"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="h-12 flex-1 rounded-full bg-indigo font-medium text-cotton hover:bg-indigo-deep disabled:opacity-60">
      {pending ? "Saving…" : "Save story"}
    </button>
  );
}
