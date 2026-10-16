# Admin Panel Coverage Report
**Date:** 2025-07-10  
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
| `products` | array: `id`, `name`, `headline`, `description`, `features[]`, `note`, `image`, `enabled` | Systems & plans → "VIARA systems" | ✅ Editable (all fields per system) |
| `catalog.categories` | array of `{ id, name }` — 4 items | Systems & plans → "Care areas & facility recommendations" | ✅ Names editable |
| `catalog.facilities` | array of `{ id, name, systems[] }` — 5 items | Systems & plans → "Care areas & facility recommendations" | ✅ Names + system checkboxes editable |
| `plans` | array: `id`, `name`, `label`, `description`, `price`, `features[]`, `featured`, `enabled` | Systems & plans → "Packages & pricing" | ✅ Editable (all fields per plan) |
| `offers` | array: `id`, `title`, `description`, `badge`, `endDate`, `active`, `plan` | Offers tab | ✅ Editable (add/remove/edit) |
| `copy` | free-form key/value record of `Localized` strings | "All page text" tab (CopyEditor) | ✅ Editable |
| `company` | all company fields | "Company information" tab (CompanyEditor) | ✅ Editable |

**Summary: All 17 top-level keys / section groups in `SiteContent` are covered in the admin panel.  
No missing sections were found — no code changes were required.**

---

## 2. What Was Added in This Task

**Nothing was added.** A complete audit confirmed full coverage already exists across the admin's 9 navigation tabs.

---

## 3. What Remains NOT Editable (and Why)

### Journeys page data (`app/journeys-view.tsx`)

The five care journey stages are defined as a hardcoded `journeys` array in `journeys-view.tsx`:

```ts
const journeys = [
  { icon, title: {ar, en}, description: {ar, en}, team: {ar, en}, systems: string[], question: {ar, en} },
  // × 5 stages
]
```

**This data is NOT in `site-content.ts` and NOT editable in the admin panel.**

**Reason it is NOT in the schema:** This is structural/navigational content that defines the interactive care journey explorer experience. The stage titles, descriptions, team labels, and guiding questions are tightly coupled to which `systems[]` IDs are shown per stage — changing them incorrectly would break the system catalog mapping. It is treated as application logic, not operator-configurable marketing copy.

**Recommendation for a future iteration:** If operators need to customize journey stage text, these fields can be added to `site-content.ts` as a new `journeys` array of type:

```ts
journeys: z.array(z.object({
  title: requiredLocalized,
  description: requiredLocalized,
  team: localizedSchema,
  question: localizedSchema,
})).length(5)
```

The `systems[]` IDs and `icon` assignments would remain hardcoded (as they drive the display logic). The `journeys` key would then appear in the admin panel's "Content" tab with a `Pair` field per text field per stage. This would require:
1. Adding the schema key to `siteContentSchema` in `site-content.ts`
2. Setting a default in `defaultContent` matching the current hardcoded values
3. Replacing the hardcoded strings in `journeys-view.tsx` with `content.journeys[i].title` etc.
4. Adding a "Journey stages" Panel to the admin `content` tab

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

None found. The admin panel already had complete, correct coverage of all `SiteContent` fields before this task ran.

**One item documented for product owner's attention (from Task 2 audit):**  
`app/modern-home.tsx` contains hardcoded marketing metrics (`99.98%`, `100+`, `4.8M+`, `98.6%`) with no sample-data disclaimer. These are not part of `site-content.ts` and are not editable in the admin. This is a product/marketing decision — see `docs/task2-fake-data-audit.md` section 5 for details.

---

## 6. Tab-to-Section Mapping Reference

| Admin Tab | Sections Managed |
|---|---|
| Overview | Dashboard metrics (read-only) |
| Site content | `hero`, `about`, `sections.about`, `faqs` |
| Company information | `company` (via CompanyEditor) |
| All page text | `copy` (via CopyEditor) |
| Systems & plans | `products`, `catalog`, `plans` |
| Offers | `offers`, `sections.offers` |
| Customer reviews | Reviews DB records, `sections.reviews` |
| Customer requests | Leads/inquiries DB records |
| Brand & contact | `brand`, `imagery`, `contact`, `seo` |
