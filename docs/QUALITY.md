# Quality & Operations Report (`portfolio-web` & `portfolio-api`)

## 1. Automated Test Coverage

- **Backend (`portfolio-api`)**:
  - `test/index.test.ts`: Hono middleware stack (`requestId`, `secureHeaders`, `cors`, `bodyLimit` 1 MB, `csrfMiddleware` Origin & Content-Type checks, OpenAPI + Scalar `/docs`).
  - `test/t03-db-seed.test.ts`: Drizzle schema integrity (26 tables), Web Crypto PBKDF2-SHA256 100k iterations, pagination & sort helpers.
  - `test/t04-public-api.test.ts`: Public endpoints (`/v1/site`, `/v1/projects`, `/v1/projects/{slug}`, `/v1/certifications`), bilingual localization fallback (`_id` → `_en`), private link URL redaction.
  - `test/t08-auth.test.ts`: JWT HS256 session cookies (`pf_session`), TOTP 2FA setup/enable/verify/disable (`pf_2fa`), `tokenVersion` revocation on password change & logout-all, IP rate limiting, Owner vs Editor role enforcement.
  - `test/t09-admin-crud.test.ts`: Content lifecycle state machine (`draft` ↔ `published` ↔ `archived`), `400 INVALID_STATE` on illegal transitions, editor draft-only edit rule, `confirmSlugChange`, audit logs, and revalidate webhook.
  - `test/t10-media.test.ts`: Cloudinary SHA-1 upload signature, file size & 30s video clip limits, YouTube/Vimeo/Loom URL parser, `409 CONFLICT` when deleting referenced media.
  - `test/t11-analytics-contact.test.ts`: Bot & admin-session filtering on `/v1/events`, daily rotating `visitor_hash`, idempotent `daily_stats` aggregation, contact form honeypot & Turnstile verification.
  - `test/t12-t13-documents-backup.test.ts`: Single active CV per `(type, locale)`, export preset filtering, JSON Resume `/v1/export/resume.json`, 43-char share tokens, `410 SHARE_LINK_EXPIRED`, and JSON backup export / dry-run import.

- **Frontend (`portfolio-web`)**:
  - `test/t05-foundation.test.ts`: Zero hardcoded `#hex` colors across `components/`, i18n message key parity between `en.json` and `id.json`.
  - `test/t06-t07-public-seo.test.tsx`: VideoFacade privacy-enhanced embed, ProjectCard private link badge, ExperienceTimeline, SkillsGrid.
  - `test/t08-auth-web.test.tsx`: `RoleGate` and `AdminShell` role-based navigation hiding.
  - `test/t09-admin-crud-web.test.tsx`: `DataTable` status action buttons & `BilingualField` EN/ID tab switcher.
  - `test/t10-t11-media-analytics-web.test.tsx`: `cloudinaryLoader` auto-format/quality transforms, `StatCard` & `ViewsChart`.
  - `test/t13-theme-contrast.test.ts`: Automated WCAG AA contrast ratio (≥ 4.5:1) verification across all 4 OKLCH presets (`slate`, `forest`, `sunset`, `mono`) in both light and dark modes.
  - `e2e/*.spec.ts`: Playwright E2E test suites for public pages, admin auth, media, documents, contact, roles, and accessibility.

## 2. Core Web Vitals & Lighthouse Targets

- **Performance**: ≥ 95 (ISR + tag-based revalidation, Cloudinary `f_auto,q_auto`, click-to-load `VideoEmbed` facade, zero third-party analytics scripts).
- **Accessibility**: 100 (WCAG 2.1 AA contrast verified mathematically in `test/t13-theme-contrast.test.ts`, skip-to-content link, semantic landmarks, `prefers-reduced-motion` support).
- **Best Practices**: 100 (Strict CSP, `HttpOnly; Secure; SameSite=Lax` cookies, CSRF protection).
- **SEO**: 100 (`hreflang` alternates, dynamic OpenGraph images, JSON-LD `Person` & `CreativeWork`, `/sitemap.xml`, `/robots.txt` disallowing `/admin` and `/s/`).
