"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, Plus, X } from "lucide-react";
import type { ColorOption, Product, SizeOption } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import { Card, inputCls, labelCls } from "./ui";
import { QuiltArt } from "@/components/ui/QuiltArt";

const DEFAULT_COLORS: ColorOption[] = [
  { name: "White", hex: "#F4F1EA" },
  { name: "Beige", hex: "#DCCBAE" },
  { name: "Navy Blue", hex: "#1F2A44" },
];
const DEFAULT_SIZES: SizeOption[] = [
  { id: "s", label: "Small", dims: "60 × 90 in", bed: "Single bed", price: 0 },
  { id: "m", label: "Medium", dims: "100 × 90 in", bed: "Double bed", price: 0 },
  { id: "l", label: "Large", dims: "108 × 92 in", bed: "King bed", price: 0 },
];

export function ProductForm({ product }: { product?: Product }) {
  const [colors, setColors] = useState<ColorOption[]>(product?.colors ?? DEFAULT_COLORS);
  const [sizes, setSizes] = useState<SizeOption[]>(product?.sizes ?? DEFAULT_SIZES);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState(product?.category ?? "cotton-quilts");

  return (
    <form action={saveProduct} className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="space-y-6">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Name *</label>
              <input name="name" required defaultValue={product?.name} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={category} onChange={(e) => setCategory(e.target.value as Product["category"])} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>URL slug</label>
              <input name="slug" defaultValue={product?.slug} placeholder="auto from name" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Tagline</label>
              <input name="tagline" defaultValue={product?.tagline} placeholder="One short line under the name" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea name="description" rows={5} defaultValue={product?.description} className={`${inputCls} h-auto py-3`} />
            </div>
            <div>
              <label className={labelCls}>Material</label>
              <input name="material" defaultValue={product?.material} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>GSM</label>
              <input name="gsm" type="number" min={0} defaultValue={product?.gsm} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Care instructions</label>
              <textarea name="care" rows={2} defaultValue={product?.care} className={`${inputCls} h-auto py-3`} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">Sizes & prices</h2>
            <button type="button" onClick={() => setSizes((s) => [...s, { id: `n${s.length}`, label: "", dims: "", price: 0 }])} className="flex items-center gap-1 text-sm text-madder">
              <Plus size={15} /> Add size
            </button>
          </div>
          <div className="space-y-3">
            {sizes.map((s, i) => (
              <div key={s.id + i} className="grid grid-cols-2 gap-2 rounded-2xl bg-white/60 p-3 ring-1 ring-indigo/8 sm:grid-cols-[1fr_1fr_1fr_0.8fr_0.8fr_auto]">
                <input name="sizeLabel" defaultValue={s.label} placeholder="Label (Small)" className={inputCls} />
                <input name="sizeDims" defaultValue={s.dims} placeholder="60 × 90 in" className={inputCls} />
                <input name="sizeBed" defaultValue={s.bed} placeholder="Single bed" className={inputCls} />
                <input name="sizePrice" type="number" min={1} defaultValue={s.price || ""} placeholder="Price ₹" className={inputCls} required />
                <input name="sizeCompare" type="number" min={0} defaultValue={s.compareAt || ""} placeholder="MRP ₹" className={inputCls} />
                <button type="button" onClick={() => setSizes((x) => x.filter((_, j) => j !== i))} className="grid h-12 w-12 place-items-center rounded-xl text-muted hover:bg-madder/10 hover:text-madder" aria-label="Remove size">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 font-serif text-xl">Visibility</h2>
          <label className="flex items-center justify-between py-2">
            <span>Live on website</span>
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-5 w-5 accent-[#1F2A44]" />
          </label>
          <label className="flex items-center justify-between py-2">
            <span>Featured on home page</span>
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? true} className="h-5 w-5 accent-[#1F2A44]" />
          </label>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">Colours</h2>
            <button type="button" onClick={() => setColors((c) => [...c, { name: "", hex: "#C9B28F" }])} className="flex items-center gap-1 text-sm text-madder">
              <Plus size={15} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  name="colorHex"
                  value={c.hex}
                  onChange={(e) => setColors((x) => x.map((y, j) => (j === i ? { ...y, hex: e.target.value } : y)))}
                  className="h-12 w-12 shrink-0 cursor-pointer rounded-xl border-0 bg-transparent"
                />
                <input
                  name="colorName"
                  value={c.name}
                  onChange={(e) => setColors((x) => x.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))}
                  placeholder="Colour name"
                  className={inputCls}
                />
                <button type="button" onClick={() => setColors((x) => x.filter((_, j) => j !== i))} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-muted hover:text-madder" aria-label="Remove colour">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {images.length === 0 && previews.length === 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-raw p-2">
              {colors.slice(0, 3).map((c, i) => (
                <div key={i} className="aspect-[4/3]">
                  <QuiltArt color={c.hex} kind={category === "pillow-covers" ? "pillow" : "quilt"} tag={false} float={false} />
                </div>
              ))}
              <p className="col-span-3 px-1 pb-1 text-xs text-muted">No photos yet, so the site shows these illustrated renders.</p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-serif text-xl">Photos</h2>
          <div className="grid grid-cols-3 gap-2">
            {images.map((src) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-xl bg-raw">
                <input type="hidden" name="keepImage" value={src} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setImages((x) => x.filter((y) => y !== src))} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-cotton/90 text-madder opacity-0 transition group-hover:opacity-100" aria-label="Remove photo">
                  <X size={14} />
                </button>
              </div>
            ))}
            {previews.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl bg-raw ring-2 ring-madder/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded-full bg-madder px-2 py-0.5 text-[0.6rem] text-cotton">new</span>
              </div>
            ))}
          </div>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-indigo/25 p-6 text-center text-sm text-muted transition hover:border-madder hover:text-madder">
            <Plus size={18} />
            Upload photos (JPG, PNG, WebP · max 8 MB each)
            <input
              type="file"
              name="images"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              onChange={(e) => setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))}
            />
          </label>
        </Card>

        <div className="flex gap-3">
          <SaveButton />
          {product && (
            <button
              formAction={deleteProduct}
              formNoValidate
              onClick={(e) => {
                if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) e.preventDefault();
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
    <button disabled={pending} className="h-12 flex-1 rounded-full bg-indigo font-medium text-cotton transition hover:bg-indigo-deep disabled:opacity-60">
      {pending ? "Saving…" : "Save product"}
    </button>
  );
}
