# Phase 1: Connect

Source of truth: the Monks Central plan, section 7 row "1 Connect", with 5.1-5.5,
5.7, 5.8, 9 and 10. Same rules as Phase 0: one logical change per commit on
`main`, tests in the same commit, push after each. Studio sites only.

**Accept (live, on Studio sites):**

- Connect `mc-a` (Classic Monks `feat/monks-central`, operator grant ticked
  on the consent page), `mc-c` (Basic mode, application password) and
  `monks-central-test` (Classic Monks + WooCommerce + Bricks).
- 20 parallel calls to one site with an expired access token cause exactly
  one refresh.
- A deliberately corrupted secret shows "Sign in again".
- Removing `mc-a` revokes the grant on the site (checked with `studio wp`).
- A WordPress 7.0 site is refused with "Update WordPress to 7.1 or newer
  first".
- Transcript in `docs/acceptance/phase-1.txt`, screenshots of the shell,
  Overview and Sites in dark and light in `docs/acceptance/phase-1/`.
- `cargo fmt`, `clippy -D warnings`, all Rust and UI tests green.

Test runs use a private data folder (`MONKS_HOME`) and so their own keychain
item; both are deleted at the end.

## What Classic Monks offers (read from `feat/monks-central`)

- `/.well-known/oauth-protected-resource` at the site root (or the site's
  subfolder): `resource` is the MCP URL (pretty or `?rest_route=`),
  `authorization_servers[0]` is the issuer.
- `<issuer>/.well-known/oauth-authorization-server`: authorize, token,
  register, revoke endpoints. Public clients only (`none`), PKCE S256 only.
- DCR is stateless: the `client_id` carries the signed metadata. Loopback
  redirect URIs ignore the port (RFC 8252), so the app registers
  `http://127.0.0.1/callback` and listens on a random port.
- The consent page has "This is my Monks Central app (operator)" (M2), only
  honoured for administrators. The app checks the result in `get-hq-status`
  (`connection.operator`), never assumes it.
- Access tokens last 1 hour, refresh tokens 30 days and rotate; reusing a
  spent refresh token revokes the whole family (60 s replay grace, M12).
  `oauth/revoke` with the refresh token revokes the family.
- MCP is JSON-RPC over POST with no session (legacy mode): `tools/list` gives
  every ability the grant may use, with `readOnlyHint`; `tools/call`.
  `Authorization` or `X-CM-Authorization` carry the bearer token.
- The released plugin (`main`, on `mc-b`) has OAuth and MCP but no
  `get-hq-status`: degraded mode with an "Update Classic Monks" note.

Basic mode uses core REST: `/wp/v2/users/me?context=edit` proves the
application password, `core/get-environment-info` (Abilities API, WordPress
6.9+) gives the WordPress, PHP and environment versions. The REST root comes
from the home page's `Link: rel="https://api.w.org/"` header, so sites
without pretty permalinks work.

## P1.1 Plan (this file)

## P1.2 CI: Linux on every push, macOS and Windows nightly

`rust` job: Linux on push and pull request; Linux, macOS and Windows on a
nightly schedule and on manual dispatch. (Phase 0 question 5.)

## P1.3 One keychain item per data folder

Keychain account `master-key-<16 hex of sha256(canonical data folder)>`, so a
test data folder never touches the real one and can be deleted on its own.
(Phase 0 question 4.) The Phase 0 item (`master-key`) held no site secrets
and is no longer read.

## P1.4 Test sites: the full stack

`scripts/test-sites.sh`: `mc-a` defaults to Classic Monks
`feat/monks-central`; Classic Monks sites get AI + MCP switched on; `mc-a`
gets WooCommerce, Elementor and Bricks (installed from
`~/.cache/monks-test-assets/bricks-2.4.3.zip`, not active; skipped with a
note if the zip is missing), `mc-c` gets WooCommerce and Elementor. The zip is
never copied into the repo.

## P1.5 Core lifecycle: headless core, takeover

- The core is shared (`Arc`); the socket handler reads core state.
- Socket methods: `status` (now says `headless`), `sites.list` (agents may
  read), `core.shutdown`. Shutdown is answered only by a headless core: it
  waits for in-flight site work (refreshes) to finish, then exits. The app's
  core refuses it.
- `monks status` starts a headless core in the background when none runs,
  then answers. (Phase 0 deferred item.)
- The app, finding a headless core, asks it to finish and exit, then takes
  the lock. Another app window is reported, never stopped. (Phase 0
  question 3.)

## P1.6 Store: sites, groups, tags, notes

