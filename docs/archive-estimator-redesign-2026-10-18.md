# Archive estimator redesign — 2026-10-18

- Replaced generic full-page calculator classes with isolated `archive-estimator` styling.
- Compact dialog title and close control; responsive two-column inputs/result layout, stacked on mobile, scroll confined to dialog.
- Adjustable assumptions and calculation method use native disclosures.
- Existing estimateArchive calculation, schema limits, units and proposal callback preserved.
- Added reset, unique input IDs and described ranges. Empty/decimal/out-of-range inputs invalidate the estimate and disable attachment.
- At least one modality remains selected. Selection does not silently alter average study size.
- Home file recovered exactly from prior full saved content after a write-helper variable collision; only intended change is the calculator dialog CSS class.

Validation: TypeScript passed. Arabic/English modal previews at 1440, 1151, 1024, 768, 390 and 320 pixels; no horizontal overflow. Default 1.5 TiB, branch scaling 6.9 TiB, retention/copies 41.2 TiB checked. Reset, invalid values, attachment into inquiry without submission, Escape/focus restoration and standalone planning layout passed. No browser page errors.

Evidence: `D:/VIARA/scratch/marketing-archive-estimator-20261018/results.json`.