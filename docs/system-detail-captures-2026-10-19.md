# System detail redesign and actual UI captures — 2026-10-19

## Scope

Arabic and English detail pages for RIS, PACS and CMS. Kept the shared text-only hero. Added product overview navigation, a product-specific screenshot gallery, capability cards from current product content, workflow stages, scope planning questions, current related systems and scoped inquiry links. Existing reviews and review submission UI remain connected.

## Actual screenshots

New captures were taken through normal staff login to the local application using the user-authorized demo account. No authentication state or password was saved by the capture script. No clinical, booking, matching, or patient-record actions were submitted.

Original and optimized assets are in `public/assets/system/captures-20261019/`:

| Asset | Captured route | Shown interface |
| --- | --- | --- |
| ris-worklist | /worklist | Worklist scheduler, stages and filters |
| ris-modality | /modality | Modality queue |
| cms-appointments | /appointments | Scheduling workbench |
| pacs-reconciliation | /pacs/reconciliation | Study matching and review filters |

Each new screen was visually reviewed before copying into public assets. The captured queues contain no patient records. PNG originals are preserved; WebP versions and 840px mobile versions reduce transfer size. Captures are static images of the local environment, not an embedded live connection or evidence of performance metrics.

The gallery also includes two existing, visually reviewed screenshots: the CMS reception workspace and PACS viewer before study selection. The latter is explicitly labeled and does not claim to display loaded DICOM images. A reception route that redirected to login during this capture session was excluded from the new published assets.

Image metadata lives in `lib/system-captures.ts`. No generated medical image or stock workstation photograph is presented as an application screenshot. Unsupported numerical performance claims and blanket compliance/interoperability claims were replaced with current product content and technical scope review language.

## Interaction and accessibility

Native dialog for enlargement, Escape dismissal and browser focus restoration. Screenshot selection uses pressed buttons, previous/next controls and keyboard arrows within the expanded view. Images preserve their proportions. The original PNG can be opened separately for full-resolution inspection. Reduced-motion preferences are supported.

## Verification

TypeScript passed. Browser checks cover all 6 language/system routes at 1440, 1024, 768, 390 and 320px. Checks include page errors, overflow, correct system/capture, related routes, thumbnail selection, lightbox, keyboard arrows, Escape/focus restoration, scoped inquiry links and matching language route.

Evidence: `D:/VIARA/scratch/marketing-detail-redesign-20261019/`.
Local preview reused: http://127.0.0.1:5175/solutions/ris
No deployment performed.