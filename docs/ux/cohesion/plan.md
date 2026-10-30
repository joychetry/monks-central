# UX cohesion: plan

Branch `feat/ux-cohesion` from `main` (0.3.1). Goal: one page system across every screen, and Joy's 12 points fixed.
The redesign's look stays: Figtree, the one green, light sidebar, both themes, WCAG AA, visible focus, no
colour-only status, 200% zoom, no native-looking controls, no em dashes in copy.

This file is the plan. Code comes after it, in the order at the end.

## 1. What is there today

### The shell (`ui/src/App.tsx`, `styles/base.css`)

- **Sidebar (`.rail`)**: brand, then the "Sites to show" group select (`.scope-field`), the nav groups, then
  `.foot` (the "Next check at" note, the theme switch, the version). The whole rail is one `overflow: auto` box
  and the foot is pushed down with `margin-top: auto`, so with a short window the foot scrolls away with the nav.
- **Top bar (`.top`)**: "Last checked" status line, the Ctrl K bar, and "Check all sites now". On Overview that
  button is the primary disc button with the text first and the icon disc after it (`App.tsx:541`); on every
  other page it is a plain button with the icon first. Same action, two looks, two icon orders.
- **Page head (`.phead`)**: already shared. The title and the line under it come from `ABOUT` in App; screens
  put their actions in the head with `<HeadActions>` (a portal into `.phead-acts`). The gap under it is the
  `.body` grid row gap (`--sp-5`, 24px).
- **Page body**: every screen renders `.scroll.page` (a bare scroll box), then usually a `.stack` (grid, 16px
  gap) inside it. Some screens skip the `.stack` and add their own grid in their CSS file instead.
- **Detail panel**: `.insp` sits in the `.body` grid's second column, so it only takes room while it is drawn.

### Screens

Legend: wrapper = what the screen's root is; toolbar = the row of search, filters and buttons; empty = how
its empty and error states are drawn (`<Empty>` is the shared component in `components/feedback.tsx`; "inline"
means a hand-written `<div className="empty">`).

| Screen | Wrapper | Toolbar | Tabs | Table / list | Empty | Side panel | One-off layout CSS |
|---|---|---|---|---|---|---|---|
| Overview | `.scroll.page` > `.ov` | none | none (segmented in the feed card) | `.t` in `.card` | inline `.empty`, `.quiet` lines | none (2-col `.ov-split`) | `.ov`, `.ov-split`, `.stats` in base.css |
| Sites | `.scroll.page.sites`, **no `.stack`** | `.filters`: segmented counts, search, a dashed `.chip` | none | `.t` grid in `.card`, 5 cols | inline | `.insp.site-pane`, **only while a row is open** | `.sites .t td` height |
| Updates | `.scroll.page.updates` > `.split-r` | `.filters` | none | `.t` in `.card` | inline + `.quiet` | static right `.stack` | `.updates .filters .check` |
| Plugins / Themes (Matrix) | `.scroll.page.mx` > `.stack` | `.filters` | none | `.t.mx-t` grid | inline | `.insp.mx-insp`, **only while a cell is open** (Themes: an "Active theme" aside) | `.mx .filters .srch` |
| Content | `.scroll.page` > `.stack` | `.filters.cfilter`: site `Select`, **post types as a segmented row that wraps**, search | segmented post types | `.t` | inline (4) | none | `.cfilter` widths |
| Media | `.scroll.page` > `.split-r` | **split in two**: site picker and search in the card head (a `<form>`), type, month and Grid/List in `.mfilters` under it | none | thumbs grid or `.t` | inline (3) | `.stack.mside`, **blank column until an item is picked** | `.mlib .card-head …`, `.mfilters` |
| Users | `.scroll.page.users` > `.stack` | `.filters` | none | `.t` in `.card` | inline (2) | none | `.users .filters .srch` |
| Comments | `.scroll.page.comments` > `.stack` (max 1000px) | `.filters` | none | `.inbox` cards | inline | none | `.comments > .stack` width |
| Classic Monks | `.scroll.page.cm` > `.stack` | site `Select` **in the page head**; `.filters` form in the Features tab | `Tabs`, 5 tabs | `.toggles`, `.t` | `<Empty>` (4) + inline | `.split-r` per tab | `.cm .filters …`, `.cm > .stack > .tabs` |
| Monitoring | `.scroll.page.mon` > `.stack` | none | none | `.t` | inline | none | none |
| Security | `.scroll.page.sec` > `.stack` | none | none | `.t` x2 | inline + `.quiet` | right `.stack` | none |
| Clients | `.scroll.page.clients` > `.stack` | none | none | `.t` | inline | `.split-r` renewals card | none |
| Store | `.scroll.page.store` > `.stack` | site `Select` **in the page head**, period segmented; search + select in a card head | none | `.t` | inline + `.quiet` | none | `.store .card-head …`, `.phead-acts .store-pick` |
| Reports | `.scroll.page.reports` > `.stack` | none | none | none | inline | none | none |
| AI | `.scroll.page.ai` (own grid, gap 24px) | none | `Tabs` | `.t` | inline + `.empty-pic` | none | `.scroll.page.ai`, `.ai > .tabs` |
| Settings | `.scroll.page.setpage` > `.stack` | none | none | `.t` | none | none | `.setpage …` |
| Search | `.scroll.page.search` (own grid, gap 24px, max 980px) | big 48px search row, then `.filters` | segmented kinds | `.t` | inline | none | `.srch-go` 48px, `font-size: 1rem` |

