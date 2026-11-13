# Analytics Ingestion API

## Overview
Conversion event tracking endpoint for the VIARA marketing platform. Receives client-side engagement events (estimator usage, inquiry initiation, receipt downloads) and forwards them to configured webhook handlers.

## Interface
- `[route.ts:POST /api/analytics]` - Accepts and validates conversion event payloads

## Invariants
- `[route.ts:POST]` Requires sameOrigin(request) check (status 403)
- `[route.ts:POST]` Limits request body to 4,000 bytes via readLimitedJson (status 400/413)
- `[route.ts:POST]` Enforces event name whitelist in Set `['view_solution', 'start_inquiry', 'submit_inquiry_success', 'submit_inquiry_failure', 'use_archive_estimator', 'download_request_receipt', 'contact_channel_click']` (status 400)

## Side Effects
- `[route.ts:POST]` Dispatches asynchronous non-blocking POST fetch to `process.env.ANALYTICS_WEBHOOK_URL`

## Verification
- Run: `npm test`
