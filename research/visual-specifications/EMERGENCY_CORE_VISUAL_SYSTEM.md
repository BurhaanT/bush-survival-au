# Emergency-core visual system — review specification v0.1

**Prepared:** 4 September 2026  
**Language revision:** 6 September 2026; labels edited, not safety-approved  
**Applies to:** specialist-review prototype only  
**Status:** page layout planned; no factual picture or diagram approved  
**Source:** `research/review-drafts/EMERGENCY_CORE_REVIEW_PROTOTYPE_v0.1.md`

## Design job

A stressed reader must be able to:

1. find advice for the problem they face without choosing an activity;
2. see the immediate action and its stop condition before explanatory text;
3. distinguish common actions from condition-specific exceptions;
4. find both **With a first-aid kit** and **Without a first-aid kit** sections, including when a kit is missing the needed item;
5. avoid transferring a technique to a superficially similar emergency;
6. return to the shared response/breathing, communication, movement and monitoring pages without searching through prose.

This plan sets out what stands out on the page and how to prevent reading mistakes. It does not approve the anatomy shown, equipment use, the shape of land or emergency wording. Apply the [plain-language rules](../../EDITORIAL_STYLE_GUIDE.md) to every label and caption, including existing ones.

## Physical assumptions to test, not decisions

- Candidate portrait sizes: 6 x 9 inch and A5.
- Candidate use: bare hands, wet/cold gloves, low light, vehicle interior and a clear waterproof sleeve.
- Critical pages should work as facing spreads but must remain safe when printed single-sided or viewed one page at a time.
- No minimum type size, colour palette, paper or binding is approved until full-size print tests.
- Colour may reinforce categories but can never be the only carrier of meaning.

## Elements used throughout the guide

| Element | Function | Constraint |
|---|---|---|
| Section word | Names the emergency in plain language | Never rely on icon alone. |
| Urgency line | States `CALL 000`, `DO THIS NOW`, `DO NOT MOVE` or another approved priority | Exact wording/content status must be approved; no decorative alarm language. |
| Numbered steps | Shows what to do and in what order | Usually one action per number; put the warning beside the action. Name roles when people must act at the same time. |
| Kit split | Separates selected equipment use from no-supply care | Shared actions appear before the split; columns must stack in the same order on narrow/mobile output. |
| Stop/never panel | Prevents a known high-consequence error | Must be visible without following a footnote or page turn. |
| Keep checking / movement strip | Links changes, location and limits on moving | Must agree with the positioning and movement rules for that injury or illness. |
| Page link | Sends the reader to one named page | Use the final page number and title; never “see above.” |
| Last-checked date | Shows when medical, emergency-service or land-use advice was reviewed | Small but readable; not mixed with lifesaving action. |
| Review watermark | Prevents prototype misuse | Present on every review page; removed only after register approval. |

## Navigation model

The reader should not choose “hiking,” “camping,” “4WD” or “fishing.” The opening index uses problems they can recognise. These are proposed headings, not approved instructions:

```text
SOMETHING IS WRONG
        |
        +-- Immediate danger now? ------------> DANGER / WHEN TO MOVE
        |
        +-- Person not responding or not breathing normally? -> RESPONSE / CPR
        |
        +-- Obvious life-threatening bleeding? --------> SEVERE BLEEDING
        |
        +-- Lost / cannot safely return? --------------> GET HELP + STAY/MOVE
        |
        +-- Cold, overheated, injured or suddenly ill? -> CONDITION INDEX
        |
        +-- Already called for rescue? ----------------> WAIT / KEEP CHECKING / TELL RESCUERS
```

The exact order, including when severe bleeding changes the next action, remains unresolved under `BLS-001`. This layout sketch cannot be used as an emergency sequence until a medical reviewer approves it.

## Page-system wireframes

### A. Emergency entry spread — IM-001 / IM-015

