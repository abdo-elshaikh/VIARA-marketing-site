# Guest Consultation Requests Tracking Route (English)

## Overview
English consultation request history tracking page enabling prospective healthcare clients to review status, download receipts, and manage submitted inquiries.

## Interface
- `[page.tsx:RequestsPage]` - Server page rendering English request tracking view
- `[page.tsx:metadata]` - Request tracking page metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:RequestsPage]` Verifies guest session using signed `viara_guest_id` cookie

## Side Effects
- Dispatches DELETE requests to purge user-owned inquiry records
- Generates in-memory blob URLs for receipt text downloads

## Verification
- Run: `npm test`
