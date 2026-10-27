# Monks Central: three UI directions

Clickable static HTML for the design pass in plan section 5.7. Pick one, or pick one and name what to borrow from the others.

All three use the same data: 40 sample sites, 16 plugins, 80 plugin updates on 35 sites, 2 sites down and 4 that need a look. Only the design changes between them.

## Open them

Open any `index.html` in a browser. The pages link to each other through the navigation.

| Direction | Start here |
| --- | --- |
| A. Broadsheet | [a-broadsheet/index.html](a-broadsheet/index.html) |
| B. Console | [b-console/index.html](b-console/index.html) |
| C. Cloister | [c-cloister/index.html](c-cloister/index.html) |

Each folder has the same five pages: `index.html` (Overview), `sites.html`, `plugins.html`, `update.html` (bulk update, add `?step=confirm` or `?step=progress`) and `editor.html`. Press Ctrl K (or Cmd K) anywhere for the command palette. Add `?theme=dark` or `?theme=light` to any address, or use the theme button. Without either, the pages follow your system setting.

## Compared

| | A. Broadsheet | B. Console | C. Cloister |
| --- | --- | --- | --- |
| **Look** | Editorial monochrome. Newsreader serif headlines, Hanken Grotesk text, JetBrains Mono data. Black rules, no boxes. | Pro tool, close to Linear. IBM Plex Sans and Plex Mono at 13px. Hairlines, flat panels, inverted primary buttons. | Calm and soft. Archivo (wide cut for titles), rounded white cards on a grey canvas, pill buttons, green brand mark. |
| **Structure** | Masthead with all 13 sections across the top, a dateline under it. Full width pages. Bulk update is a full page with big step numbers. Plugins is a dot matrix (plugins down, sites across). | Sidebar with grouped sections and counts. Table plus inspector panel. Bulk update is a side sheet over the table. Plugins is a version grid (sites down, plugins across). | Grouped sidebar, page title and tools in the header, everything in cards. Bulk update is a centred wizard. Plugins is one card per plugin with aligned strips of 40 squares. |
| **Density** | Medium. About 11 site rows at 1440 by 900. Big type takes space on Overview. | High. About 24 site rows plus an inspector at the same size. Built for 300 sites. | Low. About 12 site rows, each with more air. Needs scrolling sooner. |
| **Strengths** | Most distinctive and least like any other admin tool. Overview reads as a sentence ("Two sites are down. Four need a look."). The editor feels like writing, not form filling. | Fastest for real work: keyboard hints everywhere, selection bar, inspector saves page jumps, version numbers visible at a glance. Matches the plan (left rail, Ctrl K, TanStack tables) with the least change. | Friendliest for clients and new users. Clear grouping, approvals feel safe, the agent approval card stands out. Easiest to read in dark mode. |
| **Risks** | 13 sections across the top will not fit on small windows and has no room for more. Serif tables can feel slow at 300 sites. The rotated site names in the matrix stop working past about 60 sites. | Can look like every other dev tool if we are not strict about type and spacing. Dense screens are harder for first time users. The inspector needs a wide window. | Closest to the generic SaaS look Joy wants to avoid. Cards waste space with many sites. Rounded pills everywhere soften the brand. |

## Screenshots

1440 by 900, headless Chromium (`/usr/bin/chromium`), both themes. Every file is `<screen>-<theme>.png` in the direction's `shots/` folder.

