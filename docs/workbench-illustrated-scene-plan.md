# Illustrated Workbench Plan

## Status

Phases 1–5 implemented on August 27, 2026. The six dedicated skill pages,
layered illustrated scene, semantic object links, shared annotation renderer,
and pointer, keyboard, and touch interaction model are now in place. The
scene has dedicated compact and small-phone composition rules, and a temporary
Ceramics anchor confirmed that the renderer remains declarative. Local browser
visual acceptance remains a manual release check when a browser connection is
available.

## Purpose

Replace the current long, category-based Workbench page with one illustrated,
interactive workbench scene. Each object should feel like part of the same
physical workspace while acting as a quiet preview and an entry point to a
dedicated practice page.

The redesign must preserve the site's existing editorial and museum-gallery
language rather than introduce a separate portfolio UI.

## Repository Findings

- The site is a dependency-free GitHub Pages project using plain HTML, one
  shared `styles.css`, and small page-specific JavaScript files.
- Internal links are relative. Nested Notes pages establish the convention of
  directory-based pages with `index.html` and depth-correct relative paths.
- `workbench.html` is currently a large archive page with three main areas:
  selected projects, sketch studies, and sewing work.
- The existing sketch and sewing material is substantial and should be moved
  into dedicated skill pages, not discarded or reduced to placeholders.
- `practice.js` progressively enhances ordinary image links with a native
  `<dialog>` viewer. It can remain available to the migrated archive pages.
- The shared visual system is already well defined:
  - Georgia/Times serif for display and reading text
  - Helvetica/Arial sans serif for small labels and navigation
  - white textured wall, dark ink, muted burgundy, brass, walnut, and paper
  - thin rules, open spacing, restrained shadows, and small uppercase labels
- The shared content widths are `1120px` and `860px`; the current Workbench
  already uses a wider `1360px` shell.
- Existing responsive breakpoints are `820px`, `620px`, and `410px`, with a
  global `prefers-reduced-motion` treatment.
- Existing accessibility conventions include skip links, visible
  `:focus-visible` outlines, semantic navigation, native links/buttons, and
  `aria-current`.
- There is no build system or automated test suite. Verification is expected
  through a local HTTP server and browser checks.
- No `.openai/hosting.json` exists, so the repository remains a conventional
  GitHub Pages site rather than a Sites-managed project.

## Recommended Direction

Keep `workbench.html` as the canonical Workbench landing page. This avoids a
site-wide URL migration and preserves every existing navigation link.

Create dedicated skill pages using the repository's established nested-page
pattern:

```text
workbench.html
workbench/
  photography/
    index.html
  sketching/
    index.html
  sewing/
    index.html
  robotics/
    index.html
  coding/
    index.html
  game-design/
    index.html
```

On GitHub Pages these resolve to clean URLs such as
`/workbench/photography/`. Source links remain relative and explicitly include
`index.html` (for example, `workbench/photography/index.html` from
`workbench.html`) so direct local-file previews also open the page rather than
the containing directory.

The scene should use separate lightweight SVG assets over one base-bench SVG.
The initial drawings should be deliberately simple editorial line art: warm,
slightly imperfect, and replaceable. The first implementation should prove the
interaction and composition, not pretend placeholder illustrations are final
artwork.

## Declarative HTML Architecture

Use ordinary semantic anchors in `workbench.html` as the canonical item
source. Each anchor owns its destination, accessible name, illustration,
preview copy, normalized scene position, annotation placement, and any mobile
override. `workbench-scene.js` reads and progressively enhances those existing
anchors; it must not recreate or replace them from a separate JavaScript item
list.

An item should keep its configuration in shared `data-*` attributes and CSS
custom properties so it remains tied to the scene rather than to a desktop
pixel size:

```html
<a
  class="workbench-object"
  data-workbench-item
  data-id="photography"
  data-description="Composition, observation, and visual documentation."
  data-annotation-side="right"
  data-annotation-offset-x="3"
  data-annotation-offset-y="-4"
  href="workbench/photography/index.html"
  style="
    --object-x: 69%;
    --object-y: 34%;
    --object-width: 15%;
    --object-rotation: -2deg;
    --object-layer: 3;
    --mobile-object-x: 67%;
    --mobile-object-y: 27%;
    --mobile-object-width: 23%;
  "
>
  <img src="assets/workbench/camera.svg" alt="" />
  <span class="workbench-object__name visually-hidden">Photography</span>
</a>
```

