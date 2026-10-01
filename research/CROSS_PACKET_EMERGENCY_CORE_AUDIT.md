# Cross-packet emergency-core safety audit

**Audit date:** 4 September 2026  
**Scope:** EP-001 to EP-009, `CONTENT_REGISTER.md`, `FIRST_AID_KIT_REGISTER.md` and `SAFETY_REVIEW.md`  
**Purpose:** prevent individually plausible instructions from becoming contradictory or unsafe when used together under stress  
**Status:** authoring audit complete; no clinical or rescue content approved for field use

## Outcome

There is enough research to draft a sample for specialists to check. There is not yet an approved guide to use in the bush.

**Later language review, 6 September 2026:** the prototype and planned diagram labels have been edited under [the plain-language rules](../EDITORIAL_STYLE_GUIDE.md). This does not settle any safety conflict listed below. Counts in this audit are the 4 September snapshot, not today's register totals.

At the audit snapshot there are 148 registered content units:

- 107 at **Specialist review required**;
- 34 at **Researching**;
- 1 operational item at **Cross-checked**;
- 6 approved project/format controls, none of which is a clinical treatment approval.

No first-aid, evacuation, communications, stay/move or dangerous-temperature instruction is yet field-ready. The prototype must say this visibly on every review export. Researching propositions cannot be smuggled into prose as caveats, captions, examples or illustrations.

The smallest coherent review scope is a short emergency core built around one entry flow, one communication flow and one set of shared actions. It should not attempt to become the full medical reference yet.

## Controlling architecture

The same instruction must not be rewritten on multiple condition pages. One canonical page owns each shared action; condition pages link to it and state only their exception.

| Shared decision or action | Canonical owner | Dependent pages | Audit rule |
|---|---|---|---|
| Recognise that help is needed and stop compounding the problem | Chapter 02 / FIRST claims | All | No medical or hazard page invents a different first-minute sequence. |
| 000/112, location, phone, satellite and PLB | Chapter 03 / COMMS and BEACON claims | All urgent conditions | Condition pages state the urgency and link to the canonical contact method. |
| Stay, short retrace, minimum emergency move and organised rescue | Chapter 04 / MOVE plus EVAC claims | Injury, illness, weather and lost-person pages | No condition page silently authorises a walkout, group split or relocation after a reported position. |
| Thermal protection and shelter/site selection | Chapter 05 / COLD, HEAT and SHELTER claims | Burns, drowning, shock, monitoring and delayed rescue | A condition page states its thermal exception; shelter construction does not overwrite medical handling. |
| DRSABCD, response/breathing, CPR and AED | Chapter 06 / BLS claims | Choking, drowning, poisoning, envenomation and deterioration | One CPR sequence only; specialised pages state why breaths, contamination or water change emphasis. |
| Catastrophic bleeding, direct pressure and embedded objects | Chapter 06 / BLEED claims | Wounds, burns, fish/stingray and trauma | No cleaning, cooling or venom-pain treatment outranks uncontrolled bleeding. |
| Anaphylaxis recognition, positioning and prescribed adrenaline | Chapter 06 / ANAPH claims | Asthma, tick, insect, food and marine pages | All allergy intersections return to one product-current anaphylaxis page. |
| Pressure immobilisation technique | Chapter 06 / SNAKE claims | Funnel-web/mouse spider, blue-ringed octopus, cone shell and sea snake | Creature pages decide whether PIT applies; only one reviewed application technique exists. |
| General wound cleaning and covering | Chapter 06 / WOUND claims | Bites, burns and trauma | Pathogen/chemical-specific decontamination exceptions must be explicit and local. |
| Delayed-rescue monitoring and responder handover | Chapter 06 / MON claims | All | Condition pages add their own deterioration signs without duplicating the shared observation/log loop. |

## Candidate priority spine for specialist review

This is an architecture to review, not reader-facing medical advice:

1. Detect and reduce immediate danger without creating another casualty.
2. Check response while identifying immediately obvious catastrophic bleeding.
3. Get help started early; give the location and emergency first.
4. Open/protect the airway and decide whether breathing is normal.
5. If required, use the single canonical CPR/AED flow; otherwise control life-threatening bleeding and enter the relevant condition card.
6. Apply condition-specific actions, position and movement restrictions.
7. Protect the person from weather without obscuring airway, bleeding or required treatment.
8. Stay findable, continue condition-specific observation, record changes and follow current responder direction.

