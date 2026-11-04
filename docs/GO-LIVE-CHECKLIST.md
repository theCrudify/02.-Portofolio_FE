# Production Go-Live Checklist (T15)

## 1. Database (Neon PostgreSQL)
- [ ] Create production project in Neon (`ap-southeast-1` Singapore).
- [ ] Copy pooled & direct connection string into `DATABASE_URL`.
- [ ] Run migrations: `npm run db:migrate` in `portfolio-api`.
- [ ] Run initial seed with strong owner password:
  ```bash
  DATABASE_URL="..." OWNER_EMAIL="..." OWNER_PASSWORD="..." npm run db:seed
  ```

## 2. Backend (`portfolio-api` on Cloudflare Workers)
- [ ] Set production secrets via `wrangler secret put`:
  - `DATABASE_URL`
  - `JWT_SECRET` (`openssl rand -base64 48`)
  - `HASH_SALT` (`openssl rand -base64 32`)
  - `FRONTEND_URL` (`https://<your-domain>`)
  - `REVALIDATE_SECRET` (`openssl rand -hex 32`)
  - `TURNSTILE_SECRET`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `RESEND_API_KEY`, `CONTACT_TO_EMAIL`
  - `SENTRY_DSN` (optional)
  - `GITHUB_TOKEN`, `GITHUB_USERNAME` (optional)
- [ ] Deploy Worker: `npm run deploy` (or push to `main` via `.github/workflows/deploy.yml`).
- [ ] Verify `GET https://api.<your-domain>/health` returns `200 OK` with `"db": "up"`.
- [ ] Verify Cron Trigger `10 0 * * *` is active in Cloudflare dashboard.

## 3. Frontend (`portfolio-web` on Vercel)
- [ ] Import `portfolio-web` in Vercel (`sin1` Singapore region).
- [ ] Set environment variables in Vercel:
  - `NEXT_PUBLIC_SITE_URL=https://<your-domain>`
  - `NEXT_PUBLIC_API_URL=https://api.<your-domain>`
  - `REVALIDATE_SECRET=<matching-secret>`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<turnstile-site-key>`
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>`
- [ ] Configure custom domain & DNS records in Cloudflare.

## 4. First-Day Post-Deploy Security & Content Steps
- [ ] Log in to `https://<your-domain>/admin/login` as Owner.
- [ ] Immediately enable **2FA TOTP** in `/admin/settings` → **Security & 2FA**.
- [ ] Complete bilingual Profile (`/admin/profile`), Global SEO (`/admin/seo`), and Appearance (`/admin/appearance`).
- [ ] Upload active CV PDFs (EN & ID) in `/admin/documents`.
- [ ] Publish initial projects and verify `/sitemap.xml`, OpenGraph preview, and contact form delivery.
- [ ] Configure Cloudflare Uptime / Better Stack monitor on `/health` and `/en`.
