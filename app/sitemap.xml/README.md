# Search Engine Sitemap Endpoint

## Overview
Dynamic XML sitemap endpoint listing all published Arabic and English marketing routes, solution detail pages, and localized alternate links.

## Interface
- `[route.ts:GET /sitemap.xml]` - Generates standard XML sitemap
- `[route.ts:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[route.ts:GET]` Excludes disabled or unpublished solutions
- `[route.ts:GET]` Provides bidirectional `xhtml:link rel="alternate"` hreflang entries for Arabic (`ar`) and English (`en`)

## Side Effects
- Reads active products and solutions from Cloudflare D1 via `readPublicContent()`

## Verification
- Run: `npm test`