Mobile custom properties and annotation override attributes are optional. The
desktop values remain the default; a mobile override is used only when the
portrait composition needs collision control. Shared CSS and JavaScript will
interpret the normalized numbers consistently.

The six initial anchors will be:

1. Photography — camera
2. Sketching — sketchbook and pencils
3. Sewing — sewing machine, fabric, or scissors
4. Robotics & Prototyping — a small robot/electronics assembly
5. Coding — laptop
6. Game Design — controller or a small game-making object

No item-specific selector, listener, or JavaScript branch should be added.
Adding or changing an item must not require a matching JavaScript object.

## Scene Rendering

`workbench.html` will contain the complete declarative scene structure:

- the existing site header and Workbench introduction
- minimal exploration copy with separate desktop and touch wording
- one fixed-aspect scene container
- the base workbench illustration
- one object layer containing the six semantic item anchors
- one shared SVG annotation path layer
- one shared annotation text region and explicit skill link
- a small non-visual live region only if interaction feedback needs it

Each item anchor will contain the object's decorative image and a complete
accessible name. Position, width, rotation, stacking order, annotation data,
and optional mobile overrides will be declared on that same anchor through
shared attributes and CSS custom properties rather than generated selectors.

Without JavaScript, the CSS-composed scene and all six native links will remain
visible and navigable. JavaScript adds active-item state, previews, annotation
geometry, and first-tap touch selection. No duplicated fallback directory or
second item list is needed.

## Positioning and Responsive Composition

- Use a normalized scene coordinate system and CSS percentages for objects.
- Use a controlled desktop aspect ratio around `5 / 3` rather than a height
  determined by viewport pixels.
- At `620px` and below, switch the same scene to a taller composition, likely
  around `4 / 5`, so touch targets and annotations remain legible.
- Apply optional mobile position overrides from the same item anchor.
- Keep the page itself free of horizontal overflow. Do not make the primary
  mobile experience a horizontally scrolling desktop canvas.
- Give every interactive object a minimum practical hit area even when the
  visible drawing is narrow or irregular.
- Reserve quiet negative space near scene edges for annotations; do not pack
  the entire surface with objects.
- Decorative bench elements belong in `bench-base.svg`. Interactive objects
  must remain separate assets.

The base scene and objects must share a predictable coordinate system. The
base SVG should use a stable `viewBox`; object percentages and annotation
geometry should be tested against that same composition at every breakpoint.

## Annotation System

Use one reusable annotation component rather than one tooltip per object.

Each annotation side maps to a small, predictable placement rule:

- `top`, `top-left`, `top-right`
- `left`, `right`
- `bottom`, `bottom-left`, `bottom-right`

The item supplies a side and optional normalized `offsetX`/`offsetY`. Shared
logic will:

1. identify the active object's anchor point;
2. derive the annotation endpoint from the declared side;
3. build a gently curved SVG path between them;
4. position the title, description, and action link;
5. add an active class that fades in the text and animates the path with
   `stroke-dasharray`/`stroke-dashoffset`.

The annotation should remain unboxed unless testing proves that text loses
contrast over the illustration. If a background is needed, use a very light
paper wash rather than a conventional tooltip card.

Reduced-motion mode will show the final annotation immediately, with no lift,
rotation, or drawn-path animation.

## Interaction State

Use one active item ID and delegated listeners on the scene. Adding a new data
entry must not register a new listener.

### Desktop pointer

- Pointer hover activates the preview.
- The object lifts by only a few pixels, scales slightly, and receives a quiet
  highlight or shadow.
- Leaving the object/annotation area dismisses the preview.
- Clicking the object follows its native anchor immediately.

### Keyboard

- Every object is a semantic anchor in a logical DOM/tab order.
- Focus activates the same preview used by hover.
- The site's existing visible focus outline is preserved and adjusted only if
  the irregular SVG shape needs a clearer focus surface.
- Enter follows the link using native anchor behavior. Space remains the
  browser's normal scrolling key because these are navigation links, not
  buttons.
- Focus must not make the annotation disappear while its explicit link is
  being reached.

### Touch/coarse pointer

- The first tap on an object prevents immediate navigation and selects it.
- The annotation remains open and contains an explicit link such as
  “View Photography”.
- That explicit link performs navigation. This is clearer and less
  error-prone than requiring users to discover a second-tap rule.
