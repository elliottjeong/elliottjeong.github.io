# Blog Project Archive Plan

## Purpose

Transform `blog/` from a chronological list of posts into an archive where visitors can follow robotics projects and study notes by project or subject.

The experience should support two primary goals:

1. Visitors can browse projects and study subjects as a folder-like hierarchy from the landing page.
2. Visitors can still use a recent-updates list to find newly added or revised notes.

The site will remain a dependency-free collection of static HTML and CSS files, and all links will use relative URLs.

## Current State

- `blog/index.html` displays two posts in a single chronological list.
- `blog/poluto-v1-remote-access.html` is a technical note that belongs to the Poluto V1 project.
- `blog/a-place-for-notes.html` is a note about the site itself.
- The back link on each post returns to the complete Notes list.
- There is currently no project hub, project-specific table of contents, or previous/next navigation between notes.

## Chosen Direction

### 1. Combine a project hub with recent updates on the landing page

Folders and collections will be the primary navigation on the landing page. The chronological post list will remain as a secondary section.

```text
Notes / Lab Archive

Projects
└── Poluto V1
    └── 01 Three SSH relationships

Studies
└── Add subject folders as study notes are published

Site Notes
└── A place for notes

Recent updates
├── Poluto V1 / Three SSH relationships
└── Site Notes / A place for notes
```

Empty folders and projects that do not yet have published content will not appear on the public site.

### 2. Add a Notes-specific directory navigation sidebar

On desktop, Notes pages will use a two-column layout with a directory on the left and page content on the right.

```text
┌──────────────────────┬────────────────────────────────────┐
│ NOTES DIRECTORY      │ Notes / Projects / Poluto V1       │
│                      │                                    │
│ ▾ Projects           │ POLUTO V1                          │
│   ▾ Poluto V1        │ Project overview                   │
│     01 Remote access │                                    │
│                      │ Build log                          │
│ ▸ Studies            │ 01  Three SSH relationships       │
│ ▾ Site Notes         │                                    │
│   A place for notes  │ Latest update                      │
└──────────────────────┴────────────────────────────────────┘
```

- The sidebar will appear only within the Notes section; the existing global header will remain unchanged.
- On desktop, the directory will use `position: sticky` so it remains available while the visitor reads the content.
- Folders will expand and collapse with `<details>` and `<summary>`, allowing the interaction to work without JavaScript.
- Pages within folders will be standard navigation links.
- The current page link will use both `aria-current="page"` and a visual highlight.
- The implementation will retain the keyboard behavior of native HTML elements and will not use a complex `role="tree"` pattern.
- The design will not imitate an operating-system file browser literally. It will use thin rules, index numbers, drawer labels, and other details that suit the site's existing museum/archive visual language.

### 3. Collapse the directory on mobile

- On narrow screens, the left sidebar will become a collapsible `Browse notes` panel above the content.
- When opened, the panel will display the same link hierarchy as the desktop directory.
- The panel will be closed by default so that a long directory does not appear before the page content.
- The layout must not introduce horizontal scrolling at a viewport width of 320px.
- Version 1 will not add JavaScript to preserve the directory's open state between page navigations.

## Proposed File Structure

```text
blog/
├── index.html
├── projects/
│   ├── index.html
│   └── poluto-v1/
│       ├── index.html
│       └── 01-remote-access.html
├── studies/
│   └── index.html
└── site-notes/
    ├── index.html
    └── a-place-for-notes.html
```

- `blog/index.html`: archive root and recent updates
- `blog/projects/index.html`: list of all projects
- `blog/projects/poluto-v1/index.html`: Poluto V1 overview, status, and note index
- `blog/projects/poluto-v1/01-remote-access.html`: the current SSH note
- `blog/studies/index.html`: study archive that can expand as subjects are added
- `blog/site-notes/index.html`: notes about the portfolio site itself

As more projects are added, create a new `blog/projects/<project-name>/` directory for each one. Keep a study note within its project when it is directly tied to that work. Place it under `studies/` only when it is an independent subject that can apply to multiple projects.

## Page Responsibilities

### Notes root

- A short introduction to the archive
- Projects, Studies, and Site Notes collections
- Status, note count, and last-updated date for active projects
- The three to five most recent updates

### Project hub

- Project name and a short, factual description
- Status and last-updated date
- Project goal or scope
- An ordered build-log index
- Links to related repositories or outcomes only when those resources exist

### Individual note

- A `Notes / Projects / Poluto V1 / Note title` breadcrumb
- Project name, note number, date, and status metadata
- Note content
- Previous note / project index / next note navigation at the end
- Current-page indication in the sidebar

## Existing URL Migration Plan

| Current file | Target file | Handling |
| --- | --- | --- |
| `blog/poluto-v1-remote-access.html` | `blog/projects/poluto-v1/01-remote-access.html` | Update internal links to the new path and retain a compatibility page at the old URL if needed. |
| `blog/a-place-for-notes.html` | `blog/site-notes/a-place-for-notes.html` | Update internal links to the new path and retain a compatibility page at the old URL if needed. |

Do not delete the original files until the usage of the existing published URLs has been checked.

## Implementation Phases

### Phase 1 — Structure and shared navigation

1. Create the target directories and the project and collection `index.html` pages.
2. Add the shared directory navigation markup to all Notes pages.
3. Add the Notes-specific two-column layout, sticky sidebar, and folder hierarchy styles to `styles.css`.
4. Convert the directory into a collapsible panel on mobile.

### Phase 2 — Existing note migration and project flow

1. Move the Poluto V1 SSH note into the project directory.
2. Connect the ordered notes from the Poluto V1 project hub.
3. Move the site note into its separate collection.
4. Verify all breadcrumbs, back links, previous/next links, and relative asset paths.

### Phase 3 — Landing page and polish

1. Convert the Notes root into a folder-style project hub.
2. Add the recent-updates section below the primary collections.
3. Check current-page, focus, and hover states.
4. Test long titles, deep nesting, and horizontal overflow on desktop and mobile.

## Implementation Principles

- Keep shared styles in `styles.css`.
- When the directory navigation changes, apply the same update to every Notes page.
- Do not invent project descriptions or personal information that has not been provided.
- Do not communicate folder state through icons alone; always provide a text label.
- Keep the folder link and expansion control as separate interactions. `<summary>` expands the folder, while the links inside it navigate to pages.
- Use project note numbers to make the reading order clear in the interface and the table of contents.
- Do not add search, a tag system, or JavaScript state persistence until the amount of content makes those features necessary.

## Completion Criteria

- Visitors can find the Poluto V1 project and its notes from the Notes landing page.
- Visitors can return to the project index directly from an individual Poluto V1 note.
- The left directory remains available while scrolling on desktop.
- The same directory can be expanded and collapsed on mobile.
- Every folder toggle and link is usable with a keyboard alone.
- The current page is visually identified and has `aria-current="page"`.
- All page and asset URLs are relative.
- There is no horizontal overflow at viewport widths of 320px and above.
- Core navigation works without JavaScript.
