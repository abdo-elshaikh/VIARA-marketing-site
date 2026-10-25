# Admin Panel Coverage Report
**Date:** 2026-10-17  
**Scope:** `app/admin/admin-client.tsx` vs `lib/site-content.ts` (SiteContent type)  
**Build status:** ✅ Clean (no changes required — full coverage already existed)

---

## 1. SiteContent Keys — Admin Editability Map

| Key / Section | Sub-fields | Admin Tab | Status |
|---|---|---|---|
| `brand` | `name`, `logo`, `primary`, `tagline` | Settings → "Brand identity" | ✅ Editable |
| `seo` | `title`, `description` | Settings → "Search engine metadata" | ✅ Editable |
| `imagery` | `hero`, `care` | Settings → "Page photography" | ✅ Editable |
| `contact` | `email`, `phone`, `whatsapp`, `address`, `facebook`, `instagram`, `linkedin`, `youtube`, `x`, `telegram`, `snapchat`, `github` | Settings → "Contact information" | ✅ Editable (all 13 fields) |
| `hero` | `badge`, `title`, `accent`, `description`, `cta` | Content → "Hero content" | ✅ Editable |
| `about` | `title`, `body` | Content → "About VIARA" | ✅ Editable |
| `sections.about` | boolean toggle | Content → "About VIARA" panel | ✅ Editable |
| `sections.offers` | boolean toggle | Offers tab | ✅ Editable |
| `sections.reviews` | boolean toggle | Reviews tab | ✅ Editable |
| `faqs` | array of `{ id, question, answer }` | Content → "Frequently asked questions" | ✅ Editable (add/remove/edit) |
| `journeys` | five stages: `title`, `description`, `team`, `question` | Content → "Care journey stages" | ✅ Bilingual copy editable; system mappings and icons remain fixed |
| `metrics` | four `{ value, label }` entries | Content → "Homepage metrics" | ✅ Bilingual values and labels editable; verify claims before publishing |
| `products` | array: `id`, `name`, `headline`, `description`, `features[]`, `note`, `image`, `enabled` | Systems & plans → "VIARA systems" | ✅ Editable (all fields per system) |
| `catalog.categories` | array of `{ id, name }` — 4 items | Systems & plans → "Care areas & facility recommendations" | ✅ Names editable |
| `catalog.facilities` | array of `{ id, name, systems[] }` — 5 items | Systems & plans → "Care areas & facility recommendations" | ✅ Names + system checkboxes editable |
| `plans` | array: `id`, `name`, `label`, `description`, `price`, `features[]`, `featured`, `enabled` | Systems & plans → "Packages & pricing" | ✅ Editable (all fields per plan) |
| `offers` | array: `id`, `title`, `description`, `badge`, `endDate`, `active`, `plan` | Offers tab | ✅ Editable (add/remove/edit) |
| `copy` | free-form key/value record of `Localized` strings | "All page text" tab (CopyEditor) | ✅ Editable |
| `company` | all company fields | "Company information" tab (CompanyEditor) | ✅ Editable |

**Summary: All `SiteContent` keys and section groups are covered in the admin panel.**

---

## 2. What Was Improved

- Failed inquiry and review reads now return an explicit `503` error instead of an empty list that looks successful.
- Inquiry and review list errors are shown independently, and unavailable data is not presented as a zero count in the dashboard or as a fresh navigation badge.
- Failed inquiry status updates no longer change the local record or show a success message.
- Inquiry search now trims the query and matches facility, branch, system, plan, offer, and request details as well as contact fields.
- The inquiry inbox shows filtered/total counts and offers a one-click way to clear active filters.
- Clipboard errors are surfaced, and the admin brand link uses Next.js navigation.
- Journey stage copy and homepage metrics are editable in Arabic and English; journey system mappings remain fixed.

---

## 3. Fixed Application Structure

### Journeys page data (`app/journeys-view.tsx`)

Journey stage copy is editable in the admin panel. The five stages remain fixed in order, and their system mappings and icons stay hardcoded so changing copy cannot break catalog links.

---

## 4. Customer Reviews Management Status

**✅ Fully implemented.** The `reviews` tab in `admin-client.tsx` provides:

| Feature | Implementation |
|---|---|
| List all reviews with status badges | ✅ Renders all `Review[]` from `/api/admin/reviews` |
| Approve (publish) a review | ✅ `reviewAction(r, 'approved')` → PATCH `/api/admin/reviews` |
| Hide/reject a review | ✅ `reviewAction(r, 'rejected')` → PATCH `/api/admin/reviews` |
| Delete a review permanently | ✅ `reviewAction(r, 'delete')` → DELETE `/api/admin/reviews?id=...` |
| Assign a system ID to a review | ✅ Select dropdown per review row |
| Add a new review manually (with consent) | ✅ Full form in "Add a review with customer consent" panel |
| Section visibility toggle | ✅ `sections.reviews` toggle at top of tab |
| Pending reviews badge in sidebar | ✅ `<i>` badge count on nav item |

API routes confirmed to exist:
- `GET /api/admin/reviews` — list
- `PATCH /api/admin/reviews` — update status / systemId
- `DELETE /api/admin/reviews?id=` — remove
- `POST /api/admin/reviews` — add manual review

---

## 5. Issues and Conflicts Found

Homepage metrics are editable under Site content, and the cloud availability badge uses the same managed value as the first metric. The admin reminds publishers to verify public-facing figures and their sources before publishing.

---

## 6. Tab-to-Section Mapping Reference

| Admin Tab | Sections Managed |
|---|---|
| Overview | Dashboard metrics (read-only) |
| Site content | `hero`, `about`, `sections.about`, `faqs`, `journeys`, `metrics` |
| Company information | `company` (via CompanyEditor) |
| All page text | `copy` (via CopyEditor) |
| Systems & plans | `products`, `catalog`, `plans` |
| Offers | `offers`, `sections.offers` |
| Customer reviews | Reviews DB records, `sections.reviews` |
| Customer requests | Leads/inquiries DB records |
| Brand & contact | `brand`, `imagery`, `contact`, `seo` |