```text
LEFT PAGE                              RIGHT PAGE
+----------------------------------+   +----------------------------------+
| FIRST MINUTES                    |   | GET HELP                         |
| [REVIEW COPY]                    |   | 000 / location first             |
|                                  |   |                                  |
| 1 DANGER                         |   | PHONE CONNECTS                    |
| 2 RESPONSE + SEVERE BLEEDING     |-->| say service + location + event   |
| 3 SEND FOR HELP                  |   |                                  |
| 4 AIRWAY / NORMAL BREATHING      |   | NO MOBILE CONTACT                |
| 5 CPR or condition page          |   | carried satellite / PLB branch   |
|                                  |   | [deployment picture excluded]    |
| [DECISION REQUIRED: BLS-001]     |   |                                  |
|                                  |   | TELL THEM / REPORT CHANGES       |
| footer: exact linked pages       |   | footer: follow rescuers' advice  |
+----------------------------------+   +----------------------------------+
```

Error tests: catastrophic bleeding must be found without losing abnormal-breathing/CPR; 112 must not appear superior to 000; a reader must not believe ordinary SMS reaches 000.

### B. Stay/findable and movement spread — IM-002 / IM-017

```text
START: IS THE CURRENT PLACE OR POSITION BLOCKING LIFESAVING CARE?
   |
   +-- YES --> MOVE ONLY AS NEEDED --> CHECK AGAIN --> REPORT NEW POSITION
   |
   +-- NO --> HAS HELP / PLB BEEN ACTIVATED?
                 |
                 +-- YES --> HELP RESCUERS FIND YOU + SHELTER + STAY TOGETHER
                 |
                 +-- NO --> STOP / LAST CERTAIN POINT
                               |
                               +-- go a short way back [REVIEW LIMITS]

SEPARATE BOXES BELOW — NEVER ONE CONTINUOUS ARROW:
[MOVING WITH HELP] [RESCUERS TAKE YOU TO CARE] [SPECIALIST RESCUE — NOT TAUGHT]
```

Error tests: no path from “PLB acknowledged” to beacon off; no casual lone messenger; no arrow that turns minimum movement into a long carry.

### C. Medical condition page — IM-016

```text
+------------------------------------------------------+
| CONDITION + URGENCY             [page tab / word]    |
| REVIEW STATUS / DATE CHECKED                          |
+------------------------------------------------------+
| RECOGNISE: observable signs + uncertainty             |
| WHEN TO CALL / MOVE: limits on position and movement  |
+------------------------------------------------------+
| DO THIS NOW — shared numbered actions                 |
+--------------------------+---------------------------+
| WITH A FIRST-AID KIT     | WITHOUT A FIRST-AID KIT   |
| exact KIT IDs            | safest supported action   |
| training / limits        | what cannot be replaced   |
+--------------------------+---------------------------+
| DO NOT: warnings beside the step they affect          |
+------------------------------------------------------+
| KEEP CHECKING / WHILE WAITING / TELL RESCUERS          |
+------------------------------------------------------+
| evidence IDs | reviewer/version/date | page links     |
+------------------------------------------------------+
```

On a narrow/mobile rendering, the right column moves immediately below the left without changing heading order. It must not appear to be a second, lower-priority afterthought.

### D. Response/breathing/CPR — IM-015

Use one CPR sequence only. Any body-mechanics CPR diagram remains withheld until `BLS-004` and relevant reviewers are complete. D-049 permits one narrow, visibly unapproved adult/child-age-one-plus recovery-position refresher as IM-188. It does not demonstrate CPR mechanics, infant handling, condition-specific positioning or practical competence, and it does not relax the remaining hold.

Required visual distinctions:

- responsive versus unresponsive;
- normal versus abnormal breathing, with reviewer-approved gasping cue;
- CPR needed versus side-position/airway observation;
- barrier/AED available now versus no equipment;
- drowning and contamination cross-links without a second CPR algorithm;
- current ANZCOR stopping criteria, never a time clock.

