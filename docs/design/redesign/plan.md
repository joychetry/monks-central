# Redesign plan: Joy's design onto this codebase

Design: `spec.md` and `screens/`. Rules: `docs/ux/README.md`. The work goes through the system in this order:
tokens and fonts, the shell, shared components, then screens. No Rust or behaviour changes; the one new data
read is the Overview's Latest changes feed, which uses the existing `activity_list` command (`api.activityLog`).

## 1. Tokens and fonts (`ui/src/styles/tokens.css`, `fonts.css`, `ui/src/fonts/`)

Keep the existing token names, because every screen's CSS uses them, and point them at the design's values.
Add the design's own names for what the old set lacks.

| Existing token | Light | Dark | Design source |
|---|---|---|---|
| `--bg` (surfaces, fields) | `#FFFFFF` | `#141414` | `--surface` |
| `--panel` | `#F6F8F7` | `#1B1B1B` | `--well` |
| `--raise` (hover, tags) | `#F1F3F2` | `#222222` | `--ground` light, `--tint` dark |
| `--sel` (selected row) | `#E8F4EE` | `#222222` | `--tint` |
| `--line` / `--line-2` / `--line-ui` | `#E3E7E4` / `#C7CFCA` / `#8A978F` | `#262626` / `#343434` / `#666666` | `--border` / `--border-hover` / `--border-strong` |
| `--text` / `--text-2` / `--text-3` | `#0D1411` / `#45524B` / `#5A665F` | `#EDEDED` / `#ABABAB` / `#929292` | `--ink` / `--ink-muted` / `--ink-subtle` |
| `--focus` | `#01824C` | `#3DBF82` | `--monk-green` (dark: `--accent`, see decisions) |
| `--ok` / `--ok-bg` | `#016B3F` / `#E8F4EE` | `#3DBF82` / `#222222` | `--brand-text` / `--tint` (dark: `--accent`) |
| `--warn` / `--warn-bg` | `#8A5A00` / `#FBF1E0` | `#E3AE52` / `#241E14` | `--warn-ink` / `--warn-bg` |
| `--danger` / `--danger-bg` | `#B3261E` / `#FBEAE8` | `#F08A82` / `#261716` | `--danger` / `--danger-bg` |

New: `--ground`, `--well`, `--tint`, `--tint-2`, `--green`, `--green-hover`, `--on-green`, `--accent`,
`--brand-text`, `--btn-ink`, `--btn-ink-hover`, `--btn-on-ink`, `--warn-paper`, `--warn-line`, `--saffron`,
`--k-core`, `--k-plugin`, `--k-theme`, `--k-off`, `--highlight`, `--shadow-soft`, `--shadow-float`, radii
(`--radius-pill`, `--radius-card` 14, `--radius-dialog` 18), and `--display` (Outfit).

Rail tokens (`--rail-*`) and the `.rail` remap go: the light sidebar is a light surface now, the same tokens as
the content.

