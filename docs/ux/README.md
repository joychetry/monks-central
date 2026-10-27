# Monks Central UI quality bar

The standing bar for every screen, in every phase. It comes from the Phase 1.5 readability pass
(Joy, 2026-10-27: "improve the user experience, the fonts and the spacing so it is more readable,
accessible and understandable"). The design stays direction B "Console" (`docs/design/b-console`):
monochrome, dense, keyboard-first, with the serif Overview sentence. These rules make it easy to read
for a site owner who isn't technical; they don't change the direction.

A screen is done when it meets every rule below and `npm test` and `npm run e2e` pass in `ui/`.

## 1. Type

- Six sizes, all tokens in `ui/src/styles/tokens.css`, in `rem` so the OS and browser text size
  scale them: `--fs-xs` 12px (keys, captions), `--fs-sm` 13px (labels, column heads, versions),
  `--fs` 15px (body), `--fs-lg` 18px (titles), `--fs-xl` 28px (counts, empty states),
  `--fs-sentence` 44px (the Overview sentence). No other size, and nothing under 12px.
- Body at 15px with a 1.5 line height (`--lh`).
- Tabular figures for counts and versions (`.num`, table cells, counts).
- Mono (`--mono`) only for versions and code-like strings (addresses). Never for timestamps
  ("2 min ago"), tags, labels or prose.

## 2. Spacing and density

- Every padding, margin and gap comes from the 4px scale: `--sp-1` 4 … `--sp-7` 48.
- Rows are comfortable by default (`--row` 40px). Settings > Row height > Compact sets
  `data-density="compact"` (32px rows, 16px gutters) and is remembered on this computer
  (`mc-density` in local storage). Every table must work in both.
- Sections breathe: 24px gutters (`--pad`), 48px above and 40px below the Overview sentence.

## 3. Colour and contrast (WCAG 2.2 AA, both themes)

- Text 4.5:1 on every surface it sits on, including muted text (`--text-3`), placeholders,
  the "Soon" nav labels and status words. Large text 3:1.
- Icons, control borders (`--line-ui`) and the focus ring (`--focus`) 3:1. Hairlines
  (`--line`, `--line-2`) are decoration only; never let one be the only sign of a control.
- Status colours (`--ok`, `--warn`, `--danger`) reach 4.5:1 on content surfaces and on their own
  tinted backgrounds. Version cells coloured amber or red (Updates, Plugins) use these tokens.
- `ui/src/contrast.test.ts` checks every pair (108 of them). A new token or surface means a new
  pair in that test.

### Status is never colour alone

Every status has a shape and a word (`<Status>` in `components/ui.tsx`): tick = Healthy,
warning sign = Needs a look / Sign in again / No tools yet, cross = Down, empty ring = Not checked,
"i" = a note (Slow). Later screens follow the same rule: a word next to every coloured cell
("Update", "Risk", "Off"), and symbols explained in words in the legend (for example
"dot = not installed", "struck through = installed but inactive" in the Plugins matrix).
A slow site (over 3 s) is a note on a healthy site, never a warning.

## 4. Light theme: paper and ink

Light mode keeps a dark rail; the content area is warm off-white paper. Dark mode stays fully dark.
Rail tokens (`--rail-*`) are separate from content tokens; `.rail` maps them onto the content names,
so every component (buttons, inputs, keys, the logo) works on the rail unchanged. In dark mode the
rail tokens point at the dark content tokens.

Three rails were tried, all at AA (`phase-1-ux/sidebar-options/`):

| Option | Rail | Paper | Verdict |
|---|---|---|---|
| A Ink | `#1c1b19` warm near-black | `#fbfaf7` | **Chosen** |
| B Graphite | `#1e1f20` neutral | `#f8f8f7` | Reads cold next to warm paper; drifts toward grey SaaS |
| C Umber | `#241d17` brown-black | `#faf6ef` cream | Too brown: the rail starts to look like a brand colour, and cream paper tints the monochrome |

**Why Ink:** it still reads as black, so the app stays monochrome and colour stays for status only.
Its slight warmth matches the off-white paper, so the rail and the page look like one sheet of ink
on paper rather than two products. Rail text reaches 15:1, the muted rail text (`--rail-text-3`)
5.7:1 at worst, the rail status colours 4.5:1 or more on the rail and its hover state, and the
selected item adds a 2px ink bar so the choice isn't shown by a background shade alone.

## 5. Clarity

- Every table has a one-line legend or column help (`.legend`, `.help`), tied to the table with
  `aria-describedby`. Column names are spelled out ("WordPress", "Last checked", not "WP").
- Every number says what it counts ("Sites down", "5 sites on 7.1.3", "Changes waiting for
  approval on sites").
- Missing values are words: "not known", "none". No "?" or bare dashes.
- Empty, loading and error states say what happened in plain words and offer the next step
  (Add a site, Try again, Clear the filters, Go to Sites).
- Truncated names carry a tooltip with the full text.
- No jargon in the UI: say **connection** (not grant), **permission** or **access** (not scope),
  **tool** (not ability), never "DCR" or "operator" except where we quote the site's own consent
  page. Plain copy, no em dashes, every button says what it does.
- A Classic Monks connection with no tools says so plainly on Sites and Overview: "Connected, but
  this connection can't do anything yet. Sign in again and tick the tool groups." with a Sign in
  again button.

## 6. Accessibility

- A visible 2px focus ring on everything focusable (`:focus-visible`, `--focus`); inputs never set
  `outline: none`.
- A skip link ("Skip to content") is the first Tab stop. Tab order follows the page: rail, top bar,
  filters, table, inspector. Dialogs (sheet, palette) keep focus inside and give it back on close.
- Every control works from the keyboard; the Sites grid keeps J/K/X/slash/R/A and is a read-only
  `role="grid"` so the focused row is announced. Icon-only buttons have an `aria-label`.
- Progress and notices sit in live regions (`role="status"`) that exist before they change.
- Hit targets at least 24px (checkboxes and tag remove buttons included); buttons and nav items
  are 28-32px.
- `prefers-reduced-motion` stops all animation. Under 900px wide (a 1440px window at 200% zoom)
  the layout becomes one column with the rail on top, nothing cut off; wide tables scroll inside
  their own box.

## 7. How it is checked

In `ui/`:

- `npm test`: Vitest, including `contrast.test.ts` (108 token pairs).
  `CONTRAST_REPORT=../docs/ux/phase-1-ux/contrast.md npx vitest run src/contrast.test.ts`
  writes the table.
- `npm run e2e`: Playwright against a build that swaps the core for `e2e/mock-core.ts` (fake sites,
  no secrets). `e2e/a11y.spec.ts` runs axe (WCAG 2.0-2.2 A/AA and best practice; serious and
  critical fail) on every screen in `e2e/screens.ts`, in both themes and both row heights, and
  checks the skip link, focus rings, keyboard use of the Sites grid, focus kept in the sheet and
  given back by the palette,
  200% zoom and browser text size. CI runs both.
- Screenshots: `SHOTS=<folder> npx playwright test shots` writes every screen in both themes (and
  compact for Sites, 200% zoom for Overview, Sites, Updates and Plugins) to `docs/ux/<folder>/`
  (Phase 1.5: `phase-1-ux/after`, Phase 2: `phase-2`).

A new screen adds itself to `e2e/screens.ts`, so it gets axe and screenshots for free.

## Phase 1.5 results (2026-10-27)

- Screenshots: `phase-1-ux/before/` (26) and `phase-1-ux/after/` (38: every screen in dark and
  light, Sites in compact, Overview and Sites at 200% zoom).
- Contrast: 108 of 108 pairs pass (`phase-1-ux/contrast.md`). Closest: control borders 3.20:1
  (light) and 3.34:1 (dark) on the raised surface; status text 4.88:1 (`--ok` on `--raise`, light).
  Before the pass: muted text on raised rows 3.96:1, green status on hover 4.24:1, input and
  checkbox borders 1.41:1, the "not checked" square 1.41:1.
- axe: 0 serious or critical issues on 13 screens x 2 themes x 2 densities (52 runs), plus 9
  keyboard, zoom and text-size checks: 61 of 61 pass (`phase-1-ux/axe.txt`).

### Chosen not to change

- **Address column on Sites.** At 15px the table didn't fit beside the inspector. The address moved
  to the name's tooltip, the inspector, the palette and the filter, so nothing is lost and the rest
  of the columns stay readable without sideways scrolling.
- **Connection detail in the table** shows only the kind (Classic Monks / Basic mode); "full
  access", "older" and "no tools" are in the Status column, the inspector and Overview.
- **The consent-page wording** "This is my Monks Central app (operator)" is quoted as the site
  shows it. The word lives in the Classic Monks plugin, not in this app.
- **The palette top stays light** in light mode. The brief made a dark top optional ("if it helps");
  the palette is a light dialog over light content and reads fine, so it wasn't worth a third surface.
- **The Overview distribution bars** stay shades of ink. They are hidden from screen readers and
  every value is written out next to them, so they don't need 3:1.
