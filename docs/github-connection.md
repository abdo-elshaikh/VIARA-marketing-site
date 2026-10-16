# Standalone & Production Architecture

The VIARA marketing site source is located in `d:/VIARA/marketing-site`. It is completely decoupled from ChatGPT and operates as an independent, production-grade Next.js / Vinext web application.

- Primary Site Domain: `https://viara.health`
- Technology Stack: Next.js (App Router), React 19, TypeScript, Drizzle ORM, Cloudflare D1 (`DB`) and R2 (`BUCKET`).

## Authentication & Security Model

The website features a dual-tier standalone security architecture:

1. **Public Visitor / Lead Flow (Zero Barriers):**
   - Public visitors (hospital directors, radiologists, clinic managers) can submit inquiries directly without registration or external authentication.
   - Submissions are tracked per-client using a signed `viara_uid` session cookie.
   - Visitors can visit `/requests` (Arabic) or `/en/requests` (English) to review their active inquiries, download request summaries, or remove requests.
   - Automated spam protection is enforced via Honeypot detection and hourly rate limiting (10 requests/hour per email).

2. **Administrative Control Center (`/admin`):**
   - Protected by a standalone, token-based session cookie (`viara_admin_session`).
   - Admins log in via a dedicated, branded login portal at `/admin`.
   - Credentials configured via environment variables:
     - `VIARA_ADMIN_EMAIL`: Configured admin email (default: `admin@viara.health`).
     - `VIARA_ADMIN_PASSWORD`: Configured admin password or key.
   - The admin panel allows managing marketing copy, revising pricing packages, reviewing leads, and approving customer reviews.

## Environment Variables

Configure the following secrets in your hosting environment (`.env` or deployment secrets):

```env
VIARA_ADMIN_EMAIL=admin@viara.health
VIARA_ADMIN_PASSWORD=your_secure_password_here
NEXT_PUBLIC_SITE_URL=https://viara.health
```

## Running & Building

- Local development server: `npm run dev`
- Production build: `npm run build`
- Type checking: `npm run typecheck`
- Automated test suites: `npm test`
