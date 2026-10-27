# Phase 0: Foundation

Source of truth: the Monks Central plan (sections 1, 5, 8, 9, 10, 11). Each
ticket is one commit on `main`, pushed to `origin` (`joychetry/monks-central`,
private). Tests go in the same commit as the code. No releases, tags or
publishing. No live sites; Studio sites only.

**Accept (whole phase):**

- `cargo fmt --check`, `cargo clippy --workspace --all-targets -- -D warnings`,
  `cargo test --workspace` and `npm test` (UI) pass locally and in CI.
- `monks doctor https://monks-central-test.local` passes with no TLS
  environment variables set (`SSL_CERT_FILE`, `SSL_CERT_DIR` and friends unset).
- A second core refuses to start while one holds the lock.
- A socket client is always an agent, and the socket has no confirm method.

## Layout

```
crates/core   monks-core: store, vault, net, core lock, ipc
crates/cli    monks (console binary): core, status, doctor
crates/app    monks-central (Tauri 2 app, GUI subsystem on Windows)
ui/           React + TypeScript + Vite shell, Vitest tests
scripts/      test-sites.sh (WordPress Studio)
```

Data folder: the OS app-data folder for `com.classicmonks.monks-central`, or
`MONKS_HOME` when set (tests, CI, a second install). Created owner-only (0700)
on Unix.

## P0.1 Licence, README, this plan

GPL-3.0-or-later `LICENSE`, a short `README.md`, `.gitignore`.

## P0.2 Rust workspace

Workspace `Cargo.toml` (edition 2024, shared lints), `crates/core` (library)
and `crates/cli` (binary `monks`). `crates/app` arrives with the UI in P0.8.

## P0.3 Store: SQLite with migrations

`rusqlite` (bundled SQLite). Hand-rolled versioned SQL files in
`crates/core/migrations/`, tracked with `PRAGMA user_version`, each applied in
one `BEGIN IMMEDIATE` transaction. WAL, foreign keys on, busy timeout.
A database newer than the app is refused, never touched.
First migration: `credentials` (encrypted records for the vault). Every other
table in plan 5.8 arrives with the phase that uses it.

Tests: fresh DB reaches the latest version; re-open is a no-op; a newer DB is
refused.

## P0.4 Vault: encrypted secrets, one keychain master key

- One 32-byte master key in the OS keychain through `keyring-core` with each
  platform store pinned explicitly (macOS Keychain, Windows Credential Manager,
  Linux Secret Service over D-Bus via zbus; no `secret-tool` subprocess). No
  store feature means no store, never a silent in-memory mock.
- First run creates the key, writes it, reads it back and compares before use.
  A key is created only when the keychain says "no entry"; any other keychain
  error stops, so existing records are never orphaned.
- Records: XChaCha20-Poly1305, random 24-byte nonce, the record name as
  associated data (a blob copied to another row will not decrypt).
- `put` reads the row back and decrypts it before reporting success (the
  empty-record bug from Central).
- A record that will not decrypt is reported as "Sign in again", never as a
  provider or keychain error.

Tests (keyring mock store, no real keychain): round trip, read-back, wrong key
and swapped rows give "Sign in again", key created once and reused, a keychain
error never creates a new key, a short key is refused.

Deferred: passphrase mode (Argon2id) for machines with no keychain.

## P0.5 Net: HTTP client on the OS trust store