The order at steps 2-5 remains blocked by `BLS-001`: current Australian DRSABCD and the immediately obvious catastrophic-bleeding interrupt must be reconciled by a qualified Australian emergency/resuscitation clinician and tested as one flow. Until then, no “first five minutes” medical diagram may be treated as usable.

## Cross-condition conflict matrix

| Intersection | Unsafe simplification | Controlling audit decision | Main content IDs | Status |
|---|---|---|---|---|
| Live danger versus staying put | “Never move” or “always evacuate” | Use the least movement for immediate safety/lifesaving care; full evacuation is a separate responder-led decision. | MOVE-001, EVAC-002 to EVAC-006 | Review required; messenger, walkout and carry branches blocked |
| DRSABCD versus catastrophic bleeding | Two rival opening mnemonics | Produce one clinician-approved entry flow with a visible catastrophic-bleeding interrupt. | BLS-001, BLEED-001, BLEED-002 | Blocked on clinical review and timed testing |
| 000 versus Poisons Information Centre | Treat the numbers as alternatives | Immediate threats use 000/BLS; 13 11 26 provides exposure-specific advice and must not delay emergency activation. | POIS-001, BITE-001, EVAC-001 | Review required |
| Airway versus possible spinal injury | Leave an unresponsive person unmoved to “protect the spine” | Airway and normal breathing control; handle gently and minimise additional movement. | SPINE-001 to SPINE-003, MON-002, DROWN-006 | Review required |
| Condition-specific position | One universal recovery, sitting, lying or legs-up posture | Response/breathing and the condition page control. Anaphylaxis, breathing distress, seizure, vomiting and spinal concerns require visible exceptions. | ANAPH-003, ASTH-004, SEIZ-002, ILL-002, MON-002 | Joint allergy/respiratory/emergency review required |
| Oral food, drink or glucose | “Give water” as generic shock or exposure care | Nothing by mouth when response/swallowing is unsafe or poisoning/stroke is suspected; condition-specific oral paths only. | COLD-004, HEAT-004, STROKE-003, ILL-004, DIAB-002, DIAB-003, POIS-003 | Cold rule and generic shock-fluid rule blocked; joint overlap review required |
| Direct pressure versus embedded object | Press directly on or remove every source | Pressure around and stabilise a retained object; separate penetrating-eye and chest/critical-site exceptions. | BLEED-003, EYE-002, WOUND-001, MARINE-004 | Review required; no single generic illustration |
| Arterial tourniquet versus PIT | “Tight bandage/tourniquet” as interchangeable | Arterial tourniquet is for selected uncontrolled limb bleeding; PIT is a different broad-pressure/immobility system for specified envenomation only. | BLEED-004, SNAKE-002, BITE-002 | Separate visuals, terminology and kit storage required |
| PIT versus other bites/stings | Use PIT for any dangerous animal | PIT only on the reviewed Australian snake/sea-snake, funnel-web/mouse-spider and paralysis-producing marine branches. | BITE-002, SPIDER-001/002, MARINE-002 to 005 | Mouse-spider scope and recognition threshold blocked |
| Heat/cold treatment versus tissue/systemic harm | Apply hot or cold treatment based on pain alone | Systemic heat/cold illness, burn cooling and marine pain treatment are separate systems with different equipment and stop rules. | COLD-005, HEAT-003, BURN-003, SPIDER-002, MARINE-002/004 | Product, temperature and duration details blocked or review required |
| Water allocation and water type | Treat all available water as interchangeable | Burn/eye/wound/heat/jellyfish uses have different urgency, cleanliness and fresh/seawater constraints; no global water-use rule. | HEAT-003, BURN-003, EYE-001, WOUND-002, MARINE-002/003 | Needs joint burns/eye/wound/marine/water review |
| Generic wound cleaning versus decontamination exception | Put antiseptic or a bush substance on all wounds | General wounds use the reviewed clean-water/covering path; bat lyssavirus and chemical exposure retain explicitly labelled exceptions. | WOUND-002/003, BAT-002/003, POIS-004 | Exact bat product and generic wound method blocked |
| Cooling a burn versus cooling the casualty | Twenty minutes of water without whole-person protection | Continue evidence-based tissue cooling while preventing systemic hypothermia; the exact cold-environment branch needs review. | BURN-003, COLD-002/005 | Joint burns/wilderness review required |
| Natural-water cooling or aquatic rescue | Enter water because cooling or rescue is urgent | Avoid creating a second casualty; non-immersion heat cooling and land/craft-based rescue branches must be visible. | HEAT-003, DROWN-001 | Review and environmental scenario tests required |
| Choking versus CPR | Continue blows/thrusts after loss of response | Transition into the single BLS flow when the person is unresponsive and not breathing normally. | CHOKE-002 to CHOKE-005, BLS-002 | Adult/child/infant manikin review required |
| Drowning versus generic CPR messaging | Compression-only slogan displaces ventilation | The canonical Australian BLS page must visibly flag drowning's rescue-breath importance without creating a rival sequence. | DROWN-002 to DROWN-004, BLS-002 | Initial-breath/AED detail partly blocked |
| Contaminated mouth versus rescue breaths | Either withhold all ventilation or expose the rescuer | Exact poison/device branch must distinguish contamination from ordinary overdose and never promise an unvalidated barrier is protective. | POIS-005, BLS-002, KIT-002 | Blocked on toxicology/resuscitation and device review |
| Anaphylaxis versus asthma | Upright asthma advice delays adrenaline or standing worsens anaphylaxis | Suspected severe allergy uses the anaphylaxis/adrenaline/position path first; personal asthma plan remains a linked adjunct. | ANAPH-001 to 006, ASTH-001 to 004 | Joint allergy/respiratory review required |
| Stroke versus hypoglycaemia | Oral sugar given to someone with unsafe swallowing or glucose check delays 000 | Activate the stroke path; measurement is secondary and oral glucose requires reliable safe swallowing. | STROKE-001 to 003, DIAB-001 to 003 | Joint stroke/diabetes review required |
| Tick allergy versus physical removal | Generic tweezer removal copied from overseas guidance | Do not disturb pending exact Australian product/professional branch; no-product forceps advice stays out while sources conflict. | TICK-001 to 003 | Blocked |
| Bluebottle versus uncertain serious jellyfish | Vinegar or fresh water applied to all jellyfish stings | Separate clear local bluebottle from uncertain/evolving severe sting; geography alone does not clear risk. | MARINE-001 to 003 | Heat parameters, vinegar branch and call threshold blocked |
| Numbers/devices versus clinical deterioration | One “normal” result clears a serious problem | Observable condition and trend control; measurements never delay treatment/contact and appear only when separately approved. | MON-001/003, HEAT-001, STROKE, HEART, ILL and DIAB claims | Review required; no baseline oximeter/BP device |
| Monitoring versus treatment | Stop pressure, CPR, cooling or airway observation to fill a form | Lifesaving care and communication control; record opportunistically and mark unknowns. | MON-001, MON-004, MON-005 | Review and timed usability test required |
| Delayed rescue versus CPR duration | Add a wilderness time limit | Keep current ANZCOR bystander stopping criteria; no elapsed-time rule. | BLS-002, MON-006 | Review required |

