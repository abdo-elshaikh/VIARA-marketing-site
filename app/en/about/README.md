# About Us Route (English)

## Overview
English company profile route presenting VIARA's diagnostic radiology focus, engineering principles, leadership team, and regional healthcare partnerships.

## Interface
- `[page.tsx:EnglishAboutPage]` - Server page rendering English company view
- `[page.tsx:metadata]` - English page SEO and social metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:metadata]` Renders English title and description with canonical URL pointing to `/en/about`

## Side Effects
- Reads published site settings via `readPublicContent()` from Cloudflare D1

## Verification
- Run: `npm test`
