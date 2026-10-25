# VIARA brand redesign across all marketing pages — 2026-10-18

## Brand system
- Emerald #007b61, forest #073e32, mint surfaces and white reading areas.
- Gold #f6c747 and coral #e94f46 provide small accents and attention states from the existing logo.
- Existing configured brand primary color remains the source for public controls, the administrator login and CMS controls.
- Local Arabic and English fonts, consistent spacing, keyboard focus, responsive layouts and reduced-motion support.

## Page coverage
- Homepage: harmonized with the forest and emerald palette.
- Systems directory: refreshed scope summary, selectable cards and search controls.
- RIS, PACS and CMS: dedicated product identity, feature cards, in-page navigation, workflow stages, related systems and demonstration CTA.
- Planning: new introductory composition, plans, rollout phases and archive calculator.
- Workflows: new journey introduction, stage controls, contextual systems and selection summary.
- Company: image-led opening, brand story, principles, offices and support information.
- Requests: shared navigation, actual record counts, organization/reference search, status filters, empty/error states, details, summary download and existing deletion confirmation.
- Administrator login: bilingual layout, configured logo, password visibility and existing authentication endpoint.
- CMS: brand palette and refreshed sidebar, panels, controls, tables and overview. No permission or authentication changes.
- Missing page: branded bilingual 404 with working links to the systems directory.
- Error boundary: branded retry and home navigation without exposing technical error details.

## Local verification
- TypeScript passed following the main redesign; final pass also run after the finishing changes.
- 47 browser route/viewport checks across Arabic and English, including 390px, 768px and 1440px layouts.
- Expected HTTP 200 for available pages and 404 for missing pages, with no horizontal overflow or JavaScript runtime errors.
- Interactions exercised: planning stages, workflow exploration, scoped system search, password visibility and administrator login language switch.
- Authenticated CMS screens were styled and typechecked; browser review covered the administrator sign-in page without attempting authentication.
- No inquiry submission, record deletion, login attempt, content publication or deployment was performed during the review.
- Evidence: scratch/marketing-brand-all-pages-20261018/results.json and screenshots in the same directory.
- Existing local server reused at http://127.0.0.1:5173.