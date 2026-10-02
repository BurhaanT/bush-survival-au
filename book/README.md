# Editable book source

This directory contains the original, editable Markdown files for the personal Victorian Bush Survival Field Guide.

## Where to make edits

- Edit individual files in `chapters/`.
- Keep chapter order in [MANIFEST.md](MANIFEST.md).
- Record factual and instructional units in [../CONTENT_REGISTER.md](../CONTENT_REGISTER.md).
- Record sources in [../SOURCE_REGISTER.md](../SOURCE_REGISTER.md).
- Record species and visuals in their dedicated registers.
- Do not manually edit the combined Markdown or PDF outputs.

Generated files will be:

- `output/markdown/VICTORIAN_BUSH_SURVIVAL_FIELD_GUIDE.md`
- `output/pdf/VICTORIAN_BUSH_SURVIVAL_FIELD_GUIDE.pdf`

During research, a guarded assembly creates `output/markdown/VICTORIAN_BUSH_SURVIVAL_FIELD_GUIDE_WORKING.md` with a prominent warning. A field-ready assembly is blocked by [EDITION_STATUS.md](EDITION_STATUS.md) until all applicable gates are complete.

## Editorial workflow

1. Define the chapter questions and reader actions.
2. Research claims into an evidence packet.
3. Assign IDs and consequence levels.
4. Compare sources, record conflicts and define the supported scope.
5. Write practical review prose now, with preceding warnings for unreviewed high-consequence material; do not invent unsupported procedures.
6. Add verified visuals and captions.
7. Run specialist and usability reviews where required.
8. Mark content Approved or Restricted.
9. Assemble the combined Markdown.
10. Generate and visually verify the PDF last.

## Drafting rule

The 7 September 2026 revision replaces the outline-only restriction. The canonical chapters now contain readable working prose and practical steps. High-consequence sections have preceding warnings and evidence-confidence labels. Unresolved material is not independently approved, and unsafe gaps are not filled by guessing. The working assembly can include these clearly marked chapters; a field-ready assembly still requires the full release gate.

## Geographic rule

Every chapter is Victoria-specific. National guidance may be used when applicable, but Victorian environment, law, emergency systems, species distribution and seasonal context must be checked explicitly.

## Activity rule

The reader enters through the emergency, not through an activity category. Hiking, camping, 4WD, fishing, hunting, prospecting, paddling, working and other contexts are mentioned only when they change hazards, available shelter/equipment, legal conditions or the safest decision.

## Life-first rule

In a true emergency involving an immediate risk of death or really serious injury, the guide must not tell a reader to withhold the only reasonable lifesaving action merely to preserve ordinary activity compliance. The exceptional action must be necessary, proportionate and the least harmful workable option; emergency contact is attempted where possible; the action stops when the danger is controlled; and the ordinary rule remains visible. This is not blanket legal permission and does not validate a missing method or make an unsafe food, water source, fire or tool safe.

## Medical presentation rule

Every practical first-aid entry must show two sections checked by a medical reviewer:

1. **With a first-aid kit** — list the exact supplies needed.
2. **Without a first-aid kit** — also applies when a kit is missing those supplies.

The second section is not permission to invent a substitute. Say when no safe replacement exists and whether missing equipment makes rescue or medical care more urgent.

Use [MEDICAL_ENTRY_TEMPLATE.md](MEDICAL_ENTRY_TEMPLATE.md) for every condition or injury, and link kit items to [../FIRST_AID_KIT_REGISTER.md](../FIRST_AID_KIT_REGISTER.md).

## Plain-language rule

Apply [../EDITORIAL_STYLE_GUIDE.md](../EDITORIAL_STYLE_GUIDE.md) to every new or existing page, caption and instruction. Keep source details and safety limits intact. A language edit does not count as medical, botanical or other specialist approval.

For an incident-facing chapter, put **Do this now**, short `if … then …` branches, stop rules and checks before background or source discussion. Separate material meant to be learned before a trip from the route used while stranded. Keep warnings beside the action they govern, but move repeated project-process detail to the registers.