Forbidden visual shortcuts:

- one silhouette implying identical hand/head/breath mechanics for all ages;
- an AED icon that sends a solo rescuer away from the person;
- an oxygen-saturation reading used as a CPR or CO decision gate;
- a progress bar or timer implying CPR can stop after a duration.

### E. Distinguishing severe bleeding from snakebite care — IM-190 / IM-189 / IM-023

The severe-bleeding page and snakebite pressure-immobilisation page must not share an unlabelled bandage icon. Pressure immobilisation (PIT) combines a reviewed bandaging method with keeping the limb still. Labels must explain this without suggesting that the two types of bandaging are interchangeable.

```text
LIFE-THREATENING BLEEDING             SUSPECTED SNAKEBITE
Purpose: stop blood loss             Purpose: slow venom spreading
Action: press on the bleeding point  Action: keep still + reviewed bandaging
Tourniquet: only if approved         Tourniquet: NEVER for snakebite
Check: bleeding controlled           Check: exact reviewed bandage checks
Movement: follow the condition page  Movement: keep the person and limb still
```

Under D-050, IM-189 is a narrow working-edition implementation of the IM-009 concept: a text-led immediate-action card and pressure-immobilisation concept map, not approved technique art. It may show 000/CPR priority, stillness, continuous observation, prohibitions and intended whole-limb coverage/immobilisation. Its local-first two-bandage wording must be labelled as one ANZCOR-permitted method, not a proven best method. The concept map does not show wrap geometry, overlap, force or verified pressure and does not resolve an unknown bite site, non-limb placement, upper-limb handling, child sizing, self-application, no-kit wrapping/splinting or lone/no-contact movement.

Under D-051, IM-190 is the corresponding severe-bleeding working-edition exception: a text-led direct-pressure decision card, not force, hand-position, wound-depth, tourniquet or packing technique art. It may show early 000, the bleeding-point versus embedded-object wording, kit/no-kit material options, one-or-two-pad reassessment, trained-product limits, observation and the explicit distinction from snakebite PIT. It may not show a generic body pressure point, tourniquet placement/tightening, product art, improvised construction, haemostatic application, wound packing, specialised eye/torso impalement care or a lone-rescuer bleeding-versus-CPR algorithm.

The D-050 and D-051 exceptions do not approve IM-023, a generic PIT technique or a tourniquet comparison panel. Apart from the bounded IM-189 coverage concept map and IM-190 text-led direct-pressure card, factual technique panels remain blank until exact equipment, anatomy, pressure intent/checks, sequence, failure response and stop rules are approved and physically tested. `FIELD_READY_BUILD=NO` remains controlling.

### F. Anaphylaxis action/position set and when not to give food or drink — IM-191–IM-193 / IM-024 / IM-025

Position cannot be encoded as one universal person icon. Use a labelled decision inset owned by the relevant condition:

```text
UNRESPONSIVE + NORMAL BREATHING --> reviewed side/airway path
UNRESPONSIVE + ABNORMAL BREATHING -> CPR path
POSSIBLE ANAPHYLAXIS --------------> approved allergy position branches
BREATHING DISTRESS WITHOUT THAT ----> condition-specific path
VOMITING / PREGNANCY / SPINE ------> visible exception, not footnote
```

D-043’s split-not-shrink rule and D-052 create one product-neutral three-card review system: IM-191 covers recognition and immediate action; IM-192 gives the ordered position decision; IM-193 covers five-minute reassessment, no-product limits, asthma overlap, continued observation and hospital follow-up. The split exists to preserve readable action text and visible branch ownership; it is not permission to distribute three unreviewed cards as field-ready instructions.