Sheets and dialogs (AddSite, Install, JobSheet, PublishMany, the Editor, MediaPicker) are not pages; they
keep `Sheet` and only pick up the control, type and button fixes.

### What is inconsistent, measured

Taken from the mock build at 1440 x 900 (Media, both themes):

| Control | Height | Border (light / dark) | Radius |
|---|---|---|---|
| `Select` (`.input.select.sm`) | 34px | `#7b877f` / `#767676` (`--line-ui`, reads as a white ring in dark) | 9px |
| `SearchInput` | **40px** (its `sm` class reaches the wrapper, not the input) | `--line-ui` | pill |
| `Button small` | 30px | `#c7cfca` / `#343434` (`--line-2`) | pill |
| `DateInput sm` | 34px | `--line-ui` | 10px |

So one toolbar row holds four heights, three radii and two border colours. Tokens: `--control` 36,
`--control-sm` 30, `--field` 40, `--field-sm` 34: four heights where two would do.

Type sizes off the scale: `10px` (users.css, comments.css, `.pchip .fav`, `.ptile.xs`: under 12px), `26px`
(store.css, classic-monks.css), `1rem` (search.css), `1.0625rem` (the brand), and pixel line heights
(`/16px`, `/18px`, `/20px`) in seven screen files.

Empty states: `<Empty>` is used in 5 places; about 25 are hand-written `<div className="empty">`, plus
`.quiet` one-liners for "nothing here" inside cards.

Buttons: 34 `.disc` buttons put the text first and the icon after it (Overview's "Check all sites now",
Add a site, Upload files, Add a user, Confirm and run, Make the report, …).

Loading: `App.tsx` imports every screen eagerly (one bundle, TinyMCE included, because App imports
`leaveGuard` from `screens/Editor`). Per-screen data (`api.users`, `api.media`, `api.posts`, …) is fetched
in each screen's effect on mount, with no cache, so every visit starts from a skeleton.

Favicons: `crates/core/src/icons.rs` takes WordPress's `site_icon_url`, else the first `<link rel="icon">`
(usually the 32px one, or a 16px `.ico`), and only then `apple-touch-icon`. `SiteTile` draws it at 20px in a
30px tile (`.fav img`), so a 16px icon is upscaled and blurry, and a multi-size `.ico` is at the browser's mercy.

## 2. The target system

As few new pieces as do the job; everything else is the CSS that is already shared, made the only way.

### Tokens (`styles/tokens.css`)

- **Type**: the scale that exists stays the only one: `--fs-xs` 12, `--fs-sm` 13, `--fs` 14, `--fs-md` 15,
  `--fs-lg` 20, `--fs-xl` 28, `--fs-stat` 36. Line heights: `--lh` and `--lh-tight` only.
- **Controls**: `--control: 36px` and `--control-sm: 32px` for every button, input, select, search, date,
  number box, chip and segmented track. `--field` and `--field-sm` go (sheets' form fields use `--control`;
  a textarea keeps its own min height).
- **Control look**: `--control-line: var(--line-2)` (the button border today) for every control at rest,
  `--line-ui` on hover, `--radius-control: var(--radius-pill)` for toolbar controls, `--radius` for form
  fields in sheets, and one focus ring: `--ring: 0 0 0 3px color-mix(in srgb, var(--focus) 22%, transparent)`
  with the green border, in place of today's outline-plus-shadow double ring on fields.
