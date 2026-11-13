# Search Engine Robots Endpoint

## Overview
Dynamic robots.txt generator configuring search crawler indexing boundaries and sitemap location.

## Interface
- `[route.ts:GET /robots.txt]` - Generates crawler access directives

## Invariants
- `[route.ts:GET]` Disallows crawler access to administrative (`/admin`), API (`/api`), and personal request (`/requests`, `/en/requests`) endpoints
- `[route.ts:GET]` References canonical `/sitemap.xml` URL using configured site origin

## Side Effects
- None

## Verification
- Run: `npm test`
