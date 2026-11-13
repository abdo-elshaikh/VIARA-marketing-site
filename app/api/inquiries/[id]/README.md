# Inquiry Record Deletion API

## Overview
Secure endpoint allowing guests or administrators to delete an existing consultation inquiry record.

## Interface
- `[route.ts:DELETE /api/inquiries/[id]]` - Deletes specified inquiry by ID

## Invariants
- `[route.ts:DELETE]` Requires sameOrigin(request) check (status 403)
- `[route.ts:DELETE]` Requires caller to be an authenticated admin (via getAdmin()) or authenticated guest owner (via readGuestId()) (status 401)
- `[route.ts:DELETE]` Non-admin callers can only delete inquiries matching `inquiries.userId === clientId` (status 404 if not found)

## Side Effects
- `[route.ts:DELETE]` Deletes matching inquiry record from Cloudflare D1 `inquiries` database table

## Verification
- Run: `npm test`
