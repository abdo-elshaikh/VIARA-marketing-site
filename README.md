# VIARA Healthcare Technology

**Bilingual Arabic/English marketing site with comprehensive content management.**

🌐 **23 healthcare systems** | 🔒 **Secure admin** | 🌍 **AR + EN** | ⚡ **Cloudflare Edge**

---

## Quick Links

- 📋 [**Project Status Report**](PROJECT_STATUS.md) - Current state and readiness
- 🚀 [**Deployment Guide**](docs/DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- ✅ [**Pre-Launch Checklist**](docs/PRE_LAUNCH_CHECKLIST.md) - 100+ verification items
- 📝 [**Content Guidelines**](docs/CONTENT_GUIDELINES.md) - Content standards
- 🎯 [**Improvement Tasks**](docs/IMPROVEMENT_TASKS.md) - Prioritized roadmap

---

## Public experience

- Arabic and English home routes use `app/care-home.tsx` and the shared
  `CareFrame`: a regional visual identity, facility-guided system suggestions,
  four healthcare domains, rollout overview, FAQs and contact.
- `/systems` and `/en/systems` cover 23 clinical, diagnostic, operational and
  digital care scope areas, with search, category filters, facility presets,
  detailed system pages and a six-system request brief.
- `/journeys` and `/en/journeys` connect five stages of the patient journey to
  the systems and teams involved. Visitors can combine up to six systems across
  stages and carry the selection into the contact form.
- `/planning` presents package scopes, implementation phases and an archive
  capacity estimator. `/about` explains design and delivery principles.
- Directory areas include expansion needs requiring assessment. Availability,
  integrations, local requirements, timelines and SLAs need a technical proposal.
- See [the regional experience update](docs/regional-experience-2026-10-17.md)
  for design changes and verification evidence.
- Selected system IDs are validated server-side and included in the saved request
  message and downloadable receipt. Hospital, laboratory and other healthcare
  facility types are supported without changing existing request records.

- Detailed solution pages at `/solutions/ris`, `/solutions/pacs`, and
  `/solutions/medical-centers`, with equivalent `/en/solutions/...` routes.
  Pages use the enabled products and translated content from the admin settings;
  disabled and unknown products return 404. Proposal links preselect the product.
- `/sitemap.xml` lists enabled public solution pages and both language variants.
  `/robots.txt` excludes administrative, API and personal request paths.
  Set `NEXT_PUBLIC_SITE_URL` to the production origin before release; the existing
  fallback is `https://viara.health`.
- Organization, software and breadcrumb structured data uses published content;
  no customer ratings or prices are invented. Social cards use a local asset.
- The built-in brand symbol has a 4.9 kB WebP display asset; customized logos are
  preserved. Administration CSS is loaded by the admin route.

- Arabic `/` and English `/en`, including translated forms, FAQs and request pages.
- Systems, configurable packages, active offers, a solution finder and a workflow tour.
- Scroll reveals, floating accents, interactive demo chart and reduced-motion support.
- Approved customer reviews, with consent and moderation for new submissions.
- Contact channels, social links and WhatsApp rendered only when configured.
- D1-backed inquiries, request status tracking, per-user downloads and deletion.
- Guest request history is tied to an HMAC-signed browser cookie; first-time
  English-preferring browsers are offered the `/en` home once via Accept-Language.

## Administration

`/admin` requires an exact server-side match against the verified owner email in the
secret runtime variable `VIARA_ADMIN_EMAIL`, with the password from
`VIARA_ADMIN_PASSWORD` (or `VIARA_ADMIN_KEY`). Both variables are required:
missing configuration fails closed with HTTP 503, and no default credential
exists anywhere in the source. Login attempts are rate limited (5 per 15 minutes
per email/IP), and session cookies are HMAC-signed with a 7-day expiry. No admin
credential is included in the client bundle.

The admin can edit bilingual content, product features, package names and pricing,
offers and expiry dates, FAQs, brand color, logo, contact information and SEO
metadata. Uploaded PNG/JPEG/WebP logos (up to 3 MB) are stored in the `BUCKET` R2
binding. Structured data is stored in D1 under `DB`.

Content uses optimistic revision checks to reject stale saves. Save & publish makes
content changes visible on subsequent page loads. The last 20 published content
versions are archived in `site_revisions` and can be restored from the admin
overview; restoring publishes the chosen version as a new version without
erasing history. Review moderation and customer
request statuses update immediately. Offers expire at the end of the specified
Africa/Cairo calendar day.

The inbox displays the latest 200 requests with search, filtering and CSV export.
The personal request pages display only records for the authenticated site user.
The site preserves its current owner-private audience.

## Development

### Prerequisites
- Node.js 22.13.0+
- pnpm 11.25.0 (auto-installed via `npm run install:ci`)

### Setup
```bash
# Install dependencies
npm run install:ci
pnpm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
# Site runs at http://localhost:5173
```

### Testing & Verification

```bash
# TypeScript check
npm run typecheck

# Run all tests (15 unit tests)
npm test

# Specific test files
node --experimental-strip-types --test tests/inquiry.test.mjs
node --experimental-strip-types --test tests/content.test.mjs
python tests/migrations_test.py

# Build production
npm run build
```

### Project Structure
```
marketing-site/
├── app/              # Next.js pages and components
├── lib/              # Business logic and utilities
├── database/         # Schema and migrations
├── tests/            # Test suites
├── docs/             # 📚 Comprehensive documentation
├── public/assets/    # Static assets (images, icons)
└── scripts/          # Build and utility scripts
```

Security headers (CSP, frame-ancestors, HSTS, nosniff, Referrer-Policy) are
applied in `middleware.ts`. Public content reads use a 30-second in-isolate
cache that is invalidated on every admin publish.

Append migrations using Drizzle; do not modify applied migration history.

## Content

No customer reviews, business contact details, prices or special offers are
fabricated. Configure real information in the admin. Interface examples use sample
data and are marked illustrative. Forms store records; there is no automated
outbound email or WhatsApp notification integration.

---

## 📚 Documentation

This project includes comprehensive documentation:

### For Developers
- **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
  - Environment setup
  - Database migrations
  - Production deployment (Cloudflare Pages)
  - Troubleshooting guide

### For Content Managers
- **[CONTENT_GUIDELINES.md](docs/CONTENT_GUIDELINES.md)** - Content standards
  - Technical claims documentation
  - DICOM/HL7/FHIR specifications
  - Testimonial requirements
  - Bilingual consistency rules

### For Project Management
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current project state
  - Technical architecture overview
  - Test coverage summary
  - Deployment readiness assessment
  - Risk analysis

- **[PRE_LAUNCH_CHECKLIST.md](docs/PRE_LAUNCH_CHECKLIST.md)** - Launch verification
  - 100+ checklist items
  - Technical requirements
  - Content requirements
  - Sign-off procedures

- **[IMPROVEMENT_TASKS.md](docs/IMPROVEMENT_TASKS.md)** - Prioritized roadmap
  - Critical tasks (image optimization, env config)
  - High priority (performance, accessibility)
  - Future enhancements (analytics, SEO, videos)

### Historical Documentation
- **[REVIEW-AND-DEVELOPMENT-PLAN.ar.md](REVIEW-AND-DEVELOPMENT-PLAN.ar.md)** - Development history in Arabic
- **[regional-experience-2026-10-17.md](docs/regional-experience-2026-10-17.md)** - Design update details

---

## 🎯 Current Status

**Version**: 1.0 Pre-Launch  
**Completion**: 85%  
**Tests**: ✅ 15/15 passing  
**TypeScript**: ✅ Zero errors  
**Deployment**: ⏳ Pending optimization

### Ready ✅
- Core functionality complete
- Bilingual support (AR/EN)
- Secure admin authentication
- 23 healthcare systems catalog
- Patient journey mapping
- Demo request system
- Comprehensive testing

### Needs Completion ⚠️
1. **Image Optimization** (Critical)
   - 18 images >500KB (16.81 MB total)
   - Target: 4-5 MB after WebP conversion
   - Tool: `scripts/optimize-images.mjs`

2. **Production Configuration** (Critical)
   - Set environment variables
   - Configure Cloudflare D1 and R2
   - Add real company data

3. **Performance Testing** (High Priority)
   - Lighthouse audits
   - Core Web Vitals measurement
   - Cross-browser testing

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed status report.

---
