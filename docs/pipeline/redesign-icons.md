# Redesign: plugin and theme icons from WordPress.org

Branch `feat/redesign` (worktree `/home/joy/dev/monks-central-redesign`), 2026-10-28. Built on the fidelity
pass (`redesign-fidelity.md`). Nothing merged, no PR, release or tag.

## Core

`crates/core/src/wporg.rs`, beside the plugin search in `fleet.rs` (which now reads its base URL from the
same `Feeds.wordpress_org`).

- **What is asked:** only the slugs the inventories hold (plugin folder, theme folder; `hello.php` is
  `hello-dolly`), plus the plugin search's own results. Slugs must look like directory slugs
  (`[a-z0-9_-]`, up to 100), so nothing else is sent or used as a path.
- **How:** `plugin_information` / `theme_information` with `request[slugs]=a,b,c`, 20 a batch, heavy fields
  turned off, through the shared request limits (`api.wordpress.org` and each image host count as one
  site: 2 at a time). One run at a time (`try_lock`); it runs after each site check, after "check all",
  and after a manual "read plugins again".
- **Which image:** plugin icons svg, then 2x, then 1x (the generated `default` pattern is not used); theme
  `screenshot_url` (protocol-relative, made https). Only `https` on `ps.w.org`, `s.w.org`, `ts.w.org`;
  never a URL from a site. 2 MB cap, image bytes sniffed (`icons::image_mime`).
- **Cache:** `<data>/wporg/plugins|themes/<slug>`, a `data:` URL, or an empty file for a miss. The file's
  time is the lookup time: hits and misses are asked again after 7 days. Offline (no answer), the batch
  stops and every file stays. An image host that fails keeps the old picture and waits a week.
- **Serving:** `package_icons` (which pictures exist, with their time, so the window reads each once per
  version) and `package_icon(kind, slug)` (the `data:` URL), like `site_icon`. New pictures send
  `inventory-changed`.
- **Search:** the answer's icons are cached in the background after results return (no extra lookup).
  Live, the 12 tiles filled about 5 s after the results.
- **Reports:** the HTML report's "Work done" rows that name a plugin or theme the site runs get a 16px
  picture, each picture once as a CSS class. The PDF keeps the words (the hand-written PDF has no images).

Tests (no network; unit tests' default feed points at a closed local port): recorded answers in
`crates/core/tests/fixtures/wporg/{plugins,themes}.json` (api.wordpress.org, 2026-10-28) served by a local
server; one batch per kind; hits and misses; nothing asked again within the week, misses included; a week
on, asked again; offline keeps the cache; search answers cached with no lookup and an off-host icon
refused; host allowlist (http, look-alike hosts, a site's uploads, `data:`, protocol-relative off-host);
slug rules; sentence matching; report HTML dedupe.

## UI

`components/PkgTile.tsx`: `PkgTile` (picture in the design's `.ptile`: 30px radius 8, `lg` 40px, `sm`
24px, new `xs` 18px radius 5 like the house chips, 1px line border, white behind the picture, monogram
otherwise), `ChangeTile` (a change's tile: plugin or theme, ink "W" for core, globe for translations, none
for content), `pkgOf`, `pkgNamed`, `slugOf` (moved from Matrix).

Where: Plugins and Themes row heads and inspector; Updates rows; Pick, Review and Run sheets; Install
results and bundle lines; Security finding meta line and Abandoned rows; AI plan boxes; Activity and
Latest changes rows that name a plugin or theme the site runs (tile just before the name); Search results;
the HTML report. Audit rows: `docs/design/redesign/audit.md` (2 kept rows now done, 8 new rows; 333 rows,
91 kept).

Mock fixtures carry pictures for WooCommerce, Akismet, Elementor, Yoast, Rank Math, Jetpack and Twenty
Twenty-Five; Classic Monks and Bricks stay monograms. Vitest: `PkgTile.test.tsx` (read once per version,
monograms, kinds and sizes, change tiles, sentence matching) and the Overview sentence placement. Browser:
pictures fill tiles the size of the monograms and the row doesn't move; axe, native controls and 200% zoom
specs cover the changed screens.

## Checks (final code)

- `cargo fmt --all --check`, `cargo clippy --workspace --all-targets -- -D warnings`: clean.
- `scripts/sidecar.sh`, `cargo test --workspace`: 147 passed (core 129).
- `tsc --noEmit`: clean. Vitest: 19 files, 295 tests passed (3 clean runs in a row; two single one-off
  failures earlier came while load average was about 7 with the live app running, each passed alone).
- Playwright full: 458 passed, 1 flaky, 246 skipped (opt-in compare and shots). The flaky one is the
  300-site Sites perf budget (100 ms), passed on retry, as in the fidelity report. Two earlier full runs
  failed it on both tries, so it was measured against the code before this work (`53ea7f0`, throwaway
  worktree): same flow 15 times each, baseline 7 of 15 over budget (107 to 133 ms), this work 9 of 15
  (105 to 148 ms); the baseline full run also failed it once. Nothing in this work renders on Sites.
- `tauri build --no-bundle`: built `target/release/monks-central`.
- Compare images re-rendered for 01, 03, 04, 05, 12, 16, 18, D03, D04, D08 (`docs/ux/redesign/compare/`).

## Live (real app, default data folder, Studio sites, test data kept)

First check after launch filled the cache: WooCommerce (svg), Akismet, Classic Editor, Elementor (gif),
Hello Dolly, Twenty Twenty-Five, Twenty Twenty-Four, Twenty Twenty-Three show real pictures. Misses cached
and shown as monograms: Classic Monks (the Pro build, `classic-monks`), MC Broken Update (test fixture),
Bricks (theme). Shots in `docs/ux/redesign/live/`: `03-updates`, `04-plugins`, `05-themes`,
`d03-updates-plan` (closed without changes), `12-security`, `d04-install-search` (search only, nothing
installed), `16-ai-activity`, `15-report-work-done` (Corner Bakery, October, made with the acceptance
driver into `/tmp`, not Downloads).

## Not done, or worth knowing

- `16-ai-activity.png` is from the build just before the tile moved next to the name in past-tense rows
  ("You [tile] confirmed the plan: ..."); the final placement is covered by vitest, not re-shot.
- While shooting, the desktop switched to workspace 4 on its own (another session, it seems) and five Tab
  presses meant for the app landed in a Chrome tab on 127.0.0.1:8787. Only focus moved; no Enter, no
  typing. I stopped driving the desktop there and made the report through the driver instead.
- The app was stopped with SIGTERM after the live check (it ignores SIGINT and stays in the tray); no app
  was running before.
- Search result pictures appear about 5 s after the results: the core fetches them one by one and signals
  once. Signalling per picture or fetching two at a time would be quicker.
- Theme tiles crop the 4:3 screenshot to the middle; at 30px they read as a colour swatch more than a
  picture.
