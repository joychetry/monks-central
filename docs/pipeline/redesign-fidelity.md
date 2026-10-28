# Redesign fidelity: report

Branch `feat/redesign` (worktree `/home/joy/dev/monks-central-redesign`), 2026-10-28. Nothing merged, no PR,
release or tag.

Attempt 1 stopped with four page agents unfinished (`docs/pipeline/redesign-fidelity-handoff.md`). This attempt
merged `redesign/people`, took the unfinished work of `redesign/business`, `redesign/ai` and `redesign/care`
(the same content as their pushed `wip` commits), finished it, then audited and fixed the pages that had no
audit rows yet. `feat/site-icons` was already in `feat/redesign` (79010f3, 97907bb, 55757da, afdc119).

## Audit

`docs/design/redesign/audit.md` (joined from `audit/*.md`): **325 rows, 232 done, 93 kept with a reason,
0 open.** Every kept row names the rule from `docs/ux/README.md` or the data the core doesn't have, and what
the app shows instead.

Compare images (design left, app right, 1440 wide, full height): `docs/ux/redesign/compare/<page>-<theme>.png`,
57 files, all re-rendered on the final code (`COMPARE=1 npx playwright test compare`).

## Per page

| Page | Result | Rows (done / kept) | Why not all matched |
|---|---|---|---|
| Sidebar | matched | 8 / 3 | Comments count (no fleet-wide count in the core), clock follows the OS locale, design logo not in the bundle |
| 01 Overview | matched | 4 / 7 | Words for numbers and missing values (ux rules), version words not in the activity log, existing Versions and Next steps cards |
| 02 Sites | matched | 16 / 5 | Bulk bar stays under the table (nothing moves under the pointer), extra inspector facts kept |
| 03 Updates | matched | 13 / 7 | Existing filters and translation updates kept; rule-over-design items |
| 04 Plugins | matched | 18 / 3 | No plugin icons in the inventory (letter tiles) |
| 05 Themes | matched | 6 / 1 | as Plugins |
| 06 Content | matched | 13 / 5 | Data the list doesn't carry (excerpts, word counts) |
| 07 Media | partly | 5 / 4 | Media library data the core doesn't read (dimensions per item, usage) |
| 08 Users | matched | 14 / 2 | |
| 09 Comments | partly | 11 / 6 | No fleet-wide comment counts, per-site reads only |
| 10 Classic Monks | matched | 6 / 1 | Feature list is the site's own |
| 11 Monitoring | matched | 6 / 2 | Renewals column and the explaining foot kept (existing feature, plain words). The 24-hour line is now real: the core returns `Monitor.day` from the checks it already keeps |
| 12 Security | matched | 4 / 2 | Affected range in words not available; Abandoned plugins card kept |
| 13 Clients | matched | 13 / 1 | |
| 14 Store | partly | 4 / 2 | No per-day revenue, trend or per-product sales in `shop::Overview`/`Product`; orders by status shown instead |
| 15 Reports | matched | 5 / 1 | Rebuilt to the design (it was still the old form). Preview numbers come only when the report is made; then the real report shows in the same well |
| 16 AI | matched | 5 / 1 | Plans don't record the agent's name or reason. Tabs were unclickable (strip collapsed to 1px): fixed in `controls.css` for every tab strip |
| 17 Settings | matched | 5 / 2 | Text size and app updates kept (existing features) |
| 18 Search | partly | 5 / 2 | `content_search` has no excerpts, dates or products. Edit now opens the editor from a result |
| D01 Empty and error | matched | 4 / 1 | |
| D02 Add a site | matched | 6 / 4 | |
| D03 Updates flow | matched | 9 / 4 | |
| D04 Install, bundles, roll back | matched | 11 / 7 | |
| D05 Content flows | matched | 13 / 8 | |
| D06 Users and clients | matched | 11 / 5 | |
| D07 Classic Monks tabs | matched | 5 / 2 | Undo now asks first (design's dialog); old and new values and daily bars aren't in the site's data |
| D08 AI states | matched | 4 / 1 | Agent name, as 16 |
| D09 Store and settings | matched | 3 / 2 | Confirm is the shared plan sheet; secret note says keychain |
| D10 Palette | matched | 5 / 2 | |

"partly" means the layout and every element the app has data for match, and the rest is a kept row for
missing data.

## Site images (favicons)

- Core: `crates/core/src/icons.rs`. On each check: the REST root's `site_icon_url`, else `<link rel=icon>` on
  the home page, else `/favicon.ico`, fetched with the site client's same-host redirect rule, size-capped,
  image types only, cached under `icons/<site id>` in the data folder; `site_icon` command returns a `data:`
  URL (allowed by the CSP `img-src data:`). Core tests: order, cache kept, deleted, caps.
- UI: `SiteTile` shows the favicon wherever the design shows a site image (Overview, Sites table and
  inspector, Updates, Plugins/Install, Content, Users, Comments, Clients, Classic Monks, Monitoring, Security,
  Store picker, AI plans and access, Search, palette, job sheet, Reports picker); monogram tile otherwise.
  Mock fixtures have favicons on four sites and none on two.
- Live: all four Studio sites (mc-a, mc-b, mc-c, monks-central-test) have no site icon set and no icon link;
  their `/favicon.ico` redirects on the same host to WordPress's default "W" logo, which the core cached and
  the app shows (`docs/ux/redesign/live/02-sites.png`, `d10-palette.png`). The sites were not changed.

## Checks (final code)

- `cargo fmt --all --check`: clean. `cargo clippy --workspace --all-targets -- -D warnings`: clean.
- `scripts/sidecar.sh`, then `cargo test --workspace`: 144 passed, 0 failed (core 126, others 18).
- `tsc --noEmit`: clean. Vitest: 18 files, 291 tests passed.
- Playwright (full): 457 passed, 0 failed, 1 flaky (a 300-site perf budget, passed on retry; `perf` alone
  3/3 passed with no retries), 246 skipped (the opt-in `compare` and `shots` specs). Compare spec: 57 passed.
- `tauri build --no-bundle`: built `target/release/monks-central`.

## Live check

Real app (release build) on the default data folder, test data kept, 1440x900 on Hyprland:
`docs/ux/redesign/live/` 01-overview, 02-sites, 03-updates, 04-plugins, 10-classic-monks, 11-monitoring,
12-security, 15-reports, 16-ai, 18-search, d10-palette. Found and fixed from it: the sidebar's thick
scrollbar (now thin, on hover or focus), Reports text wrapping, single-hour points on the 24-hour line.

## Not done or not checked

- Audit rows for pages 01-09, 13, D01-D06 and D10 were written by attempt 1; this attempt re-rendered their
  compare images and spot-checked Overview, Sites and the sidebar, not every row again.
- The Overview's head sentence ("All four sites are healthy") can sit beside "1 site needs attention"
  (mc-b's older Classic Monks counts as attention, not health); left as is, not a design difference.