IM-192 specifically implements the anaphylaxis-position need previously assigned to IM-024. It is not product training or a recovery-position movement demonstration. Its priority order must be unmistakable: unresponsive **and** not breathing normally goes to the canonical CPR path; otherwise use the first applicable pregnancy, vomiting/unresponsive-normal-breathing, difficult-breathing or flat row. It must preserve “never stand or walk”, keep difficult-breathing sitting on the ground with legs outstretched rather than in a chair, and show infant/young-child flat or legs-out positioning across a carer’s lap rather than upright/over a shoulder.

IM-191 may show the any-one-severe-sign/no-rash rule, the CPR gate, adrenaline first, 000 and an immediate missing-product alert. IM-193 may show five-minute follow-up, the fuller no-product branch, adrenaline-before-asthma overlap, continuous response/breathing checks and required ambulance/hospital care despite improvement. No card may show a brand, dose, route, cap/end, activation, hold time, anatomical target, age/weight selection, expired/borrowed-product rule or ampoule-and-syringe technique. IM-191’s severe/persistent abdominal-pain or repeated-vomiting wording must remain visibly qualified pending allergy-clinical review.

Each card must state that its 95% source-match and 60% new-layout estimates are subjective and are not probabilities of safety, treatment success or survival. Review must test every card alone and the complete navigation sequence, including whether a reader reaches IM-192/IM-193 without delaying adrenaline, 000 or CPR.

D-052 does not approve a competing IM-024, product panel or generic adrenaline-device silhouette. Any later product-specific visual needs a new unique image record, current exact-product evidence, pharmacist/device and allergy review, inert-trainer testing and a fresh post-layout gate. `FIELD_READY_BUILD=NO` remains controlling.

Food and drink need a clear decision check. A decorative water bottle must not imply that everyone should drink:

```text
NOT RESPONDING / DROWSY / HAVING A SEIZURE / CANNOT SWALLOW SAFELY --> NOTHING BY MOUTH
SUSPECTED STROKE OR POISONING ---------------------> CONDITION PAGE; NO GENERIC DRINK
DIABETES / HEAT / COLD ----------------------------> ONLY APPROVED CONDITION PATH
SHOCK WHEN THE CAUSE IS NOT YET KNOWN ------------> NO GENERAL WATER RULE
```

`COLD-004` and `ILL-004` remain researching and cannot be converted into affirmative instructions.

### G. While waiting: keep checking and tell rescuers — IM-018 / IM-019

```text
KEEP WATCHING
response -- normal breathing -- severe bleeding -- environment
     ^                                             |
     |                                             v
CHECKS FOR THIS INJURY OR ILLNESS <--- change / treatment / new symptom
     |
     +--> TELL 000 / RESCUE --> record fact + time --> continue care
```

No generic five- or ten-minute interval. A visible statement must say that paperwork or a device never interrupts CPR, pressure, airway care, cooling or emergency contact.

Casualty record layout priorities:

1. immediate danger/change;
2. location and incident;
3. response/breathing/bleeding;
4. actions, exact product/dose only if known, and time;
5. allergies, regular medicines/history;
6. access/environment;
7. a large, legitimate `UNKNOWN` option.

### H. Shelter air and carbon monoxide — IM-020

Use a cut-away diagram checked against sources, not a dramatic illustration. Explain carbon monoxide (CO) as a poisonous gas from burning fuel. Keep that term and its warnings beside each separate diagram where needed.

Required objects:

- tent/swag;
- vehicle;
- enclosed awning/bothy/improvised shelter;
- outdoor-use stove/heater/lantern/charcoal and engine exhaust placed outside with a prohibition line preventing entry;
- wind arrows showing that exhaust may enter an opening without defining a “safe” distance;
- multiple people/pet symptom clue and fresh-air route;
- proposed labels: `YOU CANNOT USE SMELL TO RULE OUT THIS GAS`, `A NORMAL BLOOD-OXYGEN READING DOES NOT RULE OUT POISONING`, and `AN ALARM DOES NOT MAKE INDOOR FUEL-BURNING SAFE`.

