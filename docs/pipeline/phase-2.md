# Phase 2: Plugins, themes, updates

Run 2026-10-28 on `main`. Plan sections 5.6, 5.7 and the Phase 2 feature map. The live acceptance
passes: an old WooCommerce updated on 2 sites in one job, one site rolled back, the agent path
refused without an agent grant, and signing in again revoking the old grant. The same update and
rollback also ran from the real app window. The live run found five real bugs (one in the core, two
in Classic Monks, one in the app, one in the UI). All five are fixed below, each with a test that
failed first.

## What changed

### monks-central (`main`)

| Commit | Change |
|---|---|
| `74c7a04` | **feat(core):** signing in again revokes the old grant on the site (RFC 7009, the token plus the client that owns its family). If the old secret can't be read, the old grant runs out on its own within 30 days. |
| `f17a8ed` | **feat(core):** plugin and theme inventory, and jobs that change many sites. `fleet.rs`, migration `0003_fleet.sql` (inventory, jobs, job_items). Read from the Classic Monks snapshot, from the older tools on Classic Monks 2.5.0, or from core REST in Basic mode. Twelve actions (update, roll back, activate, deactivate, delete, auto-update and install for plugins; update, activate and delete for themes; WordPress core; translations). A job runs each site's changes one after another and the sites side by side, then reads each site again. |
| `2287c3b` | **feat(cli):** `monks run <site> <tool> [json]` over the core's socket. Agents can read; every change is refused with the plain message, because no agent grants exist yet (Phase 5). The socket has no confirm method (plan 5.6). |
| `28a09dc` | **feat(app):** window commands: inventory list/refresh, plugin versions, WordPress.org search, job start/get/list; inventory and job events. |
| `70f6fdc` | **feat(ui):** Updates, Plugins and Themes (one row per site, one column per item, a roving-tabindex grid with an inspector), Install (WordPress.org search or a zip link), and the job sheet: 1. Plan, 2. Confirm, 3. Progress (plan 5.7). |
| `5e5afb9` | **test(ui):** axe, keyboard and 200% zoom checks on the Phase 2 screens; 24 mock screenshots in `docs/ux/phase-2/`. |
| `2efca24` | **fix(core):** a change got 30 s to answer. A WooCommerce update took longer, so a change that went through showed as failed. Writes are never sent twice, so they now get 5 minutes; reads keep 30 s and their retries. |
| `7738f1a` | **fix(ui):** the palette's plan said "Update 1 things"; it now uses the Updates screen's title ("Update WooCommerce on MC A"). |
| `d7e1307` | **fix(ui):** "Update 0 themes" became "No theme updates". |
| `9843c46` | **fix(app):** starting any job from the window crashed the app. `job_start` was a sync Tauri command, so `tokio::spawn` ran outside the runtime and panicked. The core tests, the driver and the mock e2e all run inside a runtime, so none of them saw it. `start_job` is now async, which forces every caller into a runtime (a dropped future fails clippy), and the command is async too. |
| `7a5dc1d` | **fix(ui):** "All 1 change done." became "The change is done." |
| `4c573b4` | **fix(ui):** the roll-back list offered "Roll back to 11.3.0-beta.1" (newer than the installed 11.2.1) plus older betas and RCs. Only stable releases below the installed one are offered now. |
| `9a7b4e3` | **test(core):** acceptance driver: `inventory`, `update-plugin`, `versions`, `rollback`. |
| `add4a17` | **docs(acceptance):** `docs/acceptance/phase-2.txt` and 16 real-app screenshots in `docs/acceptance/phase-2/`. |
| `8790221` | **docs(ux):** refreshed the mock rollback and progress screenshots after the fixes. |

### Classic Monks Pro (`feat/monks-central`)

| Commit | Change |
|---|---|
| `5faf4458` | **fix(mcp):** ported the Free create-term fix. `create-term` checks the taxonomy's own `edit_terms` capability instead of `manage_categories`. Test in `wrappers2.sh`: an editor may create categories, and may not create `nav_menu` terms. |
| `e6b7d7d6` | **fix(rollback):** `rollback-plugin` over MCP replaced the files and then threw on `wp_is_auto_update_enabled_for_type()`, because only WP-CLI preloads `wp-admin/includes/update.php`. `operator.sh` now rolls Akismet back and forward over HTTP. |
| `a85e2dc2` | **fix(mcp):** `update-plugin` left the plugin inactive. Core's `upgrade()` deactivates it and leaves turning it back on to a wp-admin page, which never loads over MCP, so updating WooCommerce from Monks Central switched the shop off. The tool now turns the plugin back on silently, as core does, and says so if that fails. Test in `operator.sh`. |

