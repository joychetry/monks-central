# Phase 7: Business

Run 2026-10-28 on `main`, with M8 on the Classic Monks plugin branches. Plan section 5 and the
Phase 7 row cover:

- Content extras: scheduling, custom fields, revisions, bulk changes and publishing on several sites.
- Bundles, zip install, global search and import/export.
- Classic Monks reports, and WooCommerce products with a store overview.
- Client reports (HTML and PDF, white label), the cost tracker and clients.
- Search Console and the AgentedSEO adapter, behind settings and tested with mocks only.

Both live acceptance runs pass:
- A monthly report for 2 sites, from the driver and again from the real app window.
- One post published to 3 sites, two on Classic Monks and one in Basic mode.

## What changed

### monks-central (`main`)

| Commit | Change |
|---|---|
| `76ed013` | **feat(core):** schedule entries (the `future` status and a date), custom fields through `get-post-meta` and `meta` on save (Classic Monks only; private `_` fields are never shown), earlier versions (`list-revisions`, `restore-revision`) and bringing entries back from the trash (`untrash-post`). Basic mode can schedule. |
| `7d78536` | **feat(core):** content changes as job actions: `publish_post` (the same post on many sites, terms by name), `set_post_status`, `trash_post`, `untrash_post`. Content-only jobs skip the inventory refresh. |
| `53299d6` | **feat(ui):** the publish date, custom fields and earlier versions in the editor; a trash view; ticking entries for bulk publish, draft, trash or restore; and "Publish on several sites". Every bulk change goes through the plan and confirm sheet. |
| `1137b6c` | **feat(core):** clients, costs and charges (per site or client, each month, year or once, in cents per currency), and app settings (migration 0009). The site list goes out as JSON (sites, groups, tags, notes, clients and costs) or CSV, and comes back in. Never with secrets. Import never adds a site, because signing in needs a person; it lists the ones not connected. |
| `06412f7` | **feat(ui):** Clients: per-client monthly costs, charges and what is left, per currency, with the next renewal. Plus a costs and charges table, and export and import in Settings. |
| `116ef4e` | **feat(core) (M8):** plugin bundles, and installing a plugin or theme from a zip. The zip is staged in the data folder under its SHA-256 (64 MB at most, kept a week), so a plan holds no file path. It is sent to `install-zip` in 1 MB chunks. |
| `e41fe9a` | **feat(ui):** Install from a zip (plugin or theme, replace, turn on) and bundles (make, edit, install on picked sites). |
| `402f61f` | **feat(core):** search posts and pages on every site at once, side by side, naming the sites that didn't answer. |
| `6c5b657` | **feat(ui):** Ctrl K, "Search everything for ...". Sites, plugins, themes and clients match at once from what the window already has, then posts and pages from every site. |
| `0182431` | **feat(core):** Classic Monks reports (404, searches, unused media, logins and two-factor), read side by side. A WooCommerce store's overview and products through `get-store-overview` and `list-products`. An `update_product` job changes prices or stock with `update-products`, after checking the numbers. |
| `7c5b597` | **feat(ui):** Store (revenue, orders, average, to send, out of stock, running low, and products with a Change sheet that goes to confirm). Plus a Reports tab in Classic Monks. |
| `3bf6af1` | **feat(core):** Search Console and AgentedSEO, both off until turned on. Search Console uses your own Google OAuth client and signs in over a loopback with PKCE and the read-only scope. The client and tokens live in the vault, and tokens refresh. Clicks, impressions, CTR, position and top queries are read from the address property, then the domain property. Google's addresses come from `Feeds`, so tests use a local stand-in. The AgentedSEO reader is loose (see Open questions). |
| `28a98c8` | **feat(core):** monthly client reports. One document model is written out as HTML and as a PDF from our own small writer (Helvetica, WinAnsi, A4, page numbers). The name, footer, accent and white label come from Settings, and files never overwrite. |
| `f4b1bed` | **feat(ui):** Reports (a client's sites or picked sites, month, Open the PDF or HTML, a preview that runs no scripts). Settings gains report branding, the Search Console client and sign-in, and AgentedSEO. Every rail section is built, so the coming soon screen is gone. |
| `ac7a25b` | **fix(core):** "already installed" from install-zip now names the Replace box. Found live. |
| `97ea233` | **test(core):** acceptance commands `publish`, `search`, `client`, `report`, `cm-reports`, `store` and `zip`. |
| `e7194db` | **fix(core):** a short report section stays on one PDF page; an agent's change reads "Update post", not "update-post". Found live. |
| `f6bb8d0`, `f24dd64` | **fix(ui):** follows docs/ux/README.md: words instead of dashes, table legends, a named select, section headings lined up with tables, and the search legend on one line. Includes the screenshots in `docs/ux/phase-7`. |
| `952fe94` | **docs:** README and docs/ux/README.md for Phase 7. |

### Classic Monks Pro and Free (`feat/monks-central`, never main)

| Repo | Commit | Change |
|---|---|---|
| Pro | `91ba9d1c` | **M8 `install-zip`** (Monks Central connection only). It uses the upload-media chunk protocol, plus `kind` (plugin or theme), `overwrite` and `activate`. The finished install reports `kind, slug, name, version, plugin, activated, replaced`. The chunk code is now shared with `upload-media`, and abandoned uploads are deleted by cron. Plain refusals: already installed, not a zip, DISALLOW_FILE_MODS, FTP needed. Tested in `tests/mcp/m8.sh`. |
| Pro | `7ea0fbc5` | `list-products` and `get-store-overview`: read-only, Monks Central only, and registered only with WooCommerce. They work with HPOS on or off. Tested in `tests/mcp/woo-overview.sh`, which runs both HPOS modes and the site time zone. |
| Free | `a3deec0` | M8 `install-zip`, the same as Pro. Tested in `tests/mcp/m8.sh`. |

## Checks (all local; GitHub Actions is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | clean |
| `cargo clippy --workspace --all-targets -D warnings` | clean |
| `cargo test --workspace` | 131 passed: core 115, core binary 9, cli 4 + 2 + 1. Before this phase the core had 101. |
| Core coverage (`cargo llvm-cov -p monks-core`) | lines 94.55%, regions 92.91%, functions 94.38% (bar 80%). New modules: report 88.0%, seo 93.6%, shop 95.8%, packages 95.7%, business 97.9%. |
| `tsc -b` | clean |
| Vitest | 211 passed in 16 files (198 before the last part of this phase). New: Phase7Content (6), Phase7Business (6), Phase7Install (5), Phase7Search (5), Phase7Store (4), Phase7Reports (4). |
| Playwright (`npx playwright test`) | 352 passed, 170 skipped (the screenshot specs, which need SHOTS). axe runs on 104 screens × 2 themes × 2 densities, with 0 serious or critical issues. |
| New keyboard tests | bulk, the import picker, adding a client, searching from the palette and opening a result, changing a product's stock to the confirm step, and making and opening a report |
| New 200% zoom checks | content-history, content-bulk, publish-many, clients, client-edit, cost-add, settings-exported, install-zip, install-bundle-edit, search, store, store-change, classic-monks-reports, reports, reports-made, settings-search-console |
| `tauri build --no-bundle` | built `target/release/monks-central` |
| PDF | `qpdf --check` is clean on the test and live reports; `pdftotext` reads them back |
| Classic Monks `tests/mcp/ci.sh` | Pro, port 8888 (CM_WOO=1 CM_ELEMENTOR=1, Bricks zip): 40 suites, 1194 checks passed, 0 failed. Free, port 8889: 26 suites, 673 checks passed, 0 failed. Both temp sites deleted. |
| Screenshots | `docs/ux/phase-7`: 23 screens in both themes (46 files). Live: `docs/acceptance/phase-7/live-*.png`. |

One flaky test was seen once and not changed: `net::tests::closed_port_says_could_not_reach`. It
binds a port, drops it and expects nothing to answer, so another test can grab the port in
between. It passed on its own and in every later full run. This test is older than Phase 7.

## Live acceptance: pass

The details are in `docs/acceptance/phase-7.txt`, with the files in `docs/acceptance/phase-7/`.

- **Publish one post to 3 sites:** job 24 published "Autumn opening hours (phase 7)" on mc-a,
  monks-central-test and mc-c (Basic mode). It was checked on each site with WP-CLI (posts 21, 16
  and 17) and by loading each public page.
- **A monthly report for 2 sites:** client Corner Bakery has mc-a and monks-central-test. The
  October 2026 report was made by the driver and again from the real app window. The results:
  - HTML plus a 2-page PDF, clean under qpdf.
  - No parts missing.
  - Uptime, changes made, versions, security, posts published and the store, for each site.
- **Also live:**
  - M8 zip install on monks-central-test, then a refusal without Replace, then clean-up.
  - Global search in the app found the post on all 3 sites.
  - The store overview and products on mc-a.
  - The Classic Monks reports on mc-a. Each one names the setting to turn on first.
- **Test data kept:** the Studio sites stay connected. The 3 posts, the Corner Bakery client and the
  two reports in ~/Downloads stay as test data. The mc-hello test plugin was removed.

## Open questions, decided

- **Import never adds sites.** Connecting a site needs a person to sign in. Import updates
  connected sites, adds clients and costs once, and lists the URLs that aren't connected.
- **Zips are staged by hash.** A job names `<sha256>.zip` in the data folder, not a path. An agent
  can't point a plan at an arbitrary file, and replaying a plan uses the same bytes.
- **A theme zip doesn't turn on by default.** Turning on a theme changes the whole site, so the
  person ticks it.
- **The MCP `plan_changes` schema is unchanged.** It doesn't list the new actions (`publish_post`,
  `set_post_status`, `trash_post`, `untrash_post`, `update_product`, `install_zip`):
  - Agents can already change one site through its own tools, with the site's approval.
  - `install_zip` must stay with a person, who picks the file.
  - Opening cross-site publishing and product changes to agents is a separate decision for a later phase.
