export type Category = "cotton-quilts" | "polyester-quilts" | "pillow-covers";

export const CATEGORIES: { id: Category; label: string; short: string }[] = [
  { id: "cotton-quilts", label: "Cotton Quilts", short: "Cotton" },
  { id: "polyester-quilts", label: "Polyester Quilts", short: "Polyester" },
  { id: "pillow-covers", label: "Pillow Covers", short: "Pillow Covers" },
];

export type ColorOption = { name: string; hex: string };

export type SizeOption = {
  id: string;
  label: string; // Small / Medium / Large
  dims: string; // 60 × 90 in
  bed?: string; // Single bed
  price: number; // INR
  compareAt?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  material: string;
  gsm?: number;
  colors: ColorOption[];
  sizes: SizeOption[];
  images: string[];
  care: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  color: string;
  sizeId: string;
  sizeLabel: string;
  dims: string;
  price: number;
  qty: number;
};

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
export const ORDER_STATUSES: OrderStatus[] = ["new", "confirmed", "shipped", "delivered", "cancelled"];

export type PaymentMethod = "cod" | "upi";

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    note?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: PaymentMethod;
  status: OrderStatus;
};

export type InquiryType = "bulk" | "contact";
export type InquiryStatus = "new" | "contacted" | "closed";

export type Inquiry = {
  id: string;
  type: InquiryType;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  organisation?: string;
  city?: string;
  products?: string[];
  quantity?: string;
  timeline?: string;
  message: string;
  status: InquiryStatus;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  body: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  whatsapp: string; // digits incl. country code, e.g. 919876543210
  phone: string;
  email: string;
  address: string;
  deliveryText: string;
  announcement: string;
  instagram: string;
  facebook: string;
  shippingFee: number;
  freeShippingAbove: number;
};