### Classic Monks Free (`feat/monks-central`)

| Commit | Change |
|---|---|
| `5c0192c` | **fix(mcp):** the same `update-plugin` fix (identical code), with the same `operator.sh` test. Free has no rollback tool (rollback runs only from wp-admin there, where `update.php` is loaded), so `e6b7d7d6` isn't needed there. Free already had the create-term fix. |

## Checks (all local; GitHub Actions is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | pass |
| `cargo clippy --workspace --all-targets -- -D warnings` | pass, 0 warnings |
| `cargo test --workspace` | 66 passed, 0 failed (core 52, ipc 9, cli 3, autostart 2) |
| Core coverage (`cargo llvm-cov -p monks-core`) | 91.33% lines, 88.98% regions, 89.81% functions (bar: 80%) |
| `tsc` (incl. e2e) and `tauri build` from the repo root | pass |
| `npm test` (Vitest) | 145 passed, 0 failed |
| `npm run e2e` (Playwright: axe in both themes and densities, keyboard incl. the matrix grid and job sheet, 200% zoom) | 108 passed, 0 failed (68 skipped: screenshot specs, run only with `SHOTS`) |
| Classic Monks Pro `tests/mcp/ci.sh` (CM_PORT 8888, CM_WOO, CM_ELEMENTOR, Bricks zip) | 35 suites, 959 pass, 0 fail, 0 skip |
| Classic Monks Free `tests/mcp/ci.sh` (CM_PORT 8889, same flags) | 22 suites, 483 pass, 0 fail, 0 skip |

## Live acceptance: all pass

Details and the full transcript are in `docs/acceptance/phase-2.txt`. The run used the app's default
data folder and the Studio sites mc-a, mc-b, mc-c and monks-central-test.

- Inventory read on all 4 sites: snapshot (mc-a, monks-central-test), older tools (mc-b on 2.5.0), REST (mc-c, Basic).
- One job updated WooCommerce 11.1.2 -> 11.2.1 on MC A and Monks Central Test: both Done; on the sites, both 11.2.1 and active.
- MC A rolled back to 11.1.2: Done, active. Monks Central Test stays on 11.2.1.
- `monks run` refused `update-plugin` and `rollback-plugin` with the plain message and read `get-site-snapshot`; the site was unchanged. The headless core it started was stopped after.
- Signing in again on an extra connection in a throwaway folder: grants went 1 -> 2 -> 2 (the old one was revoked when the new one was made) -> 1 after remove. The keychain item and folder were deleted.
- The same update and rollback from the real app window: plan, confirm, progress, Done (screenshots in both themes).
- End state: all 4 sites connected with health Ok, 1 Monks Central grant each, the same active plugins as before.

## Open questions, decided

- **M14 (theme rollback and checksums):** not needed. The feature map puts it in v0.2, and Phase 2 rolls back plugins only. No plugin branch work done for it.
- **Agent grants:** they don't exist until Phase 5, so every change through the socket is refused and reads run on the operator grant (plan 5.6). The refusal says what to do: make the change in the app, or give agents their own access.
- **Revoking the old grant** needs the old token. If the saved secret can't be read, the old grant can't be revoked and runs out on its own within 30 days.
- **Every change is a job,** a single one included, so the history and the retry path are the same everywhere.
- **Down sites** (health down when last checked) are left out of plans, with the reason shown. A site that needs signing in again, or that hasn't been read yet, is left out the same way.
- **Basic mode** reads plugins and themes over REST but can't see updates. It can activate, deactivate, delete and install from WordPress.org. Updates and rollback need Classic Monks; the UI says so.
- **WordPress.org search** goes straight from the core to `api.wordpress.org`, not through a site.
- **Jobs left unfinished** when the app closed are marked failed at the next start, so nothing shows as running forever.
- **Rollback targets:** the UI offers only stable releases older than the installed one. Classic Monks still accepts any version from the operator; agents can't send one (see above).
- **Classic Monks keeps rollback behind its own module switch**, off by default. The site's message ("Turn on Plugin & Theme Rollback under Core > Plugins first.") reaches the job as is. It was turned on for MC A for this run and left on.
- **Test sites:** the Pro branch was copied onto mc-a and monks-central-test (rsync, no deletes) to pick up the two fixes. mc-b stays on 2.5.0 on purpose.
- **Preview app:** the older preview build refused the Phase 2 database (by design: it knows only migration 2). The preview worktree was moved to `main`, rebuilt and relaunched; it opens the data.
- **Real-app progress screenshots** are dark only. A light set would have meant changing the sites again; the light theme of the progress step is covered by the mock screenshots.
