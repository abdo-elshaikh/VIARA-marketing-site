# Implementation Planning & Capacity Estimator Route (English)

## Overview
English diagnostic planning page featuring the interactive DICOM archive storage estimator, implementation package matrix, phased deployment roadmap, and financial ROI calculator.

## Interface
- `[page.tsx:EnglishPlanningPage]` - Server page rendering English planning view
- `[page.tsx:metadata]` - English page SEO configuration
- `[page.tsx:dynamic]` - Dynamic rendering policy (`force-dynamic`)

## Invariants
- `[page.tsx:EnglishPlanningPage]` Enforces English localization tokens across calculator inputs and package comparisons

## Side Effects
- Writes planned scope estimates to `sessionStorage` under `viara-planned-scope`
- Writes estimated ROI summaries to `sessionStorage` under `viara-roi-summary`

## Verification
- Run: `npm test`
