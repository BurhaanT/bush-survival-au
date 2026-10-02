# Edition status

**Edition:** Illustrated working manuscript 0.15, updated 2 October 2026

**Scope:** Victoria, Australia  
**Field-ready:** NO  
**Current validation revision:** QA-038 records D-076's cross-book immediate-life-threat legal/editorial rule and the edition 0.15 reader-facing alignment. QA-037 remains the Victoria rabbit/small-animal and 146-asset working-projection baseline, QA-036 the action-first editorial baseline and QA-035 the earlier signalling baseline. Commit `9d24124` and GitHub Actions run `36958505006` deployed the earlier QA-037 content at `/bush-survival-au/`; edition 0.15 is not yet claimed as deployed. The live reader, `/print/` route and IM-207 passed the earlier post-deployment checks. The future `survival.burhaantargett.tech` option remains unconfigured and untested. The route contains exactly the 15 manifest chapters, 146 placements and 226 visible frames; all 39 portrait SVGs use their 119 manifest-defined panels while Read mode preserves every complete original. No PDF, controlled A5 pagination, physical proof or human review exists. `FIELD_READY_BUILD=NO` remains controlling.

**Reason:** The 15 canonical chapters put immediate actions and short decision branches before background and evidence notes. Chapter 12 now adds a Victoria-specific rabbit and small-animal layer before fishing, but deliberately supplies no improvised snare, trap placement, humane dispatch, rabbit field dressing or rabbit-specific cooking method. The manifest contains 146 working visuals—99 external images and 47 original diagrams—used in 146 chapter placements; 39 portrait SVGs expand to 119 semantic review panels. The plant chapter still contains twenty-nine pictured food-relevant or hazard-recognition entries, and the fish atlas remains incomplete and non-authoritative. Medical, shelter, water, fire, plant-identification, fishing, rabbit and other consequential techniques remain working material pending the named specialist, practical and stressed-reader reviews. The guide is not field-ready; `FIELD_READY_BUILD=NO` remains controlling.

**Immediate-life-threat rule:** D-076 says a genuine immediate threat of death or serious injury takes priority over ordinary activity rules only for action that is necessary, proportionate and least harmful when no safer lawful course is reasonably available. This is the guide's deliberately strict editorial threshold, not the complete or general statutory threshold. Current *Crimes Act 1958* (Vic) ss 322G, 322I, 322R and 322S provide a fact-specific defence framework and abolish common-law necessity; they do not give advance permission, immunity or a blanket survival exemption. Reader-facing chapter and SVG alignment, Victorian legal/regulator review and stressed-reader testing remain open.

**Layout clarification:** D-057 changes only how portrait SVGs are displayed in paged and draft-print contexts. It does not change any asset byte, source conclusion, confidence estimate or approval state. Each panel repeats its working label, part number, continuation context and detached-page warning; missing metadata fails visibly instead of shrinking the image. The shared crop uses non-scrollable clipping so focus and print preparation cannot shift the visible slice away from its registered boundary.

**Print-route clarification:** D-058 adds a fail-closed `/print` review route, not a released book. It projects only the canonical chapters, repeats the working-edition status, waits for fonts and all image frames, and blocks ordinary selected-section printing. Browser layout is provisional until a marked working PDF is exported, rendered page by page and physically checked.

## Build approval

`FIELD_READY_BUILD=NO`

Changing this flag is an editorial approval decision, not a formatting step. It may be changed to `YES` only after the edition and PDF gates in `CONTENT_VALIDATION_GATE.md` are complete and recorded.

## Current allowed output

- Working combined Markdown with a prominent not-for-field-use warning.
- Read-only local webpage with persistent draft warnings, including the dedicated full-book `/print` review route. Neither its section preview nor its full-book browser pagination is final PDF pagination or a field-use approval.
- Live static GitHub Pages snapshot at `https://burhaantargett.tech/bush-survival-au/`; rabbit-revision commit `9d24124` passed GitHub Actions run `36958505006`. The reader, print route and IM-207 returned HTTP 200, and the live IM-207 file matched the reviewed 6,904-byte SHA-256 record. Deployment-base handling is intended to support a later `survival.burhaantargett.tech` custom domain without source edits, but that domain remains unconfigured and untested. Public hosting exposes the allowlisted manuscript and all bundled images; it does not clear the private-copy ICIP, attribution, licence, image-rights or disclosure issues recorded in `GITHUB_PAGES.md`.
- No field-ready PDF.
