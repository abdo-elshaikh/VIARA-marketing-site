# Patient Journeys Route (Arabic)

## Overview
Interactive clinical workflow tour guiding healthcare providers through the 5 key stages of a patient's diagnostic journey (Booking, Registration, Modality Scan, Radiologist Review, Result Delivery). Allows selecting systems across workflow touchpoints into a unified consultation scope.

## Interface
- `[page.tsx:JourneysPage]` - Server component rendering Arabic journey view
- `[page.tsx:metadata]` - Page SEO and Open Graph metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:JourneysPage]` System selections are clamped to a maximum of 6 systems (`MAX_SCOPE_SYSTEMS = 6`)
- `[page.tsx:dynamic]` Set to `'force-dynamic'` to reflect real-time active product configurations

## Side Effects
- Reads public content and available healthcare systems from Cloudflare D1
- Persists selected journey systems into `sessionStorage` under `viara-request-draft` when navigating to the consultation request form

## Verification
- Run: `npm test`
