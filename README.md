# VIARA Healthcare Technology Blueprint

**Bilingual Arabic/English marketing site with comprehensive content management and Cloudflare edge architecture.**

🌐 **24 healthcare systems** | 🔒 **Secure admin** | 🌍 **AR + EN** | ⚡ **Cloudflare Edge**

---

## Quick Links

- 📋 [**Project Status Report**](PROJECT_STATUS.md) - Current state and readiness
- 🚀 [**Deployment Guide**](docs/DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- ✅ [**Pre-Launch Checklist**](docs/PRE_LAUNCH_CHECKLIST.md) - 100+ verification items
- 📝 [**Content Guidelines**](docs/CONTENT_GUIDELINES.md) - Content standards
- 🎯 [**Improvement Tasks**](docs/IMPROVEMENT_TASKS.md) - Prioritized roadmap

---

## System Overview

VIARA Healthcare Technology is a full-stack, edge-rendered marketing, content management, and clinical showcase platform. Built on the Next.js App Router (via the Vinext compiler on Cloudflare Workers/Pages), it integrates with Cloudflare D1 (SQLite) using Drizzle ORM and Cloudflare R2 bucket storage for media assets.

The platform provides an authentic bilingual experience (Arabic first with English mirroring), an interactive DICOM archive capacity estimator, 24 clinical and operational system specifications, facility-guided system presets, diagnostic hardware workstation showcases with live software captures, HMAC-secured guest request tracking, and an authenticated administrative workspace for zero-downtime CMS content publishing.

## Local Interface & Invariants

### Direct Root Files
- `[middleware.ts:middleware]` - Edge routing middleware for locale negotiation and security headers
- `[drizzle.config.ts:default]` - Drizzle Kit configuration targeting Cloudflare D1 SQLite dialect
- `[package.json:scripts]` - Standard build, test, and verification runner targets

### Root Invariants & Safeguards
- `[middleware.ts:locale]` Injects `x-viara-locale` header (`en` for `/en/*` paths, otherwise defaults to `ar`); redirects first-time English-preferring visitors to `/en` and persists preference via `viara_locale` cookie (30-day maxAge)
- `[middleware.ts:securityHeaders]` Injects strict HTTP security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and strict `Content-Security-Policy`
- `[middleware.ts:exclusion]` Excludes static assets, public media, API routes (`/api/*`), and internal compiler paths (`_next/*`) from locale redirection

## Subdirectories & System Boundaries

- **[Application Presentation Layer (app)](./app/README.md)**: Next.js App Router root layout, Arabic/English home routes, clinical workstation showcases, lead requisition forms, capacity estimators, customer reviews, and route subdirectories.
- **[Core Domain & Infrastructure Library (lib)](./lib/README.md)**: Domain business logic, Zod validation schemas, catalog definitions for 24 healthcare systems, Cloudflare D1/R2 integration, in-isolate caching, HMAC guest cookies, and administrative authentication.
- **[Database Layer (db)](./db/README.md)**: Drizzle ORM schema definitions and D1 client factory (`getDb`) managing `inquiries`, `site_settings`, `site_revisions`, and `reviews` tables.
- **[Database Migrations (drizzle)](./drizzle/README.md)**: Sequential SQLite schema migration files and journal metadata for Cloudflare D1 database evolution.
- **[Build & Environment Scripts (scripts)](./scripts/README.md)**: Tooling for Miniflare/Wrangler runtime environment setup, CI dependency installation, preview database seeding, and connector preview bridges.

## Global Invariants

- **Multi-Tenant System Isolation**: Visible software systems in public directories and proposal forms are strictly bounded to verified active IDs in `marketingSystemIds` (max 6 selectable systems per inquiry).
- **Optimistic Concurrency Control**: All administrative CMS content updates (`PUT /api/admin/content`) require matching version numbers, preventing concurrent write overwrites and automatically archiving prior states to `site_revisions`.
- **Cryptographic Session Security**: Administrative access requires exact matches against `VIARA_ADMIN_EMAIL` and constant-time HMAC-SHA256 signature verification over `viara_admin_session` cookies; unauthenticated requests fail closed.
- **Strict Memory & Payload Limits**: Incoming API request bodies are bounded (2 MB for CMS content, 3 MB for R2 binary uploads with magic-byte validation, 16 KB for inquiries, 4 KB for analytics) via `readLimitedJson`.
- **RTL & Typographic Discipline**: Arabic layouts default to `dir="rtl"` with Tajawal font; English layouts default to `dir="ltr"` with Manrope font; line heights and touch targets adhere to medical readability floors.

## Global Side Effects

- **Cloudflare D1 SQLite Database**: Persists consultation inquiries, key-value CMS content versions, historical revisions archive, and moderated client reviews.
- **Cloudflare R2 Object Storage**: Stores uploaded branding logos and media assets under `media/${key}` with immutable caching.
- **Webhooks & Telemetry**: Emits asynchronous POST notifications to `SALES_WEBHOOK_URL` upon new inquiries and `ANALYTICS_WEBHOOK_URL` for conversion tracking.
- **Client Storage**: Uses `sessionStorage` for temporary consultation proposal drafts and capacity calculator inputs; uses HMAC-signed cookies (`viara_guest_id`, `viara_admin_session`, `viara_locale`) for session state.

## System Verification

- Run: `npm test`
- Build Verification: `npm run build`
- Type Check: `npm run typecheck`
