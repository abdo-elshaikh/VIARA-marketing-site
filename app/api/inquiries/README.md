# Inquiries API

## Overview
Public consultation request submission endpoint for the VIARA marketing site. Validates consultation inquiries, provisions signed guest identity cookies, prevents duplicate submissions, and notifies sales webhooks.

## Interface
- `[route.ts:POST /api/inquiries]` - Submits new consultation and system proposal inquiry
- [Inquiry Record Deletion](./[id]/README.md) - Secure inquiry deletion by guest owner or administrator

## Invariants
- `[route.ts:POST]` Requires sameOrigin(request) check (status 403)
- `[route.ts:POST]` Limits request body to 16,000 bytes via readLimitedJson (status 400/413)
- `[route.ts:POST]` Validates form fields via inquirySchema (honeypot empty website, normalized phone >= 7 digits, consent required) (status 400)
- `[route.ts:POST]` Idempotency constraint: existing inquiry ID belonging to another user returns 409 Conflict; same user returns existing reference
- `[route.ts:POST]` Rate limit constraint: max 10 inquiries per email within 1 hour (status 429)

## Side Effects
- `[route.ts:POST]` Sets signed guest identity cookie `viara_guest_id` if not already present
- `[route.ts:POST]` Inserts inquiry row into `inquiries` database table
- `[route.ts:POST]` Dispatches asynchronous non-blocking POST notification to `process.env.SALES_WEBHOOK_URL`

## Verification
- Run: `npm test`
