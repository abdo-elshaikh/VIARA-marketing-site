# Task 2 — Fake / Placeholder Data Audit

**Date:** 2025-07-10  
**Scope:** All `.tsx` files under `app/` and `components/`; key library files in `lib/`  
**Build status after audit:** ✅ Clean (`npm run build` — 408 RSC + 1946 client modules, 0 errors)

---

## 1. What Was Found and Replaced

**No replacements were needed.** A full search across all TSX files found no instances of:

| Pattern searched | Result |
|---|---|
| `Lorem ipsum` | Not found |
| `placeholder` (user-facing text) | Not found (only CSS `placeholder:` utilities in `portal/`) |
| `TODO` / `FIXME` | Not found |
| `example.com` | Not found |
| `test@` | Not found |
| Fake phone patterns (`0500000000`, `+966 5`, `555-`) | Not found (`555` appeared only in an SVG path in `social-icons.tsx`) |
| `John Doe` | Not found |
| `محمد أحمد` | Not found |
| `مستشفى النموذجي` | Not found |

The `contact` fields in `defaultContent` (email, phone, whatsapp, address) are all empty strings `''`, which is intentional — the admin panel is where the operator fills in real contact info.

---

## 2. What Was Kept (Correct Usage)

### 2a. Input placeholders
All `placeholder=` attributes on `<input>` elements are legitimate UX hints (search fields, form fields). None were changed.

Examples:
- `care-hub.tsx`: `placeholder={t('هل تبحث عن نظام محدد؟ ابحث بالاسم أو الاختصار…','Looking for a specific system? Search its name or code…')}`
- `lead-form.tsx`: various form field placeholders

### 2b. UI demo / showcase sample data (labeled appropriately)
Several components render illustrative UI panels with sample patient IDs and names. All are properly disclosed:

| File | Sample data | Disclosure label |
|---|---|---|
| `viara-site.tsx` | Worklist rows: "أحمد م. ع", "سارة ك. ح", "خالد ع. س", "مريم ح. ن" + IDs like VR-9021 | `<span class="modality-badge">{t('بيانات تجريبية', 'SAMPLE DATA')}</span>` shown on every panel |
| `viara-site.tsx` | PACS viewer, CMS flow panels | Same `SAMPLE DATA` badge |
| `healthcare-explorer.tsx` | LIS terminal: BARCODE #984210/1, "محمد عبد الله", "هدى فاروق" | Wrapped in `<details class="hc-demo-disclosure">` with disclaimer: *"نماذج توضيحية ببيانات تجريبية؛ لا تمثل اتصالًا فعليًا أو نتائج مرضى."* |
| `viara-site.tsx` (Terms modal) | References to illustrative interfaces | Explicit terms text: *"الواجهات المعروضة توضيحية"* |

These are intentional UI mockups inside collapsible or clearly labeled demo zones. They should not be changed.

### 2c. `.env` / `.env.example` files
Not applicable — no fake credentials found in any env files.

### 2d. `vite.config.ts` placeholder
`SITE_CREATOR_PLACEHOLDER_DATABASE_ID = "00000000-0000-4000-8000-000000000000"` is a build-time placeholder for local Miniflare D1, not user-facing content. Kept as-is.

---

## 3. customer-reviews.tsx Architecture

**Finding:** `customer-reviews.tsx` accepts reviews as a prop (`reviews: PublicReview[]`) from its parent. The parent is `care-home.tsx`, which receives them as `reviews?: PublicReview[]` and passes them straight through.

**No hardcoded reviews were found.** The component returns `null` when `reviews.length === 0`. Reviews come from the database via `/api/reviews` and are passed through the server component chain.

**Architecture is correct** — no changes needed.

---

## 4. care-home.tsx — Stats Section Audit

The stats section uses `statsData`, a dynamically computed array — not hardcoded marketing claims:

```ts
const statsData = [
  { number: String(allowed.length),              label: t('مجالاً في دليل الأنظمة', …) },
  { number: String(healthcareCategories.length), label: t('مسارات للرعاية والتشغيل', …) },
  { number: String(facilityProfiles.length),     label: t('أنواع منشآت للاستكشاف', …) },
  { number: '2',                                 label: t('لغتان لتجربة أقرب لفريقك', …) },
];
```

`allowed.length` = count of enabled systems from the database-backed `careCatalog()` call.  
`healthcareCategories.length` = 4 (from catalog).  
`facilityProfiles.length` = 5 (from catalog).  
`'2'` = hardcoded language count — this is accurate (Arabic + English) and is a factual constant.

**No fake stats.** No action required.

---

## 5. Hardcoded Marketing Claims to Review (modern-home.tsx)

`modern-home.tsx` contains a **metrics strip** with four hardcoded numbers presented as factual business claims. These have **no sample-data disclaimer** and appear as credibility signals to the user:

```tsx
// app/modern-home.tsx — lines ~463-479
<div className="vx-metrics-strip">
  <div className="metric-box">
    <strong>99.98%</strong>
    <span>{t('نسبة الجاهزية السحابية المعتمدة', 'Certified Cloud Availability')}</span>
  </div>
  <div className="metric-box">
    <strong>100+</strong>
    <span>{t('تكامل مباشر مع أجهزة الأشعة والتحاليل', 'Direct Modality & Analyzer Interfaces')}</span>
  </div>
  <div className="metric-box">
    <strong>4.8M+</strong>
    <span>{t('دراسة وفحص طبي مؤرشف وموثق', 'Archived Diagnostic Studies')}</span>
  </div>
  <div className="metric-box">
    <strong>98.6%</strong>
    <span>{t('نسبة قبول المطالبات الأولية (Clean Claims)', 'First-Pass Clean Claim Rate')}
    </span>
  </div>
</div>
```

Also in the same file, a HUD overlay panel shows:
```tsx
<strong>94.2% · 320 Beds</strong>   // "Live Inpatient Occupancy"
<strong>184 Studies (0 Denials)</strong>
<strong>18ms (Real-time)</strong>    // "FHIR API Response Time"
```

**These numbers are not labeled as sample data and are not computed from real data sources.**

### Recommendation
These are marketing claims that should either:
- Be **verified** and sourced (SLA documentation, actual system stats), or
- Be **moved to `site-content.ts`** so the admin can control them, or
- Have a disclaimer added similar to the `SAMPLE DATA` badge pattern used elsewhere

**This task did not change them** — changing marketing claim values is a product decision. The numbers are documented here for the product owner's review.

---

## 6. Issues Encountered

None. Build was clean before and after the audit. No files were modified (no fake data warranted replacement).

---

## 7. Files Audited

| File | Fake data found? | Action |
|---|---|---|
| `app/care-home.tsx` | No | No change |
| `app/customer-reviews.tsx` | No | No change (prop-based, DB-driven) |
| `app/viara-site.tsx` | Sample data properly labeled | No change |
| `app/healthcare-explorer.tsx` | Sample data properly labeled | No change |
| `app/modern-home.tsx` | Hardcoded marketing metrics (undisclaimed) | Documented — product decision needed |
| `app/calm-home.tsx` | No | No change |
| `app/journeys-view.tsx` | No | No change |
| `app/care-hub.tsx` | No | No change |
| `app/lead-form.tsx` | No | No change |
| `app/admin/admin-client.tsx` | No | No change |
| `lib/site-content.ts` | No (contact fields intentionally empty) | No change |
| `lib/company-content.ts` | No (drafts disabled by default) | No change |