- **The AgentedSEO contract is assumed.** The plugin is at M0. The reader takes these and skips
  anything else:
  - Abilities `agentedseo_get-capabilities`, `get-page-stats` and `get-audit-issues`.
  - The `/`, `-` and `agented-seo/` prefixes too.
  - `{totals?, pages[{url|page, clicks, impressions}]}`.
  - `{issues[{severity}]}` or `{counts{}}`.

  It is documented in `seo.rs` and turned off by default.
- **Search Console is off by default and uses your own Google client.** It never calls Google
  while off, and was never called in this run. The client secret and tokens stay in the vault.
  "Remove the Google client" deletes both, but doesn't revoke the token at Google; a person can do
  that in their Google account.
- **CM reports that are switched off on a site** show Classic Monks' own instruction ("Turn on 404
  Error Logging under Core > Logs first") under "Not read". They were left off on mc-a, because
  turning them on is the site owner's choice.
- **The report preview** runs no scripts (`sandbox="allow-same-origin"`), so axe skips inside it.
  The report's own HTML is escaped and tested in the core.
- **Reports list the last 20 posts.** "Published" reads the newest 20 posts, which is marked as a
  `shortcut:` in `report.rs`. Uptime is kept 30 days, so a report for an older month shows fewer
  checks, and says how many.
- **`install-zip` stays non-destructive** in Classic Monks, as the agent chose. Marking it
  destructive would ask for approval on every chunk. The Monks Central connection only, plus the
  plan and confirm sheet, guard it.

## Not done, and why

- The preview app at `/home/joy/dev/monks-central-preview` wasn't running and wasn't moved to main.
  Migration 0009 means the old preview now refuses the data folder. Move it to main and rebuild it
  before using it again.
- Plugin Check wasn't run on the Free zip. One `file_get_contents` has a `phpcs:ignore`.