Migration 2: `sites` (address, name, connection mode, MCP URL and OAuth
endpoints, client id, versions, capabilities JSON, sign-in state, health),
`site_groups` (one group per site, for the site switcher), `site_tags`,
`site_notes`. Secrets stay in `credentials` (vault record `site:<id>`).

## P1.7 Net: request limits and retry rules

- At most 2 requests per site and 8 overall, waiting in turn.
- Retries (up to 2, short back-off, `Retry-After` honoured up to 10 s) only
  for read-only calls: MCP tools marked `readOnlyHint`, `tools/list`, GETs.
  A write is retried only when it never left the machine (connect error).
- 429, 403 and WAF challenge pages are reported in plain words.

## P1.8 OAuth client

Discovery from the site address, then the protected-resource `resource`
value; authorization server metadata; DCR; PKCE S256; loopback listener on
`127.0.0.1:<random>/callback` with `state` and `iss` checked; code exchange
with `resource`; refresh; revoke. The browser step is a function the caller
passes in (the app opens the system browser).

Tests against a fake Classic Monks server (axum, test-only).

## P1.9 Connect, refresh, remove, health

- Add a site by Classic Monks OAuth or Basic mode. Before the browser opens,
  the public feed's generator version is checked; after sign-in the version
  from `get-hq-status` (or `core/get-environment-info`) is authoritative.
  Below 7.1: "Update WordPress to 7.1 or newer first", and a fresh grant is
  revoked again.
- Every secret write is read back (vault). A record that won't open marks
  the site "Sign in again"; signing in again keeps the site's group, tags and
  notes.
- Capabilities from `tools/list` and `get-hq-status`: abilities, operator,
  approvals, modules. No `get-hq-status`: degraded, "Update Classic Monks".
- Refresh is single-flight per site: callers that saw the same expired token
  wait for one refresh and use its result. A refresh whose answer is lost
  (timeout, dropped connection, server error) may have rotated the token on
  the site, so the site goes to "Sign in again" with no retry. A refresh
  that never left the machine changes nothing. Every grant is refreshed at
  core start.
- MCP calls send the bearer token in `Authorization` and `X-CM-Authorization`
  (hosts that strip the first). A 401 refreshes once and repeats the call
  (the site refused it before running it). Basic mode has no fallback: a 401
  explains that the host may strip the header.
- Remove: `oauth/revoke` with the refresh token, then the vault record and
  the site row. If the site can't be reached the local secrets are still
  deleted and the user is told the grant lives on until it expires.
- Health: home page status and time, plus the connection check (MCP or
  REST). Healthy, Needs a look, Down, Sign in again. At start, every 15
  minutes while the core runs, and on demand.
- Groups (one per site), tags, notes.

## P1.10 App commands

Tauri commands (operator only): list sites, add (OAuth, Basic), cancel a
pending sign-in, sign in again, remove, check, set group, set tags, add and
delete notes. The core announces changes; the app forwards them to the
window as an event.

## P1.11 UI: Console design system and shell

Direction B "Console" turned into tokens (`ui/src/styles/tokens.css`, light
and dark, colour only for status) and small components (Button, Kbd, Status,
Tag, Sheet, Palette). Shell: left rail with grouped sections and counts,
scope switcher (all sites or a group), Ctrl K palette, theme switch (system,
light, dark), the "checks run while the app is open" note. Fonts bundled
(IBM Plex Sans, IBM Plex Mono, Newsreader; OFL).

## P1.12 UI: Overview and Sites

- Overview: the serif sentence from direction A ("All 3 sites are healthy."
  / "One site is down. One needs a look."), then KPIs, Needs attention and
  Versions panels.
- Sites: filter bar, dense keyboard table (j/k or arrows, x to select,
  Enter for the inspector, / to filter, a to add), selection bar (check now,
  set group), inspector (health, stack, connection and capabilities, group,
  tags, notes, Sign in again, Remove with a confirm step), add-a-site sheet
  (Classic Monks or Basic mode).

## P1.13 Live acceptance harness

`crates/core/examples/acceptance.rs` drives the same core API the app uses.
The browser step signs in with a session cookie made by `studio wp` (no
password handled) and submits the real consent form with the operator box
ticked.

## P1.14 Phase 1 result

Commits, test counts, acceptance, deferred items, open questions.

## Out of scope for Phase 1

Install Classic Monks for me (waits for the wp.org listing), import/export
(Phase 7 in plan v2), passphrase mode, TanStack virtualised tables (Phase 2,
with the 300-site matrix), one-click login (Phase 4).
