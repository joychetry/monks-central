# Pipeline step: ui-review (independent review of the UI/UX pass)

Date: 2026-10-28. Attempt 1. Result: PASS.

The review read the whole UI/UX pass diff (`dce3bac..a0146ae`), with two independent read-only reviews
(the control kit; the screens), walked the flows as a new user and as a power user with 300 sites (mock
build) and on the real app (WebKitGTK, Studio sites), fixed every real issue found, and ran every check and
every phase's live acceptance again. The live run found one real bug in the Classic Monks plugin, fixed on
`feat/monks-central` in both editions.

## The known issue: notices pushed rows down

Fixed everywhere, not only after Undo and moderation. A result, a check in progress or a failed action
never appears as a line above a list any more:

- Results and action errors are toasts on every screen that had an inline notice (Sites, Sites inspector,
  Comments, Users, Media, Content, Clients, Classic Monks, AI, Updates, Security, Store refreshes, Install
  bundles, Editor revisions, Plugins/Themes cell panel, and the app-wide job error). Toasts sit at the
  bottom right, and at the bottom left while a sheet is open, so they never cover a sheet's buttons.
- A refresh after an action keeps the rows on screen. Before, Comments, Users, Media and Content swapped
  the whole list for a loading placeholder after every action, which was the worst shift of all.
- The Sites selection bar appeared above the table on the first tick and pushed every row down. It now
  sits under the table, stuck to the bottom of the view.
- Updates' "Update selected" is always there (disabled with nothing ticked) instead of sliding the
  buttons beside it. Add a site's address error has its line reserved, so the "How to connect" cards
  don't move as you click one.
- When the comment you acted on leaves the list, keyboard focus moves to the comment that takes its
  place (found on the real app: focus fell to the page).
- Checks: `e2e/a11y.spec.ts` "results never move the rows" measures row positions across ticking,
  a check, a feature toggle and its Undo; a unit test makes sure a comment action never shows the
  loading placeholder; the rule is in `docs/ux/README.md` section 6a.

## Other issues found and fixed

**Interaction**

- The rail's "Sites to show" list (a custom Select since the UI/UX pass) let its keys through to the
  Sites shortcuts: typing "a" there opened Add a site, "r" checked sites, arrows moved the table. The
  shortcuts now skip keys the kit's controls handled.
- Enter in an empty "Put in a group" box ungrouped every selected site, silently, as often as you
  pressed it. Empty is ignored, one Enter at a time, and the result is a toast.
- Two quick tag edits lost the first one; a note could be deleted twice.
- A group scope whose last site moved out left the whole app empty ("No sites yet"); it now falls back
  to all sites.
- Comments: a reload already on its way could bring back a comment you had just acted on; Undo after
  switching lists loaded the old list into the new tab.

**Control kit**

- Passing through a post's time box rewrote its date (the seconds were dropped).
- The calendar's month buttons and Page keys from the 31st skipped a month (31 Jan to March).
- A typed date error stayed after picking a day from the calendar.
- A number box took letters and saved them as nothing; it now says "Write a number from 1 to 100." and
  Classic Monks won't save it.
- Combobox and MultiSelect lists didn't scroll the highlighted option into view (with 300 sites, Space
  ticked a site you couldn't see); MultiSelect does its lookups with a set and a map, and its list
  follows the box when chips wrap.
