# English Presentation & Routing Subsystem

## Overview
English-language presentation root for the VIARA healthcare marketing platform. Serves the primary English home page (`/en`) showcasing clinical systems, interactive diagnostic scenes, facility-guided system presets, and links to all English localized sub-routes.

## Interface
- `[page.tsx:EnglishHome]` - Server page rendering English home experience
- `[page.tsx:generateMetadata]` - English home SEO and Open Graph metadata
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)
- [About Us](./about/README.md) - English company profile, leadership credentials, and healthcare partnerships
- [Patient Journeys](./journeys/README.md) - 5-stage patient diagnostic workflow tour with proposal selection
- [Planning & Capacity Estimator](./planning/README.md) - Interactive DICOM archive estimator and implementation packages
- [Privacy Policy](./privacy/README.md) - English data privacy and healthcare compliance documentation
- [Consultation Requests](./requests/README.md) - Self-service proposal tracking and receipt downloads
- [Solutions Directory](./solutions/README.md) - Detailed solution profiles for RIS, PACS, and Medical Centers
- [Systems Catalog](./systems/README.md) - Complete directory of 24 clinical and diagnostic software systems

## Invariants
- `[page.tsx:EnglishHome]` Sets HTML direction to `ltr` and loads Latin humanist font stack (`Manrope`)
- `[page.tsx:dynamic]` Set to `'force-dynamic'` to immediately reflect published CMS updates

## Side Effects
- Reads published site settings and reviews via `readPublicContent()` from Cloudflare D1

## Verification
- Run: `npm test`