- Tapping another object switches the active item.
- Tapping outside the active object and annotation dismisses it.
- Touch behavior is determined by pointer capability, not viewport width
  alone, so touch laptops and small desktop windows behave sensibly.

## Skill Page Structure

Create a restrained shared skill-page pattern in `styles.css`, reusing the
existing header, footer, intro, eyebrow, section-heading, record, and gallery
language where possible.

Each page should contain:

- the shared site header with Workbench marked current
- a small breadcrumb back to Workbench
- skill title and short factual lede
- a flexible content area for records, process notes, images, references, or a
  small “more will live here” placeholder
- the shared footer with return navigation

Do not create a new JavaScript system for skill pages. Existing gallery markup
and `practice.js` can be reused where appropriate.

Content migration should be factual:

- Move the existing sketch overview and archive into
  `workbench/sketching/index.html`.
- Move the existing sewing archive into `workbench/sewing/index.html`.
- Place the existing OpenBot record on Robotics & Prototyping.
- Place Dynasts on Game Design.
- Place the existing film and visual-documentation records on Photography when
  the wording fits without inventing new claims.
- Coding can point to or summarize already documented technical work such as
  Poluto only when the existing repository supports the copy.
- Use minimal placeholders for areas without enough factual material.

## Planned Files

### Existing files to modify during implementation

- `workbench.html`
  - replace the index/gallery body with the illustrated scene shell
  - preserve shared header, page title, metadata, and footer conventions
  - remove the page-level image dialog after its galleries move to skill pages
- `styles.css`
  - add shared scene, object, annotation, skill-page, touch, responsive, and
    reduced-motion styles
  - keep all new rules grouped and commented in the existing style
- `docs/README.md`
  - retain the link to this plan

`practice.js` should not need item-specific changes. It may continue serving
the migrated sketching and sewing pages through depth-correct relative script
paths.

### New implementation files

- `workbench-scene.js` — generic progressive-enhancement and interaction
  controller for the declarative anchors in `workbench.html`
- `assets/workbench/bench-base.svg`
- `assets/workbench/camera.svg`
- `assets/workbench/sketchbook.svg`
- `assets/workbench/sewing-machine.svg`
- `assets/workbench/robot-parts.svg`
- `assets/workbench/laptop.svg`
- `assets/workbench/game-controller.svg`
- `workbench/photography/index.html`
- `workbench/sketching/index.html`
- `workbench/sewing/index.html`
- `workbench/robotics/index.html`
- `workbench/coding/index.html`
- `workbench/game-design/index.html`

All new files will use lowercase kebab-case names. No framework, package,
build step, or external animation library is planned.

## Implementation Phases

### Phase 1 — Preserve and separate current content

1. Create the six nested skill directories and the shared skill-page shell.
2. Move existing sketching and sewing archives to their dedicated pages,
   correcting asset, stylesheet, navigation, script, and footer paths.
3. Re-home the existing project records where the current factual copy supports
   it.
4. Verify all moved image links and the existing dialog viewer before replacing
   the Workbench landing body.

### Phase 2 — Build the layered scene

1. Add the base bench SVG and six separate object SVG placeholders.
2. Replace the old Workbench body with the scene shell, minimal copy, and six
   fully configured semantic item anchors.
3. Apply shared CSS to compose those anchors as scene objects while preserving
   native navigation without JavaScript.
4. Enhance the existing anchors from `workbench-scene.js`; do not generate a
   second set of links.
5. Apply percentage-based positions and test the desktop composition.

### Phase 3 — Add preview and navigation behavior

1. Implement the single active-item state.
2. Add delegated hover and focus previews.
3. Add the shared SVG arrow and annotation text placement.
4. Preserve native desktop/keyboard link navigation.
5. Add first-tap selection and the explicit mobile annotation link.
6. Add outside-tap dismissal and active-item switching.
7. Add reduced-motion behavior.

### Phase 4 — Responsive and visual integration

1. Tune scene aspect ratio and optional mobile item overrides at the existing
   `620px` and `410px` breakpoints.
2. Confirm minimum touch targets and readable annotation text.
3. Match the existing palette, typography, hairlines, and shadow restraint.
4. Check that the scene remains an illustrated workspace, not a set of floating
   icons or cards.

### Phase 5 — Scalability proof

1. Temporarily add one fully configured Ceramics anchor to the object layer in
   `workbench.html`, using an existing placeholder asset solely for the test.