| Screen | A. Broadsheet | B. Console | C. Cloister |
| --- | --- | --- | --- |
| Overview | [dark](a-broadsheet/shots/overview-dark.png), [light](a-broadsheet/shots/overview-light.png) | [dark](b-console/shots/overview-dark.png), [light](b-console/shots/overview-light.png) | [dark](c-cloister/shots/overview-dark.png), [light](c-cloister/shots/overview-light.png) |
| Sites | [dark](a-broadsheet/shots/sites-dark.png), [light](a-broadsheet/shots/sites-light.png) | [dark](b-console/shots/sites-dark.png), [light](b-console/shots/sites-light.png) | [dark](c-cloister/shots/sites-dark.png), [light](c-cloister/shots/sites-light.png) |
| Plugins | [dark](a-broadsheet/shots/plugins-dark.png), [light](a-broadsheet/shots/plugins-light.png) | [dark](b-console/shots/plugins-dark.png), [light](b-console/shots/plugins-light.png) | [dark](c-cloister/shots/plugins-dark.png), [light](c-cloister/shots/plugins-light.png) |
| Bulk update: plan | [dark](a-broadsheet/shots/update-plan-dark.png), [light](a-broadsheet/shots/update-plan-light.png) | [dark](b-console/shots/update-plan-dark.png), [light](b-console/shots/update-plan-light.png) | [dark](c-cloister/shots/update-plan-dark.png), [light](c-cloister/shots/update-plan-light.png) |
| Bulk update: confirm | [dark](a-broadsheet/shots/update-confirm-dark.png), [light](a-broadsheet/shots/update-confirm-light.png) | [dark](b-console/shots/update-confirm-dark.png), [light](b-console/shots/update-confirm-light.png) | [dark](c-cloister/shots/update-confirm-dark.png), [light](c-cloister/shots/update-confirm-light.png) |
| Bulk update: progress | [dark](a-broadsheet/shots/update-progress-dark.png), [light](a-broadsheet/shots/update-progress-light.png) | [dark](b-console/shots/update-progress-dark.png), [light](b-console/shots/update-progress-light.png) | [dark](c-cloister/shots/update-progress-dark.png), [light](c-cloister/shots/update-progress-light.png) |
| Post editor | [dark](a-broadsheet/shots/editor-dark.png), [light](a-broadsheet/shots/editor-light.png) | [dark](b-console/shots/editor-dark.png), [light](b-console/shots/editor-light.png) | [dark](c-cloister/shots/editor-dark.png), [light](c-cloister/shots/editor-light.png) |
| Command palette | [dark](a-broadsheet/shots/palette-dark.png), [light](a-broadsheet/shots/palette-light.png) | [dark](b-console/shots/palette-dark.png), [light](b-console/shots/palette-light.png) | [dark](c-cloister/shots/palette-dark.png), [light](c-cloister/shots/palette-light.png) |

## Recommendation

**B. Console as the base, with two things taken from A.**

Monks Central is a tool people open to get through a list: check 40 or 300 sites, update them, fix the two that broke. Console fits that best. It shows the most rows, every action has a key, the inspector avoids page jumps, and the side sheet keeps the table in view during a bulk update. It also matches the plan (left rail, Ctrl K, keyboard-first TanStack tables) without changes.

Console on its own can drift towards a generic dev tool look. Two things from Broadsheet fix that and give it the editorial edge Joy likes:

1. The Overview headline: one sentence in a large serif that says how the fleet is ("Two sites are down. Four need a look."), above the dense panels.
2. The post editor: serif body text and a centred page, because writing should not feel like a settings form.

Cloister is the safest for clients, but it is also the closest to the template look we want to avoid, and it runs out of room first at 300 sites.

## What all three share

- Brand: the Classic Monks mark from `classic-monks/assets/images/classicmonks-icon.svg`. Ink coloured in A and B, Monk Green (`#01824c`) in C.
- Colour only for status: green healthy, amber needs a look, red down or at risk. Status colours follow the Classic Monks admin tokens in `classic-monks/DESIGN.md`, brightened for dark mode.
- The honest limit from plan section 2 is on every Overview: checks only run while the app is open.
- Bulk update follows the same three steps everywhere: plan, confirm, progress.

## Files

- `shared/data.js`: the sample data. `shared/core.js`: theme, command palette and the logo.
- `fonts/`: OFL fonts (latin subset) from Google Fonts, so the pages look the same offline.
- `stubs.sh <folder> <name>`: writes the five page stubs for a direction.
- `shoot.sh <folder>...`: redraws every screenshot for the given directions.
