# Garg Fabrication: website + admin

Next.js 16 (App Router, Cache Components) · Tailwind 4 · Motion · Lenis.

## Run

```bash
npm install
npm run dev -- -p 3100     # http://localhost:3100
```

Admin: `/admin` · password from `ADMIN_PASSWORD` in `.env.local` (default `garg@2026`).

## Where things live

| What | Where |
|---|---|
| Design tokens (colours, type scale, stitch motif) | `src/app/globals.css` |
| Home page sections, in story order | `src/app/(site)/page.tsx` → `src/components/home/*` |
| Videos + posters (web-encoded from `source-docs/videos`) | `public/media/` |
| Data (products, orders, enquiries, journal, settings) | `data/*.json` (auto-created from `src/lib/seed.ts`, git-ignored) |
| Admin uploads | `data/uploads/`, served at `/uploads/*` |
| Public server actions (checkout, enquiries → WhatsApp) | `src/app/actions.ts` |
| Admin server actions | `src/app/admin/actions.ts` |

## Before launch

- Set real **prices** and the **WhatsApp number** in `/admin` (both are placeholders).
- Set a long random `SESSION_SECRET` and a new `ADMIN_PASSWORD`.
- The JSON file store suits one small server (VPS). For serverless hosting, swap `src/lib/db.ts` for a database.
- Add AI story images: drop files in `public/media/ai/` and swap a chapter's `media` in `src/components/home/Journey.tsx`.
