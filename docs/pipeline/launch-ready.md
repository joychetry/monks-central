# Pipeline step: launch-ready (Phase 8, built but not launched)

Date: 2026-10-28. Attempt 1. Result: PASS.

Monks Central is ready to launch and not launched. Linux installers are built, signed for the
updater, installed and opened. macOS and Windows installers are set up in a release workflow
that runs on a version tag; they are untested because GitHub Actions is blocked by billing. The
app updates itself from GitHub Releases. The docs, the licence checks and Joy's launch checklist
are written. Nothing is tagged, released or public.

## What changed

**Installers and updates**

- `scripts/bundle.sh` builds the `monks` command into each installer (Tauri `externalBin`), then
  runs `tauri build`. On Linux that gives an AppImage, a `.deb` and an `.rpm`; on macOS a `.dmg`;
  on Windows an `.msi` and a setup `.exe` (current-user install). All are unsigned (plan D7).
  The `.deb` and `.rpm` put `monks` in `/usr/bin`.
- The Tauri updater plugin reads `latest.json` from
  `github.com/joychetry/monks-central/releases/latest/download/`. It installs only files signed
  with the updater key. The key pair was generated here into
  `/home/joy/.hermes/secrets/monks-central-updater.key` (mode 600, no password, never committed);
  the public key is in `crates/app/tauri.conf.json`.
- The app checks once at start. If a version is ready it says so in a note that stays until you
  close it; it says nothing when it is offline. **Settings > Updates for Monks Central** checks on
  request and installs on a click: download, signature check, install, restart. Site work in
  progress finishes before the restart. A failed check says it couldn't reach the releases on
  GitHub, in plain words.
- `.github/workflows/release.yml` runs on a `v*` tag. Its jobs are Linux, macOS Apple silicon,
  macOS Intel and Windows, through `tauri-action`, and it builds a **draft** pre-release with the
  installers, their `.sig` files and `latest.json`. It needs the repo secret
  `TAURI_SIGNING_PRIVATE_KEY`.
- Version 0.1.0 everywhere (workspace, app, UI).

**From the final review**

- **Agent plans expire.** A plan from an AI agent that nobody confirms within 7 days expires.
  - It can't be confirmed: the core refuses it with "This plan expired ...".
  - The AI screen marks it **Expired** and offers only **Remove**. The rail badge, the tab count
    and the palette count only live plans.
  - `plan_status` tells the agent it expired.
  - Removing it is logged as "Removed the expired plan".
  - Expiry is worked out when a plan is read (`PLAN_TTL` in `fleet.rs`), so there is no migration.
- The Windows named-pipe owner check stays open until Windows CI runs. It is noted in
  `SECURITY.md`, the checklist (step 1) and the docs site's limits page.

**UI polish**

- Content editor, custom fields: the boxes (each field and the Field name and Value row) are as
  tall as every other field. Each Remove button lines up with its box, not with the box and its
  label. A Playwright test measures it and fails on the old code (28 px against 32 px).

**Docs and licences**

- [`docs/install.md`](../install.md): macOS Open Anyway (Sequoia), Windows SmartScreen, the
  AppImage (FUSE, getting `monks` out of it), `.deb` and `.rpm`, putting `monks` on the PATH,
  updates, uninstalling, and where the data lives.
- `README.md` (install, links), `CHANGELOG.md` (0.1.0, Unreleased), `CONTRIBUTING.md`,
  `SECURITY.md` (GitHub private reporting, how the app protects sites, known limits) and
  `PRIVACY.md` (every outside service the app talks to, and when).
- `docs/site`: an mdBook source. Its pages are the introduction, install, the first site,
  everyday use, AI apps, limits, privacy, security and the changelog. Install, privacy, security
  and the changelog are included from the repo files. `mdbook build docs/site` builds it.
- Licence audit: `deny.toml` + `scripts/licence-audit.sh` (cargo-deny, license-checker). No AGPL
  and nothing GPL-3.0 can't take. The results are in
  [`docs/release/licences.md`](../release/licences.md).
- GPL headers: every Rust, TypeScript, CSS and shell file starts with
  `SPDX-License-Identifier: GPL-3.0-or-later`. `scripts/check-headers.sh` checks this, and
  `--fix` adds the line where it is missing. CI runs both checks.
- [`docs/release/checklist.md`](../release/checklist.md): everything Joy must do to launch, in
  order:
  1. fix billing and run CI (watch the Windows job);
  2. decide J4, with the data and a recommendation;
  3. merge both plugin branches;
  4. make the repo public and turn on private vulnerability reporting;
  5. add the updater secret, date the changelog, tag, and test the draft on real machines;
  6. run Plugin Check and submit Classic Monks Free to wp.org;
  7. the steps after launch.

## Commits

monks-central (`main`), each pushed:

| Commit | |
|---|---|
| `a6b30ef` | feat(ai): an agent's plan expires after 7 days, shows as Expired and never runs |
| `4bb1054` | fix(ui): custom field boxes match the other fields and Remove lines up with its box |
| `84dad44` | build: installers for every system and signed updates from GitHub Releases |
| `71f455e` | ci: release workflow builds draft releases on a version tag |
| `2e562d2` | chore: licence audit of every dependency and GPL headers on every source file |
| `b6dc5d2` | docs: install guide, changelog, contributing, security and privacy |
| `e722247` | docs: docs site source (mdBook) in docs/site |
| `a14f0dd` | docs(release): launch checklist for Joy |
| `55bcb11` | docs(acceptance): launch-ready live record and screenshots |
| (this commit) | docs(pipeline): launch-ready report and status |