- **Page rhythm**: `--head-gap: var(--sp-5)` (under the page head), `--page-gap: var(--sp-4)` (between the
  toolbar, cards and sections of a page). Cards keep `--radius-lg`, padding `--pad`.

Accessibility check on the border change: WCAG 1.4.11 asks 3:1 for what identifies a control. Buttons
already rest on `--line-2` and pass on their label; for selects the chevron (`--text-2`, over 4.5:1) and the
label do it, and text boxes keep the well fill (`--panel`) plus the `--line-ui` border on hover and focus.
`contrast.test.ts` keeps testing `--line-ui` and `--focus` (both still used). **Decision for Joy**: if text
boxes in sheets must keep a 3:1 border at rest, they keep `--line-ui` and only toolbar controls go quiet.

### Shared components (React)

| Component | Where | What it is |
|---|---|---|
| `Page` | `components/page.tsx` (new) | `<div className="page">`: the scroll box, a grid with `--page-gap`. `side` prop renders the two-column layout with a right `SidePanel` that is always there. `narrow` prop for Search and Comments (max width) instead of their CSS. Replaces `.scroll.page` + `.stack` + `.split-r` at page level. |
| `Toolbar` | same file | `<div className="toolbar" role="group">`: one row, `align-items: center`, every child `--control` tall; `Toolbar.End` (or `.end` child) pushes to the right; wraps only under 900px. Replaces `.filters`, `.bar`, `.mfilters`, card-head forms used as filters. |
| `SidePanel` | same file | The right column card. Children when there is something to show, else a calm empty state (`<Empty>` small: icon, one line like "Pick a site to see its details."). Fixed width `--inspector`, sticky top. |
| `Empty` | `feedback.tsx` (exists) | Every empty and error state goes through it; adds a `size="sm"` for inside cards and side panels, replacing the `.quiet` one-liners where they stand for "nothing here". |
| `Button` | `ui.tsx` (exists) | New `icon` prop: renders the glyph first, then the text, always. The `.disc` style keeps its green disc but on the left (`padding-left: 5px`). |
| `Tabs` | `controls.tsx` (exists) | Gains overflow: tabs that don't fit go into a "More" menu at the end of the row. |
| `Segmented` | `controls.tsx` (new, small) | The `segmented inline` groups (Sites, Updates, Content post types, Comments, Search, Media, Settings) as one component, sharing the same overflow helper as `Tabs`. |

CSS for these lives in `styles/base.css` next to `.card` and `.t`. Cards (`.card`, `.card-head`,
`.card-foot`, `.card-body`) and tables (`.t`) are already shared and stay CSS classes.

## 3. The 12 points, one by one

1. **One page structure.** Every screen's root becomes `<Page>` (with `side` where it has a right column),
   its filter row a `<Toolbar>`, its cards `.card`, its empty states `<Empty>`. The site picker is always the
   first toolbar item (Classic Monks and Store move it out of the page head; Media moves it out of the card
   head). Page actions stay in the page head via `HeadActions`. Remove from `styles/screens/*.css`: every rule
   on `.scroll.page.*`, `> .stack`, `.filters`, `.mfilters`, `.cfilter`, `.split-r`, `.phead-acts .*-pick`,
   toolbar widths (`.srch`/`.select` sizes per screen). Delete `.scroll.page`, `.filters`, `.bar` (kept only
   if a sheet still needs it), `.split-r` from base.css once nothing uses them. Files: `App.tsx` (`.body`
   grid becomes one column; the side panel lives inside `Page`), every `screens/*.tsx` page,
   `styles/base.css`, `styles/screens/*.css`.
2. **Type scale.** Replace the stray sizes: `10px` to `--fs-xs` (and grow `.ptile.xs` and `.pchip .fav` from
   18 to 20px so the letter fits), `26px` to `--fs-xl`, `1rem` to `--fs-md`, the brand's `1.0625rem` to
   `--fs-md`, pixel line heights to `--lh-tight`. New Vitest `styles.test.ts` reads every CSS file and fails
   on a `font-size` or `font` shorthand size that isn't `var(--fs…)`, `inherit` or `1em`, and on any
   `--fs-*` token under `0.75rem`.
