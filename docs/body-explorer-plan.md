# Body Explorer Plan

## Status

Planning was approved on August 30, 2026, and implementation began immediately
afterward. Phases 1, 2A, 2B, and the Phase 3 Hand & wrist vertical slice are
implemented in production files under `workbench/robotics/body-explorer/`.

The current implementation includes the project entry, static explorer shell,
front/back body overview, the user-provided final raster artwork, a separate
inline SVG interaction map with semantic hotspot IDs, hover/focus/selected
states, data-driven paired left/right highlighting, URL-backed overview and
regional states, responsive orientation controls, the Hand & wrist palm/dorsal
study plate, its two resources, and on-demand video loading.

The next feature implementation begins at **Phase 4A — Knee vertical slice**.
Before publication, complete a final visual browser pass at the documented
wide, tablet, `620px`, `410px`, and `320px` acceptance widths.

The product remains a diagram-first educational resource navigator placed
under Robotics. STRENGTHTAPE instructional videos are the first content
collection, but the product and data model must remain open to anatomy,
exercise, and rehabilitation resources.

## Purpose

Create an interactive Body Explorer in which a visitor navigates from a
gender-neutral full-body character to a detailed body-part illustration and
then selects a more precise area to reveal related learning materials.

The intended interaction is spatial rather than conversational:

```text
Full body, front and back
└── choose Hand & wrist
    └── choose Thumb-side wrist
        ├── related area or condition label
        └── De Quervain taping video
```

The tool is an educational resource navigator, not a diagnostic system. It
must say that a resource or condition can be related to a selected area; it
must not conclude that a visitor has a particular condition.

## Project Origin

The project began from the practical difficulty of finding and organizing
useful taping instructions while dealing with hand and knee pain. The initial
STRENGTHTAPE playlist contains useful demonstrations, but the material is
organized as a conventional video list rather than as a body-centered learning
system.

This personal motivation belongs in the Robotics project introduction. The
explorer itself should remain neutral, concise, and focused on navigation.

## Repository Findings

- The portfolio is a dependency-free GitHub Pages site built with plain HTML,
  one shared `styles.css`, and small page-specific JavaScript files.
- `workbench.html` is the visual Workbench directory. Its Robotics object links
  to `workbench/robotics/index.html`.
- The Robotics page already combines physical prototypes and ongoing technical
  systems. Body Explorer fits there as a developing interactive system rather
  than as another top-level portfolio section.
- Nested pages use explicit relative links and directory-based `index.html`
  files, so `workbench/robotics/body-explorer/index.html` matches the existing
  URL structure.
- `path.html`, `bird-and-robot.js`, and the illustrated Workbench demonstrate
  that the portfolio already supports exploratory, progressively enhanced
  interactions without a framework.
- The shared visual language uses serif display type, small sans-serif labels,
  a textured white wall, dark ink, burgundy, brass, paper tones, thin rules,
  and restrained motion.
- Existing accessibility conventions include skip links, visible focus states,
  semantic controls, touch-specific behavior, and reduced-motion rules.
- There is no build system, backend, or protected API environment. The initial
  explorer should remain fully static.

## Placement in the Portfolio

Keep the global navigation and Workbench scene unchanged.

Add Body Explorer as a featured, in-development project on
`workbench/robotics/index.html`. Its project entry should include:

- the project name and `In development` status;
- a concise account of the personal learning problem that motivated it;
- a still or small preview of the full-body explorer;
- an `Open Body Explorer` link;
- factual scope language that does not present the project as a clinical tool.

The interactive tool will live at:

```text
workbench/robotics/body-explorer/index.html
```

If development notes become substantial, add a related project log under
`blog/projects/body-explorer/` later. A Notes archive is not required for the
first release.

## Chosen Product Direction

### 1. Make the diagram the primary interface

The first screen should be understandable without instructions or a search
query. Show front and back views of one friendly, gender-neutral character.
Visitors choose a visible body region directly.

Do not place a dashboard, chat interface, large filter panel, or result grid in
front of the body. The illustration is the navigation.

### 2. Separate final artwork from interaction geometry

The full-body character is a final visual asset supplied by the project owner.
It must not be redrawn, approximated, converted to SVG, retouched, or generated
again. The page uses two independent layers inside one responsive container:

1. **Visual layer** — the supplied raster character image, displayed only as
   artwork with no interaction logic.
2. **Interaction layer** — a transparent inline SVG whose paths provide
   semantic IDs, pointer and keyboard targets, focus treatment, hover
   highlighting, and selected state.

