# Launch checklist (for Joy)

Everything is built and checked locally; nothing is tagged, released or public.
These are the steps only you can take, in order. Each one says why and how to
check it worked.

## 1. Fix GitHub billing

GitHub Actions is blocked by billing, so no workflow has run: not CI
(`.github/workflows/ci.yml`) and not the release build
(`.github/workflows/release.yml`). Every check ran locally instead (see
`docs/pipeline/launch-ready.md`).

- [ ] Fix the billing problem under github.com > Settings > Billing and plans.
- [ ] Run CI once by hand: Actions > CI > Run workflow (the manual run tests
      Linux, macOS and Windows). It must be green before step 5.
- [ ] Look at the Windows job in particular: the named-pipe owner check
      (`crates/core/src/ipc.rs`) has never been built or run on Windows. It is
      still open until that job passes (final review, "Left open").

## 2. Decide J4: a separate "Monks Central" connector plugin?

Plan section 7, J4: asked at the start of Phase 8, not decided by the build.
Today the connector lives in Classic Monks Free and Pro (`functions/monks-central`).

What the data says:

- **Connector code that exists:** on Free's `feat/monks-central` branch,
  `functions/monks-central` is 73 PHP files and about 13,300 lines (OAuth 2.1
  server, MCP server, approvals, activity log, 62 abilities); 41 commits over
  `main`. Pro carries the same connector plus its module abilities (55 commits).
- **wp.org review status:** Free was never submitted (step 6), so there is no
  review history yet and no review clock to lose by moving the code.
- **Two OAuth servers on one site:** if a separate plugin and Classic Monks both
  ran a connector, a site would have two grant stores and the app would have to
  pick one. Either the separate plugin owns OAuth and Classic Monks hands its
  abilities to it, or only one of them may be active as connector.
- **Cost:** a third plugin means a third readme, wp.org listing, support forum,
  release train and test suite (`tests/mcp/ci.sh` is 26 suites in Free today).

Questions to answer:

- [ ] Build the separate plugin, or keep the connector in Classic Monks Free
      (current plan, M1)?
- [ ] If separate: move the connector code out of Free (one connector, no
      duplication), or ship it in both?
- [ ] Which actions stay Classic Monks only (module control, Bricks and
      Elementor editing, Woo bulk edit, reports)?

Recommendation: keep the connector in Free for the first launch. It is built,
tested and documented there, and a separate plugin delays the wp.org listing by
a new review. Revisit after launch if users without Classic Monks ask for it.

## 3. Merge the plugin branches

Both are on `feat/monks-central`, green with WooCommerce, Elementor and Bricks
(Pro 40 suites and 1216 checks, Free 26 suites and 695 checks at
`docs/pipeline/ui-review.md`).

- [ ] `classic-monks` (Pro): review and merge `feat/monks-central` into `main`
      (tip `30247da8`). Bump the version from `2.6.0-dev` to the release number.
- [ ] `classic-monks-free`: review and merge `feat/monks-central` into `main`
      (tip `c08baea`). Header and `Stable tag` say 1.0.0, right for a first
      submission.
- [ ] Run both `tests/mcp/ci.sh` suites once more on `main` after the merge.

## 4. Make the repository public

- [ ] github.com/joychetry/monks-central > Settings > General > Danger Zone >
      Change visibility > Public.
- [ ] Settings > Code security: turn on **Private vulnerability reporting**
      (SECURITY.md sends reports there), Dependabot alerts and secret scanning.
- [ ] Before you do: search the history once more for secrets
      (`git log -p | grep -iE "password|secret|token" | less`). The build kept
      them out, but the history is yours to check.

The in-app updater reads
`https://github.com/joychetry/monks-central/releases/latest/download/latest.json`,
which only works once the repo is public and a release is published.

## 5. Add the updater signing key and tag the first release

The updater key pair was generated on this computer:

- private key: `/home/joy/.hermes/secrets/monks-central-updater.key` (mode 600,
  no password, never committed). Back it up somewhere safe: **if it is lost, no
  installed copy can ever update itself again** (they only trust this key).
- public key: in `crates/app/tauri.conf.json` (`plugins.updater.pubkey`).

Steps:

- [ ] Repo > Settings > Secrets and variables > Actions > New repository secret:
      `TAURI_SIGNING_PRIVATE_KEY` = the contents of the key file
      (`cat /home/joy/.hermes/secrets/monks-central-updater.key | wl-copy`).
      Leave `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` unset (the key has none).
- [ ] Move `## [0.1.0] - Unreleased` in `CHANGELOG.md` to today's date.
- [ ] Tag and push: `git tag -a v0.1.0 -m "Monks Central 0.1.0" && git push origin v0.1.0`.
- [ ] Watch Actions > Release: four jobs (Linux, macOS Apple silicon, macOS
      Intel, Windows). They make a **draft** release with the installers,
      their `.sig` files and `latest.json`.
- [ ] Before publishing the draft: download each installer and try it on a real
      machine, following `docs/install.md` (macOS Open Anyway, Windows
      SmartScreen, Linux). The macOS and Windows builds have never been run.
- [ ] Publish the draft (it is marked pre-release). Then open the Linux build
      from step 5's draft on this computer, Settings > Check for a new version:
      it should say you have the newest version.

## 6. Submit Classic Monks Free to wordpress.org

- [ ] Build the zip from `main` after step 3 (no `tests/`, no dev files).
- [ ] Run the Plugin Check plugin on the zip in a scratch site and fix what it
      reports. It has never been run on the Free zip; a few `phpcs:ignore`
      comments without reasons are known (final review).
- [ ] Submit at https://wordpress.org/plugins/developers/add/. The readme
      already has the "Connect to Monks Central" and "External services"
      sections the review asks for. Expect weeks of review.
- [ ] Until it is live, sites without Pro connect in Basic mode; nothing in the
      app depends on Free being on wordpress.org.

## 7. After launch

- [ ] Publish the docs site (`docs/site`, built with `mdbook build docs/site`),
      for example with GitHub Pages, and link it from the README.
- [ ] Code signing (Apple Developer ID, a Windows certificate) when it pays
      for itself; then the install guide loses its warnings section.
- [ ] Watch issues for keychain trouble on Linux desktops without GNOME
      Keyring or KWallet: there is no passphrase fallback (plan 5.2) yet.

Not done on purpose, waiting for you: no tag, no release, no public repo, no
wp.org submission, no merge to a plugin `main`.
