# Redesign spec: what Joy's design says

Source: `docs/design/redesign/source/dark.html` and `light.html` (self-unpacking bundles, not in git; see
`.gitignore`). Each bundle is a board canvas: one `<iframe>` per screen or state, all built on one shared app
stylesheet ("Monks Central, app stylesheet. Built on the Classic Monks design system"). Both files use the same
stylesheet; the dark file sets `data-theme="dark2"` ("dark v2: neutral greys, green only on prominent
accents"), the light file the default tokens. A third token set in the stylesheet, `data-theme="dark"`
(green-tinted night), is not used by any board, so it is ignored here.

Screens are in `screens/`: `<theme>-<board>.png` is the first 1440x900 of the board, `<theme>-<board>-full.png`
the whole board at 1440 wide. Every board was rendered standalone in Chromium after the bundle unpacked.

## Screens and states (28 boards per theme, plus one light-only)

| Board | What it shows |
|---|---|
| 01 Overview | Shell, page head, 4 stat cards (Sites, Updates waiting, Vulnerable plugins, Waiting on you), Needs attention list, Your sites table, Latest changes feed with All/You/AI tabs |
| 02 Sites | Filter tabs with counts (All, Needs attention, Up), search pill, dashed filter chip, ink bulk bar attached to the table, data list with site tiles, details pane (actions, facts, group, tags, notes, remove) |
| 03 Updates | Kind tabs (All, Core, Plugins, Themes) with counts, "Group by site", table grouped by site with from→to versions and "good to know" badges; side cards: What's waiting (segmented bar), Action needed (steps), roll-back note |
| 04 Plugins, 05 Themes | Matrix: one row per plugin, one cell per site (version + state word), cell states update / active / off / none / vulnerable, detail pane |
| 06 Content, 07 Media, 08 Users, 09 Comments | Site picker, type tabs, tables; media thumbnails grid; comment inbox cards with reply |
| 10 Classic Monks, 11 Monitoring, 12 Security | Toggles per site, uptime bars and response chart, vulnerability list |
| 13 Clients, 14 Store, 15 Reports | Client cards and their sites, products table with stock, report builder with steps |
| 16 AI, 17 Settings, 18 Search everything | Plans with diffs to confirm, connect an app (code block), settings sections with segmented controls and switches, search results grouped with highlights |
| D01 | Overview empty (disc, title, Add a site, 3 steps) and error (danger disc, Try again, mono detail), toast |
| D02 | Add a site dialog (steps, choice cards), sign in again |
| D03 | Updates: pick, review (confirm list), run (progress rows with meter) |
| D04 | Plugins: install dialog, bundles, roll back |
| D05 | Content: editor drawer, history, bulk bar, trash, publish to many |
| D06 | Users and Clients: add, delete (danger dialog), edit |
| D07 | Classic Monks: settings, activity, approvals, reports |
| D08 | AI: running, empty, activity, connect |
| D09 | Store and Settings: product change dialog, Search Console fields, toasts |
| D10 | Command palette |
| Light only: component sidebar | The sidebar alone at full width (the light sidebar is the newer rule) |

## Type

Families (all SIL Open Font License, latin subset from Google Fonts, variable):

- **Figtree**: everything (`--font-sans`). App base 14px / 20px.
- **Outfit**: display (`--font-display`): page title, brand, stat numbers, card numbers, site tiles.
- **JetBrains Mono**: labels, meta, versions, keys, counts (`--font-mono`).

| Role | Font | Size / line | Weight | Extra |
|---|---|---|---|---|
| Page title `.mc-h1` | Outfit | 28 / 34 | 600 | letter-spacing -0.025em |
| Section title `.mc-h2` | Outfit | 20 / 26 | 600 | -0.02em |
| Card title `.mc-h3` | Figtree | 15 / 22 | 600 | |
| Page description `.mc-desc` | Figtree | 15 / 22 | 400 | `--ink-muted` |
| Body | Figtree | 14 / 20 | 400 | |
| Item detail, subtle | Figtree | 13 / 18 | 400 | |
| Nav item | Figtree | 14 | 500, current 600 | |
| Button | Figtree | 14 / 18 (sm 13) | 500 | |
| Label `.mc-label`, nav group, table head | JetBrains Mono | 11 / 16 | 500 | UPPERCASE, letter-spacing 0.06em |
| Meta `.mc-meta`, feed time | JetBrains Mono | 12 / 16 (feed 11.5) | 400 | tabular |
| Version `.mc-ver` | JetBrains Mono | 13 / 18 | 500 | tabular |
| Count badge `.cm-dash-count` | JetBrains Mono | 11 | 600 | |
| Key `.mc-kbd` | JetBrains Mono | 11 | 500 | |
| Stat number | Outfit | 36 / 1 | 600 | -0.04em, tabular |
| Brand name | Outfit | 17 / 20 | 600 | brand sub-line mono 11 |

## Colour tokens

| Token | Light | Dark (dark2) | Use |
|---|---|---|---|
| `--ground` | `#F1F3F2` | `#0B0B0B` | page behind cards |
| `--surface` | `#FFFFFF` | `#141414` | sidebar, top bar, cards |
| `--well` | `#F6F8F7` | `#1B1B1B` | table heads, hover rows, chips, counts |
| `--ink` | `#0D1411` | `#EDEDED` | text |
| `--ink-muted` | `#45524B` | `#ABABAB` | secondary text |
| `--ink-subtle` | `#5A665F` | `#929292` | labels, meta |
| `--border` | `#E3E7E4` | `#262626` | hairlines |
| `--border-hover` | `#C7CFCA` | `#343434` | secondary button border |
| `--border-strong` | `#8A978F` | `#666666` | 3:1 borders |
| `--field-border` | `#8A978F` | `#616161` | inputs |
| `--field-border-hover` | `#45524B` | `#9A9A9A` | |
| `--field-bg` | `#FFFFFF` | `#0E0E0E` | |
| `--search-bg` | `#F4F6F5` | `#1B1B1B` | search pill |
| `--monk-green` | `#01824C` | `#01824C` | primary fill, checkbox on, current count |
| `--monk-green-hover` | `#016B3F` | `#02995A` (primary hover) | |
| `--brand-text` | `#016B3F` | `#EDEDED` (green text retired in dark) | links, current nav (light) |
| `--accent` | n/a | `#3DBF82` | dark: dots, current nav icon, pulse |
| `--tint` | `#E8F4EE` | `#222222` | current nav, positive grounds |
| `--tint-2` | `#D4EBDE` | `#2C2C2C` | |
| `--highlight` | `#BDE5CC` | `#3A3A3A` | search marks |
| `--btn-ink` | `#0D1411` | `#262626` | primary pill (light), bulk bar, toast |
| `--btn-on-ink` | `#FFFFFF` | `#EDEDED` | |
| `--warn-ink` | `#8A5A00` | `#E3AE52` | |
| `--warn-bg` | `#FBF1E0` | `#241E14` | |
| `--warn-line` | `#F0DDB8` | `#3B3020` | alert card border |
| `--warn-paper` | `#FFFCF5` | `#17140F` | alert card / row ground |
| `--saffron` | `#E8A13A` | `#E8A13A` | "needs sign-in" bar segment |
| `--danger` | `#B3261E` | `#F08A82` | |
| `--danger-ink` | `#8E1F18` | `#F08A82` | |
| `--danger-bg` | `#FBEAE8` | `#261716` | |
| `--k-core` / `--k-plugin` / `--k-theme` / `--k-off` | `#003D25` / `#01824C` / `#6BBD92` / `#C7CFCA` | `#E6E6E6` / `#9C9C9C` / `#4F4F4F` / `#333333` | update-kind bar segments |
| `--scrim` | `rgba(10,15,13,.42)` | `rgba(0,0,0,.65)` | |

Dark v2 rule: green only on the main action (filled pill), the current page (icon and count), on states
(switch, checkbox), selection, progress and status dots. Links, version arrows, bars and site tiles go neutral.
In light, the primary pill is ink (`--btn-ink`) with a green disc holding the icon; in dark it is green with a
translucent white disc.

## Shape, space, depth

- Radii: card 14, KPI 14, dialog 18, drawer 16, input 10 (sm 8-9), nav item 8, tile 10 (sm 8), site tile 8,
  key 6, badge 6, buttons, chips, segmented, search, status pills 999 (pill).
- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64. Page padding 28 32 64; page gap 24; card head 12 20 (min 56);
  card body 20; list item 14 20; table cell 8 16 (row 56, head 40); KPI 18 20; sidebar 16 12, gap 18.
- Shell: sidebar 248 wide, `--surface`, right border; top bar min 64 high, padding 12 32, bottom border;
  page max 1280 centred.
- Controls: button 36 (sm 30), input 40 (sm 34), search pill 38, nav item 36, segmented button 30, tabs 42,
  switch 36x20, checkbox 18 (radius 5, 1.5 border), count badge 22x20, key 22 high with 2px bottom border.
- Shadows: `--shadow-soft` light `0 1px 2px rgba(15,26,20,.05), 0 6px 20px rgba(15,26,20,.06)`, dark
  `0 1px 2px rgba(0,0,0,.5), 0 6px 20px rgba(0,0,0,.35)` (selected segment, theme switch); `--shadow-float`
  light `0 2px 6px rgba(15,26,20,.06), 0 30px 80px rgba(15,26,20,.16)`, dark `0 2px 6px rgba(0,0,0,.6),
  0 30px 80px rgba(0,0,0,.6)` (dialogs, drawer, bulk bar, toast). Cards have no shadow, only a 1px border.
- Borders: 1px `--border` on cards, bars and rows; `--warn-line` on alert cards; dashed `--border-strong` on
  filter chips; inputs 1px `--field-border`.
- Focus: `outline: 2px solid var(--monk-green); outline-offset: 2px`.
- Motion: colours 0.15s ease; `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for the checkbox tick.

## Components

| Component | Design class | Notes |
|---|---|---|
| Sidebar | `.mc-side` | brand (logo 30, name, "by Classic Monks"), "Sites to show" select, nav groups (mono labels), nav items with 17px line icons and count badges, footer: next-check note (well, clock icon), theme switch (3 round buttons: computer, light, dark), version |
| Nav count | `.cm-dash-count` | well pill, mono; `--alert` warn colours; current page: green fill, white text |
| Top bar | `.mc-top` | status (pulse dot, "Last checked **4 minutes ago**", link "2 sites need attention"), search bar "Search or run a command" with `Ctrl K`, primary pill "Check all sites now" with refresh disc |
| Page head | `.mc-head` | h1 + description, actions on the right (secondary pill with key) |
| Stat card | `.mc-kpi` | mono label, small tile icon, big number + words, segmented bar (`.cl-mix__bar`, 8px, 3px gaps, radius 4), key with square swatches and bold counts; `--alert` warn paper |
| Card | `.mc-card` | head (h3, badge, subtle text or link), flush list or table body |
| Needs attention row | `.mc-item` | 36px icon tile (danger, warn, ink for AI, tint), bold title, muted detail, small pill action (secondary or soft) |
| Feed | `.mc-feed` | 28px round avatar ("You" tint, AI ink with sparkle), sentence with bold names, mono time |
| Segmented | `.mc-seg` | pill track in `--well` with border, selected button `--surface` + soft shadow; optional mono counts |
| Tabs | `.mc-tabs` | underline tabs, current green underline |
| Status pill | `.mc-st` | dot + word, pill: up (tint / green), down (danger), sign in (warn) |
| Badge | `.cm-badge` | mono 11, radius 6, tint / neutral / warn / danger |
| Buttons | `.cm-btn` | pills: primary (ink / green in dark), brand (green), secondary (surface + border), soft (tint), ghost, danger, danger-solid; sm 30 |
| Table | `.mc-table`, `.mc-dt` | mono uppercase head on `--well`, 56px rows, hover `--well`, selected `--tint` with 3px green inset bar, alert rows `--warn-paper` |
| Site cell | `.mc-site` | 30px rounded ink tile with initial, name bold, mono address |
| Matrix cell | `.mc-cell` | well box, mono version, state word; update tint, vulnerable danger, off outline, none dashed |
| Bulk bar | `.mc-bulk` | ink pill bar, attached to the table top when rows are ticked |
| Dialog / drawer | `.mc-dialog`, `.mc-drawer` | radius 18 / 16, float shadow, head, body, foot on `--well` |
| Stepper | `.mc-steps` | numbered rings joined by hairlines; current ink filled, done tint |
| Choice card | `.mc-choice` | radio-like card, selected green border + tint |
| Progress | `.mc-prog`, `.mc-meter` | rows with state icons, 6px meter |
| Note | `.mc-note` | well callout with icon; warn, danger, brand variants |
| Empty | `.mc-empty` | centred disc, Outfit title, muted text, primary pill, optional steps |
| Toast | `.mc-toast` | ink pill box, green tick, close |
| Fields | `.mc-input`, `.mc-search`, checkbox, `.cm-dash-toggle` | 40px fields radius 10; search is a filled pill; drawn checkbox green when on; switch 36x20 green |
| Key | `.mc-kbd` | mono 11, 1px border, 2px bottom border, radius 6 |
| Palette | D10 | 640 wide, search row with Esc key, mono group labels, rows with 28px icon tiles, selected row `--well`, footer keys |

## Where the design breaks the house rules (docs/ux/README.md)

Recorded here, decided in `plan.md`:

- Many sizes under 12px (labels, counts, keys and badges at 11px, feed time 11.5px).
- Dark `--ink-subtle` `#929292` and light `--ink-subtle` `#5A665F` must be checked on every surface they sit on.
- Status pills in dark v2 show "Up" with a green dot and neutral text: the word carries it, fine.
- Checkbox uses `accent-color` on some table checkboxes (native); the app keeps its drawn ones.
