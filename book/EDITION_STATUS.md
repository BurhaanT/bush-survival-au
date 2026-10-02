# Edition status

**Edition:** Illustrated working manuscript 0.13, updated 2 October 2026

**Scope:** Victoria, Australia  
**Field-ready:** NO  
**Current validation revision:** QA-036 records the action-first editorial pass and reader navigation for the 145-asset working edition. It supersedes QA-035 only for current manuscript wording, document counts and reader presentation; QA-035 remains the signalling-card and asset baseline. WEB-QA-003 records the successful public `/bush-survival-au/` deployment from commit `c8eb207`; the action-first edition is not live until a later checked deployment. The future `survival.burhaantargett.tech` option remains unconfigured and untested. The route still contains exactly the 15 manifest chapters, 145 placements and 224 visible frames; all 38 portrait SVGs use their 117 manifest-defined panels while Read mode preserves every complete original. No PDF, controlled A5 pagination, physical proof or human review exists. `FIELD_READY_BUILD=NO` remains controlling.

**Reason:** The 15 canonical chapters now put immediate actions and short decision branches before background and evidence notes. The urgent opening chapters were shortened, first aid gained a symptom-to-action index, and plant/fishing material now has explicit stranded-now, pre-learned and reference boundaries. The manifest still contains 145 working visuals—99 external images and 46 original diagrams—used in 145 chapter placements; 38 portrait SVGs expand to 117 semantic review panels. The plant chapter still contains twenty-nine pictured food-relevant or hazard-recognition entries, and the fish atlas remains incomplete and non-authoritative. Medical, shelter, water, fire, plant-identification, fishing and other consequential techniques remain working material pending the named specialist, practical and stressed-reader reviews. The guide is not field-ready; `FIELD_READY_BUILD=NO` remains controlling.

**Layout clarification:** D-057 changes only how portrait SVGs are displayed in paged and draft-print contexts. It does not change any asset byte, source conclusion, confidence estimate or approval state. Each panel repeats its working label, part number, continuation context and detached-page warning; missing metadata fails visibly instead of shrinking the image. The shared crop uses non-scrollable clipping so focus and print preparation cannot shift the visible slice away from its registered boundary.

**Print-route clarification:** D-058 adds a fail-closed `/print` review route, not a released book. It projects only the canonical chapters, repeats the working-edition status, waits for fonts and all image frames, and blocks ordinary selected-section printing. Browser layout is provisional until a marked working PDF is exported, rendered page by page and physically checked.

## Build approval

`FIELD_READY_BUILD=NO`

Changing this flag is an editorial approval decision, not a formatting step. It may be changed to `YES` only after the edition and PDF gates in `CONTENT_VALIDATION_GATE.md` are complete and recorded.

## Current allowed output

- Working combined Markdown with a prominent not-for-field-use warning.
- Read-only local webpage with persistent draft warnings, including the dedicated full-book `/print` review route. Neither its section preview nor its full-book browser pagination is final PDF pagination or a field-use approval.
- Live static GitHub Pages snapshot at `https://burhaantargett.tech/bush-survival-au/`, deployed through GitHub Actions from commit `c8eb207`; the reader, print route and checked assets returned HTTP 200. Deployment-base handling is intended to support a later `survival.burhaantargett.tech` custom domain without source edits, but that domain remains unconfigured and untested. Public hosting exposes the allowlisted manuscript and all bundled images; it does not clear the private-copy ICIP, attribution, licence, image-rights or disclosure issues recorded in `GITHUB_PAGES.md`.
- No field-ready PDF.
