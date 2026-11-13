# Public Media Asset Streaming API

## Overview
Immutable asset delivery endpoint serving uploaded branding logos and media assets directly from the Cloudflare R2 bucket binding.

## Interface
- `[route.ts:GET /api/media/[id]]` - Streams media asset with caching headers

## Invariants
- `[route.ts:GET]` Validates `id` route param matches strictly `/^[a-f0-9-]{36}\.(png|jpg|webp)$/` (status 404 if invalid)
- `[route.ts:GET]` Requires `env.BUCKET` Cloudflare R2 binding to be available (status 503 if unconfigured)

## Side Effects
- `[route.ts:GET]` Reads object stream from Cloudflare R2 bucket at `media/${id}` and sets public immutable caching headers

## Verification
- Run: `npm test`