## Exact propositions excluded from the first review prototype

The first prototype will not contain these as performable instructions, even with warning text:

- universal PLB deployment wording beyond following the exact model manual (`BEACON-002`);
- oral food/drink treatment for hypothermia (`COLD-004`);
- lightning fallback posture/site advice (`SHELTER-003`);
- natural-material shelter construction (`SHELTER-005`);
- final infant CPR mechanics until the third check and hands-on review (`BLS-004`);
- haemostatic packing and improvised tourniquet construction (`BLEED-005`, `BLEED-006`);
- improvised PIT materials or lone snakebite self-movement (`SNAKE-003`, `SNAKE-005`);
- exact splinting, distal-circulation technique or limb massage (`LIMB-002`, `LIMB-003`, `LIMB-005`);
- a ten-minute heart-attack call threshold or generic aspirin use (`HEART-001`, `HEART-003`);
- generic oral fluids for undifferentiated shock (`ILL-004`);
- solo chair-edge/self-thrust choking methods (`CHOKE-006`);
- uncorroborated drowning/AED detail and contaminated-CPR device detail (`DROWN-004`, `POIS-005`);
- a fixed chemical-eye flush duration or eyeball-contact speck removal (`EYE-001`, `EYE-003`);
- an exact wound-irrigation system, wound-bed antiseptic or field closure (`WOUND-002`, `WOUND-003`);
- Victorian funnel-web/mouse-spider uncertainty rules (`SPIDER-001`);
- generic tick freezing or no-product forceps removal (`TICK-001`, `TICK-003`);
- stable marine-sting exception, hot-water parameters or uncertain-jellyfish vinegar algorithm (`MARINE-001` to `MARINE-003`);
- a generic bat-wound antiseptic product (`BAT-003`);
- a no-contact messenger exception, generic walkout/private transport or improvised casualty carry (`EVAC-004` to `EVAC-006`).

