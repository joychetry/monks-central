# Review 1.5: independent review of the Phase 1.5 readability pass

Run 2026-10-28 on `main`. Scope: the 20 commits after `03a531b` (`7a8053e`..`484e291`), read as a
strict reviewer for correctness, accessibility, tokens, copy and tests that test nothing. Then the
Tauri version mismatch, the full check suite, and the Phase 1 live acceptance on the Studio sites.

## What changed

| Commit | Change |
|---|---|
| `7482f83` | **build:** tauri crate 2.11.6 -> 2.12.5 to match `@tauri-apps/api` 2.12.4, so `tauri build` runs (it refused on the major.minor mismatch). tauri 2.12 needs Rust 1.90, so the workspace `rust-version` moves 1.89 -> 1.90 (installed: 1.99.1). |
| `53bc4c8` | **fix(ui), keyboard:** the Sites key handler took Space anywhere on the page. On a row's checkbox it ticked the *focused* row instead and swallowed the press, so a keyboard user ticked the wrong site; on any other button it did the same. Space now selects only when the grid has focus. **fix(ui), screen readers:** the grid set `aria-selected` on the focused row, so rows nobody had ticked were announced "selected"; it now follows the selection. Test added (fails without the fix). |
| `2410c25` | **test(core):** `4fe3784` (a slow site is healthy, with a note) changed core behaviour with no test. The wording moved into `answered()` with a test under, at and over 3 s; the UI keys on the "Slow" prefix. |
| `1d2063a` | **test(ui):** `contrast.test.ts` fell back to the first CSS block when a selector was missing, so losing the dark block would have checked light tokens twice and passed. It now throws. |
| `967bc06` | **fix(ui), copy:** the inspector said "unknown" for missing versions; the table and Overview say "not known" (docs/ux/README.md section 5). |
| `8f28c84` | **build(ui):** `tsc` didn't cover `e2e/` or `playwright.config.ts`, so the axe and keyboard specs were never type-checked. Now included; clean. |
| `df780a7` | **test(core):** the acceptance driver sent only hidden fields and the operator box, so on a site without the operator box the grant got no tools (a person in a browser keeps the default groups). It now ticks every tool group and Full access when offered, and documents running against the default data folder. |
| `911e934` | **docs(acceptance):** `docs/acceptance/review-1.5.txt`, the live run below. |

Reviewed and fine as is: the skip link and `#content` focus, palette focus return and Tab trap, sheet
focus trap, live regions that exist before they change, status shapes plus words, rail token remap,
`rem` type scale, the e2e mock core and screen list, the axe/keyboard/zoom specs (they assert real
things: focus targets, `scrollWidth`, computed font size), Settings and density persistence. No em
dashes in UI copy; the only "operator" in the UI is the quoted consent-page wording (README decision).

## Checks (all local; GitHub Actions is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | pass |
| `cargo clippy --workspace --all-targets -- -D warnings` | pass, 0 warnings |
| `cargo test --workspace` | 52 passed, 0 failed (39 + 9 + 3 + 1 across the test binaries) |
| Core coverage (`cargo llvm-cov -p monks-core`) | 91.48% lines, 88.85% regions, 89.18% functions (bar: 80%) |
| `npm run build` (tsc incl. e2e, vite) | pass |
| `npm test` (Vitest, incl. 108 contrast pairs) | 130 passed, 0 failed |
| `npm run e2e` (Playwright: axe on 13 screens x 2 themes x 2 densities, keyboard, focus, 200% zoom, text size) | 62 passed, 0 failed, 0 retried (44 skipped: screenshot specs, run only with `SHOTS`) |
| `tauri build` (from the repo root, as README says) | pass, `target/release/monks-central` |

## Live acceptance (Phase 1 re-run): 12 of 12 pass

Full transcript: `docs/acceptance/review-1.5.txt`. Preview app closed first.

- Throwaway data folder, extra connection: WordPress 7.0 refused in plain words (mc-b downgraded,
  restored to 7.1.3, home page 200); corrupted secret shows "Sign in again" and signing in again
  recovers; remove revokes on the site (2 grants -> 1, the destroyed secret's leftover revoked on the
  site -> 0); folder and keychain item deleted.
- Default data folder (`~/.local/share/com.classicmonks.monks-central`), kept:
  - mc-a: Classic Monks 2.6.0-dev, operator, all 6 tool groups, 184 tools
  - monks-central-test: 2.6.0-dev, operator, all 6 tool groups, 189 tools
  - mc-b: released 2.5.0 (no operator box), all 6 tool groups and Full, 169 tools, shown as older
  - mc-c: Basic mode
- 20 parallel calls on mc-a with an expired token: 20 ok, 1 refresh. Full check: all four healthy.
- `monks status` started a headless core; the app built by `tauri build` took over on the same folder
  and showed "All four sites are healthy." with mc-b under Needs attention as older Classic Monks.
- Each Classic Monks site ends with exactly one Monks Central grant.

## Open questions I decided

1. **Tauri: bump the crate or pin the JS API down?** Bumped the crate to 2.12 and the MSRV to 1.90.
   Keeps both sides current; the only cost is the MSRV, and nothing documents a reason for 1.89.
2. **Is "No tools yet. Sign in again and tick the tool groups." right for an older Classic Monks?**
   Yes. mc-b on released 2.5.0 got 169 tools once its tool groups were ticked, so signing in again is
   the real fix there too; no copy change.
3. **What is the "extra connection" for the destructive tests?** A second grant on monks-central-test
   from a throwaway data folder, made and fully removed before the kept connections existed, so any
   leftover grant on the site was unambiguously the test's.
4. **Not changed (noted for later phases):** with 300 sites every row checkbox is a Tab stop in the
   grid (pre-existing; a roving tabindex belongs with the virtualised table); a site that is both
   "no tools" and health "warning" shows "No tools yet" first (Overview still lists its health detail);
   `.sentence` keeps its documented 40px bottom padding and a few 2px hairline offsets stay raw.
5. **`ui/pnpm-lock.yaml`** was untracked before this run and isn't from this repo's npm setup; left
   untouched and uncommitted.
