# Professional marketing redesign — 2026-10-18

## Public experience
- New responsive homepage: contextual hero, center selector, product explorer, workflow narrative, rollout introduction, FAQ and demonstration request.
- Interactive product tabs use the configured RIS/PACS/CMS content, support keyboard navigation and preserve enabled-product settings.
- Center and product selections attach to the existing inquiry form. Archive estimation, privacy dialog, published reviews and request history remain connected to the existing implementation.
- Shared public typography, surfaces, navigation, buttons and footer extend to systems, planning, workflows, company and product pages.
- Existing image assets, local fonts and Lucide icons are reused. Hero imagery and copy remain editable through the content settings.
- Workflow concepts are labelled as illustrative. Removed unsubstantiated timing, voice dictation and messaging claims from the visible product previews.
- Facility choices and restored form drafts respect the radiology and medical-center scope.

## Verification
- TypeScript passed before and after the visual refinements.
- Headless local Chrome reviewed 28 route/viewport combinations in Arabic and English at 390, 768 and 1440 px; every page returned HTTP 200, with no horizontal overflow or JavaScript runtime errors.
- Exercised product selection, RTL keyboard navigation, attaching center context to the inquiry, mobile menu dismissal, FAQ disclosure, calculator dialog and focus restoration. No inquiry was submitted.
- Preview evidence: scratch/marketing-professional-20261018/preview-results.json and associated screenshots.
- An additional content-test command was rejected by automatic permission review because the granted approval was limited to TypeScript and local browser checks. It did not run.
- No deployment was performed; the existing local server on port 5173 was reused.