# Victorian Bush Survival Field Guide project

The project is creating a personal-use field guide restricted to Victoria. Commercial development is parked.

Edit the individual Markdown chapters, then rebuild the combined file and, last, the PDF. The current chapters contain readable working prose and practical instructions, with visible warnings and unresolved limits. They have not been independently approved. Only checked and approved content may enter a field-ready edition.

## Read the book on screen

Double-click **Open Book Reader.vbs** in this folder. It opens a read-only, book-style view with contents navigation and a desktop page preview. While it is running, [open the reader](http://127.0.0.1:4317/). After a computer restart, use the launcher again.

The reader follows edits to the original Markdown; it does not keep a second manuscript. All 15 chapters now contain readable content. The older emergency review sample remains separate and is not the current manuscript. This is not a field-ready edition or a final PDF proof. [Reader instructions and limits](reader/README.md).

## GitHub Pages hosting

The same themed reader is live at the public project address [https://burhaantargett.tech/bush-survival-au/](https://burhaantargett.tech/bush-survival-au/). The deployment of commit `c8eb207` completed successfully, and HTTP checks confirmed the reader, print view, a registered diagram, and the generated JavaScript and CSS assets. Pages uses **GitHub Actions** as its source; do not publish the repository branch root. The workflow builds and uploads only `reader/dist-pages`, using the base path reported by GitHub so its links and assets work beneath `/bush-survival-au/`.

The repository and Pages site are public. Deploying makes the allowlisted manuscript records and all bundled registered images publicly accessible. The Actions variable `PUBLISH_BOOK_READER=YES` is the explicit deployment switch, not a field-readiness or rights approval. `FIELD_READY_BUILD=NO` remains controlling, and unresolved image-rights, copyright, ICIP, cultural-authority and safety warnings still require review.

A future project-specific custom domain such as `survival.burhaantargett.tech` should require only GitHub Pages and DNS configuration. The existing build reads GitHub's configured base path, so the same source can move from `/bush-survival-au/` to the custom domain root without hard-coded path edits. That future subdomain arrangement has not yet been tested. Read [the GitHub Pages setup, public-disclosure and custom-domain notes](GITHUB_PAGES.md) before changing it.

## Project records

Start with:

1. [Current state](CURRENT_STATE.md)
2. [Universal content validation gate](CONTENT_VALIDATION_GATE.md)
3. [Editable book source](book/README.md)
4. [Book build manifest](book/MANIFEST.md)
5. [Plain-language writing rules — apply to existing and new content](EDITORIAL_STYLE_GUIDE.md)

Durable project records:

- [Project brief](PROJECT_BRIEF.md)
- [Decision log](DECISION_LOG.md)
- [Content and claim register](CONTENT_REGISTER.md)
- [Research register](RESEARCH_REGISTER.md)
- [Source register](SOURCE_REGISTER.md)
- [Book structure](BOOK_STRUCTURE.md)
- [Species register](SPECIES_REGISTER.md)
- [Image register](IMAGE_REGISTER.md)
- [Safety review](SAFETY_REVIEW.md)
- [Comprehensive first-aid kit register](FIRST_AID_KIT_REGISTER.md)
- [Medical entry template](book/MEDICAL_ENTRY_TEMPLATE.md)
- [Book style guide](book/STYLE_GUIDE.md)
- [Archived Gate 1 commercial assessment](PHASE_1_MARKET_VALIDATION.md)
- [Archived commercial model](COMMERCIAL_MODEL.md)
- [Content validation log and archived commercial test plan](VALIDATION_LOG.md)
- [Existing-content language review](research/PLAIN_LANGUAGE_REVIEW.md)
- [GitHub Pages deployment guide](GITHUB_PAGES.md)
- [Equipment checks and unperformed test worksheets](research/equipment/SYSTEM_CHECK_WORKSHEETS.md)
- [Proposed initial reviewer enquiries — not sent](research/reviewer-briefs/INITIAL_REVIEW_ENQUIRIES.md)

No survival instruction, species entry, medical instruction or Indigenous-knowledge content has yet been approved for field use.
