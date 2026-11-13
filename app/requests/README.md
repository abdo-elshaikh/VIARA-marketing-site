# Guest Consultation Requests Tracking Route (Arabic)

## Overview
Self-service consultation request history view allowing prospective healthcare facility clients to track the status of their submitted demo and proposal inquiries using HMAC-signed guest session cookies.

## Interface
- `[page.tsx:RequestsPage]` - Server page rendering consultation requests tracking view
- `[page.tsx:metadata]` - Request tracking page metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)
- `[requests-view.tsx:RequestsView]` - Interactive client component managing request status display, text receipt download, and deletion

## Invariants
- `[page.tsx:RequestsPage]` Reads guest ID strictly from verified `viara_guest_id` cookie
- `[requests-view.tsx:RequestsView]` Strips sensitive administrative details and displays only user-owned inquiries

## Side Effects
- `[requests-view.tsx:remove]` Dispatches DELETE request to `/api/inquiries/${id}` to purge inquiry records
- `[requests-view.tsx:download]` Generates in-memory blob for consultation receipt download

## Verification
- Run: `npm test`