- Removing a chip dropped focus on the page (and out of a sheet's focus trap).
- Toasts with Undo closed after 8 seconds, too soon to reach from the keyboard; they now stay until
  closed or until you change screens, and closing a focused toast gives focus back.
- Lists opened inside a sheet were portaled outside its `aria-modal` dialog, which WebKit can hide from
  screen readers; they now open inside the dialog.
- Colour presets couldn't take focus when the colour was a custom one.

**Classic Monks plugin (found by the live run)**

- `get-comments` declared `author_email` with `format: email`, and WordPress validates ability output,
  so a single comment without an email (WP-CLI, imports, pingbacks) made the whole comment list fail;
  the app couldn't show that site's comments. The field is a plain string now, in Pro and Free, with a
  test in each suite that lists a comment with no email. The final review's run had hit the same error
  without noticing it.

## Performance with 300 sites

New `?fixture=fleet300` in the mock core (the fleet repeated to 300 sites, with inventory and monitors)
and `e2e/perf.spec.ts`, which watches the browser's long tasks:

- Opening Sites, Updates, Plugins, Themes, Monitoring, Security and Overview: the longest freeze is
  about 90 to 130 ms (one render of 300 rows); the budget is 300 ms.
- After that, every key, tick and keystroke (j/x on the table, the filter, the palette, the rail's list,
  the Clients site picker with 30 arrow presses) stays under 100 ms.

No virtualization was needed: rows are light and interactions don't block.

## Commits

monks-central (`main`):

- `3d4653d` fix(ui): nothing moves under the pointer: results float as toasts, selection bars stay put
- `8bb44be` fix(ui): Sites keys, bulk group, tags and notes; a vanished group; comment Undo after a tab change
- `b888cda` fix(ui): control kit: dates, numbers, long lists, chips, toasts and lists inside sheets
- `3a21fbc` test(ui): every list stays quick with 300 sites
- `275bc56` fix(ui): approving from the keyboard goes on to the next comment, and messages stay with their screen
- docs: the acceptance record, screenshots and this report (see the last commit)

Classic Monks Pro (`classic-monks`, `feat/monks-central`), rsynced to mc-a and monks-central-test: `30247da8` fix(comments): get-comments lists comments that have no author email
Classic Monks Free (`classic-monks-free`, `feat/monks-central`): `c08baea` fix(comments): get-comments lists comments that have no author email

## Checks (all local; CI is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | clean |
| `cargo test --workspace` | 139 passed, 0 failed (core 122, core ipc 9, cli 4 + 2 + 1, app 1); no Rust changed |
| Core coverage (`cargo llvm-cov -p monks-core`) | 93.09% regions, 94.34% functions, 94.57% lines (80% required) |
| `tsc -b` | clean |
| Vitest | 245 passed in 17 files (236 before) |
| Playwright | 445 passed, 0 failed (190 skipped are the screenshot specs without `SHOTS`): axe (WCAG 2.0 to 2.2 A/AA + best practice) on every screen in both themes and row heights, keyboard, focus, 200% zoom, text size, native controls 76 of 76, the new no-shift, keyboard-focus and 300-site timing tests |
| Em dashes in UI copy | none |
| `tauri build --no-bundle`, `cargo build --release -p monks-cli` | built |
| Classic Monks Pro `tests/mcp/ci.sh`, port 8888 (CM_WOO=1, CM_ELEMENTOR=1, Bricks 2.4.3 zip) | 40 suites, 1216 checks passed, 0 failed (1215 before, plus the no-email check); temp site deleted |
| Classic Monks Free `tests/mcp/ci.sh`, port 8889 (same settings) | 26 suites, 695 checks passed, 0 failed (694 before, plus the no-email check); temp site deleted |

## Live acceptance

Record: `docs/acceptance/ui-review.txt`. Default data folder, the four Studio sites; tests that break a
connection on purpose used throwaway folders, deleted with their keychain items. The preview app was not
running.

| Phase | Result |
|---|---|
| 0 | PASS: doctor, one core only, status |
| 1 / review-1.5 | PASS: burst refresh (20 ok, 1 refresh), WordPress 7.0 refused, corrupt then sign in again, remove revokes, the CLI's core handed over to the app |
| 2 | PASS: WooCommerce on 2 sites in one job, rollback, agent refusals, sign in again reuses the grant |
| 3 | PASS: Recipe with terms, image import as featured, Gutenberg edit, two edits to one block refused, Elementor and Bricks locked, Basic mode, 2.5.0 refused |
| 4 | PASS after the plugin fix: the comment list failed on comments without an email; fixed, rsynced to mc-a and monks-central-test, lists read; login link, moderation, module undo, users, approval waiting all passed |
| 5 | PASS: the MCP client (`claude -p`), held update approved, a 3-site plan waits for the person, no socket confirm, plan allowlist, confirm runs it, mc-b approved and retried |
| 6 | PASS: broken update rolled back, security scans, monitors, the tray item |
| 7 | PASS: publish to 3 sites, search, monthly report PDF, zip install, store, Classic Monks reports |
| Real app | PASS: in WebKitGTK on the Studio sites, approving mc-a's comment with no email from the keyboard: it leaves at once, no row jumps, focus goes to the next comment, the Undo toast floats; the Sites selection bar sits under the table |

End state: all 4 sites connected and health Ok; 1 Monks Central grant on each of mc-a, mc-b and
monks-central-test, plus MC A's "Monks Central (AI agents)" grant (kept on purpose); mc-c on its one
application password; the run's content kept as test data (listed in the record); the app closed.

Screenshots: `docs/ux/ui-review/live/` (the real app) and `docs/ux/ui-review/mock/`.

## Open questions, decided

- **Toasts, not reserved space.** A notice line with a fixed height would still move content when a
  message wraps, and wastes a row on every screen. Toasts already existed (live region, Undo), so every
  result uses them. Inline errors stay only for a form's own fields and in place of content that didn't
  load, where nothing below can move under a click. Settings and Reports keep their result under the
  button you pressed (nothing you are aiming at is below it), and the report result has its own buttons.
- **Undo stays until closed or you change screens.** Timing out Undo after 8 s failed WCAG 2.2.1 for
  keyboard users; a toast that stays forever followed you and covered the Sites inspector. Messages now
  belong to their screen. At most three show; older ones go.
- **Classic Monks feature Undo moved from the inline line to the toast.** Same reasons; the Activity tab
  still undoes any change later.
- **The Sites selection bar sticks to the bottom under the table** rather than being always shown (a
  permanent empty bar on the main screen) or replacing the filter bar (filters would vanish while
  selecting).
- **No list virtualization.** With 300 sites every interaction stays under 100 ms and a screen opens in
  about 130 ms; virtualizing would break the Sites grid's keyboard and screen reader behaviour for no
  felt gain. The budgets are in `e2e/perf.spec.ts` (marked as a shortcut: measured in Chromium, not
  WebKitGTK).
- **Tooltips on text that can't take focus** (a cut-off name in a table cell) stay mouse-only. Making
  300 cells focusable would add 300 Tab stops; the full text is in the page for screen readers and in the
  inspector or editor for keyboard users. The README says so.
- **The plugin fix is a plain string, not `anyOf` email or empty.** The field is display data the app
  never mails to; a looser schema is the honest description of what WordPress stores.