`reqwest` 0.13 with the `rustls` backend, whose verifier is
`rustls-platform-verifier` (trusts exactly what the OS trusts, so Studio,
Local and mkcert sites work with no flags). Connect and request timeouts. TLS
failures map to plain words ("This site's certificate isn't trusted by your
computer").

Tests: a local HTTPS server with a self-signed certificate gives the plain
"not trusted" message.

Deferred to Phase 1: per-site and global concurrency limits, retry rules,
429/403/WAF back-off (they belong to the connectors).

## P0.6 Core lock

`<data>/core.lock`, held with an exclusive OS file lock (`File::try_lock`) for
the life of the core, PID written for messages. A second core gets "Monks
Central is already running (pid N)". The OS drops the lock when the process
dies, so there is no stale-lock cleanup.

Tests: second lock in the same data folder fails; lock is free after drop.

## P0.7 IPC: local socket, every client is an agent

- Unix: socket `<data>/run/core.sock` in a 0700 folder; stale socket removed
  only while holding the core lock.
- Windows: named pipe `\\.\pipe\monks-central-<hash of data folder>` with an
  explicit security descriptor that grants only the current user, first
  instance only, remote clients rejected.
- Protocol: one JSON object per line, request `{id, method, params}`, response
  `{id, result}` or `{id, error: {code, message}}`, 1 MiB line limit.
- Roles: `Operator` (app window, Tauri commands only) and `Agent`. The socket
  server hard-codes `Agent` for every connection. The socket method table has
  no confirm method. Phase 0 methods: `status`.

Tests (all three OSes in CI): status over the socket reports role `agent`;
`plan.confirm` and any unknown method give `method_not_found`; the method
table holds no confirm; a second core in the same folder is refused; on Unix
the run folder is 0700.

## P0.8 CLI: `monks`

Console binary (also on Windows). Commands:

- `monks core` runs a headless core in the foreground until Ctrl-C.
- `monks status` asks the running core over the socket.
- `monks doctor [URL]` checks data folder, database, keychain + vault round
  trip, core (running or not), TLS environment variables, and HTTPS to `URL`.
  Exit code 1 when a check fails. Prints no secret.

Tests: doctor against a temp data folder with the mock keychain.

## P0.9 App: Tauri 2 + React UI shell

`crates/app` (`monks-central`), Tauri 2, starts the core in-process (lock +
database + socket) and serves the window through Tauri commands with the
`Operator` role. If another core holds the lock, the window says so.
`ui/`: Vite + React + TypeScript, left rail with the plan's sections
(placeholders), status card from `core_status`, light/dark from the OS.
Neutral styling only; the design pass is Phase 0.5.

Tests: Vitest + Testing Library render the shell with a mocked `invoke`.

## P0.10 CI

GitHub Actions on push: `fmt`, `clippy -D warnings`, `cargo test` on Linux,
macOS and Windows; UI typecheck, build and Vitest on Linux;
shellcheck and the test-sites self-test (added with P0.11).

## P0.11 Test sites script

`scripts/test-sites.sh create|start|stop|status|delete` for `mc-a` (Classic
Monks branch build + WooCommerce), `mc-b` (Classic Monks as released, from
the `main` branch, degraded mode; it is not on wordpress.org yet), `mc-c` (no
Classic Monks, application password). Writes the Studio hosts block entry
itself with `sudo` (Studio's `pkexec` hangs with no polkit agent), then starts
the site. Checks WordPress is 7.1 or newer and `WP_ENVIRONMENT_TYPE=local`.
Never touches sites it did not create. App password saved to a 0600 file,
never printed.

## P0.12 Phase 0 result

Done 2026-10-27. Live transcript: `docs/acceptance/phase-0.txt`, screenshot
`docs/acceptance/phase-0-app-dark.png`.

### Commits

- `3bc9fb7` docs: add licence, readme and phase 0 plan (P0.1)
- `05273db` chore: add rust workspace with core and cli crates (P0.2)
- `bffada1` feat(core): add sqlite store with versioned migrations (P0.3)
- `f88dac1` feat(core): add secret vault with one keychain master key (P0.4)
- `9fd1324` feat(core): add http client on the os trust store (P0.5)
- `28c663d` feat(core): add data folder and single-core lock file (P0.6)
- `f378b01` feat(core): add local socket ipc where every client is an agent (P0.7)
- `daea6ca` feat(cli): add monks core, status and doctor (P0.8)
- `4003836` feat(app): add tauri 2 app and react ui shell (P0.9)
- `cff7ffe` ci: add fmt, clippy, tests and ui tests (P0.10)
- `4f909a6` chore: add wordpress studio test-sites script (P0.11)
- `ccb30b6` fix(ci): install only the linux packages tauri needs (P0.10)
- docs: phase 0 result (P0.12, this section)

### Tests

- Rust: 22 (monks-core 13 unit + 6 socket integration, monks-cli 3), all
  passing on Linux and macOS; 20 on Windows (two Unix permission tests don't
  apply; the named-pipe tests run there). fmt and clippy `-D warnings` clean.
  CI run 40535633616 green on all jobs.
- UI: 3 Vitest tests; typecheck and build clean.
- Scripts: shellcheck clean; `scripts/test-sites.test.sh` (hosts edits and
  version check on a temp file).

### Doctor (no TLS environment variables set)

```
$ monks doctor https://monks-central-test.local
Monks Central doctor (0.0.1)
  ok    Data folder   /home/joy/.local/share/com.classicmonks.monks-central
  ok    Database      schema 1
  ok    Keychain      master key read back; vault write, read back and delete ok
  info  Core          not running (start it with `monks core` or open the app)
  ok    TLS settings  no TLS environment variables; using the OS trust store
  ok    HTTPS         https://monks-central-test.local answered 200
All checks passed.
```

With a core running, the Core line reads `running (pid N), this client is an
agent`, and a second `monks core` exits with "Monks Central is already
running (pid N)." The app window (via `tauri dev`) shows role `operator`
while `monks status` against the app's in-process core answers as an agent.

Test sites made by the script: `mc-a` (8885, Classic Monks `feat/hq` +
WooCommerce), `mc-b` (8886, Classic Monks `main` 2.5.0), `mc-c` (8887, no
Classic Monks, app password verified against `/wp/v2/users/me`), all
WordPress 7.1.3.

### Deferred

- Passphrase mode (Argon2id) when no keychain is available (Phase 1, before
  the first site secret is stored on a headless machine).
- CLI and `monks mcp` starting a headless core when none runs, and the core
  exiting when idle. Today `monks core` is started by hand.
- The app attaching to (or taking over from) a running headless core. Today
  the window says "already running".
- Network limits (per-site 2, global 8), retry rules, 429/403/WAF back-off:
  Phase 1 with the connectors. TLS errors give a plain hint, no docs link yet.
- Shipping `monks` next to the app (Tauri sidecar on Windows, "Install
  command-line tool" on macOS/Linux): Phase 8.
- CI compiles and tests the app crate on all three OSes but does not open a
  window; the window was opened by hand on Linux only.
- Playwright + axe UI checks and light-theme screenshots: with the Phase 0.5
  design. Coverage gate: Phase 2.
- `scripts/test-sites.sh delete` was not run live (it would delete the sites
  just made).

### Open questions

1. Classic Monks is not on wordpress.org: no plugin with slug `classic-monks`
   or author `classicmonks` (checked 2026-10-27). The plan's "Free (wp.org,
   1.0.0)" and Basic mode's "install Classic Monks for me" depend on it. What
   is the real slug, or is Free not published yet? `mc-b` uses `main` until
   then.
2. `mc-a` defaults to `feat/hq` (plan section 10). The plugin track now works
   on `feat/monks-central`; should the default follow it?
3. When the app starts while a headless core runs, should the app ask it to
   exit and take over, or should the headless core hand its socket over?
4. One keychain item (`com.classicmonks.monks-central` / `master-key`) is
   shared by every data folder (`MONKS_HOME`). Fine, or one item per folder?
5. CI runs macOS and Windows on every push. On a private repo those minutes
   cost 10x and 2x. Keep, or move them to a nightly or manual job?