The SVG is not an illustration and must not reproduce the character. Both
layers share a fixed coordinate contract so resizing the container scales them
together without alignment drift.

The overview may use visually precise areas such as left wrist, right wrist,
left hand, and right hand while mapping each area to a broader navigation
region such as Hand & wrist. Unique hotspot identity and navigation region are
related but must remain separate concepts.

### 3. Use a consistent three-level hierarchy

The complete interaction has three levels:

1. **Body overview** — front and back character views with major regions.
2. **Regional detail** — a larger illustration of the selected body part with
   precise hotspots.
3. **Resource view** — a compact panel for the selected hotspot and its related
   materials.

The transition should feel like moving closer to an illustrated study plate,
not opening unrelated application screens.

### 4. Begin broad, then deepen each region

The full-body overview should exist from the beginning because the project is
also a personal taping study atlas. Development can still proceed as vertical
slices:

- first prove the entire flow with Hand & wrist;
- then add Knee;
- then Lower leg, ankle & foot;
- then Shoulder, arm & elbow;
- then Torso & back;
- then Hip & thigh.

On the public version, an overview hotspot may still support hover, focus, and
selection before its regional detail is ready, but it must respond with an
explicit planned-resource state. Only an available region may navigate into a
regional detail. Do not create a clickable area that produces no visible or
announced result, and do not style a planned region as if its full detail flow
were already available.

### 5. Keep taping as the first collection, not the product identity

`Body Explorer` remains the product name. `Taping techniques` is the first
resource collection attached to its regions.

Future resource types can include:

- anatomy;
- related conditions or states;
- exercise and stretching;
- rehabilitation references;
- taping techniques.

Only resource types that contain material for the selected area should appear.
Do not render empty tabs merely to advertise future scope.

### 6. Omit search and LLM features from the initial release

The body is already a visible, finite navigation space. Search, fuzzy matching,
and LLM interpretation would add interface and infrastructure complexity before
the diagram interaction has been validated.

Search may be reconsidered when the resource collection becomes difficult to
navigate spatially. If added later, it should remain a secondary shortcut into
the same region model rather than become a separate chat product.

## Experience Flow

### Body overview

```text
┌─────────────────────────────────────────────────────────────┐
│ Body Explorer                         Educational resources │
│                                                             │
│ Choose an area to explore                                   │
│                                                             │
│         FRONT                    BACK                        │
│       [character]             [character]                    │
│                                                             │
│ Taping basics: Create a base · Remove tape safely            │
└─────────────────────────────────────────────────────────────┘
```

- Front and back views should be visible together on wide screens.
- On narrow screens, use a front/back segmented control or stack the figures
  only if both remain comfortably tappable.
- A hotspot receives a soft color wash and label on hover, focus, or selection.
- The overview should not expose medical terminology before a visitor chooses
  a region.

### Regional detail

```text
Body / Upper limb / Hand & wrist

┌──────────────────────────────┬──────────────────────────────┐
│                              │ THUMB-SIDE WRIST             │
│      palm / back toggle      │                              │
│                              │ Resources related to this    │
│     [large hand drawing]     │ area                         │
│          (hotspots)          │                              │
│                              │ Taping technique             │
│                              │ De Quervain                  │
└──────────────────────────────┴──────────────────────────────┘
```

- Preserve a visible breadcrumb and an explicit `Back to body` control.
- Use alternate views when a region requires them: palm/back, front/back, or
  sole/top.
- Selecting a hotspot should update the resource panel without unexpectedly
  scrolling or navigating away.
- The browser Back button should move through the same meaningful states.

### Resource view

Each selected area should show:

- a plain-language area name;
- an optional neutral related-state label;
- one or more resource cards;
- the source name and resource type;
- an external link and, if implemented, an on-demand video player;
- a persistent educational-use notice.

Do not load 45 YouTube players on page load. Use thumbnails and load a player
only after a visitor selects a video. Never autoplay.

## Illustration Direction

### Full-body character

`assets/workbench/robotics/body-explorer/body-default.png` is the approved and
final full-body visual artwork. It contains the front and back characters in one
`1224 × 1285` transparent raster asset.

The asset is immutable for this implementation:

- do not redraw it as SVG;
- do not approximate or recreate it with HTML, CSS, canvas, or generated art;
- do not retouch, crop, recolor, resample, or otherwise modify its pixel data;
- do not embed interface labels, titles, instructions, or FRONT/BACK text in it;
- preserve the original file as the source of truth for the overview character.

