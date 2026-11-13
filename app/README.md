# Presentation & Routing Application Layer

## Overview
Next.js App Router presentation and routing architecture for the VIARA bilingual (Arabic/English) healthcare marketing website and content management portal. Root routes serve Arabic by default while `/en/*` routes mirror public views in English. Top-level files provide the core brand presentation layout, client showcases (RIS, PACS, CMS, AI, PORTAL), interactive calculation engines (DICOM archive capacity, ROI savings), lead capture forms, and request tracking.

## Interface
- `[layout.tsx:RootLayout]` - Root HTML wrapper applying language direction, localized fonts, and metadata
- `[page.tsx:Home]` - Arabic flagship homepage entry point
- `[care-home.tsx:CareHome]` - Coordinated public marketing layout with scroll-reveals and section navigation
- `[care-hero.tsx:CareHero]` - Flagship hero showcase with 3D medical environment scenes and system workstation frames
- `[home-system-showcase.tsx:HomeSystemShowcase]` - Interactive clinical systems carousel with live software captures
- `[brand-page-hero.tsx:BrandPageHero]` - Sub-page hero banner with dynamic facility presets
- `[lead-form.tsx:LeadForm]` - Client consultation and demo requisition form with validation and receipt downloads
- `[scope-calculator.tsx:ScopeCalculator]` - Interactive DICOM archive capacity estimator engine
- `[system-synergy-map.tsx:SystemSynergyMap]` - Interconnected clinical workflow diagram
- `[customer-reviews.tsx:CustomerReviews]` - Moderated client testimonials showcase
- `[review-form.tsx:ReviewForm]` - Client testimonial submission modal
- [About Us](./about/README.md) - Arabic company profile, mission, leadership, and credentials
- [Administration Portal](./admin/README.md) - Protected CMS content publishing, inquiry inbox, and review moderation
- [API Routing Subsystem](./api/README.md) - REST API handlers for inquiries, media streaming, and CMS management
- [English Presentation Subsystem](./en/README.md) - Complete English-localized public presentation layer
- [Patient Journeys](./journeys/README.md) - 5-stage patient diagnostic care journey with proposal basket
- [Planning & Capacity Estimator](./planning/README.md) - Implementation roadmap, capacity estimator, and package matrix
- [Privacy Policy](./privacy/README.md) - Arabic data privacy terms and healthcare compliance standards
- [Consultation Requests](./requests/README.md) - Self-service proposal inquiry tracking and receipt downloads
- [Robots Generator](./robots.txt/README.md) - Dynamic search engine crawler access configuration
- [Sitemap Generator](./sitemap.xml/README.md) - Dynamic XML sitemap endpoint with bilingual hreflang alternates
- [Solutions Directory](./solutions/README.md) - Detailed solution profiles for RIS, PACS, and Medical Centers
- [Systems Catalog](./systems/README.md) - Comprehensive directory of 24 clinical and diagnostic software systems

## Invariants
- `[layout.tsx:RootLayout]` Locale resolution falls back to 'ar' unless 'x-viara-locale' header is 'en', enforcing dir='rtl'/'ltr' and loading Tajawal or Manrope fonts respectively
- `[care-home.tsx:useEffect]` URL query parameter 'systems' is deduplicated, restricted to marketingSystemIds and active products in content.products, and clamped to at most 6 systems
- `[care-hero.tsx:CareHero]` Hero rotation timer is scheduled only when autoPlay is enabled, prefers-reduced-motion is false, document is visible, pointer is not hovering, and element is not focused
- `[lead-form.tsx:submit]` Form submission is rejected if state is 'sending' or if required fields fail validation: name (2-100 chars), organization (2-150 chars), phone (7-25 chars), email (<=200 chars), facility selection, and consent checkbox
- `[scope-calculator.tsx:ScopeCalculator]` Modality selection enforces at least one active modality; inputs are validated by scopeEstimateSchema requiring integer values within boundaries: dailyScans (1-10000), branches (1-100), operatingDays (1-366), averageMiB (1-10000), retentionYears (1-20), backupCopies (0-5)
- `[care-directory.tsx:CareDirectory]` Selected scope systems basket is capped at MAX_SCOPE_SYSTEMS = 6

## Side Effects
- `[lead-form.tsx:submit]` Dispatches HTTP POST request to `/api/inquiries?lang=${locale}` and emits analytics events
- `[lead-form.tsx:download]` Generates in-memory blob URL via URL.createObjectURL to trigger client-side download of inquiry summary text file
- `[admin/admin-client.tsx:api]` Dispatches network requests (GET, POST, PUT, DELETE) to administrative API endpoints

## Verification
- Run: `npm test`
