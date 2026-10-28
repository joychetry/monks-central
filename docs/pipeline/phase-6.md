# Phase 6: Safety and monitoring

Run 2026-10-28 on `main`, with M10 on the Classic Monks plugin branches. Plan section 5 and the
Phase 6 row cover several features:

- Safe updates: a pre-check, then an HTTP and error-log check after the update, with automatic rollback.
- A vulnerability feed from WPVulnerability (no key).
- Abandoned plugins and checksums.
- Uptime, SSL and domain expiry.
- PageSpeed.
- A tray agent.

The live acceptance passes: a test plugin whose new version fatals was forced onto mc-a from the
real app window, and the update was rolled back automatically with the PHP fatal as the reason.

The earlier attempt built every feature but stopped in the middle of the live acceptance, without a
report (status FAIL with no reason). This run finished it. The live run found three more bugs, all
fixed below with tests: two in Classic Monks and one in the core.

## What changed

### monks-central (`main`)

| Commit | Change |
|---|---|
| `23e155f` | **feat(core):** safe plugin updates. Where the site has the M10 tools, `get-http-status` must say the site works first and `get-error-log-since` marks the log. Then `update-plugin` runs with `safe: true`, so the site checks itself and puts the old version back in the same request. After that the core loads the home page as a visitor and reads the log since the mark. A 5xx, WordPress' critical error page or a new fatal from that plugin rolls it back with `rollback-plugin`. Job items get a `rolled_back` state (migration 0006). Sites without M10 update as before. |
| `29cc028` | **feat(ui):** job progress tags a rolled back change and shows the reason, and the summary counts it. "Try the failed changes again" does not offer it, because a retry would break the site again. |
| `75a9e9f` | **feat(core):** security scan. WPVulnerability (free, no key) for WordPress, plugins and themes, matched to the installed version. Abandoned plugins: closed on WordPress.org, or no release for two years. Core and plugin checksums through Classic Monks. Answers are cached a day and shared across sites (migration 0007). Each site is scanned once a day. |
| `4915f24` | **feat(ui):** Security screen. Lists vulnerabilities (severity in words and a shape), abandoned plugins, changed files and what wasn't checked, with one-site or all-fixable updates through the usual plan. |
| `3c70523` | **feat(core):** monitors. Every home page is loaded every 5 minutes, and the TLS certificate's expiry is read with a small DER reader (no new dependency). Domain expiry comes from RDAP once a day. PageSpeed runs on request for public sites. Uptime is kept 30 days (migration 0008). |
| `7984e28` | **feat(ui):** Monitoring screen. Up or down and why, answer time, 24 h and 30 day uptime, certificate and domain days left, and the PageSpeed phone score with LCP, CLS and TBT. The rail shows how many sites are down. |
| `ec542fe` | **feat(app):** tray agent. Closing the window hides it to the tray and monitoring keeps running. The tray shows a status line, can check now and quits cleanly. Desktop notices say which sites went down or came back. |
| `e8daf94` | **fix(core):** a vulnerability that WPVulnerability names only by CVE reads as a sentence, not a version range (found in a live scan). |
| `33e2188` | **fix(core):** PageSpeed's keyless limit is daily, so the error message no longer says "an hour". |
| `83fea9d` | **test(core):** acceptance driver commands `security`, `monitors` and `pagespeed`. |
| `e2897a7` | **docs(ux):** mock screenshots in `docs/ux/phase-6/` (10) and the checks in `docs/ux/README.md`. |
| `a2c43a9` | **docs:** safety and monitoring in the README. |
| `abbb706` | **fix(core):** a site isn't marked down while Monks Central updates it (found live). The 5-minute uptime check reached mc-a during the safe update's maintenance mode, recorded a 503 and showed "1 down", and the tray could have sent a "down" notice for Monks Central's own update. Monitors now skip the home page of a site with a change running, and the next round checks it as usual. Tested in `uptime_domains_and_pagespeed_are_recorded`. |
| `7cf9b6b` | **docs(acceptance):** `docs/acceptance/phase-6.txt`, the fixture plugin in `docs/acceptance/phase-6/fixture/`, and 4 real-app screenshots. |

### Classic Monks Pro (`feat/monks-central`) and Free (`feat/monks-central`)

M10 is on both branches. Each change is one commit per repo, with the same test (`tests/mcp/m10.sh`).