Front and back views are produced by positioning the unchanged composite image
inside fixed-aspect-ratio containers. Any future replacement must be supplied
as a new approved final asset; implementation work may then recalibrate the
overlay coordinates but must not edit the replacement artwork.

### Regional illustrations

- Increase anatomical specificity only as much as navigation requires.
- Use clean outer contours, a few joint or surface landmarks, and quiet labels.
- Do not reproduce the dense labeling of a medical anatomy chart.
- Palm/back and sole/top variants should share alignment where possible.
- Selected areas use a translucent burgundy or brass wash, not an alarming red.

### Integration with the portfolio

- Reuse the current ink, burgundy, brass, paper, and wall tokens.
- Use thin leader lines and small editorial annotations already familiar from
  the Workbench.
- Keep containers open and lightly ruled rather than using SaaS-style cards.
- Use soft zoom, crossfade, or drawn-line transitions sparingly.
- In `prefers-reduced-motion`, switch views without zoom or path animation.

Artwork format and interaction format are deliberately independent. The current
full-body visual layer is the external raster `<img>`. Its transparent inline
SVG overlay supplies only interaction paths, semantic IDs, accessible names,
focus styling, hover styling, and selected styling.

Each front/back container uses the same `510 × 1285` interaction coordinate
space as its crop of the final artwork. The `<img>` and `<svg>` occupy the exact
same container and resize together. SVG paths must never contain
representational character artwork.

Regional detail artwork may use raster or vector assets according to its
approved source, but it must follow the same separation rule: final artwork in
the visual layer and a transparent SVG hit map in the interaction layer.

## Initial Region Hierarchy

```text
Body
├── Shoulder, arm & elbow
│   ├── shoulder top / AC joint
│   ├── shoulder front and side
│   ├── shoulder blades / retraction
│   ├── upper trapezius
│   ├── triceps
│   ├── outer elbow
│   ├── inner elbow
│   └── general elbow
├── Hand & wrist
│   ├── thumb-side wrist
│   └── central palm-side wrist
├── Torso & back
│   ├── abdomen
│   ├── ribs
│   ├── mid back
│   ├── low back
│   ├── paraspinal / spine
│   └── sacroiliac area
├── Hip & thigh
│   ├── lateral hip
│   ├── hip flexor
│   ├── groin
│   ├── gluteal area
│   ├── quadriceps
│   ├── hamstring
│   └── hamstring tendon
├── Knee
│   ├── patellar tendon
│   ├── tibial tuberosity / Osgood-Schlatter area
│   ├── inner knee
│   └── outer knee
└── Lower leg, ankle & foot
    ├── medial shin
    ├── lateral / anterior shin
    ├── calf
    ├── Achilles tendon
    ├── ankle
    ├── heel
    ├── plantar fascia
    ├── ball of foot
    ├── big-toe joint / bunion
    └── big-toe base / turf toe
```

The hierarchy reflects the initial playlist rather than claiming complete body
coverage. Head and neck semantic shapes may exist in the overview hit map for
future compatibility, but they are not active content regions in the initial
data set. They should use a null or explicit future region target and a planned
availability state rather than being incorrectly mapped to Torso & back. The
upper trapezius may be reachable from Shoulder, arm & elbow without implying a
complete Neck collection.

## Initial Content Inventory

