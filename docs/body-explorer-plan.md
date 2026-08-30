# Body Explorer Plan

## Status

Planning approved on August 30, 2026. No production files have been created.
The current direction is a diagram-first educational resource navigator placed
under Robotics. The first content collection will be STRENGTHTAPE instructional
videos, but the product and data model must remain open to anatomy, exercise,
and rehabilitation resources.

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

### 2. Use a consistent three-level hierarchy

The complete interaction has three levels:

1. **Body overview** — front and back character views with major regions.
2. **Regional detail** — a larger illustration of the selected body part with
   precise hotspots.
3. **Resource view** — a compact panel for the selected hotspot and its related
   materials.

The transition should feel like moving closer to an illustrated study plate,
not opening unrelated application screens.

### 3. Begin broad, then deepen each region

The full-body overview should exist from the beginning because the project is
also a personal taping study atlas. Development can still proceed as vertical
slices:

- first prove the entire flow with Hand & wrist;
- then add Knee;
- then Lower leg, ankle & foot;
- then Shoulder, arm & elbow;
- then Torso & back;
- then Hip & thigh.

On the public version, an overview region should become active only when its
regional detail illustration is usable. Do not create dead hotspots. Regions
that are not ready may be drawn normally without hover treatment or labeled
quietly as planned work outside the diagram.

### 4. Keep taping as the first collection, not the product identity

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

### 5. Omit search and LLM features from the initial release

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

The overview character should feel friendly and memorable without becoming a
mascot or a game avatar.

- Use rounded, slightly stylized proportions.
- Minimize gender-coded chest, waist, hip, facial, hair, and clothing features.
- Keep the stance neutral and symmetrical so hotspots are easy to locate.
- Avoid photorealistic skin, exposed musculature, and clinical textbook detail.
- Use calm facial or featureless treatment so attention stays on the body map.
- Draw front and back figures in one consistent scale and pose family.

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

SVG is preferred for crisp scaling and hotspot alignment. Keep the illustration
and interaction layers separate: an optimized base illustration can remain an
external asset while an inline SVG overlay supplies the interactive hotspot
paths and focus styling.

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
coverage. Head and face are not active in the initial data set. The upper
trapezius may be reachable from Shoulder, arm & elbow rather than implying a
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
    label,
    description
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

Use event delegation and `data-*` identifiers. Adding a hotspot or resource
must not require a new event listener or item-specific JavaScript branch.

Reflect meaningful navigation in the URL hash, for example:

```text
#body
#hand-wrist
#hand-wrist/thumb-side-wrist
```

Hash state allows direct links and makes browser Back/Forward behavior
predictable without a router or framework.

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
            ├── body-explorer-body-front.svg
            ├── body-explorer-body-back.svg
            ├── body-explorer-hand-palm.svg
            ├── body-explorer-hand-back.svg
            ├── body-explorer-knee-front.svg
            ├── body-explorer-knee-back.svg
            ├── body-explorer-lower-leg-front.svg
            ├── body-explorer-lower-leg-back.svg
            ├── body-explorer-foot-top.svg
            └── body-explorer-foot-sole.svg
```

Add further regional illustration files only as those views are implemented.
Keep shared and page-specific visual rules in `styles.css` according to the
repository convention.

## Responsive Behavior

### Wide screens

- Use a wide explorer shell, approximately `1280px` to `1440px` maximum.
- Show front and back body figures together.
- In a detail view, place the illustration and resource panel side by side.
- Keep the illustration visually dominant.

### Narrow screens

- Keep one body orientation visible at a time if side-by-side figures become
  too small.
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

### Phase 1 — Project entry and static shell

1. Add a featured Body Explorer record to `workbench/robotics/index.html`.
2. Create the nested explorer page with the shared header, Robotics breadcrumb,
   project title, educational notice, and non-JavaScript region directory.
3. Add the initial data file with stable region, hotspot, and resource IDs.
4. Add the two general taping resources outside the body hierarchy.

### Phase 2 — Full-body overview

1. Create the front and back gender-neutral character illustrations.
2. Add the interactive hotspot overlay for the major region groups.
3. Implement hover, focus, selected, and unavailable-region states.
4. Implement URL hash state and Back/Forward behavior.
5. Verify the overview at desktop, tablet, and narrow-phone widths.

### Phase 3 — Hand & wrist vertical slice

1. Create palm and back-of-hand regional illustrations.
2. Add thumb-side wrist and central palm-side wrist hotspots.
3. Connect De Quervain and Carpal Tunnel resources.
4. Implement the resource panel and on-demand video behavior.
5. Validate the entire body-to-region-to-resource interaction before duplicating
   it for other regions.

### Phase 4 — High-density lower-body regions

1. Add Knee, including front, inner, outer, and below-patella hotspots.
2. Add Lower leg with medial shin, lateral shin, calf, and Achilles areas.
3. Add Foot & ankle with top and sole views.
4. Connect the 17 knee, lower-leg, ankle, and foot videos.

### Phase 5 — Remaining regional views

1. Add Shoulder, arm & elbow.
2. Add Torso & back.
3. Add Hip & thigh.
4. Connect the remaining playlist resources.
5. Confirm that every one of the 45 videos appears once in the data inventory
   and in at least one reachable explorer location.

### Phase 6 — Content growth and project documentation

1. Add anatomy, exercise, or rehabilitation resources only when source quality
   and authorship can be represented accurately.
2. Add resource-type controls only when at least two types are populated.
3. Consider a Body Explorer build log in Notes.
4. Reconsider lightweight search only after observing a real navigation need.

## Verification Matrix

### Structure and links

- Open Body Explorer from the Robotics page.
- Return to Robotics through the breadcrumb and footer.
- Verify all nested relative URLs from local-file and HTTP previews.
- Confirm every YouTube ID resolves to the intended title.
- Confirm unavailable or removed videos fail gracefully.

### Diagram navigation

- Select every active region from front and back body views.
- Enter and exit every regional detail without losing orientation.
- Select every hotspot and confirm the correct resource set.
- Use browser Back and Forward across body, regional, and selected-area states.
- Verify that inactive regions do not appear clickable.

### Keyboard and assistive access

- Navigate the entire explorer using Tab, Shift+Tab, Enter, and Space where
  appropriate.
- Confirm focus order follows the visual body and regional hierarchy.
- Verify the text region directory reaches the same resources.
- Confirm headings and selected labels update coherently for screen readers.

### Responsive and visual

- Check wide desktop, tablet, `620px`, `410px`, and `320px` layouts.
- Confirm hotspots remain aligned with their illustration at every size.
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
- **Hotspot alignment:** illustration and overlay coordinates can drift during
  asset revisions. Give every asset a stable `viewBox` and test alignment at
  each breakpoint.
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
