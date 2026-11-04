# portfolio-web

Frontend web portofolio dua bahasa (English & Bahasa Indonesia) + Admin Panel, dibangun dengan **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS v4**, dan **shadcn/ui**.

## Prasyarat
- Node.js 22 LTS
- npm

## Setup Lokal

1. Install dependensi:
   ```bash
   npm install
   ```

2. Salin `.env.example` ke `.env.local` dan sesuaikan nilainya:
   ```bash
   cp .env.example .env.local
   ```

3. Jalankan server development (port 3000):
   ```bash
   npm run dev
   ```

## Perintah

| Perintah | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan Next.js dev server di port 3000 |
| `npm run build` | Build aplikasi untuk production |
| `npm start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Memeriksa tipe TypeScript (`tsc --noEmit`) |
| `npm run format` | Memformat kode dengan Prettier + Tailwind plugin |
| `npm test` | Menjalankan unit test dengan Vitest |
| `npm run e2e` | Menjalankan end-to-end test dengan Playwright |

## Variabel Environment (`.env.local`)

| Nama | Deskripsi |
| --- | --- |
| `API_ORIGIN` | Origin URL Cloudflare Worker API (misal `http://localhost:8787`) |
| `NEXT_PUBLIC_SITE_URL` | URL publik situs frontend (misal `http://localhost:3000`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key publik Cloudflare Turnstile |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name Cloudinary untuk loader gambar |
| `REVALIDATE_SECRET` | Secret untuk endpoint on-demand revalidation `/api/revalidate` |
| `SENTRY_DSN` | DSN Sentry untuk error monitoring |
| `DRAFT_MODE_SECRET` | Secret untuk mengaktifkan preview draft mode |

