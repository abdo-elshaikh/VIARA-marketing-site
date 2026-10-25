# Catalog and system detail usability refresh — 2026-10-19

## Catalog

- Direct headline explaining the selection task.
- Removed redundant jump navigation and repeated workflow disclosures from the three-card directory.
- Added actual interface previews linking to each system’s detail page.
- Shortened capability summaries to three items while retaining complete capabilities on detail pages.
- Clear primary details action and secondary initial-scope selection.
- Retained search, category filters, facility presets and scoped inquiry links.
- Remembered initial scope in sessionStorage when navigating to details and returning. Only enabled, supported system IDs are restored; duplicates and invalid entries are discarded. Selection continues to work if browser storage is unavailable.

## Detail pages

- Sticky section navigation below the existing header, active reading-section indicator and a persistent scoped demonstration action.
- Section offsets account for the existing 100px document scroll padding.
- Screenshot choices arranged alongside the main screenshot on desktop and below it on small screens.
- Added visible previous/next controls and fit/zoom inside the native image dialog. Large image panning stays inside the dialog.
- Increased text sizes, contrast and touch targets across both page types.
- Retained actual screenshot assets, current product content, workflows, reviews and existing inquiry integration.

## Verification

TypeScript check passed. Browser verification script: `D:/VIARA/scratch/marketing-systems-usability.cjs`. Evidence and the completed results are saved under `D:/VIARA/scratch/marketing-systems-usability-20261019/`.

Preview: http://127.0.0.1:5175/systems