# Redesign: Monks Central on Joy's design

Branch `feat/redesign` (worktree `/home/joy/dev/monks-central-redesign`), 2026-10-28. Not merged.
This report replaces the two earlier blocked runs (the design is now in
`docs/design/redesign/source/`, kept out of git).

## What changed

- **Design captured.** Both bundles (`light.html`, `dark.html`) rendered in Chromium: 114 PNGs of
  every screen and state at 1440x900 and full size in `docs/design/redesign/screens/`. Tokens,
  type, shape, components and the design's rule breaks in `docs/design/redesign/spec.md`; the
  mapping onto the codebase in `docs/design/redesign/plan.md`.
- **Tokens and fonts** (`ui/src/styles/tokens.css`, `fonts.css`, `ui/src/fonts/`): Figtree (body),
  Outfit (titles, stat numbers) and JetBrains Mono (labels, versions, times), bundled with their
  OFL licences; IBM Plex and Newsreader removed. Light: `#f1f3f2` ground, white cards, `#01824C`
  green, ink primary pill. Dark: the design's "dark v2" neutral greys, green primary pill,
  `#3DBF82` accent. Old token names kept with new values, so every screen moved at once.
- **Shell** (`ui/src/App.tsx`, `base.css`): a light sidebar (brand, Sites to show, grouped nav with
  count badges, next check, three theme buttons, version), a top bar (last checked, "N sites need
  attention", Search or run a command Ctrl K, Check all sites now), and a page head with the title,
  one line and the page's main action. The dark-rail-in-light-mode rule and the `--rail-*` tokens
  are gone.
- **Shared components** (`ui.tsx`, `controls.css`): pill buttons (primary, soft, danger), a
  line-icon set (`Glyph`), status pills that keep their shape, cards, mono uppercase labels, mono
  table heads, segmented controls, tabs with a green underline, drawn checkboxes/radios/switches
  and slider in green, an ink bulk bar and toasts, empty states with a centred disc.
- **Overview** (`ui/src/screens/Overview.tsx`): four stat cards with segmented bars and written
  keys, Needs attention with icon tiles and one action each (sites, vulnerabilities, an AI plan,
  waiting updates, slow notes), Your sites (attention first), Latest changes with All/You/AI and
  avatars, read from the existing activity log (`activity_list` and `activity-changed`; no Rust
  change), and Versions.
- **Every other screen** takes the same system through the shared CSS: cards, page head, labels,
  pills. No control or feature removed; `e2e/screens.ts` unchanged.
- **Rules** (`docs/ux/README.md`): type, spacing, colour, the light sidebar (section 4), and a
  "rule over design" list.

## Rule over design

The rule stayed and the app got as close as it could:

- 11px labels, counts, keys and badges (11.5px feed times) are 12px: nothing under 12px.
- Dark muted text `#929292` is `#999999` (4.5:1 on `#2c2c2c`); light muted `#5A665F` is `#56625B`;
  dark control borders `#666666` are `#767676` (3:1).
- The main action's hover goes darker (`#016B3F`) instead of the design's `#02995A`, which leaves
  white text under 4.5:1.
- Status pills keep a shape (tick, warning sign, cross, ring) beside the word; the dark design shows
  a dot only.
- Checkboxes stay drawn in the design's green, not `accent-color` native ones.
- The Sites bulk bar stays under the table, stuck to the bottom, instead of floating over rows.
- The narrow layout keeps the 900px breakpoint, not the design's 760px.
- The Overview Your sites table wraps instead of scrolling sideways (a scroll box needs its own Tab
  stop for axe).
- The design's logo image isn't in the bundle; the app keeps its own Classic Monks mark.

Green contrast checked in both themes: `contrast.test.ts` has 142 pairs (was 108), all pass,
including white on the green fill, green words on every light surface, and the dark accent and
focus ring at 3:1 or more.

## Commits

```
6b36ff0 docs(design): redesign screens and spec from Joy's design
76addc1 docs(ux): screenshots of every screen before the redesign
167c038 docs(design): redesign plan, design pieces mapped onto the codebase
9e1ad67 feat(ui): redesign tokens and fonts
2f9841b feat(ui): redesign shell, light sidebar, top bar and page head
08e7f76 feat(ui): redesign shared components
59716d8 feat(ui): redesign the Overview
3598a1a feat(ui): every screen on the redesign system
feced27 fix(ui): Overview sites table fits its card, e2e follows the new head
7c2daa4 docs(ux): quality bar for the redesign, light sidebar and rule-over-design list
7ee7024 docs(ux): redesign after screenshots and the Overview beside the design
```

## Checks

| Check | Result |
|---|---|
| `cargo fmt --all --check` | pass |
| `cargo clippy --workspace --all-targets -- -D warnings` | pass (after `scripts/sidecar.sh`) |
| `cargo test --workspace` | 140 passed, 0 failed |
| `tsc -b` | pass |
| Vitest | 281 passed (17 files), contrast 142/142 pairs |
| Playwright (axe in both themes and densities, keyboard, 200% zoom, text size, native controls, no-shift, 300 sites) | 445 passed, 1 flaky, 0 failed, 184 skipped |
| `tauri build --no-bundle` | pass, `target/release/monks-central` |

The 184 skipped are the screenshot tests, which only run with `SHOTS` set. The one flaky test
(axe: security, dark, compact) was a Chromium "Target crashed" under memory pressure and passed on
retry; earlier runs had the same kind of crash on other tests, never an assertion. Expectations
changed for the new look only: the first Tab stop after Skip to content is now Add a site in the
page head, the text size test reads the new 12px stat label, and the obsolete sidebar-options
experiment spec was removed.

## Screenshots

- Design: `docs/design/redesign/screens/` (114)
- Before: `docs/ux/redesign/before/` (150)
- After: `docs/ux/redesign/after/` (184: every screen in both themes, compact Sites, 200% zoom, 960px)
- Overview beside the design: `docs/ux/redesign/overview-side-by-side-light.png` and
  `docs/ux/redesign/overview-side-by-side-dark.png`
