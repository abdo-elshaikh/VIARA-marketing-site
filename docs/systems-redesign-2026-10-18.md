# Systems page redesign — 2026-10-18

Updated `app/care-directory.tsx`; styles in `app/systems-directory.css`.

- Arabic and English, current enabled RIS/PACS/CMS products only.
- Shared text-only hero, system anchors, searchable and filterable product cards.
- Product names, descriptions and features are read from current site content.
- Expandable native workflow disclosures replace illustrative dashboard previews.
- Facility profiles are restricted to radiology and medical centers and filtered to enabled products. Counts and selected scope include supported products only.
- Selection can be adjusted per system and passed to the existing homepage inquiry through the systems query parameter.
- No requests were submitted during verification; no deployment.

Validation: TypeScript passed. Browser checks passed at widths 1440, 1151, 1024, 768, 390 and 320 in both languages. Search, restored URL search, empty state reset, category filters, workflow disclosures, product links, facility presets, selected-scope URLs and mobile scope-bar bounds checked. No browser page errors.

Local preview: http://127.0.0.1:5173/systems
Evidence: `D:/VIARA/scratch/marketing-systems-redesign-20261018/results.json`.