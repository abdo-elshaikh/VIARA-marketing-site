# Administrative API Endpoints

## Overview
Protected administrative API handlers under `/api/admin` for the VIARA marketing site. Provides endpoints for administrative authentication, optimistic concurrency CMS content publishing with revision archiving, inquiry status updates, direct image uploads with binary magic-byte inspection to Cloudflare R2, and customer review moderation.

## Interface
- `[content/route.ts:GET /api/admin/content]` - Retrieves current CMS content with optimistic version header
- `[content/route.ts:PUT /api/admin/content]` - Publishes updated CMS content, creates historical revision, and invalidates cache
- `[inquiries/route.ts:GET /api/admin/inquiries]` - Lists inquiries with search and status filtering
- `[inquiries/route.ts:PATCH /api/admin/inquiries]` - Updates inquiry status with audit logging
- `[login/route.ts:POST /api/admin/login]` - Verifies credentials, enforces brute-force rate limits, and issues session cookie
- `[logout/route.ts:POST /api/admin/logout]` - Clears administrative session cookie
- `[logout/route.ts:GET /api/admin/logout]` - Clears session and redirects to `/admin`
- `[media/route.ts:POST /api/admin/media]` - Inspects binary magic bytes and uploads PNG/JPEG/WebP assets to Cloudflare R2
- `[reviews/route.ts:GET /api/admin/reviews]` - Lists all reviews for administrative moderation
- `[reviews/route.ts:POST /api/admin/reviews]` - Inserts an administrator-created approved review
- `[reviews/route.ts:PATCH /api/admin/reviews]` - Updates review status (approved, rejected, pending)
- `[reviews/route.ts:DELETE /api/admin/reviews]` - Deletes review record from database
- `[revisions/route.ts:GET /api/admin/revisions]` - Lists historical content revisions
- `[revisions/route.ts:POST /api/admin/revisions]` - Restores selected historical content revision with concurrency check

## Invariants
- `[content/route.ts:GET]` Requires authenticated admin session via getAdmin(); returns 403 if unauthorized, with Cache-Control: private, no-store
- `[content/route.ts:PUT]` Requires authenticated admin session and sameOrigin(request) check (status 403)
- `[content/route.ts:PUT]` Enforces optimistic concurrency control: updates require matching existing version; returns HTTP 409 Conflict if outdated
- `[content/route.ts:PUT]` Rejects request bodies larger than 2,000,000 bytes with HTTP 413
- `[login/route.ts:POST]` Enforces IP rate limiting (max 20 attempts/15 min) and IP+email rate limiting (max 5 attempts/15 min) (status 429)
- `[login/route.ts:POST]` Requires server configuration of VIARA_ADMIN_EMAIL and VIARA_ADMIN_PASSWORD/KEY (status 503 if unconfigured)
- `[media/route.ts:POST]` Enforces file size <= 3 MB (MAX_UPLOAD_BYTES) and strictly validates binary magic bytes for PNG, JPEG, or WebP (status 400)
- `[media/route.ts:POST]` Requires env.BUCKET Cloudflare R2 binding to be accessible (status 503 if unavailable)

## Side Effects
- `[content/route.ts:PUT]` Writes site settings to database siteSettings table, archives revision, and invalidates cache
- `[login/route.ts:POST]` Records failed attempts in in-memory Maps and sets HTTP-only, secure, SameSite=lax viara_admin_session cookie (7-day maxAge)
- `[logout/route.ts:POST]` Clears viara_admin_session cookie (maxAge: 0)
- `[media/route.ts:POST]` Uploads file buffer to Cloudflare R2 bucket at media/${key}
- `[reviews/route.ts:PATCH]` Updates review status in database
- `[revisions/route.ts:POST]` Restores revision in siteSettings and records restoration in siteRevisions

## Verification
- Run: `npm test`
