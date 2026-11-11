import type { Inquiry, Order, Post, Product, Settings } from "./types";

// NOTE: Prices and the WhatsApp number below are PLACEHOLDERS.
// The client has not supplied them yet; edit them in /admin.

const now = "2026-11-11T00:00:00.000Z";

const quiltSizes = (s: number, m: number, l: number) => [
  { id: "s", label: "Small", dims: "60 × 90 in", bed: "Single bed", price: s },
  { id: "m", label: "Medium", dims: "100 × 90 in", bed: "Double bed", price: m },
  { id: "l", label: "Large", dims: "108 × 92 in", bed: "King bed", price: l },
];

const colors = [
  { name: "White", hex: "#F4F1EA" },
  { name: "Beige", hex: "#DCCBAE" },
  { name: "Navy Blue", hex: "#1F2A44" },
];

export const seedProducts: Product[] = [
  {
    id: "p_cotton",
    slug: "handmade-cotton-quilt",
    name: "Handmade Cotton Quilt",
    category: "cotton-quilts",
    tagline: "Pure cotton filling. Light as a breath.",
    description:
      "Our signature Jaipuri quilt, filled with pure cotton and quilted by hand by women artisans from the villages around Jaipur. Breathable by nature, it gives gentle warmth in mild winters without the weight of a heavy blanket, and works as a light covering in warmer months.",
    material: "100% cotton filling · cotton cover",
    gsm: 250,
    colors,
    sizes: quiltSizes(1899, 2699, 2999),
    images: [],
    care: "Dry clean recommended for the first wash. Air in shade every few weeks. Store folded in a cotton bag.",
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p_poly",
    slug: "everyday-polyester-quilt",
    name: "Everyday Polyester Quilt",
    category: "polyester-quilts",
    tagline: "Easy care, hand-finished, everyday comfort.",
    description:
      "A lighter, easy-care companion to our cotton quilt. Hand-finished by the same artisans, quick to dry and simple to look after: made for guest rooms, hostels and everyday use.",
    material: "Polyester filling · soft cover",
    gsm: 200,
    colors,
    sizes: quiltSizes(1299, 1799, 1999),
    images: [],
    care: "Gentle machine wash, cold. Dry flat in shade. Do not tumble dry.",
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p_pillow",
    slug: "cotton-pillow-cover",
    name: "Cotton Pillow Cover",
    category: "pillow-covers",
    tagline: "The finishing stitch for your bed.",
    description:
      "Soft cotton pillow covers stitched to match our quilts. Every pair is cut, sewn and finished by hand.",
    material: "100% cotton",
    colors,
    sizes: [
      { id: "s", label: "Small", dims: "S", price: 299 },
      { id: "m", label: "Medium", dims: "M", price: 349 },
      { id: "l", label: "Large", dims: "L", price: 399 },
    ],
    images: [],
    care: "Machine wash cold with similar colours. Warm iron.",
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedPosts: Post[] = [
  {
    id: "post_1",
    slug: "why-a-jaipuri-quilt-feels-so-light",
    title: "Why a Jaipuri quilt feels so light",
    excerpt: "Pure cotton, hand-quilted, and lighter than you expect. Here's what's inside.",
    cover: "/media/needle.jpg",
    body: "A Jaipuri quilt is known across India for one thing: it is warm without being heavy.\n\n## What's inside\nOur cotton quilts use a pure cotton filling. Cotton breathes, so you stay comfortable through mild winters without overheating.\n\n## Why the stitching matters\nHand quilting holds the filling evenly in place, so the quilt stays soft and even for years.\n\n> Every quilt represents a woman's skill, dedication, and contribution to her family's future.",
    published: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "post_2",
    slug: "five-hundred-women-one-stitch-at-a-time",
    title: "500 women, one stitch at a time",
    excerpt: "How a small team in Rajasthan grew into a network of more than 500 women artisans.",
    cover: "/media/spread.jpg",
    body: "What began with a small team has grown into a network of over 500 rural women associated with us on a contract basis.\n\nOur women-centric model creates opportunities for women from surrounding villages to earn an income through their skills while continuing to manage their household responsibilities.\n\n## Led by Babita Gupta\nUnder the leadership of Mrs. Babita Gupta, we have built lasting relationships with women artisans, creating opportunities for meaningful work, skill development, and greater financial independence.",
    published: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "post_3",
    slug: "caring-for-your-cotton-quilt",
    title: "Caring for your cotton quilt",
    excerpt: "Simple habits that keep a handmade quilt soft for years.",
    cover: "/media/finish.jpg",
    body: "A handmade quilt rewards a little care.\n\n## Air it out\nEvery few weeks, air your quilt in the shade. Direct harsh sun can fade the colours over time.\n\n## Store it folded\nKeep it in a breathable cotton bag, never sealed plastic.",
    published: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export const seedSettings: Settings = {
  whatsapp: "919999999999",
  phone: "+91 99999 99999",
  email: "hello@gargfabrication.com",
  address: "Garg Fabrication, Jaipur, Rajasthan, India",
  deliveryText: "Delivered across India in 6–8 working days via DTDC",
  announcement: "Handmade by 500+ women artisans · Free delivery above ₹2,500 · Cash on delivery available",
  instagram: "",
  facebook: "",
  shippingFee: 99,
  freeShippingAbove: 2500,
};

export const seedOrders: Order[] = [];
export const seedInquiries: Inquiry[] = [];
