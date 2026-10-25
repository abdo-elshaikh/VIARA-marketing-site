# Changelog

All notable changes to the VIARA Marketing Site will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Pre-Launch Preparation (2026-10-20)

#### Documentation
- Created comprehensive **PRE_LAUNCH_CHECKLIST.md** with 100+ verification items
- Created **DEPLOYMENT_GUIDE.md** with step-by-step deployment instructions
  - Environment setup procedures
  - Database migration guide
  - Production deployment options (Cloudflare Pages, Wrangler)
  - Domain configuration
  - Troubleshooting guide
  - CI/CD integration examples
- Created **CONTENT_GUIDELINES.md** with content standards
  - Technical claims documentation requirements
  - DICOM/HL7/FHIR specification guidelines
  - Performance claims standards
  - Security and compliance documentation
  - Testimonial and case study requirements
  - Bilingual content consistency rules
  - Legal compliance reminders
- Created **IMPROVEMENT_TASKS.md** with prioritized roadmap
  - Critical: Image optimization, environment configuration
  - High: Performance testing, accessibility audit
  - Medium: Analytics, SEO enhancements, form optimization
  - Low: Multilingual expansion, chat widget, video content
- Created **PROJECT_STATUS.md** comprehensive status report
  - Executive summary
  - Technical architecture overview
  - Test coverage details
  - Performance analysis
  - Deployment readiness assessment
  - Risk analysis
  - Recommended next steps

#### Development Tools
- Created `scripts/optimize-images.mjs` image analysis tool
  - Identifies images larger than 500KB
  - Generates inventory report (`image-inventory.json`)
  - Provides optimization recommendations
- Created `.env.example` environment variable template
  - Documents all required configuration
  - Includes security notes
  - Provides example values

#### Improvements
- Updated README.md with quick links to documentation
- Updated README.md with current project status
- Enhanced project structure documentation
- Added development setup instructions

### Fixed
- Documented build issues and solutions
- Identified file lock problem with dist/client directory
- Provided workarounds for Windows development environment

### Analysis
- **Image Inventory**: Identified 18 images >500KB (16.81 MB total)
  - Critical: viara-brand-hero-v3.png (2.2 MB)
  - Critical: viara-brand-logo-only.png (1.5 MB)
  - High: 16 additional images (664KB - 1.3MB each)
  - Target after optimization: 4-5 MB (~70% reduction)
- **Performance Baseline**: Documented current state for future comparison
- **Deployment Readiness**: 85% complete, remaining 15% is optimization and content

---

## [1.0.0-beta] - 2026-10-17

### Added - Regional Experience Update

#### Features
- Redesigned customer reviews section (Arabic + English)
  - Quote card with star rating
  - Author name, title, organization
  - Calculated average from published reviews
  - Progress indicator and navigation
  - Respects language direction (RTL/LTR)
  - Hides navigation for single review
  - Hides section when no reviews published
- Redesigned planning page (`/planning`, `/en/planning`)
  - Brand-aligned introduction with planning board
  - Package cards using actual saved content
  - Interactive implementation phases
  - Archive calculator (ivory and green colors)
  - Package selection and calculator input transfer to contact form
  - Clear error display when localStorage fails
  - Metadata and language links for both versions
- Updated care experience (Arabic + English)
  - Enhanced introduction and visual identity
  - Improved navigation
  - Added care journeys page connecting patient stages to systems
  - 6-system scope grouping
  - Updated about page and marketing content
  - Addressed undocumented statistics, credits, inactive links

#### System Experience
- Individual pages for all 23 healthcare domains
  - Feature tabs
  - Expandable gallery
  - Interactive workflow journey
  - System-linked reviews
- Entry animations respecting reduced motion
- Local fonts
- Responsive design (Arabic + English)
- 103 browser rounds tested (all systems, mobile + desktop)
  - Gallery, keyboard, review form, save failure, retry
  - Ratings tested with isolated browser data (no fake reviews saved)

#### Multi-Page Interactive Design
- New experience for homepage, systems guide, and planning (Arabic + English)
- Unified navigation and footer for solution pages
- Wider spacing, ivory and green colors
- Search and filter directory covering 23 domains
- Up to 6 systems selection, transferred to request form
- Package and archive estimate selection transferred from planning to homepage

#### Solutions & SEO
- Six solution pages: `/solutions/ris`, `/solutions/pacs`, `/solutions/medical-centers`
  - English equivalents under `/en/solutions/`
  - Product names, descriptions, features from saved content
  - Editorial content for workflows, scoping questions, implementation steps
  - Diagrams for workflow explanation (not presented as actual system screenshots)
- "Discover this solution" buttons and footer links
  - Request transfers to homepage form with solution pre-selected
  - Language toggle returns to same solution
  - Disabled products and unknown paths return 404
- New design: dark introduction, workflow map, features list, discovery questions, implementation steps, related solutions
  - Phone and desktop responsive layout
- Added canonical, language alternates, SoftwareApplication and BreadcrumbList structured data
  - Uses published data only
  - No prices or ratings if unavailable
