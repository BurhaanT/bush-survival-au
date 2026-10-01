# Book build manifest

The combined Markdown and PDF must use this order. The list is explicit so a rebuild is deterministic.

1. `chapters/00-front-matter.md`
2. `chapters/01-how-to-use-this-guide.md`
3. `chapters/02-first-minutes.md`
4. `chapters/03-emergency-communication.md`
5. `chapters/04-stay-or-move.md`
6. `chapters/05-temperature-and-shelter.md`
7. `chapters/06-first-aid-and-evacuation.md`
8. `chapters/07-water.md`
9. `chapters/08-fire.md`
10. `chapters/09-navigation-and-signalling.md`
11. `chapters/10-victorian-regions-and-seasons.md`
12. `chapters/11-plants-and-natural-materials.md`
13. `chapters/12-food-fishing-and-wildlife.md`
14. `chapters/13-preparation-and-kits.md`
15. `chapters/14-sources-reviewers-and-limitations.md`

## Build policy

- The chapter files above are canonical.
- A build may include only chapters whose gate status permits it.
- An emergency-core PDF may omit later natural-resource chapters while their longer reviews are incomplete.
- Build metadata must include edition date, source version and review status.
- PDF generation and QA follow the edition gate in `../CONTENT_VALIDATION_GATE.md`.

