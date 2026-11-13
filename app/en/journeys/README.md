# Patient Journeys Route (English)

## Overview
English clinical workflow tour mapping the 5 stages of diagnostic patient care to corresponding VIARA software modules, with interactive multi-system proposal selection.

## Interface
- `[page.tsx:JourneysPage]` - Server page rendering English journey view
- `[page.tsx:metadata]` - English page SEO and Open Graph metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:JourneysPage]` Selection basket is capped at 6 systems (`MAX_SCOPE_SYSTEMS = 6`)

## Side Effects
- Reads active products from Cloudflare D1
- Persists selected systems to `sessionStorage` under `viara-request-draft`

## Verification
- Run: `npm test`
