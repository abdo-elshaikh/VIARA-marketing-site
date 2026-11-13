# Privacy Policy Route (English)

## Overview
English data privacy and compliance policy specifying healthcare record protection, HIPAA/GDPR standards, guest cookie identity handling, and data retention rules.

## Interface
- `[page.tsx:PrivacyPageEn]` - Server page rendering English privacy policy
- `[page.tsx:metadata]` - Legal privacy page metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:metadata]` Canonical URL points to `/en/privacy`

## Side Effects
- Reads organization legal entity details from published site settings

## Verification
- Run: `npm test`