Some excluded propositions are likely permanent omissions, not just deferred sections. A small field guide becomes safer when it refuses to teach high-error, training-dependent techniques that cannot be made reliable on the page.

## Smallest coherent specialist-review prototype

The first review export should contain only these page systems:

1. **Status and scope:** review-copy warning, Victoria scope, current-version box and instruction to follow live emergency-service direction.
2. **First minutes:** one candidate emergency-entry flow, with unresolved priority junctions visibly marked for the reviewer.
3. **Get help:** 000/112, exact-location prompts, no-coverage boundary, PLB decision/deployment cross-reference and status communication.
4. **Stay findable or make a minimum move:** last-known position, visible shelter, group cohesion, immediate-hazard exception and explicit technical-rescue boundary.
5. **Response, breathing, CPR and AED:** one canonical refresher framework; no final infant or specialised contamination graphic.
6. **Life-threatening bleeding:** direct pressure, embedded-object boundary and a placeholder for clinician decision on manufactured tourniquet scope; no improvised tourniquet instructions.
7. **Suspected snakebite:** stillness, 000/rescue, canonical PIT and monitoring, with improper-material and lone-self-rescue branches omitted.
8. **Anaphylaxis:** recognition, positioning, current prescribed product/plan structure and no-kit limits; product family artwork remains a reviewed, versioned module.
9. **Dangerous cold and heat:** sign-led recognition, protection/cooling principles and safe-swallow uncertainty; no active-heat placement or natural-water shortcut.
10. **Wait, observe and hand over:** response/breathing/bleeding/environment loop, condition links, casualty record prototype and PLB-on/findability reminder.

This is a **review prototype**, not the first usable edition. Other well-sourced condition pages can follow through the same review system after the core interaction has been approved and tested.

## Required review sequence

1. **Australian remote/wilderness emergency clinician:** entire prototype and cross-condition priority spine.
2. **Accredited Australian resuscitation instructor/clinician:** DRSABCD, catastrophic-bleeding interrupt, CPR/AED, recovery positioning and cessation boundary.
3. **Victorian search-and-rescue reviewer:** 000/SAR entry, stay/retrace/move, group cohesion, PLB/findability and evacuation boundary.
4. **Topic reviewers:** envenomation/toxicology for snake/PIT; allergy for anaphylaxis products/position; burns/temperature specialists for thermal pages.
5. **Information-design/usability reviewer:** flow decisions, cross-references, casualty record and visual salience.
6. **Post-layout re-review:** every reviewer sees the final words, captions, diagrams and adjacent pages, not just a text extract.

No single reviewer is asked to approve outside their competence. The remote-emergency clinician coordinates conflicts but does not replace toxicology, allergy, ophthalmology, public-health or rescue expertise.

## Prototype acceptance tests

Use inert equipment, trainer devices and mannequins only. No participant is exposed to injury, envenomation, temperature stress, poison or dangerous terrain.

- A reader reaches the correct 000/PLB/contact branch without believing 112 provides satellite coverage.
- A reader does not leave the reported position after PLB acknowledgement unless the scenario supplies a live hazard or responder direction.
- A reader distinguishes minimum emergency movement from a carry/evacuation plan.
- A reader recognises unresponsive abnormal breathing and does not let a form, device or AED search delay CPR.
- A reader finds the catastrophic-bleeding action without losing the airway/breathing path.
- A reader never confuses an arterial tourniquet with PIT.
- A reader routes a non-snake bite/sting away from PIT when the relevant creature branch excludes it.
- A reader selects anaphylaxis before asthma when severe-allergy cues are present and does not make the person stand or walk.
- A reader does not give oral fluid/glucose when swallowing is unsafe or stroke/poisoning is suspected.
- A reader records action times and change without fabricating measurements or interrupting care.
- Solo and group versions are tested with darkness, rain/cold, heat, gloves, noise, intermittent contact and one unavailable phone.
- Every failed interpretation is treated as a content/design defect, not merely “user error.”

## Audit decision

**Proceed to a marked specialist-review prototype. Do not proceed to a usable emergency-core edition yet.**

The next authoring step is to prepare reviewer briefs and a review-only Markdown prototype containing only the ten page systems above. All 34 `Researching` propositions remain outside actionable prose. The full first-aid chapter, natural-resource material and PDF field edition wait behind their respective evidence, specialist, usability and layout gates.
