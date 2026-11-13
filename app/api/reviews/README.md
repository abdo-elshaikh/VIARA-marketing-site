# Customer Reviews Submission API

## Overview
Public customer review submission endpoint for the VIARA marketing site. Validates client ratings, testimonials, and consent before enqueueing reviews for administrative moderation.

## Interface
- `[route.ts:POST /api/reviews]` - Submits new customer review for moderation

## Invariants
- `[route.ts:POST]` Requires sameOrigin(request) check (status 403)
- `[route.ts:POST]` Limits request body to 12,000 bytes via readLimitedJson (status 400/413)
- `[route.ts:POST]` Validates input against reviewSchema (rating 1-5, consent=true, empty honeypot website) (status 400)
- `[route.ts:POST]` Rate limit constraint: max 3 reviews per guest client ID per 24 hours (status 429)

## Side Effects
- `[route.ts:POST]` Sets signed guest identity cookie `viara_guest_id` if not already present
- `[route.ts:POST]` Inserts review row into `reviews` database table with `status='pending'` and `consent=1`

## Verification
- Run: `npm test`
