# AGENTS.md · portfolio-web

> Salin file ini ke root repo `portfolio-web` sebagai `AGENTS.md`.

## Proyek
Frontend web portofolio: situs publik dua bahasa (EN default di `/`, ID di `/id`) + admin panel di `/admin`. Next.js App Router di Vercel. Spesifikasi: `01-PROJECT-CONTEXT.md`, `03-API-CONTRACT.md`, `04-DESIGN-SYSTEM.md`.

## Perintah
- `npm run dev` — Next.js dev (port 3000)
- `npm run build` — build production
- `npm run typecheck`, `npm run lint`, `npm test` (Vitest), `npm run e2e` (Playwright)

## Struktur
```
app/
  [locale]/            # halaman publik: page, projects, projects/[slug], certifications, cv, privacy, s/[token]
  admin/               # login + (dashboard)/...
  api/revalidate/route.ts
  api/pdf/[preset]/route.ts
  sitemap.ts, robots.ts, opengraph-image.tsx, globals.css
components/
  ui/                  # shadcn/ui (jangan diedit manual kecuali perlu)
  sections/            # section beranda
  project/, media/, pdf/, admin/, layout/
lib/
  api/server.ts        # fetch dari server ke API_ORIGIN (dengan tags)
  api/client.ts        # fetch dari browser ke /api/v1 (credentials: 'include')
  events.ts            # sendBeacon helper
  theme.ts, format.ts, locale.ts
i18n/                  # konfigurasi next-intl
messages/en.json, messages/id.json
middleware.ts          # next-intl + proteksi /admin
e2e/                   # Playwright
```

## Aturan wajib
1. Server Components default. `"use client"` hanya untuk interaksi (form, toggle, chart, dnd, video).
2. Data publik: `lib/api/server.ts` dengan `next: { tags: [...] }`; jangan fetch publik dari client.
3. Browser memanggil API hanya lewat `/api/v1/*` (rewrite), tidak pernah ke domain Worker.
4. Semua teks UI dari `messages/*.json`; tidak ada string hardcode di komponen.
5. Semua warna/spacing dari token Tailwind + CSS variables; tidak ada hex di komponen.
6. Gambar lewat `next/image` (Cloudinary loader); font lewat `next/font`.
7. Halaman admin: `noindex`, dan setiap aksi menyesuaikan role (`RoleGate`).
8. Setiap komponen interaktif bisa dipakai keyboard dan punya focus ring.
9. Hormati `prefers-reduced-motion`.
10. Jangan menambah dependensi besar tanpa alasan; cek bundle (`next build` output).

## Gaya kode
TypeScript strict, komponen PascalCase dalam file kebab-case, props bertipe eksplisit, tidak ada `any`.

