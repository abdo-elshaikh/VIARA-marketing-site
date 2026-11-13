# Healthcare Solution Details Route (English)

## Overview
English product detail page presenting dedicated healthcare solutions (RIS, PACS, Medical Centers, Portal) with feature breakdown, technical workstation captures, and package options.

## Interface
- `[page.tsx:Page]` - Server page rendering English solution details
- `[page.tsx:generateMetadata]` - Dynamic SEO title and Open Graph metadata in English
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:Page]` Invokes Next.js `notFound()` if product is unlisted or disabled in CMS settings

## Side Effects
- Reads published site settings and system captures from Cloudflare D1

## Verification
- Run: `npm test`