The Classic Monks plugins were not changed, so their `ci.sh` suites were not re-run. The last runs
are in `docs/pipeline/ui-review.md`: Pro 1216 checks and Free 695, all passing.

## Checks (all local; CI is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | clean |
| `cargo test --workspace` | 140 passed, 0 failed (core 122, core ipc 9, cli 5 + 2 + 1, app 1); 139 before, plus the expired-plan summary test; the core plan test gained the expiry checks |
| Core coverage (`cargo llvm-cov -p monks-core`) | 93.11% regions, 94.35% functions, 94.58% lines (80% required) |
| `tsc -b`, `npm run build` | clean |
| Vitest | 248 passed in 17 files (245 before: expired plan card, update check and install, update note that stays) |
| Playwright | 446 passed, 0 failed, 190 skipped (the screenshot specs without `SHOTS`). Covers axe on every screen in both themes, keyboard, focus, 200% zoom, text size, native controls, no-shift and the 300-site timings. New: the custom-field geometry test, and the agent-plan keyboard test now removes an expired plan too |
| Em dashes in UI copy | none |
| `scripts/check-headers.sh` | every source file has the SPDX line |
| `scripts/licence-audit.sh` | cargo deny: advisories, bans, licences and sources ok (596 packages); npm: allowed licences only |
| `shellcheck -x scripts/*.sh`, `scripts/test-sites.test.sh` | clean, all checks passed |
| `mdbook build docs/site` | built |
| `scripts/bundle.sh` (signed) | AppImage, deb and rpm, with 3 update signatures; each verifies against the configured public key, and a tampered copy fails |

## Acceptance (live)

The full record is in `docs/acceptance/launch-ready.txt`, with screenshots in
`docs/acceptance/launch-ready/`. The real app used the default data folder with the four Studio
sites. The update test used a throwaway folder and keychain item, deleted after. The preview app
was closed for the run and started again after it.

- **.deb**: in a Debian 13 container, apt installs it with its dependencies. `monks` 0.1.0 works,
  the app starts and stays up, and apt remove deletes both binaries.
- **.rpm**: the same with dnf in a Fedora 43 container.
- **AppImage on this computer**: it opens on the real data with all four sites healthy, and
  `monks` can be extracted from it.
  - This host is Arch, so the `.deb` and `.rpm` were installed in throwaway containers on this
    machine rather than on the host.
- **Update, end to end**: a 0.0.9 test AppImage, pointed at a local `latest.json`, found 0.1.0 at
  start and in Settings. It installed 0.1.0 on a click: the file was replaced (its hash matches
  the 0.1.0 build) and it restarted as 0.1.0.
  - The real build asks GitHub. With the repo private, it says plainly that it couldn't reach the
    releases.
- **Plan expiry**: an agent plan was proposed through `monks mcp` and aged 8 days.
  - The window showed it as Expired with only Remove. `plan_status` said expired. The driver's
    confirm was refused. Remove logged it and nothing ran.
  - A fresh agent plan still runs on Confirm, logged "agent, confirmed by you".
- **Phase 0**: `monks doctor` against mc-a passed every check.
- **Sites**: all four are connected with health Ok at the end. The test plans are kept as data.

## Open questions I decided, and how

- **J4 (a separate connector plugin) is not mine to decide.** The checklist (step 2) has the
  numbers: 73 PHP files and about 13,300 lines of connector code in Free, 62 abilities, no wp.org
  review started yet. It also covers the two-OAuth-servers problem and the support cost, and
  recommends keeping the connector in Free for launch.
- **Version 0.1.0, not 1.0.** The plan calls Phase 8 "v1.0", but J2 says the repo goes public at
  the v0.1 beta, and nothing has been tested by users yet. The changelog calls it the first public
  beta. Joy can tag another number.
- **Expired plans stay listed until removed.** Hiding them would lose what the agent asked for
  (the final review's concern). They can't run, can be removed with one click, and aren't counted
  as waiting.
- **The updater key has no password.** Its file mode (600) protects it, and a password would be a
  second secret to lose. Losing the key strands every installed copy, so the checklist says to
  back it up.
- **Releases are drafts and pre-releases.** A tag never publishes anything by itself; Joy
  publishes the draft after trying the installers.
- **The CLI ships inside every installer**, next to the app, not through an in-app "Install
  command-line tool" action (plan 5.1). The `.deb` and `.rpm` put it on the PATH. The install
  guide gives the one command for macOS, the AppImage and Windows.
- **There is no passphrase fallback for computers without a keychain** (plan 5.2 was never built).
  The docs say a keychain is required and don't promise a passphrase mode. This is listed under
  "After launch" in the checklist.
- **Plugin Check was not run on the Classic Monks Free zip.** It needs a scratch WordPress, and it
  is part of the wp.org submission, which is Joy's step (checklist step 6).
- **Known, harmless:** after an AppImage updates itself, the old image stays mounted until the app
  quits, because the new process inherits its keep-alive.
- **Not done on purpose:** no tag, no release, no public repo, no wp.org submission, no merge into
  a plugin `main`.
