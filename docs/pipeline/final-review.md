# Final review

Run 2026-10-28 on `main`, with the Classic Monks plugin branches (`feat/monks-central`). This was
a whole-product code review and hardening pass of the app and both plugin branches. Then every
check and every phase's live acceptance were run again.

- The findings, their fixes and the decisions are in [`docs/review/final-review.md`](../review/final-review.md).
- The live record is in [`docs/acceptance/final-review.txt`](../acceptance/final-review.txt).

## What changed

### monks-central (`main`)

| Commit | Change |
|---|---|
| `b1de145` | **test(core):** the flaky `net::tests::closed_port_says_could_not_reach` holds its port with a bound socket that never listens (known item). |
| `dccc578` | **fix(core):** an agent's plan holds only plugin, theme, core and translation changes. Installs are by WordPress.org slug, and `PLAN_MAX` is checked first. |
| `3bf01d3` | **fix(core):** never make a login link for an AI agent. |
| `eca41f7` | **fix(core):** OAuth discovery addresses must be on the site's own host. |
| `8349cce` | **fix(core):** Basic mode sends the app password only to the site's own REST root, and a bad `Link` header can't panic. |
| `d0638ed` | **fix(core):** the site client follows redirects only on the same host. |
| `177462b` | **fix(core):** plain http only for sites on this computer or the local network. |
| `4b5a6b8` | **fix(cli):** `monks doctor` never makes a master key while a core runs. |
| `e465f70` | **fix(core):** the loopback sign-in ignores strangers and idle connections. |
| `2d0ea47` | **fix(core):** token lifetimes are held to a year, so a huge `expires_in` can't overflow. |
| `734cc79` | **fix(core):** the socket keeps serving after an accept error. |
| `f111533` | **fix(core):** one job at a time per site. A broken saved change fails instead of running, and leftover items fail when the job ends. |
| `9cc3f0e` | **fix(app):** opens only web links, only files we saved, and a site's links only on that site. |
| `08c70fe` | **test(ui):** Security's invoke mock answers every command. |
| `9e23cbe` | **fix(ui):** only the newest answer shows in Content, Store, Users, Comments and the AI log. |
| `46c831e` | **fix(ui):** deleting a bundle asks first, and a failed delete keeps the editor open. |
| `2e41c7a` | **fix(core):** a client report covers its own month. |
| `f69539d` | **fix(core):** CSV export writes formula-like cells as text. |
| `afebc8a` | **fix(core):** import checks client names, names every site it left out, and reads costs once. |
| `8c867cb` | **fix(core):** Basic mode image import stops reading at 25 MB. |
| `6468089`, `c9c259f` | **fix(core):** two edits to one block are refused with their own message. |
| `ae0df30` | **fix(core):** the PDF cuts long words in one pass and prints WinAnsi's marks. |
| `7e675b6` | **test(acceptance):** the driver confirms or declines a plan as the window does. |
| `6aa0c3c` | **fix(core):** the report's security line names only the problems found. Found live. |
| `cc04f26`, `701edd6` | **docs:** the acceptance record and the review. |

### Classic Monks Pro (`classic-monks`, `feat/monks-central`)

| Commit | Change |
|---|---|
| `00bdf9d9` | install-zip and maintenance mode run only for Monks Central's (operator) connection, and never over plain REST. |
| `a9fa065a` | Only an app on this computer (an http loopback return) can be ticked as operator. The consent page says the operator can open the dashboard, and more schemes are refused. |
| `7311f5a7` | A new post's custom fields pass their own auth callbacks. A failed meta write removes the post. |
| `e9f8037d` | The refresh replay grace waits for the rotation's tokens. |
| `ae170f86` | A chunk is appended once, even when its retry races it. |
| `61d5a95f` | get-post-meta shows protected fields to administrators only. |
| `3cfc486a` | The fatal check after a theme change fetches only the site's own host. |
| `8b62ca28` | test: an ability left out of REST reports `show_in_rest` false. |
| `f562be7a` | Array fields in OAuth and MCP requests read as empty, not as warnings. |
| `cc4e689f` | test: the operator suite's web-app check grants the toolset it reads. |

### Classic Monks Free (`classic-monks-free`, `feat/monks-central`)

