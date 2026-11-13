# About Us Route (Arabic)

## Overview
Arabic company information page presenting VIARA's mission, healthcare engineering principles, clinical leadership credentials, and regional diagnostic partnerships.

## Interface
- `[page.tsx:AboutPage]` - Server component rendering Arabic company profile
- `[page.tsx:metadata]` - Page SEO and social graph metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:metadata]` Page title and description resolve from CMS settings `company` section with fallback to Arabic defaults
- `[page.tsx:dynamic]` Set to `'force-dynamic'` to ensure freshly published company revisions appear immediately

## Side Effects
- Reads published site settings via `readPublicContent()` from Cloudflare D1

## Verification
- Run: `npm test`
