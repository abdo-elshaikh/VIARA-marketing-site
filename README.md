# VIARA Healthcare Technology

Bilingual Arabic/English marketing site and authenticated content management system.

## Public experience

- The Arabic and English home routes use `app/calm-home.tsx`: a six-section
  overview with facility-guided discovery, four healthcare areas, short product
  cards, planning tools, FAQs and contact. The previous home implementation is
  retained in `app/viara-site.tsx` but is no longer the home route entrypoint.
- Archive estimation, package details and rollout planning open on demand in
  accessible native dialogs. Optional request fields are collapsed by default;
  saved scope and selected-system summaries remain visible before submission.
- The full directory initially shows six cards. Interface concepts are collapsed
  until requested; category and search links support `?area=` and `?q=` deep links.

- A bilingual healthcare directory at `/systems` and `/en/systems` covers 23
  clinical, diagnostic, operational and digital scope areas. It provides search,
  facility profiles, category filters, comparison and a six-system request brief.
  The home page includes the same explorer with a compact initial result set.
  Configured products are distinguished from areas requiring assessment; the
  directory does not represent unverified systems as shipped products.
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

## Administration

`/admin` requires platform sign-in plus an exact server-side match against the
verified owner email in the secret runtime variable `VIARA_ADMIN_EMAIL`. Missing
configuration fails closed. No admin credential is included in the client bundle.

The admin can edit bilingual content, product features, package names and pricing,
offers and expiry dates, FAQs, brand color, logo, contact information and SEO
metadata. Uploaded PNG/JPEG/WebP logos (up to 3 MB) are stored in the `BUCKET` R2
binding. Structured data is stored in D1 under `DB`.

Content uses optimistic revision checks to reject stale saves. Save & publish makes
content changes visible on subsequent page loads. Review moderation and customer
request statuses update immediately. Offers expire at the end of the specified
Africa/Cairo calendar day.

The inbox displays the latest 200 requests with search, filtering and CSV export.
The personal request pages display only records for the authenticated site user.
The site preserves its current owner-private audience.

## Verification

- `node node_modules/typescript/bin/tsc --noEmit`
- `node --experimental-strip-types --test tests/inquiry.test.mjs tests/content.test.mjs`
- `python tests/migrations_test.py`
- Build with the Sites plugin `build-site.mjs` helper.

Append migrations using Drizzle; do not modify applied migration history.

## Content

No customer reviews, business contact details, prices or special offers are
fabricated. Configure real information in the admin. Interface examples use sample
data and are marked illustrative. Forms store records; there is no automated
outbound email or WhatsApp notification integration.