- Added `/sitemap.xml` for public pages and enabled solutions (both languages)
- Added `/robots.txt` for site paths
  - Origin from `NEXT_PUBLIC_SITE_URL`, default `https://viara.health`
  - Actual origin must be set before production deployment
- Created local 1200×630 social sharing card
- Connected Open Graph and Twitter metadata
- Migrated admin formats from layout to admin page
- Fixed profile section image sizing conflict
- Added 404 page (both languages)
- 12 browser rounds for solution pages (phone + desktop)
  - Product selection transfer to form
  - Verified search files, sharing metadata, admin CSS not loaded on homepage
  - 404 cases (Arabic + English)

#### Healthcare System Directory
- Interactive directory (Arabic + English) at `/systems`, `/en/systems`
- Compact homepage version
- 23 domains across clinical care, diagnostics, operations, digital care:
  - Hospitals, EHR, medical centers, dental, rehab, nursing, OR/ICU
  - Radiology, PACS, AI, lab, pathology, blood bank
  - Pharmacy, revenue cycle, finance, HR, equipment, analytics
  - Patient portal, referring physicians portal, telehealth, home care, referrals, interoperability
- Search by Arabic/English name and abbreviation
  - Normalizes Arabic diacritics and hamzas
- Filters for domains and facility presets (hospitals, clinics, radiology, labs, groups)
- Result count, empty state, reset filters
- Select up to 6 systems
  - Selection preserved during search/filter
  - Individual removal
  - Comparison table (scrollable on phone) showing purpose, domain, study scope
- Bundle systems into single request
  - Facility type and system summary transferred to form
  - Server validates system IDs, duplication, maximum count
  - Adds system names to saved message and download receipt
- Expanded facility types (hospitals, labs, others)
  - Preserves previous requests without database changes
- Distinguished enabled current products with detail pages from domains requiring scope assessment
  - Directory does not claim all 23 systems are ready products
  - Disabled products not shown as current solutions
- Updated default homepage intro to address broader care ecosystem
- Added directory to navigation and sitemap
- 13 Node test cases, TypeScript, production build passed
- 22 responsive rounds, 4 new directory rounds with homepage flow, 4 calculator and mock send rounds
- Directory tests: search, filters, empty results, selection limit, comparison, six-system transfer and hospital type to form (both languages, phone + desktop)

### Fixed - Responsive Design & Content Flow

#### Mobile Responsiveness (Completed locally)
- Fixed empty page start positioning
  - Decorative element no longer enters page flow
  - Responsive padding priorities adjusted
  - Title now ~180px from top instead of 924px on 390px viewport
- Mobile menu improvements
  - Logo, demo request, menu button in phone bar
  - Language and theme available inside menu
  - Desktop options remain visible
  - Menu button 44×44px
  - Menu scrollable on short screens
  - Closes on section selection, outside click, Escape, or desktop view switch
  - Escape returns focus to button
- Form labels and consent text on phone: 14px (both languages)
- Improved hero button sizes and helper text
- 22 browser cases passed: 8 viewport sizes per language, 6 additional normal motion cases
  - Checks: title and CTA position, clipping, overlap, language, theme, menu close behavior, focus, JavaScript errors
- 8 Node tests, TypeScript, production build via `node scripts/run-framework.mjs build` passed
  - Sites build helper unavailable due to missing pnpm on PATH in this environment
  - Succeeded by running build path directly via Node
- [Phone after fix](../scratch/marketing-responsive-20261016/ar-390.png), [English after fix](../scratch/marketing-responsive-20261016/en-390.png), [Check results](../scratch/marketing-responsive-20261016/results.json)
- First phase did not include content rewrite, package/calculator changes, company data and testimonials, or site publication

#### Content, Calculator & Request Flow
- Replaced definitive promises about all devices, full compatibility, 99.98% uptime
  - Messages now clarify devices, archiving, hosting, permissions defined in technical proposal
  - Adjusts marketing message; does not represent medical integration approval
- RIS, PACS, clinic previews now clearly labeled as mockups and illustrative data
  - Removed live connection badges and OHIF from presentation mockups
- Hidden reviews, offers sections, and their links when no published content
  - First review submission link remains small in footer
- Default homepage intro more specific to software type
  - CTA requests system demo
  - Custom saved content in admin panel remains unchanged; these changes don't auto-replace
- Separated calculator in `app/scope-calculator.tsx`
  - Uses actual branch count, daily exams per branch, working days, average study size (MiB), retention years, additional backup copies
  - Shows equation and estimate limits, prevents invalid values
  - Device type selection adds context to request; doesn't auto-change average size (noted in UI)
- Removed package recommendations based on fixed thresholds unlinked to approved pricing
  - Package starts with "لم أحدد بعد", manual selection preserved
- Full inputs transferred to visible summary in form
  - Summary removable or calculator editable and reattached
  - Branch field syncs with estimate; manual branch edit removes old summary to avoid conflict
- Server validates inputs and recalculates summary before appending to request needs
  - Saved in existing message field, visible to admin, requests page, download
  - No database changes, client notes preserved