3. **Tabs overflow.** A pure `fit(widths, room, moreWidth, selected)` helper returns how many tabs show;
   `Tabs` and `Segmented` measure with a `ResizeObserver` and render the rest in a `Menu` labelled "More"
   (with the count of hidden items). The chosen tab is always visible: if it lives in the overflow it swaps
   in for the last visible one. Keyboard: arrows move across the visible tabs and the More button, Down or
   Enter on More opens the menu (the existing `Menu` already does arrows, Home, End, Escape). Used by
   Classic Monks (5 tabs), AI, the Editor's head, and Content's post types (the row that wraps today).
   Tests: `fit` cases, and a render test with stubbed widths that checks the More menu, the selected tab
   staying visible, and the keys.
4. **Selects.** `.select` drops `--line-ui` for `--control-line`, takes `--control` / `--control-sm`
   height, the control radius and `--ring` focus, in both themes. The same applies to `.input`, `.srch
   .input`, `.dt-btn`, `.num-in`, `.btn` so they match. Files: `styles/controls.css`, `styles/base.css`
   (`.input`, `.btn`, `.scope.sm`), remove per-screen overrides. Check `e2e/native.spec.ts` still passes
   (appearance stays `none`).
5. **"Sites to show" to the app header.** Move the `Select` from `.rail` into `.top`, before the status
   line, at `--control-sm` with its visible label. Keep the accessible name "Sites to show" (tests in
   `App.test.tsx`, `Sites.test.tsx`, `e2e/perf.spec.ts` and `e2e/a11y.spec.ts` find it by that name). Drop
   `.scope-field` CSS from the rail and its 900px rule.
6. **Sticky sidebar footer.** `.rail` becomes a non-scrolling flex column: brand (fixed), a new
   `.rail-nav` wrapper (`flex: 1; overflow: auto`, the thin scrollbar rules move to it), and `.foot`
   (`flex: none`, a hairline above it). Under 900px the rail stays the top strip it is today. Joy's "the
   checkbox" in the footer is read as the "Next check" note; if it means something else, it moves with the
   rest of the foot anyway.
