# Victoria book reader

A read-only, book-style view of the existing Markdown. It does not maintain a second manuscript.

## Open it

Double-click **Open Book Reader.vbs** in the main Bush Survival folder. It starts the reader without a terminal window and opens the default browser. If it is already running, the launcher reuses it.

The local address is [http://127.0.0.1:4317/](http://127.0.0.1:4317/). It works on this computer while the reader is running, not on another device. After a restart, use the launcher again. There is no automatic startup task or cloud upload.

A private GitHub Enterprise Cloud Pages build is prepared but has not been deployed. Its build-checked `dist-pages` artifact becomes the site root, with the reader at `/` and print view at `/print/`. The current personal-account remote does not qualify for private Enterprise Pages access control; it must first be moved to an organisation-owned private project repository. Pages must use **GitHub Actions** as its source and **Private** visibility. See [the hosting guide](../GITHUB_PAGES.md).

## Read and review

- Choose a chapter in **Contents**. The order and titles come from the book manifest and chapter files.
- On narrower desktop windows, use **Jump to a topic…** to move straight to a plant or another major heading. The same control selects the matching preview page in **Book pages** mode.
- **Read** gives a scrolling, paper-like reading view.
- **Book pages** gives a desktop page-layout preview with previous/next page controls. Page numbers are local to the selected section, not final book pagination. Narrow screens use continuous reading so text remains readable.
- **Print view** opens `/print`, a full-book review projection with a marked working cover, contents and all 15 canonical chapters. Wait until it reports all 224 image frames and fonts ready before using the print control. The view freezes one refreshed Markdown snapshot while printing. It is not approved pagination or a field-use edition.
- Links to included project references open a side panel. External sources open separately. **View Markdown** shows the unchanged source text, read-only.
- **Emergency core draft** is a separate review sample. It is not silently added to the book or the PDF manifest.
- While the local reader is running, it checks the source files every four seconds when the tab is visible. The refresh control can also reread them. A failed refresh leaves a visible warning that the last loaded copy is being shown.
- A hosted GitHub Pages reader shows **Saved Markdown snapshot**. It cannot read files from your computer or refresh them directly. Commit and push the source change to trigger a new checked deployment.

Edit the original Markdown sections as before. No manual content copy or viewer rebuild is needed during a local reading session. A production build is a snapshot and does not follow later file edits.

## Important limits

This is a review interface, not a field-ready edition. It preserves draft warnings and does not change any content approval. As of 30 September 2026, all 15 chapter files contain reader-facing prose, with preceding warnings and evidence-confidence labels. The separate emergency sample is an older, incomplete review artifact, not the current manuscript.

Typography, margins, chapter hierarchy and table/warning styling suggest the feel of a printed book. Browser page breaks, fonts, zoom and paper size can differ from the eventual designed PDF. Paged view is not an approved typesetting proof. Browser printing, if used, remains a marked draft; no final PDF has been produced or cleared by this work.

Portrait diagrams use manifest-authored semantic panels in **Book pages** and print instead of a shared height cap. The full original remains visible in **Read** mode. Every generated panel repeats its working status, part number, a continuation note and a warning not to use that detached page alone. A new portrait SVG without valid panel metadata fails visibly. This protects legibility but is still only a working section preview, not final PDF pagination or technique approval.

The current manifest contains 145 working assets—99 external images and 46 original diagrams—used in 145 chapter placements. Thirty-eight portrait SVGs expand to 117 semantic panels in paged and print review. The set includes 90 plant photographs and one botanical drawing supporting twenty-nine food-relevant or hazard-recognition entries, but incomplete pictures never create eating permission. D-070/IM-206 add a visibly unapproved five-mode signalling synthesis without creating an official rescue sequence, movement permission, product method, detection promise or confirmed-contact state. D-069/IM-205 retains the serious-deterioration card; D-068/IM-204 the first-actions route; D-067/IM-203 the ordinary thermal-burn limits; D-065/IM-201 and D-066/IM-202 the asthma and provisional bower-fruit limits; and D-064/IM-200 the first-time identity stop. All medical, shelter, plant, fish, water, navigation and fire visuals retain their recorded limitations. Only registered local assets are displayed; unknown or remote image references fail visibly. The source register contains 490 entries, and the open safety register extends through SR12-30. FIELD_READY_BUILD=NO remains controlling.

QA-035 controls the current manuscript, reader, print-route and asset state. WEB-QA-001 separately checks the static root and repository-subpath builds. QA-034 and earlier entries remain historical baselines for their named changes. All 38 portrait SVGs have semantic metadata and produce 117 working panels; the complete originals remain available in Read mode. The full-book route renders 145 placements as 224 visible frames. Its crop containers use non-scrollable clipping so focus cannot shift a panel away from its registered boundary. This still does not create final page numbers, a PDF or a physical proof. `FIELD_READY_BUILD=NO` remains controlling.

The reader loads the canonical chapters, the separate review sample, key controls and directly linked reference material (at most two link levels). It does not expose arbitrary requested files or import the whole workspace. Some deeper or excluded project links can show “Reference unavailable”; the original Markdown link is retained.

## Maintenance

- Install from the lockfile with `npm ci` if dependencies need restoring.
- `npm start` runs the local reader and live Markdown endpoint.
- `npm run check` checks the authored application/types. The untouched starter's full component catalog has separate lint findings; this command does not pretend to fix them.
- `npm test` runs the 27 data, projection, hosted-publication-allowlist, private Enterprise Pages root/access-gate, rendering-policy, page-slice and request-boundary checks.
- `npm run build` verifies a rebuildable application snapshot. Do not confuse its generated files with canonical book content.
- `npm run build:pages` creates the static reader and print view in `dist-pages`; `npm run check:pages` checks both entry pages and all registered image files. `npm run preview:pages` serves that generated snapshot locally.
- Source: `app/reader.tsx`, `app/book-markdown.tsx`, `app/print/print-book.tsx`, `app/globals.css`, `lib/book-library.mjs`, `lib/print-book.mjs`, `lib/book-images.mjs` and `../book/assets/manifest.json`; chapter order: `../book/MANIFEST.md`.

The local server binds only to loopback. Its book-data endpoint accepts only local-host, same-origin GET requests and does not accept a filesystem path supplied by a visitor. Do not expose the development server to the internet or change it to listen on all interfaces.

The reader was built using the Sites starter and its existing interface components, with the local Markdown connection implemented for this project. Markdown rendering uses [react-markdown](https://github.com/remarkjs/react-markdown) and [remark-gfm](https://github.com/remarkjs/remark-gfm). No generated imagery was required for this reading interface.