- Package comparison shows independent scope list per package instead of "scope 1/2" rows
  - Detailed matrix with actual limits still needs approved business definition
- Fixed privacy, success, "My Requests" page copy
  - Access tied to guest ID in browser; may differ after site data cleared or other device used
- 11 Node test cases covering capacity calculation, input limits, note preservation, summary (both languages)
  - TypeScript passed
- 4 request flow rounds (phone + desktop, Arabic + English)
  - Simulated save failure then retry and download
  - No actual requests sent to database or people
- Also re-ran 22 responsive cases
- Evidence: [request flow results](../scratch/marketing-content-flow-20261016/results.json), [calculator image](../scratch/marketing-content-flow-20261016/ar-calculator.png), [responsive results](../scratch/marketing-responsive-20261016/results.json)
- At this phase end, product pages, assets, SEO remained in following work
  - Improvements completed in next update
- Changes local, site not published

#### Calm Design Update
- Rebuilt homepage entry (Arabic + English) in `app/calm-home.tsx`
  - Previous implementation preserved in `app/viara-site.tsx`
- Light calm background, single image, concise message, four main navigation links
- Expansion to 23 care domains remains available via systems guide
  - Guide not repeated on homepage
- Homepage six core sections without published offers/reviews:
  - Introduction, ecosystem exploration, solutions, planning tools, questions, contact
  - Real offers and reviews appear when published
- Replaced repeated explorers with single facility assistant and four-domain map
  - Changing facility updates scope discussion, transferable to form
  - Short search leads directly to result in full guide
- Solutions shown in three compact cards leading to detail pages
  - Replaced expanded technical previews on homepage
- Calculator, packages, implementation steps available via on-demand modals
  - Support Escape and focus restoration
  - Calculator summary editable from form, calculator reopenable
- Form shows five core fields first
  - Remaining fields in "Additional details — optional"
  - System, package, request details not lost when collapsed
  - System and calculator summaries remain visible
- Full guide shows six cards first, expand to show more
  - Large UI previews folded behind clear section labeled as illustrative mockups
  - Removed repeated facility buttons duplicating filter function
  - Domain links support direct filtering
- Kept dark mode and language toggle
  - Appropriate touch sizes, responsive navigation, reduced motion respected
  - No new automatic animations or decorative badges
- Local measurement: Arabic homepage ~4232px @ 1440, ~6069px @ 390
  - English ~4262 and 6555px
  - These are local page dimensions, not speed or conversion metrics
- 12 browser rounds (both languages, five viewports, guide)
  - Section links, no viewport overflow, CTA visibility, menu, facility selection, calculator open/edit, package selection, search, mock send
- 13 tests, TypeScript, production build passed
- Evidence: [new homepage desktop](../scratch/marketing-calm-20261016/ar-1440.png), [new homepage phone](../scratch/marketing-calm-20261016/ar-390.png), [full page](../scratch/marketing-calm-20261016/ar-1440-full.png), [check results](../scratch/marketing-calm-20261016/results.json)
- 4 additional rounds for dark mode, phone menu close on expand, guide comparison and system transfer to form with mock send
- Total 16 browser rounds for this design; [additional results](../scratch/marketing-calm-20261016/final-flows.json)
- Changes local, not published
- Send tests don't create actual requests
- Measurements and original review observations below relate to first review state; read with implementation updates

### Security
- Admin login unavailable without `VIARA_ADMIN_PASSWORD` and `VIARA_ADMIN_EMAIL` (fails closed with 503)
- Rate limiting: 5 login attempts per 15 minutes per email/IP
- Session cookies HMAC-signed, 7-day expiry
- No admin credential in client bundle
- Security headers applied: CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy
- Same-origin policy enforced
- Personal/admin pages: `Cache-Control: private, no-store`

### Testing
- Total: 15 unit tests passing
  - Content management: 9 tests
  - Inquiry system: 6 tests
- Python migration tests passing
- TypeScript compilation successful (0 errors)
- 103+ browser verification rounds across features
- Mobile responsiveness: 320px - 1920px

---

## Historical Development

See [REVIEW-AND-DEVELOPMENT-PLAN.ar.md](REVIEW-AND-DEVELOPMENT-PLAN.ar.md) for complete development history including:
- Original marketing site review (October 16, 2026)
- Responsive design fixes
- Content and calculator improvements
- Solution pages and SEO implementation
- Design system updates
- Care experience enhancements

---

## [0.1.0] - 2026-10-15 (Initial Implementation)

### Added
- Initial Vinext-based Next.js 16 application
- Cloudflare Pages deployment configuration
- D1 database with Drizzle ORM
- R2 storage for uploads
- Bilingual content structure (Arabic/English)
- Admin authentication system
- Content management with versioning
- Request tracking system
- Review moderation system

---

[Unreleased]: https://github.com/viara-health/marketing-site/compare/v1.0.0-beta...HEAD
[1.0.0-beta]: https://github.com/viara-health/marketing-site/compare/v0.1.0...v1.0.0-beta
[0.1.0]: https://github.com/viara-health/marketing-site/releases/tag/v0.1.0