Type, in rem, nothing under 12px: `--fs-xs` 12 (labels, meta, keys, counts; the design's 11 and 11.5 round up),
`--fs-sm` 13 (details, small buttons, versions), `--fs` 14 (body, buttons, nav), `--fs-md` 15 (card titles, page
description), `--fs-lg` 20 (sheet and section titles), `--fs-xl` 28 (page title, empty titles), `--fs-stat` 36
(stat numbers). `--sans` Figtree, `--display` Outfit, `--mono` JetBrains Mono. The serif goes (it was only the
Overview sentence and empty titles).

Sizes: `--control` 36 (buttons, nav), `--control-sm` 30, `--field` 40 (inputs, search), `--field-sm` 34,
`--row` 48 comfortable / 36 compact (the design's 56 is for 4-row demo tables; 48 keeps 300 sites usable).

Fonts: Figtree, Outfit and JetBrains Mono, latin subset, variable, the same files the design bundles (taken from
the bundle), in `ui/src/fonts/` with `OFL.txt` (copyright lines and the licence). IBM Plex Sans, IBM Plex Mono
and Newsreader are removed.

`ui/src/contrast.test.ts` gets the new pairs: green fills under white text, `--accent` and `--focus` on every
surface, `--text-3` on `--ground`, `--well`, `--tint`, status words on their tinted grounds, warn on
`--warn-paper`.

## 2. Shell (`ui/src/App.tsx`, `styles/base.css`)

| Design | Code |
|---|---|
| Sidebar `.mc-side` on `--surface` | `nav.rail`, light in light mode: brand (existing `Logo`, "Monks Central", mono "by Classic Monks"), "Sites to show" mono label over the existing `Select`, nav groups as mono labels, nav items 36px with the existing line icons, count badges |
| Count badges | existing counts, now pills: `.n` neutral (Updates waiting), `.n.alert` warn ("1 down", AI plans, Security, Monitoring); the current page's count is green. New: Overview shows how many sites need attention |
| "Search everything" nav item | added under App; opens the Search screen (it was palette-only) |
| Footer | next-check note in a well with a clock icon ("Next check in N min. Automatic checks run only while the app or its tray agent is open."), the theme as three round buttons (computer, light, dark; `aria-pressed`, each labelled), version |
| Top bar `.mc-top` | status (pulse dot + word, "Last checked **N min ago**", link "N sites need attention" to Sites), search bar "Search or run a command" `Ctrl K` (moved from the rail), primary pill "Check all sites now" with a refresh disc |
| Page head `.mc-head` | new, in the shell for every section: `h1` (Outfit 28) and a one-line description; the Overview description is the fleet sentence ("One site is down. ..."). Overview gets "Add a site" `A` on the right |
| Page `.mc-page` on `--ground` | `main.body` is the ground; `.scroll` (the screen) is a card (surface, 1px border, radius 14), `.insp` a second card beside it. Overview's `.scroll.page` has no card chrome: it lays out its own cards |

## 3. Shared components

| Design | Code |
|---|---|
| `.cm-btn` pills | `Button` / `.btn` (`components/ui.tsx`, `base.css`): pill, 36/30; `kind="primary"` ink in light, green in dark; secondary is the default (surface + `--line-2` border); new `kind="soft"` (tint) for the Overview fix rows; `danger` red text with border |
| `.mc-kbd` | `.kbd`: mono, 2px bottom border, radius 6 |
| `.mc-st` status pill | `Status` keeps its shape icon and word (status is never colour alone); `.st` in tables stays an icon + word; a pill variant `.st.pill` for the Overview table |
| `.cm-badge` | `.tag`: mono 12, radius 6, tint / warn / danger grounds |
| `.mc-input`, `.mc-search` | `.input` 40px radius 10, field border, inset shadow, green focus; `.srch` (`SearchInput`) a filled pill |
| Drawn checkbox, switch | `controls.css`: green when on (white tick), switch green track; still drawn, never native |
| `.mc-seg` | `.segmented`: pill track on `--well`, selected on `--bg` with the soft shadow |
| `.mc-tabs` | `.tabs`: underline tabs, current green underline |
| `.mc-table` | `table.t`: mono uppercase heads on `--well`, hover `--panel`, selected `--sel` with a 3px green inset bar, `.focus` row likewise |
| `.mc-cell` | `.cell` in the matrix: well box, mono version, state words kept |
| `.mc-bulk` | `.selbar`: ink bar with the selected count (stays stuck to the bottom: the no-shift rule) |
| `.mc-drawer`, `.mc-dialog` | `.sheet` (`components/Sheet.tsx`): radius 16, float shadow, footer on `--panel` |
| `.mc-steps` | `.jobsteps` and the Overview first-run steps: numbered rings |
| `.mc-choice` | `.radios.cards`: green border and tint when chosen |
| `.mc-prog`, `.mc-meter` | `.progress`, `.bar-progress`: 6px, green |
| `.mc-note` | `.alert`, `.note`: well callouts with radius 12 |
| `.mc-empty` | `Empty` (`components/feedback.tsx`): centred disc, Outfit title, primary pill |
| `.mc-toast` | `.toast`: ink box, white text, green tick; danger toasts keep the red cross shape |
| Palette (D10) | `.pal`: 640 wide, radius 16, search row with `Esc` key, mono group labels, 28px icon tiles, footer keys |
| Popovers, listbox, calendar, tooltip | radius 10, float shadow, selected option `--tint` |

## 4. Screens (`ui/src/screens`)

Every screen gets the shell's page head and the card body; screen JSX changes only where the design adds a
layout the classes can't give.

| Screen | Design board | Plan |
|---|---|---|
| Overview | 01, D01 | Rebuilt: 4 stat cards (Sites with up/down/needs-a-look bar and the Classic Monks count; Updates waiting with core/plugins/themes bar; Vulnerable plugins; Waiting on you: approvals on sites and AI plans), Needs attention card (icon tiles, one pill action each: existing site rows plus vulnerabilities, plans and waiting updates), Your sites table (status, WordPress, 30-day uptime, response; up to 8 rows, "Open Sites"), Latest changes feed (activity log, All/You/AI segmented, You/AI avatars, "See all activity" to AI), Versions card kept. First run: D01 empty card with the three steps. Next steps card kept |
| Sites, Add a site | 02, D02 | bar becomes filter row; grid restyled through `table.t`; inspector card; Add a site sheet with choice cards |
| Updates | 03, D03 | bar with kind tabs and counts, versions in mono with the arrow, job sheet steps and progress rows |
| Plugins, Themes, Install | 04, 05, D04 | matrix cells as well boxes, install sheet |
| Content, Editor, Publish to many, Media | 06, 07, D05 | tables, editor sheet, media grid with rounded thumbs |
| Users, Comments, Clients | 08, 09, 13, D06 | tables, inbox rows as list items, client cards |
| Classic Monks, Monitoring, Security | 10, 11, 12, D07 | toggles list, titled tables (`.h-sec` as card titles) |
| Store, Reports | 14, 15, D09 | tables, report steps |
| AI | 16, D08 | plan cards with diffs, activity log, connect code block |
| Settings | 17, D09 | sections as cards, segmented controls, switches |
| Search | 18 | result groups, `mark` in `--highlight` |
| Palette, job sheet, toasts | D10, D03, D09 | as in shared components |

## 5. Rules kept over the design (listed in `docs/ux/README.md` and the report)

- Nothing under 12px: the design's 11px labels, counts, keys and badges are 12px.
- Contrast: every text and status token pair is in `contrast.test.ts`; the dark focus ring and status dots use
  `--accent` `#3DBF82` (the design's `#01824C` ring is under 3:1 on some dark grounds).
- Status never by colour alone: status pills keep the shape icon and the word; segmented bars have a key with
  words and an `aria-label`.
- Native controls: the design's `accent-color` checkboxes and native `<select>` stay the kit's drawn controls.
- No layout shift: the bulk bar stays stuck to the bottom of the table (not attached on top as in 02).
- 900px: the existing one-column layout with the rail on top (the design collapses at 760px).
- Reduced motion: unchanged.

## 6. Tests

`App.test.tsx` and `Overview.test.tsx` change where they test the old look (the theme cycle button, the h2
sentence, the old KPI names). e2e screen list unchanged; `a11y.spec.ts` follows the moved search button.
Screenshots: `SHOTS=redesign/after npx playwright test shots` beside `redesign/before`.
