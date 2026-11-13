# Healthcare Solution Details Route (Arabic)

## Overview
Dynamic product detail page presenting individual healthcare technology solutions (RIS, PACS, Medical Centers, Portal) with feature breakdown, live software workstation captures, and package scopes.

## Interface
- `[page.tsx:Page]` - Server page rendering localized Arabic solution profile
- `[page.tsx:generateMetadata]` - Dynamic SEO title and Open Graph metadata per product
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:Page]` Invokes Next.js `notFound()` if the requested product slug does not exist or is marked `enabled === false` in CMS settings
- `[page.tsx:Page]` Canonicalizes legacy product aliases (e.g. mapping `EMR` to `EHR`)

## Side Effects
- Reads published site settings and system capture definitions from Cloudflare D1

## Verification
- Run: `npm test`
