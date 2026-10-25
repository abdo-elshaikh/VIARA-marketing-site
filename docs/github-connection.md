# Standalone & Production Architecture

The VIARA marketing site source is located in `d:/VIARA/marketing-site`. It is completely decoupled from ChatGPT and operates as an independent, production-grade Next.js / Vinext web application.

- Primary Site Domain: `https://viara.health`
- Technology Stack: Next.js (App Router), React 19, TypeScript, Drizzle ORM, Cloudflare D1 (`DB`) and R2 (`BUCKET`).

## Authentication & Security Model

The website features a dual-tier standalone security architecture:

1. **Public Visitor / Lead Flow (Zero Barriers):**
   - Public visitors (hospital directors, radiologists, clinic managers) can submit inquiries directly without registration or external authentication.
   - Submissions are tracked per-client using an HMAC-signed `viara_uid` session cookie (`lib/guest-identity.ts`). Unsigned legacy cookies are only honored when no signing secret is configured (local development); deployments with secrets set require a valid signature.
   - Visitors can visit `/requests` (Arabic) or `/en/requests` (English) to review their active inquiries, download request summaries, or remove requests.
   - Automated spam protection is enforced via Honeypot detection and hourly rate limiting (10 requests/hour per email).

2. **Administrative Control Center (`/admin`):**
   - Protected by a standalone, token-based session cookie (`viara_admin_session`) signed with the admin secret; sessions expire after 7 days and future-dated tokens are rejected.
   - Admins log in via a dedicated, branded login portal at `/admin` with per-identifier rate limiting (5 attempts / 15 minutes).
   - Credentials are **required** environment variables — the deployment fails closed (HTTP 503 on login) when they are missing:
     - `VIARA_ADMIN_EMAIL`: Verified owner email. No default.
     - `VIARA_ADMIN_PASSWORD` (or `VIARA_ADMIN_KEY`): Admin password, minimum 8 characters. No default is embedded in the source.
     - `VIARA_SESSION_SECRET` (optional): Separate secret for signing guest cookies; falls back to the admin password when unset.
   - The admin panel allows managing marketing copy, revising pricing packages, reviewing leads, and approving customer reviews.

Additional protections applied in `middleware.ts`: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and HSTS on HTTPS. State-changing API routes verify `Origin`/`Referer` and fail closed.

## Environment Variables

Configure the following secrets in your hosting environment (`.env` or deployment secrets):

```env
VIARA_ADMIN_EMAIL=owner@example.com
VIARA_ADMIN_PASSWORD=your_secure_password_here
VIARA_SESSION_SECRET=your_cookie_signing_secret
NEXT_PUBLIC_SITE_URL=https://viara.health
```

## Running & Building

- Local development server: `npm run dev`
- Production build: `npm run build`
- Type checking: `npm run typecheck`
- Automated test suites: `npm test`
