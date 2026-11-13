# Healthcare Systems Directory Route (English)

## Overview
English clinical and operational directory covering 24 healthcare technology systems with search, category filtering, facility type presets, and interactive multi-system proposal selection.

## Interface
- `[page.tsx:Page]` - Server page rendering English systems catalog
- `[page.tsx:metadata]` - Systems catalog page metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:Page]` Restricts visible products to active marketing IDs in `marketingSystemIds`
- `[page.tsx:Page]` Clamps multi-system selection to at most 6 systems (`MAX_SCOPE_SYSTEMS = 6`)

## Side Effects
- Reads published site settings and catalog definitions from Cloudflare D1
- Persists selected systems to `sessionStorage` under `viara-request-draft` upon initiating inquiry

## Verification
- Run: `npm test`
