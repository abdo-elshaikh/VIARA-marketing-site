# Healthcare Systems Directory Route (Arabic)

## Overview
Comprehensive clinical and operational catalog covering all 24 healthcare technology systems (RIS, PACS, LIS, Billing, Tele-radiology, Patient Portal, AI Diagnostic Assistant). Features keyword search, category filtering, facility type presets, and interactive multi-system proposal basket selection.

## Interface
- `[page.tsx:Page]` - Server page rendering Arabic systems catalog
- `[page.tsx:metadata]` - Systems catalog page metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:Page]` Restricts visible products to active marketing IDs in `marketingSystemIds`
- `[page.tsx:Page]` Proposal basket clamps selection to at most 6 systems (`MAX_SCOPE_SYSTEMS = 6`)

## Side Effects
- Reads published site settings and catalog definitions from Cloudflare D1
- Persists selected systems basket to `sessionStorage` under `viara-request-draft` upon initiating inquiry

## Verification
- Run: `npm test`