7. **Right panel always visible.** Sites, Plugins/Themes and Media render `<Page side={<SidePanel …>}>`.
   With nothing open it shows the empty state ("Pick a site to see its details, notes and actions.",
   "Pick a cell to manage that plugin on that site.", "Pick a file to see and edit its details."). The table
   no longer resizes when a row opens. Close buttons on the panels clear the selection (panel stays).
   Under 1100px the panel drops below the content (today's `.split-r` rule). Files: `Sites.tsx`
   (`Inspector`), `Matrix.tsx` (`Inspector`, the Themes aside), `Media.tsx` (`mside`), `components/page.tsx`.
8. **Search height and one row.** `SearchInput` passes its size to the input (`.srch.sm .input` gets
   `--control-sm`), every toolbar control is `--control` tall, `Toolbar` aligns centre. Media's two rows
   (card head form + `.mfilters`) become one `Toolbar` above the card: site, search, type, month, then Grid
   / List at the end; the Search button goes (Enter and a short debounce already exist elsewhere; Media gets
   the same debounce as Users). Search page keeps its big search row as the one deliberate exception, at
   48px with `--fs-md`.
9. **Icon left, text right.** `Button` gets `icon`; convert all 34 `.disc` buttons and the Overview "Check all
   sites now" to it. Overview and other pages then show the same "Check all sites now": icon first, plain
   button in the top bar (the page head holds each page's primary action). A Vitest test renders `Button`
   with `icon` and checks the order; a grep in `styles.test.ts` (or a small source test) fails if
   `btn-disc` appears after text in a `.tsx`. Trailing arrows on go-links (`.golink`, "Review") stay: they
   are links, not buttons.
10. **Preloading.** Code: screens become `lazy()` chunks via one `SCREENS` map of loaders in `App.tsx`;
    move the helpers App needs out of screen files first (`attention`, `summary`, `when`, `said` from
    Overview; `updatesOf`, `planTitle` from Updates; `leaveGuard` from Editor) into `src/fleet.ts`, so the
    chunks really split (TinyMCE leaves the main bundle). `preload(section)` imports the chunk (memoised)
    and warms its data; nav items call it on `pointerenter` and `focus`; after first paint
    `requestIdleCallback` preloads the likely next pages (Sites, Updates, then the rest one per idle slot).
    Data: a small `remember(key, load, ttl = 60s)` in `api.ts` (a map of promises) wraps the first loads the
    screens do today (`users`, `comments`, `posts`/`postTypes`, `media`, `storeOverview`/`products`,
    `clients`/`costs`, `appSettings`, `activityLog`, `features`/`settings`); the existing `listen` events
    and every mutation clear the matching keys, so nothing shows stale data after a change. Suspense
    fallback: the page's `Skeleton` in a card. Tests: `remember` dedupes and expires and clears on the
    event; hovering and focusing a nav item calls the loader once; the idle prefetch runs (fake
    `requestIdleCallback`).
11. **Sites page.** Spacing: fixed by `Page` (today `.scroll.page.sites` has no gap between the toolbar and
    the card). Columns: tick 44px, Site fills, Status `min-width` for the longest pill ("Sign in again"),
    WordPress (version + PHP line) and Connection `nowrap` with fixed widths, actions column `width: 1%`
    `nowrap`; the name and address cut with an ellipsis and a tooltip instead of wrapping; check at 1300px,
    1100px and 200% zoom. Favicons (Rust, `crates/core/src/icons.rs`): read `sizes` on icon links, try
    WordPress's site icon (512px), then `apple-touch-icon`, then the largest sized `icon` link (64px or more
    first), then other icons, then `/favicon.ico`; prefer PNG/SVG over ICO; raise `CAP` if a 512px PNG needs
    it. Unit tests for the ordering next to the existing `icon_links` tests. UI (`SiteTile.tsx`, base.css):
    the image fills the tile at 2x density (`.fav img` 100% of a 30px tile with 3px inset, `object-fit:
    contain`), and an icon whose natural size is under the drawn size shows the monogram instead (crisp
    fallback). Cached icons refresh on the next check (refresh runs on every check already).
12. **Own pass.** After the screens move, a sweep with the before/after shots for: radii (cards 14,
    controls pill, form fields 10, inspector 16 today vs cards 14: make it `--radius-lg`), borders (hairline
    `--line` for structure, `--control-line` for controls), hover (`--panel`) and focus (`--ring`) on every
    interactive thing, `.icon-btn` size (30) vs `--control-sm`, card-head heights (56 vs Editor's 48),
    `.kbar` 38px to `--control`, toast and selbar button heights, `.quiet` vs `.note` vs `.help` paddings.
    Each fix is listed in the PR.

## 4. Order of work

Small commits, conventional messages; tsc and Vitest for touched files after each step. There is no ESLint
config in the repo, so "eslint" is `tsc` plus the tests unless Joy wants one added.

1. `docs(ux): before screenshots`: `SHOTS=cohesion/before npx playwright test shots -g "<page list>"`
   (the existing `e2e/shots.spec.ts`, filtered to the top-level page of each section, both themes). Not the
   full suite.
2. `feat(ui): control and page tokens`: tokens, controls, selects, search height, focus ring (points 2, 4, 8
   at the token level) + `styles.test.ts`.
3. `feat(ui): Page, Toolbar, SidePanel`: components, CSS, tests.
4. `feat(ui): icon-first buttons`: `Button icon`, every `.disc` button, the top bar (point 9).
5. `feat(ui): shell`: "Sites to show" to the top bar, sticky sidebar foot (points 5, 6).
6. `feat(ui): tabs and segmented overflow` (point 3) + tests.
7. Screens onto the system (point 1, plus 7, 8, 11 where they land), one commit per group, smallest first so
   the pattern settles: Monitoring, Reports, Settings, Clients, Security, Comments, Users, Search, AI,
   Updates, Store, Classic Monks, Content, Media, Plugins/Themes, Sites, Overview. Each removes its one-off
   layout CSS.
8. `feat(core): sharper site icons` (Rust) + `feat(ui): crisp site tiles` (point 11).
9. `perf(ui): lazy screens and prefetch` (point 10): helpers to `fleet.ts`, lazy map, preload, `remember`.
10. `fix(ui): consistency pass` (point 12).
11. `docs(ux): after screenshots` into `docs/ux/cohesion/after`.
12. Push, open the PR to `main` listing each point and where it was fixed, watch CI (build, Vitest,
    Playwright with axe), fix and push until green. No merge, no release.

## 5. Risks

- E2E selectors: `e2e/screens.ts` opens tabs by role and name; the More menu must keep visible tabs as
  real `tab`s, and the 1440px CI viewport should fit Classic Monks' 5 tabs without overflow.
- Lazy screens: `e2e/perf.spec.ts` waits for `.body > *`; the Suspense fallback must not count as the
  screen (the fallback gets a class the test can skip, or the test waits for the page's own landmark).
- The quiet control border is the one accessibility judgement call (section 2).
- Favicon ordering changes a network path on every check; it keeps the same caps, timeouts and host rule.
