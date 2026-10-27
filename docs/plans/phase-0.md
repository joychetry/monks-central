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

## P0.10 Test sites script

`scripts/test-sites.sh create|start|stop|status|delete` for `mc-a` (Classic
Monks branch build + WooCommerce), `mc-b` (Classic Monks from wp.org,
degraded mode), `mc-c` (no Classic Monks, application password). Writes the
Studio hosts block entry itself with `sudo` (Studio's `pkexec` hangs with no
polkit agent), then starts the site. Checks WordPress is 7.1 or newer. Never
touches sites it did not create. App password saved to a 0600 file, never
printed.

## P0.11 CI

GitHub Actions on push: `fmt`, `clippy -D warnings`, `cargo test` on Linux,
macOS and Windows; UI typecheck, build and Vitest on Linux.

## P0.12 Phase 0 result

Commit list, test counts, doctor output, deferred items, open questions
(section below).
