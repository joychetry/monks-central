# Pipeline step: ui-ux (SaaS UI/UX pass, custom controls)

Date: 2026-10-28. Attempt 1. Result: PASS.

## What changed

**A custom control kit** (`ui/src/components/controls.tsx`, `feedback.tsx`, `styles/controls.css`), each on its
WAI-ARIA pattern, with hover, focus, pressed, disabled and error states:

- `Select`: select-only combobox + listbox, takes `<option>`/`<optgroup>` children so screens swapped one tag.
  Arrows, Home/End, Page keys, typeahead, Enter/Space/Tab choose, Esc closes. Replaces all 17 `<select>`s,
  including the rail's "Sites to show".
- `Combobox` (replaces the three `<datalist>`s: group names, taxonomy terms), `MultiSelect` (Clients > Their
  sites, with chips; scales to 300 sites), `TagInput` (site tags), `SearchInput` (every filter and search box,
  Esc and a clear button).
- `DateInput` for date, date and time, and month: a typed date ("1 Dec 2026", checked when you leave the box),
  a calendar dialog (grid keys: a day, a week, Page keys a month; Today, Clear, Close), a time box that takes
  "9:30" and steps with the arrows; a month grid for reports. Values stay in the native formats, so the core
  and its tests did not change. (WebKitGTK, the Linux webview, has no real native date picker, so this was a
  real gap too.)
- `NumberInput` (minus/plus, arrow keys, limits), `ColorInput` (swatch, hex box checked as you type, presets),
  `FilePicker` (button + drop area, the native input is `display: none`), `Slider` (new Settings > Text size,
  90 to 130%, remembered), `Menu` (Settings > Export the sites, JSON or CSV), `Tabs` (AI and Classic Monks
  sections, one Tab stop, arrows choose).
- Drawn checkboxes and radios (tick and dash in both themes), switches (`role="switch"`) for the settings that
  act at once, thin custom scrollbars, a popover layer that flips above when there is no room below.
- Feedback: `toast()` with Undo in a live region, custom tooltips on `data-tip` (hover and keyboard focus, Esc,
  `aria-describedby`; every `title` tooltip moved over), loading skeletons with words for screen readers,
  progress, empty states with a picture.

**Flows, from a new user's point of view**

- First run: Overview says "Welcome to Monks Central." and shows three step cards (add a site, what gets
  checked, work across sites with Ctrl K). With one or two sites, "Next steps" (more sites, groups, updates,
  connect an AI app), hideable for good. Every screen with no sites offers Add a site instead of a dead end.
- Add a site: "How to connect" is a radio group with what each mode gives; the address is checked when you
  leave the box ("An address has no spaces...", "Use an address that starts with https://."), in words, tied
  with `aria-describedby`, and blocks the button.
- Comments: approve, spam, trash and move-back leave the list at once (optimistic, restored if the site says
  no) and a toast offers Undo where WordPress can reverse it (approve and unapprove). Deleting a site note
  offers Undo.
- Shell: rail icons, a shorter rail foot that no longer runs off a 900px tall window, transitions on colour,
  border and shadow (140ms), sheets slide in, palette and popovers scale in, toasts rise; all off under
  reduced motion. Under 1200px the rail and inspector narrow and bars wrap; under 900px the one-column layout.

**Docs**: `docs/ux/README.md` section 6a lists which control to use for what, the states, motion and layout
rules, and the new native-control check.

## Commits

- 3e6cd3f docs(ux): before screenshots of every screen for the SaaS pass
- 268a00d feat(ui): custom control kit with ARIA patterns, toasts, tooltips and skeletons
- c6d0d2b feat(ui): custom controls on every screen, real tabs, undo toasts and first-run steps
- b49602a feat(ui): add a site checks the address as you leave the box, and asks how to connect with radios
- 76b0026 feat(ui): next steps only for a new fleet, undo for a deleted note, a filter that keeps its room at 960px
- a8e4b29 feat(ui): text size slider in Settings, and the control rules in the UX README
- b0cc842 docs(ux): after screenshots of every screen in both themes, 960px and 200% zoom, plus the real app on Studio sites
- 450d914 feat(ui): a client's sites are a searchable multi-select, so the sheet works at 300 sites