Source: [STRENGTHTAPE — Step-by-Step Instructional Videos](https://www.youtube.com/playlist?list=PLDI8hLjO50NblhYUcbl5kjswkxJsmHrSD)

The public playlist contained 45 videos when reviewed on August 30, 2026. The
inventory below is an implementation seed, not a clinical taxonomy. Titles are
the publisher's titles and should retain a visible source label.

| Collection | Count | Initial resources |
| --- | ---: | --- |
| Taping basics | 2 | How To Remove; How to Create a Base |
| Hand & wrist | 2 | De Quervain; Carpal Tunnel |
| Shoulder, arm & elbow | 9 | Tennis Elbow; Golfer's Elbow; Elbow General; AC Joint; Upper Trap; Tricep; Shoulder Retraction; Shoulder Stability; Rotator Cuff |
| Torso & back | 8 | Pregnancy (Transverse Abdominals); Paraspinal; Middle Back; Low Back; Abdominal Muscle; Spine; SI Joint; Ribs |
| Hip & thigh | 7 | Quadriceps; Hip; Hip Flexor; Hamstring; Hamstring Tendon; Groin; Gluteal |
| Knee | 6 | Patellar Tendon; Outer Knee 1 and 2; Osgood Schlatter's 1 and 2; Inner Knee |
| Lower leg, ankle & foot | 11 | Plantar Fascia; Medial Shin Splints; Lateral Shin Splints; Heel; Calf Strain; Calf Strain Self Apply; Bunion; Ball of Foot; Ankle Stability; Achilles Tendon; Turf Toe |

### Source video IDs

Store individual video IDs, not only playlist positions, because playlist order
can change.

| Region | Title | YouTube video ID |
| --- | --- | --- |
| Hip & thigh | Quadriceps | `55r2WlC6_kQ` |
| Torso & back | Pregnancy (Transverse Abdominals) | `Uc_AP1FY-BE` |
| Foot | Plantar Fascia | `tsuczAnScMs` |
| Knee | Patellar Tendon (Jumper's Knee) | `7qDmvFZnB-M` |
| Torso & back | Paraspinal | `O1JGHLobwd8` |
| Knee | Outer Knee 2 | `rq0uTlfD-EI` |
| Knee | Outer Knee 1 | `I5PciNpSbNA` |
| Knee | Osgood Schlatter's 2 | `zIhT1DQ-uKg` |
| Knee | Osgood Schlatter's 1 | `UmhWWnHKn6k` |
| Torso & back | Middle Back | `2LxAwjrLbrE` |
| Lower leg | Medial Shin Splints | `ll6IMGfWggc` |
| Torso & back | Low Back | `BlOZHW1DR38` |
| Lower leg | Lateral Shin Splints | `DbaHWgBPDa4` |
| Knee | Inner Knee | `0-2u_wk625E` |
| Hip & thigh | Hip | `R-S9gVYdils` |
| Hip & thigh | Hip Flexor | `7VAPF-laQ-c` |
| Foot | Heel | `Aj42WKye4EI` |
| Hip & thigh | Hamstring | `q0AwYkoXDgk` |
| Hip & thigh | Hamstring Tendon | `dUeJ50wbO-A` |
| Hip & thigh | Groin | `NZ6PJiruiAs` |
| Hip & thigh | Gluteal | `hZZ9evmHzEY` |
| Basics | How To Remove | `pKGZ6QjYxiI` |
| Basics | How to Create a Base | `BaZJU3gJsrk` |
| Arm & elbow | Tennis Elbow | `4r1lfOO1fvY` |
| Arm & elbow | Golfer's Elbow | `zC257lEE-RM` |
| Arm & elbow | Elbow General | `6M7yNDN0qsY` |
| Hand & wrist | De Quervain | `n-m9RT7sdUA` |
| Hand & wrist | Carpal Tunnel | `ke7glF7HrVo` |
| Lower leg | Calf Strain | `9uNg5czgBys` |
| Lower leg | Calf Strain Self Apply | `lAEaivS7uAg` |
| Foot | Bunion (Hallux Valgus) | `XdVYTSegACo` |
| Foot | Ball of Foot | `OCWg9JiEIbQ` |
| Ankle | Ankle Stability | `xEftUBryYmQ` |
| Ankle | Achilles Tendon | `evniArxjj60` |
| Shoulder | AC Joint | `hqw6SRj7_EI` |
| Torso & back | Abdominal Muscle | `hSOCa8Zfgd4` |
| Shoulder | Upper Trap | `5wtYfbJIV3I` |
| Foot | Turf Toe | `qCL8RJHFeoo` |
| Arm | Tricep | `Ex9rA_5n7zs` |
| Torso & back | Spine | `t39GSgNbue4` |
| Torso & back | SI Joint | `nU8g2pWrNEA` |
| Shoulder | Shoulder Retraction | `voEFFVbHng4` |
| Shoulder | Shoulder Stability | `XHFC0OT-VKU` |
| Shoulder | Rotator Cuff | `jd7Z-0u6Mks` |
| Torso & back | Ribs | `KPzBfT81Bz4` |

Before publication, verify every title, URL, availability state, thumbnail, and
region assignment against the live source. Preserve the source's own condition
language in titles, but write surrounding interface copy in neutral educational
terms.

## Data Architecture

Keep content separate from rendering so a new resource does not require new
interaction logic.

Use a small classic JavaScript data file rather than fetching JSON. This keeps
the page usable when opened directly from the filesystem as well as over the
local HTTP server.

Recommended entities:

```js
regions: [
  {
    id,
    parentId,
    label,
    shortLabel,
    orientation,
    detailViewId
  }
]

hotspots: [
  {
    id,
    viewId,
    regionId,
    orientation,
    side,
    highlightGroupId,
    label,
    description,
    availability
  }
]

resources: [
  {
    id,
    type,
    title,
    source,
    sourceUrl,
    videoId,
    hotspotIds,
    language,
    reviewedAt
  }
]
```

Important rules:

- Many resources may connect to one hotspot.
- One resource may connect to multiple hotspots.
- Every SVG path has one unique semantic `id`, such as
  `front-left-wrist` or `back-right-shoulder`.
- A precise overview hotspot maps to one broader `regionId`; for example,
  `front-left-hand` maps to `hand-wrist`. A future-only semantic area may keep
  `regionId: null` until a legitimate navigation region exists.
- Left/right counterparts keep distinct IDs but share one
  `highlightGroupId`. Hover or focus on either counterpart highlights both.
- Selection preserves the exact hotspot ID even when a paired highlight is
  shown.
- Phase 2B must move paired-highlight relationships into data rather than
  relying on parsing the left/right words from an ID.
- `availability` controls whether selection shows resources, navigates to a
  regional detail, or explains that related resources are planned.
- Diagram labels and source titles are separate fields.
- A condition term is metadata, not a diagnosis result.
- The initial `type` is `taping`; future types should not change the region or
  hotspot schema.
- Do not use playlist position as a stable identifier.

## Interaction Architecture

Maintain one small state object:

```text
currentView     body | hand-wrist | knee | foot-ankle | ...
orientation     front | back | palm | dorsal | sole | top
selectedHotspot null | hotspot ID
selectedResource null | resource ID
```

Temporary pointer and focus highlighting does not need to be persisted in the
state object. It is derived from the active SVG path and its
`highlightGroupId`. A paired highlight never changes `selectedHotspot` until a
visitor activates a path.

Use `data-*` identifiers and one generic interaction setup. Adding a hotspot or
resource must not require item-specific JavaScript branches.

The layer contract is:

```text
.body-view__plate
├── img.body-artwork       visual only; pointer events disabled
└── svg.body-hit-map       transparent interaction layer
    └── path.body-hit-area semantic pointer/keyboard targets
```

Hover and focus may highlight a complete left/right pair. Click, Enter, or
Space selects the exact activated hotspot, records it in state, updates the
visible selection label, updates the related region state, and emits a generic
selection-change event for future resource panels.

Reflect meaningful navigation in the URL hash, for example:

```text
#body
#body/front
#body/front/front-left-wrist
#hand-wrist/palm
#hand-wrist/thumb-side-wrist
```

Phase 2B must finalize which overview selections are meaningful enough to enter
the hash. Regional view, orientation, and selected regional hotspot must be
deep-linkable. Hash state allows direct links and makes browser Back/Forward
behavior predictable without a router or framework.

The non-JavaScript fallback should expose an ordinary linked region directory
and the initial resource links. JavaScript progressively enhances it into the
illustrated explorer.

## Proposed File Structure

```text
workbench/
└── robotics/
    ├── index.html
    └── body-explorer/
        ├── index.html
        ├── body-explorer.js
        └── body-explorer-data.js

assets/
└── workbench/
    └── robotics/
        └── body-explorer/
            ├── body-default.png
            └── regional/
                └── approved detail artwork added by phase
```

The full-body hit maps remain inline in the explorer HTML so paths are directly
focusable, styleable, and addressable by semantic ID. Do not restore the old
front/back character SVG files as visual dependencies. Update the Robotics
project preview to use the final raster artwork as part of Phase 2B.

Add regional artwork files only as those views are implemented and approved.
Their hit maps may remain inline with the corresponding view markup. Keep
shared and page-specific visual rules in `styles.css` according to the
repository convention.

## Responsive Behavior

### Wide screens

- Use the portfolio-wide `--page-width` maximum of `1120px` so the explorer
  aligns with the site header rule.
- Show front and back body figures together.
- Keep each full-body artwork plate near `220px` wide so the diagram remains
  central without making the section excessively tall.
- In a detail view, place the illustration and resource panel side by side.
- Keep the illustration visually dominant.

### Narrow screens

- Keep one body orientation visible at a time if side-by-side figures become
  too small.
- Use the FRONT/BACK segmented control below `720px` and keep the visible
  full-body plate at or below `220px`; use approximately `210px` on the
  narrowest layout.
- Place the resource panel below the detailed illustration.
- Use a persistent breadcrumb or compact back control above the illustration.
- Maintain touch targets of at least practical finger size even when the
  highlighted anatomical shape is smaller.
- Avoid horizontal scrolling at `320px` and wider.

Do not rely on hover for discovery. A short region list can sit below the map
on small screens and act as both an accessible alternative and a precise touch
target.

## Accessibility Requirements

- Every hotspot must have an accessible name.
- Hotspots must be reachable and activatable with a keyboard.
- Hover, focus, and selected states must communicate the same information.
- Color cannot be the only selected-state cue; use a label, outline, or marker.
- The detailed resource heading must update when a hotspot changes.
- Use a restrained live region only for state changes that are not otherwise
  announced through focus movement.
- Keep source links as real anchors with useful link text.
- Preserve visible `:focus-visible` outlines against every illustration color.
- Provide a text region directory that remains functional if the visual map or
  JavaScript is unavailable.
- Respect `prefers-reduced-motion` for zoom, crossfade, and leader-line effects.
- Write useful alternative text for the base illustrations without duplicating
  every hotspot label.

## Medical and Content Boundaries

The interface must consistently distinguish navigation from diagnosis.

Preferred language:

- `Resources related to this area`
- `A condition sometimes associated with this region`
- `Explore taping techniques for this area`

Avoid:

- `You have...`
- `Your symptoms mean...`
- ranked diagnoses, confidence percentages, or treatment prescriptions;
- claims copied from video descriptions without independent review.

Show a concise notice near the explorer introduction and again near instructional
resources. State that the project is for education, is not medical advice or a
diagnostic tool, and does not replace evaluation by a qualified professional.

Third-party resource cards must identify STRENGTHTAPE as the publisher. The
portfolio should not imply authorship, clinical review, sponsorship, or
endorsement unless those relationships actually exist.

## Implementation Phases

### Phase 1 — Project entry and static shell — Implemented

1. Add a featured Body Explorer record to `workbench/robotics/index.html`.
2. Create the nested explorer page with the shared header, Robotics breadcrumb,
   project title, educational notice, and non-JavaScript region directory.
3. Add the initial data file with stable region, hotspot, and resource IDs.
4. Add the two general taping resources outside the body hierarchy.

Acceptance cleanup remains: replace the old front/back SVG artwork references
in the Robotics project preview with the final raster artwork during Phase 2B.

### Phase 2A — Full-body visual and interaction foundation — Implemented

1. Integrate the supplied `body-default.png` without modifying its pixel data.
2. Present front and back crops from the same final asset.
3. Overlay separate transparent inline SVG hit maps in the same responsive
   containers.
4. Add semantic paths for head, neck, shoulder, upper arm, elbow, forearm,
   wrist, hand, chest/upper back, abdomen/lower back, pelvis, thigh, knee,
   calf, ankle, and foot as applicable to each orientation.
5. Implement pointer, keyboard, focus, selected, and planned-resource feedback.
6. Highlight both left/right counterparts when either receives hover or focus
   while preserving the exact activated hotspot on selection.
7. Keep FRONT/BACK and all explanatory typography in HTML/CSS rather than in
   the artwork.

### Phase 2B — Overview hardening — Implemented

Do not rebuild Phases 1 or 2A. Resume implementation here.

1. Add explicit `orientation`, `side`, and `highlightGroupId` hotspot data and
   remove paired-highlight dependence on parsing ID strings.
2. Confirm the mapping from each precise semantic hotspot to its broader
   navigation `regionId`.
3. Finalize planned/available behavior. Planned hotspots may be selectable when
   they provide clear planned-resource feedback, but they must not imply that a
   missing regional detail is already available.
4. Define and implement meaningful overview selection hashes and verify browser
   Back/Forward behavior.
5. Update the Robotics project preview to use the final raster artwork and
   remove obsolete visual dependencies on the old character SVGs.
6. Verify artwork/hit-map alignment, paired hover/focus, keyboard activation,
   and layout at wide desktop, tablet, `620px`, `410px`, and `320px` widths.

### Phase 3 — Hand & wrist end-to-end vertical slice — Implemented

1. Integrate approved palm and back-of-hand regional artwork without coupling
   its pixel or vector content to interaction logic.
2. Add separate transparent hit maps for thumb-side wrist and central
   palm-side wrist.
3. Connect the De Quervain and Carpal Tunnel resources.
4. Implement the reusable regional-detail and resource-panel structure.
5. Load YouTube only on demand after a visitor chooses a video; never autoplay.
6. Implement regional orientation, selected hotspot, direct-link, and browser
   Back/Forward states.
7. Validate the complete body-to-region-to-hotspot-to-resource path before
   extending the system.

Phase 2B and Phase 3 should be implemented as one coherent batch because the
Hand & wrist slice is the first real validation of the revised overview
contract.

### Phase 4A — Knee vertical slice

1. Add approved Knee artwork and separate interaction maps for front, inner,
   outer, and below-patella areas.
2. Connect the six Knee resources.
3. Validate the first high-density multi-view regional experience before
   extending the same pattern farther down the leg.

### Phase 4B — Lower leg, ankle & foot

1. Add Lower leg views for medial shin, lateral/anterior shin, calf, and
   Achilles areas.
2. Add Foot & ankle top and sole views for ankle, heel, plantar fascia, ball of
   foot, bunion, and turf-toe areas.
3. Connect the eleven Lower leg, ankle, and foot resources.

Keep Phase 4A and 4B sequential. Combining all seventeen lower-body resources,
new artwork, multi-view state, and URL behavior in one unverified change would
make alignment and data errors unnecessarily difficult to isolate.

### Phase 5A — Shoulder, arm & elbow

1. Add approved regional artwork and separate interaction maps.
2. Preserve front/back and paired left/right behavior where appropriate.
3. Connect the nine Shoulder, arm & elbow resources.

### Phase 5B — Torso/back and Hip/thigh

1. Add Torso & back regional artwork and connect its eight resources.
2. Add Hip & thigh regional artwork and connect its seven resources.
3. Reuse the regional-detail, resource-panel, orientation, and URL-state
   contracts proven in Phases 3 and 4.

### Phase 6 — Release hardening and inventory completion

1. Confirm that all 45 playlist videos appear once in the data inventory and
   in at least one reachable explorer location.
2. Verify mouse, touch, keyboard, direct links, browser Back/Forward, text
   fallback, reduced motion, and all responsive breakpoints.
3. Verify that every visual asset remains independent from its SVG hit map and
   that the final full-body artwork has not been modified.
4. Verify source labels, unavailable-video behavior, educational-use language,
   and non-diagnostic content boundaries.
5. Remove obsolete artwork references and unreachable implementation paths.

### Phase 7 — Content growth and project documentation

1. Add anatomy, exercise, or rehabilitation resources only when source quality
   and authorship can be represented accurately.
2. Add resource-type controls only when at least two types are populated.
3. Consider a Body Explorer build log in Notes.
4. Reconsider lightweight search only after observing a real navigation need.

### Recommended implementation batches and model settings

These recommendations were reviewed against the official OpenAI model catalog
and GPT-5.6 guidance on August 31, 2026:

- <https://developers.openai.com/api/docs/models>
- <https://developers.openai.com/api/docs/guides/latest-model>

| Implementation batch | Model | Reasoning effort | Rationale |
| --- | --- | --- | --- |
| Phase 2B + Phase 3 | `gpt-5.6-sol` | `high` | Cross-cutting architecture, detailed UI, URL state, accessibility, and the first end-to-end resource flow |
| Phase 4A | `gpt-5.6-sol` | `high` | First high-density multi-view regional implementation |
| Phase 4B | `gpt-5.6-terra` | `high` | Pattern reuse with a larger but well-defined hotspot and resource inventory |
| Phase 5A + Phase 5B | `gpt-5.6-terra` | `high` | Expansion of contracts already proven by the hand and lower-body slices |
| Phase 6 | `gpt-5.6-sol` | `xhigh` | Quality-first cross-cutting audit of accessibility, navigation, layout, and data completeness |
| Phase 7 | `gpt-5.6-terra` | `medium` | Normal content and documentation growth after architecture is stable |
| Mechanical ID, title, and metadata checks | `gpt-5.6-luna` | `low` or `medium` | Repetitive, bounded validation where cost and throughput matter more than new product judgment |

`max` reasoning is not the default recommendation for this project. Use it only
if a genuinely difficult integration or release-blocking defect remains after
`gpt-5.6-sol` at `xhigh`, and compare the result against the lower-effort
baseline rather than assuming more reasoning is automatically better.

## Verification Matrix

### Structure and links

- Open Body Explorer from the Robotics page.
- Confirm the Robotics preview uses the approved final raster artwork and does
  not depend on the obsolete character SVGs.
- Return to Robotics through the breadcrumb and footer.
- Verify all nested relative URLs from local-file and HTTP previews.
- Confirm every YouTube ID resolves to the intended title.
- Confirm unavailable or removed videos fail gracefully.

### Diagram navigation

- Select every active semantic hotspot from front and back body views and
  confirm that it maps to the intended broader region.
- Hover and focus every paired left/right area and confirm that both
  counterparts highlight without changing the exact selected hotspot.
- Confirm planned hotspots provide an explicit planned-resource state and do
  not imply that a missing detail view is available.
- Enter and exit every regional detail without losing orientation.
- Select every hotspot and confirm the correct resource set.
- Use browser Back and Forward across body, regional, and selected-area states.
- Verify that inactive regions do not appear clickable.

### Keyboard and assistive access

- Navigate the entire explorer using Tab, Shift+Tab, Enter, and Space where
  appropriate.
- Confirm focus order follows the visual body and regional hierarchy.
- Confirm a focused paired hotspot highlights both counterparts and retains a
  visible focus treatment on the exact keyboard target.
- Verify the text region directory reaches the same resources.
- Confirm headings and selected labels update coherently for screen readers.

### Responsive and visual

- Check wide desktop, tablet, `620px`, `410px`, and `320px` layouts.
- Confirm each `<img>` visual layer and SVG hit-map layer occupy the same
  container and remain aligned at every size.
- Confirm the full-body artwork is still the original approved
  `body-default.png` and has not been redrawn, converted, or modified.
- Confirm the explorer shell aligns with the shared `1120px` site-header width
  and the full-body plates remain near the documented `220px` maximum.
- Confirm video content never forces horizontal overflow.
- Confirm front/back and palm/back controls remain obvious on touch devices.
- Check the experience with reduced motion enabled.

### Content and safety

- Verify the educational-use notice is visible before instructional material.
- Verify condition names are not phrased as conclusions about the visitor.
- Verify every resource visibly identifies its external publisher.
- Verify the portfolio does not imply medical review or endorsement.
- Verify empty future categories are not shown.

## Risks and Deliberate Limits

- **Illustration workload:** the interaction is simple, but coherent front,
  back, palm, sole, and regional artwork is the largest production task. Prove
  one vertical slice before producing the full set.
- **Immutable overview artwork:** the supplied full-body raster is final and
  cannot be repaired through implementation edits. If a future replacement is
  supplied, treat it as a new approved asset and recalibrate only the visual
  crop and interaction overlay.
- **Hotspot alignment:** the full-body artwork is a composite raster while each
  orientation uses its own `510 × 1285` SVG interaction space. Crop positions,
  aspect ratio, and overlay coordinates form one contract and must be tested at
  every breakpoint.
- **Paired interaction drift:** IDs encode side and orientation today, but
  parsing IDs is brittle. Phase 2B must add explicit highlight-group metadata
  before more regional maps reuse the behavior.
- **Uneven coverage:** the initial playlist is strongest in the lower body and
  has only two hand/wrist videos. The interface should communicate available
  coverage honestly rather than imply a complete anatomy atlas.
- **Third-party availability:** titles, thumbnails, order, and access can change.
  Store stable video IDs and a review date, and keep external-link fallbacks.
- **Medical interpretation:** a spatial interface can still be mistaken for a
  diagnostic flow. Use neutral copy and avoid symptom-to-condition inference.
- **Scope growth:** do not add search, accounts, saved progress, analytics, a
  CMS, or a backend during the initial diagram validation.

## Completion Criteria

The first end-to-end MVP is complete when:

- Body Explorer appears as an in-development Robotics project;
- the explorer opens as a wide, dedicated nested page;
- a visitor can select Hand & wrist from a gender-neutral front/back body map;
- the full-body visual is the unchanged approved raster artwork and its SVG is
  only a transparent semantic interaction map;
- paired left/right overview areas highlight together while exact selection is
  preserved;
- the visitor can select the thumb-side or central palm-side wrist from a
  detailed hand illustration;
- the matching De Quervain or Carpal Tunnel resource appears with its source;
- the same route works through mouse, touch, keyboard, browser Back, and the
  text fallback;
- no search, LLM, backend, or framework is required;
- the page remains usable at `320px` without horizontal overflow;
- the educational and third-party-source boundaries are clear.

The first complete taping-study release is complete when all planned regional
detail views are usable and all 45 playlist videos are reachable from at least
one appropriate hotspot.