2. Confirm that it renders, positions, previews, responds to keyboard and
   touch, draws an annotation, and exposes its configured destination without
   CSS selectors, listeners, or JavaScript branches.
3. Remove the temporary anchor and confirm that no selector, listener,
   JavaScript object, or other file needs cleanup.

## Verification Matrix

### Structure and links

- Load the site through the documented local HTTP server.
- Confirm `workbench.html` works from the root and through all primary nav links.
- Open every object destination and check for a successful page load.
- From every nested skill page, verify Home, Profile, Workbench, Path, Notes,
  breadcrumb, stylesheet, scripts, and asset links.
- Check that browser Back returns to the same Workbench document and scene.

### Desktop pointer

- Hover each object and confirm only its own preview appears.
- Confirm the lift/rotation is subtle and does not disturb scene layout.
- Confirm the arrow starts at the object and reaches the declared annotation
  side without crossing unrelated objects unnecessarily.
- Click each object and confirm immediate navigation to its configured `href`.

### Keyboard

- Tab through objects in a sensible visual order.
- Confirm every focused object has both the existing visible focus treatment
  and its annotation preview.
- Press Enter and confirm native navigation.
- Confirm focus can reach the active annotation link without collapsing it.
- Verify Shift+Tab and Escape/outside dismissal do not trap focus.

### Touch and coarse pointer

- First tap selects without navigating.
- The selected annotation shows title, description, and an explicit View link.
- The View link navigates correctly.
- A different object tap switches the annotation.
- An outside tap dismisses it.
- Verify behavior on a touch-capable wide viewport, not only a narrow phone.

### Responsive layout

- Inspect at approximately 1366px, 1024px, 820px, 620px, 390px, and 320px.
- Confirm the page has no horizontal overflow.
- Confirm the bench stays coherent and objects do not become tiny targets.
- Confirm annotations remain inside the scene or its reserved text area.
- Confirm orientation changes recalculate annotation geometry.

### Accessibility and resilience

- Confirm meaningful link names and decorative image `alt` handling.
- Confirm color contrast for annotations over the bench.
- Confirm the page remains understandable with motion reduction enabled.
- Disable JavaScript and confirm that every illustrated object remains a
  visible, named, directly navigable native link.
- Check the console for errors during hover, focus, resize, touch selection,
  and navigation.

## Adding a New Skill After Implementation

The target workflow is:

1. Add a lowercase kebab-case SVG or optimized bitmap to
   `assets/workbench/`.
2. Add one semantic anchor to the object layer in `workbench.html` with its
   identity, accessible name, copy, asset, URL, scene position, size,
   annotation direction, and any necessary mobile override.
3. Create `workbench/<slug>/index.html` from the shared skill-page structure.
4. Adjust normalized position or annotation offsets only if the composition
   needs it.

No JavaScript item object, new selector, event listener, hover branch, touch
branch, fallback-list entry, or SVG annotation markup should be necessary.

## Risks and Deliberate Limits

- Six detailed objects plus readable callouts can crowd a phone-sized scene.
  A taller mobile composition and optional per-item mobile overrides are the
  planned control, not a complex automatic layout engine.
- A single shared annotation is intentionally limited to one active item at a
  time. This keeps state predictable for pointer, keyboard, and touch users.
- Initial SVG objects will be architectural placeholders. Their paths can be
  replaced later without changing anchor IDs, attributes, positions, or
  interaction logic.
- The current environment did not expose a browser connection during planning,
  so this document is based on complete source inspection. Visual and
  interaction verification must be performed during implementation with an
  available local browser.
- Keeping each semantic anchor as the canonical item source makes the markup
  more verbose than a compact JavaScript object. That verbosity is deliberate:
  it preserves native navigation without JavaScript and avoids a duplicated
  fallback list in this build-free static site.

## Completion Criteria

- Workbench reads as one coherent illustrated physical workspace.
- Hover/focus gives a quiet preview; desktop click and keyboard Enter navigate.
- Touch requires an intentional preview before navigation and provides a clear
  explicit View link.
- Six initial skills share one renderer, one state model, one annotation system,
  and one set of responsive rules.
- Existing sketching, sewing, and project content remains accessible on
  dedicated skill pages.
- The temporary Ceramics test proves that adding one declarative HTML anchor
  requires no bespoke interaction code or secondary item registration.
- The final handoff documents item markup, attributes, CSS custom properties,
  assets, positions, annotation sides and offsets, destinations, touch
  behavior, responsive limits, and placeholder art.