No flame, exhaust plume or cracked opening may be drawn in a way that looks like approved indoor use.

### I. Flash-flood site and movement — IM-021

Create a schematic terrain cross-section from reviewed landform scenarios, not a Victorian map or invented flood contour.

Show and label:

- active waterway, dry channel, culvert/drain and broad floodplain;
- site selected outside the water path;
- a dry, known escape route to least-hazard higher ground;
- competing isolated-tree, saturated-tree, exposed ridge, cliff and lightning hazards;
- warning/lead-time move before water rises;
- water-present boundary labelled `DO NOT WALK, SWIM, RIDE OR DRIVE THROUGH`;
- reported-location update after a necessary move.

Do not show water depth against a person/vehicle as a pass/fail crossing gauge. Do not label a fixed horizontal distance “safe.”

### J. Alpine dangers that combine, and limits of relying on huts — IM-022

Show how the dangers affect one another. Explain “whiteout” as loss of visible ground and horizon detail in snow conditions, and “UV” as ultraviolet radiation from the sun. Exact labels and weather relationships still need specialist review:

```text
SNOW / WIND / RAIN / FOG-WHITEOUT / ICE / LIGHTNING / UV
       |              |                  |
       v              v                  v
TEMPERATURE        NAVIGATION         SHELTER / TREE / ROAD
       \              |                  /
        +---------- RESCUE ACCESS -------+
```

The hut panel must show uncertainty:

- known and safely reachable now;
- occupied/full, damaged/unavailable or unlocatable;
- dangerous route/whiteout/ice/water/avalanche terrain;
- carried shelter remains necessary.

No arrow points to a hut across unknown terrain. No snow-cave, cornice test, transceiver search or avalanche rescue diagram.

## Asset-production rules

- Information diagrams should be original vector artwork built only after the relevant wording/geometry has an approved review decision.
- Technique art must be reconstructed from current guidance and exact tested equipment; it cannot be traced from copyrighted training material without permission.
- Medical, equipment, terrain, weather, plant and animal accuracy cannot be supplied by generative imagery.
- Generic icons may be commissioned/created only where they make no factual anatomy, equipment or behaviour claim; every icon still receives an `IM-` record.
- Source photographs used for scenario testing are research inputs, not automatically publishable assets.
- Every placed crop/caption receives post-layout factual review because cropping can remove the prohibition, body position, scale or escape route.

## Review and test sequence

1. Subject-matter reviewer approves the decision logic and exact wording without visual styling.
2. Information designer creates a grayscale wireframe using blank technique placeholders.
3. Reviewer checks whether grouping/arrows create any new implied instruction.
4. Exact equipment/technique visuals are produced and independently checked.
5. Full-size paper and waterproof-sleeve tests measure retrieval, errors and page-turn dependence.
6. Low-light, wet/cold glove and narrow-screen tests repeat the cross-condition traps.
7. Final subject-matter and post-layout sign-off is recorded against every `IM-` ID.

## Questions the finished design must pass

- Can a reader find 000/location, abnormal breathing/CPR and catastrophic bleeding without choosing an activity first?
- Can a reader correctly say why an arterial tourniquet and PIT are different?
- Does every no-kit panel state when no safe substitute exists?
- Can a reader see the rule for positioning the person, and any reason not to give food or drink, before acting?
- Does any page imply safe indoor combustion, floodwater crossing, blind higher-ground movement or guaranteed hut access?
- Do review status and excluded placeholders prevent accidental field use?
- After a page is separated from the book, does it still retain the emergency call, movement, monitoring and currency context it needs?

No visual advances to approved or restricted status until these questions and the specific `IMAGE_REGISTER.md` requirements are satisfied.

Ask new readers to explain labels and arrows in their own words. Record what they think the first action is, what comes next and when they must stop. A clearer label is an editorial improvement, not evidence that the diagram is understood or safe.