These are the same fixes, ported:

- `7346fcc`, `592f622`, `3589cc9`, `30c479d`, `0d6f1d1`, `ac3616e`, `8239ea1`, `4a3267d`
- `2ad57a7`, `a9a1fb6`
- `adbda3f` removes a stray `.orig` file

## Checks

All checks were run locally (GitHub Actions is blocked by billing).

| Check | Result |
|---|---|
| `cargo fmt --all --check` | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | clean |
| `cargo test --workspace` | 139 passed, 0 failed. Core 122 (115 at Phase 7), core ipc 9, cli 4 + 2 + 1, app 1. |
| Flaky test | `net::` and `oauth::` 40 runs in a row, 0 failures. Full workspace 5 runs, 0 failures. |
| Core coverage (`cargo llvm-cov -p monks-core`) | 93.09% lines, 94.34% functions, 94.57% regions (80% required). |
| `tsc -b` | clean |
| Vitest | 214 passed in 16 files (211 at Phase 7). |
| Playwright (`npx playwright test`: axe, keyboard, zoom) | 352 passed, 170 skipped (the screenshot specs, which need SHOTS). 0 serious or critical axe issues. |
| `tauri build --no-bundle`, `cargo build --release -p monks-cli` | built |
| Classic Monks Pro `tests/mcp/ci.sh`, port 8888 (CM_WOO=1, CM_ELEMENTOR=1, Bricks 2.4.3 zip) | 40 suites, 1215 checks passed, 0 failed. Temp site deleted. |
| Classic Monks Free `tests/mcp/ci.sh`, port 8889 (CM_WOO=1, CM_ELEMENTOR=1, Bricks 2.4.3 zip) | 26 suites, 694 checks passed, 0 failed. Temp site deleted. |

## Live acceptance

Every phase passed again against the Studio sites, in the app's default data folder. Tests that
break a connection on purpose used throwaway folders, which were deleted along with their keychain
items. The details are in `docs/acceptance/final-review.txt`.

| Phase | Result |
|---|---|
| 0 | PASS: doctor, one core only, status. |
| 1 / review-1.5 | PASS: burst refresh (20 ok, 1 refresh), WordPress 7.0 refused, corrupt then sign in again, remove revokes, the CLI's core handed over to the app. |
| 2 | PASS: WooCommerce on 2 sites in one job, rollback, agent refusals, sign in again reuses the grant. |
| 3 | PASS: Recipe with terms, image import as featured, Gutenberg edit, Elementor and Bricks locked, Basic mode, 2.5.0 refused. |
| 4 | PASS: login link once and as yourself, comments on 2 sites, module undo, users, approval waiting. |
| 5 | PASS: the MCP client (`claude -p`) lists sites, `update-post` is held and approved, a 3-site plan waits for the person, no socket confirm, the new plan allowlist, Confirm runs it, and mc-b is approved and retried. |
| 6 | PASS: broken update rolled back, security scans, monitors, tray. |
| 7 | PASS: publish to 3 sites, search, monthly report PDF, zip install, store, Classic Monks reports. |

End state:

- all 4 sites are connected and health Ok
- 1 Monks Central grant each on mc-a, mc-b and monks-central-test
- MC A keeps its AI agents grant
- the content made by the run is kept as test data

## Open questions, decided

- **Should MCP `plan_changes` offer the Phase 7 actions? No.** The actions are publish_post,
  set_post_status, trash_post, untrash_post, update_product and install_zip. The core now refuses
  them in any agent plan. The reasons:
  - Their labels would be the agent's own words, while plugin and theme labels come from the
    site's inventory.
  - `install_zip` needs a file a person picked.
  - Agents with agent access already change content through the site's own approval.

  Revisit with server-read labels if multi-site content plans are needed. The full reasoning is
  in the review.
- **install-zip** needs no approval, because only the operator connection can run it.
- **Login links** stay with any operator grant, as M3 says. To stop a stolen token, revoke the
  connection.
- **Left open, with reasons in the review:**
  - the Windows pipe owner check (no MinGW here, so it can't be built)
  - plans never expire
  - Search Console is tested against a stand-in only
  - no per-user upload cap
  - no length caps on local group, tag and note text
  - Free's phpcs ignore comments