| Pro | Free | Change |
|---|---|---|
| `8c5f8f6a` | `022655f` | **feat(mcp): M10 safe update helpers.** New tools, on the Monks Central connection only: `get-http-status` (a loopback GET with WordPress' fatal error scrape that also works in maintenance mode), `get-error-log-since` (a marker, then the new lines with paths masked, secrets redacted and fatal and warning counts) and `set-maintenance-mode`. `update-plugin` takes `safe`. It turns on maintenance mode, updates, and marks the plugin active without loading it. Then it checks the home page and the log, and when the update broke the site it puts the temp backup back in the same request. |
| `8ba3bdc9` | `e4b971f` | **fix(mcp):** a failed update no longer leaves an active plugin off. |
| `8f4d1985` | `a050143` | **fix(mcp):** when the scrape misses the fatal, the rollback reason takes it from the error log. |
| `17caeeec` | `d456976` | **fix(mcp):** `get-http-status` sees a fatal that shutdown callbacks hide (found live and in the full suite). WordPress runs the `shutdown` action before it prints the scrape, so a notice raised there (WooCommerce, Elementor) replaces `error_get_last()` and the fatal came back null. In a scrape request that WordPress has already validated (`WP_SANDBOX_SCRAPING`), Classic Monks prints the fatal first, at the earliest shutdown priority and under its own markers. |
| `229aaa0c` | `1b486bd` | **fix(mcp):** a rolled back update keeps the site's other updates (found live). The upgrade empties the `update_plugins` transient, so WooCommerce's update vanished from Updates until WordPress checked again, up to 12 hours later. The rollback now calls `wp_update_plugins()`, as the success path already did. |

## Checks (all local; GitHub Actions is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | pass |
| `cargo clippy --workspace --all-targets -- -D warnings` | pass, 0 warnings |
| `cargo test --workspace` | 111 passed, 0 failed (core 95, ipc 9, cli 4, cli mcp 1, autostart 2) |
| Core coverage (`cargo llvm-cov -p monks-core`) | 94.53% lines, 93.02% regions, 94.25% functions (bar: 80%); `security.rs` 96.26% lines, `monitor.rs` 94.65%, `fleet.rs` 91.73% |
| `tsc` (src and e2e) and `tauri build --no-bundle` from the repo root | pass |
| `npm test` (Vitest) | 181 passed, 0 failed |
| `npm run e2e` (Playwright: axe in both themes and densities, keyboard, 200% zoom, text size) | 246 passed, 0 failed (128 skipped: screenshot specs, run only with `SHOTS`) |
| Classic Monks Pro `tests/mcp/ci.sh` (CM_WOO, CM_ELEMENTOR, Bricks zip) | 38 suites, 1112 checks passed, 0 failed (Pro `229aaa0c`) |
| Classic Monks Free `tests/mcp/ci.sh` (same) | 25 suites, 636 checks passed, 0 failed (Free `1b486bd`) |

UI copy was not changed after the mock screenshots and their axe, keyboard and zoom checks
(`e2897a7`). The core fix only changes which sites get probed.

## Live acceptance: pass

Details are in `docs/acceptance/phase-6.txt`. The run used the app's default data folder and the
Studio sites. mc-a and monks-central-test run the Pro branch (rsynced). mc-b stays on 2.5.0, and
mc-c is Basic mode.

- **A broken update rolls back, with the reason.** MC Broken Update 1.0 is active on mc-a, and a
  mu-plugin offers 1.1, which calls an undefined function when it loads. From the app window
  (Updates, tick the row, Update 1 selected, Review, Update) the result was: "Finished. 0 changes
  done, 1 rolled back. Rolled back to 1.0. The home page answered 200 after the update: PHP Fatal
  error: Uncaught Error: Call to undefined function
  mc_broken_update_function_that_does_not_exist() in
  ABSPATH/wp-content/plugins/mc-broken-update/mc-broken-update.php on line 7". Afterwards 1.0 is
  on disk and active, the home page answers 200, no `.maintenance` file is left, and the site
  still offers WooCommerce 11.2.1. The driver run (job 21) gave the same.
- **Security:** MC A has WooCommerce 11.1.2 with CVE-2026-106608 (high, fixed in 11.2.0). There
  are 0 abandoned plugins. Checksums: 8 compared on MC A, 6 on Monks Central Test and 5 on mc-b,
  with 0 differing. mc-c says checksums need Classic Monks.
- **Monitoring:** all 4 sites are up, and their certificates expire Jan 29, 2029. Domain expiry and
  PageSpeed say plainly that local addresses don't apply, so no live site was touched. Tests
  against a local feed cover those paths.
- **Tray agent:** the release app registers its tray icon, and the sidebar names the 15-minute
  checks that keep running from the tray.
- **End state:** all 4 sites are connected and healthy. The fixture and its offer stay on mc-a as
  test data. MC A's 24 h uptime reads 83.3% because of the one 503 recorded before `abbb706`, and
  it ages out.

## Open questions, decided

- **Where the check runs.** On the site, in the same request as the update. If the new version
  fatals, every later request (MCP included) dies too, so only the request that installed it can
  still put the backup back. The core then checks again from outside (as a visitor, and the error
  log since the mark) and rolls back over MCP if that check fails.
- **No screenshot diff.** The plan dropped it: Tauri has no cross-platform webview screenshot API.
- **The site must work before the update.** If the pre-check fails, nothing is updated and the item
  says why. Otherwise the post-check couldn't tell what broke the site.
- **"Answered 200" with a fatal.** Studio's PHP prints errors on the page, so the status is 200
  while the page holds a fatal. The fatal triggers the rollback, and the reason quotes both
  honestly. Changing the wording would only hide the status.
- **Older Classic Monks and Basic mode update unchecked, as before.** mc-b (2.5.0) has no M10
  tools. The Updates legend says the checks need current Classic Monks.
- **A stale tool list means an unchecked update.** The core learns a site's tools from its health
  check (at start, every 15 minutes and on "Check all sites now"). The first live try ran
  unchecked because Classic Monks had just been synced onto mc-a, and it left mc-a fataling until
  the 1.0 files went back. The next health check fixed the path. I kept the current behaviour: a
  real site only gains the tools by updating Classic Monks, and the next check picks them up.
  Reading tools/list before every update would add a round trip to every change.
- **Uptime skips a site that Monks Central is changing,** instead of recording a 503 and calling it
  down. The skip covers any running change, not just safe updates, because any of them can put the
  site in maintenance mode.
- **Rolled back counts as failed in the activity log.** The log's outcomes are done, failed,
  refused and waiting. The detail starts "Rolled back to ...", and the job keeps its own
  `rolled_back` state.
- **mc-a has no error log** (WP_DEBUG off, PHP `log_errors` off), so live only the home page check
  could see the fatal. I left mc-a's config alone because it is test data. The error-log path is
  covered by `m10.sh`, which has `WP_DEBUG_LOG` on.
- **WooCommerce stays on 11.1.2 on mc-a** as the live vulnerability example. Its update is
  waiting.
