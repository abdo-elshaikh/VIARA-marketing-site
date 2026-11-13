# Privacy Policy Route (Arabic)

## Overview
Arabic regulatory and data protection compliance document outlining clinical data handling, HIPAA/GDPR alignment, consent management, cookie policies, and customer deletion rights.

## Interface
- `[page.tsx:PrivacyPage]` - Server page rendering Arabic privacy terms
- `[page.tsx:metadata]` - Legal privacy page metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:metadata]` Canonical origin resolves to configured `NEXT_PUBLIC_SITE_URL`

## Side Effects
- Reads organization legal entity details and contact channels from published site settings

## Verification
- Run: `npm test`