## Checks (all local; CI is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --check` | clean |
| `cargo clippy --workspace --all-targets -D warnings` | clean |
| `cargo test --workspace` | 139 passed, 0 failed (no Rust changed in this step) |
| Core coverage (`cargo llvm-cov -p monks-core`) | 93.1% regions, 94.6% lines |
| `tsc` | clean |
| Vitest | 236 passed (17 files), was 214; includes 16 kit tests and the contrast test (110 pairs, was 108: `--bg` on `--text` added for tooltips, primary buttons and the tick) |
| Playwright | 440 passed, 0 failed (190 skipped are screenshot tests without `SHOTS`). axe (WCAG 2.0 to 2.2 A/AA + best practice, serious and critical fail) on every screen in both themes and both row heights, keyboard, focus, zoom and text-size checks |
| Native controls (`e2e/native.spec.ts`) | 76 of 76: on all 75 screens, every button/input/textarea/select/progress/meter has computed `appearance: none`, no `select`, `datalist`, native date/time/month/colour/number input, visible file input or `title` tooltip, also with the first listbox open; a probe test proves the check catches a native control |
| Em dashes in UI copy | none |

## Screenshots (`docs/ux/saas-pass/`)

- `before/`: 144 (72 screens x 2 themes), taken on main before any change.
- `after/`: 184: every before screen in both themes, plus new screens (first site, open listbox, open
  calendar), Sites in compact, 200% zoom for six screens, and 960px wide for seven.
- `live/`: the real release app (WebKitGTK) on the Studio sites: Overview (dark), the Content Site listbox
  open, Content after picking mc-c from the keyboard (its real post types and the loading skeleton), Settings
  in light with the dark rail, switches and drawn checkbox.
- `contrast.md`: the 110 token pairs.

## Acceptance (live)

Release build (`tauri build --no-bundle`) run against the default data folder
`~/.local/share/com.classicmonks.monks-central` with the four Studio sites connected (monks-central-test,
mc-a, mc-b, mc-c). The preview app was not running. Checked in the real webview: the custom select renders and
opens from the keyboard (Tab, ArrowDown), the listbox shows above the page, Down Down Enter picked mc-c and the
screen read mc-c's real post types; the palette, theme switching (light keeps the dark rail), switches,
checkboxes, colour box and thin scrollbars all draw in WebKitGTK. Nothing was changed on any site; the theme
choice was put back to "same as my computer" and the app closed. No test data was removed.

## Open questions decided

- **Tauri webviews**: popovers use a portal with fixed positioning (no CSS anchor positioning or Popover API,
  which WebKitGTK lacks); checkbox ticks are SVG backgrounds, not pseudo-elements on inputs.
- **Native checkboxes and radios stay as elements**, drawn with `appearance: none`, so labels, forms and
  keyboard work as before. The table's own `.box` checkboxes got the same tick.
- **Classic Monks feature toggles stay buttons** ("Turn on X") and are not optimistic: a change can wait for
  approval on the site, so flipping first would show a state the site doesn't have. Their inline Undo stays.
- **Undo only where it is real**: comments approve/unapprove can be reversed; spam and trash can't be from here
  (no "not spam" or restore over this connection), so those toasts have no Undo. A deleted note's Undo writes
  it again with today's date.
- **Next steps** show only while a fleet has fewer than three sites, then get out of the way.
- **Segmented controls** (theme, row height, cost or charge) stay toggle buttons with `aria-pressed`; they
  are short and visible, which a listbox would hide.
- **The file input** stays as the way to open the system file dialog, hidden with `display: none`; the
  native-control test allows a file input only when it is not displayed.
