# Review: media manager and full-page editor

Run 2026-10-29 on `feat/media-editor`, with the Classic Monks plugin branches (`feat/monks-central`).
This is step 4 of `media-and-editor-plan.md`: a strict code and security review of the app's branch
against `main` and of the plugin commits since 2026-10-28 18:00. Then every check and every phase's
live acceptance were run again, with the media and editor flows.

- Findings, fixes and decisions: [`docs/review/media-editor-review.md`](../review/media-editor-review.md).
- Live record: [`docs/acceptance/media-editor-review.txt`](../acceptance/media-editor-review.txt), with
  screenshots `docs/acceptance/review-*.png`.

Three reviewers read the code separately (the app's Rust, the UI, the plugins). They found 1 High, 10
Medium and 19 Low. Every real issue is fixed with a test, except the five decisions below. The
live run found three more wording issues and one accessibility gap, all fixed.

## What changed

### monks-central (`feat/media-editor`)

| Commit | Change |
|---|---|
| `8018d18` | fix(core): an ACF save's Undo is the row for that entry; a failed lookup only loses the Undo |
| `f5d42cd` | fix(core): agents can't upload, replace or restore files through `agent_call` |
| `e3c0b3b` | fix(ui): the media library and picker keep only the newest answer (High: writes could hit another site's ids) |
| `fd7dbe0` | fix(ui): a text block's preview has no live links; `position: fixed` site content stays in the editor |
| `899ad22` | fix(ui): `sandbox_iframes: false`, so saving a classic post keeps its embeds |
| `e45573b` | fix(ui): a text block's editor is busy while starting, says when it can't start, and a late one is removed |
| `8b3f206` | fix(app): the window only navigates to the app's own pages |
| `cbbbd64` | fix(app): site links open over http only for a site added over http |
| `455a4e6` | fix(ui): repeater rows keep their editors when moved or removed; ACF editors show the site's values after Undo or a reload |
| `501ca45` | fix(ui): nothing can be typed while a save is on its way, and focus comes back |
| `1f0fd96` | fix(ui): Sites to show asks before closing an editor with changes; an editor belongs to its site |
| `177068d` | fix(core): media edge cases (upload ids, partial trash, month format, 400s, long and odd file names) |
| `37d6fbb` | fix(ui): the editor's heading takes focus, Remove row keeps focus, the picker's error is announced |
| `e580e14` | fix(ui): an ACF save refuses to overwrite a value changed on the site since the page opened |
| `a5c1c2a` | test(acceptance): driver commands for media and ACF |
| `1cc2914` | fix(ui): the editor opened from Search everything says "Back to the results" (found live) |
| `4905cbe` | fix(ui): the media count is read out after Load more |
| `d4a05f0` | docs(acceptance): the live record and screenshots |
| `a103635` | docs(review): findings, fixes and decisions |
| `ded7ce0` | chore(ui): one comment for the leave guard |
| last | docs(pipeline): this report and status |

### Classic Monks Pro (`classic-monks`, `feat/monks-central`)

| Commit | Change |
|---|---|
| `d0ddd4dd` | fix(mcp): operator-only writes run only for the Monks Central operator, also on core's ability REST routes (the wp-admin AI chat could call them) |
| `2fa8ef84` | fix(mcp): replace and restore record the backup first, check the move, one at a time per item, backup path kept inside `cm-replaced/<id>/`, index file |
| `f7709f8c` | fix(mcp): Undo of `update-media` and `update-acf-fields` is refused after a newer edit |
| `a888e609` | fix(mcp): ACF fields hidden with `acf/prepare_field` are not listed or written |
| `32175e9b` | fix(mcp): parent choices leave out entries the user may not read |
| `608b6865` | fix(ai): a drift refusal no longer says the change was an AI's (found live) |
| `1322b875` | fix(media): the replace type refusal reads plainly (found live) |

### Classic Monks Free (`classic-monks-free`, `feat/monks-central`)

| Commit | Change |
|---|---|
| `7ec3135` | same as Pro `d0ddd4dd` (plain app passwords; Free has no chat) |
| `126c8cc` | same as Pro `2fa8ef84` |
| `d0619d3` | `update-media` and `update-acf-fields` record the values they set, for Pro's drift check |
| `9cabd0e` | same as Pro `a888e609` |
| `c57e4ad` | same as Pro `32175e9b` |
| `95d2481` | the SVG refusal no longer says "from a URL" for uploads and replacements |
| `f9ef302` | same as Pro `1322b875` |

## Checks

All run locally on the final code (app `ded7ce0`, Pro `1322b875`, Free `f9ef302`).

| Check | Result |
|---|---|
| `scripts/sidecar.sh --release` | built |
| `cargo fmt --all --check` | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | clean |
| `cargo test --workspace` | 153 passed, 0 failed (core 133) |
| `tsc --noEmit` | clean |
| Vitest | 23 files, 324 passed |
| Playwright, full (axe in both themes and densities, keyboard, 200% zoom, native controls, no-shift) | 506 passed, 264 skipped (screenshot specs without `SHOTS`), 1 failed and 2 did not run: the perf file's "Sites with 300 sites" key budget (149 ms against 100) while both plugin suites ran. Media specs rerun after `4905cbe`: 26 passed. |
| `e2e/perf.spec.ts` alone | Still flaky on this machine (load about 2.7 from other processes): the Sites budget took 126 to 171 ms in 4 runs, and the other two perf tests passed. Interleaved with a worktree of the commit before the review (`8018d18^`): the baseline failed 2 of 6, this branch 1 of 3. So it is not a regression from this review; see Decisions. |
| `scripts/check-headers.sh` | clean |
| `tauri build --no-bundle` (from the repo root) | built `target/release/monks-central` |
| Classic Monks Pro `tests/mcp/ci.sh`, port 8888, CM_WOO=1, CM_ELEMENTOR=1, Bricks 2.4.3 zip | 42 suites, 1402 checks passed, 0 failed |
| Classic Monks Free `tests/mcp/ci.sh`, port 8889, same options | 28 suites, 874 checks passed, 0 failed (the earlier "pending approval counted" flake did not recur) |

## Live acceptance

Release build, the app's default data folder, Studio sites mc-a, mc-b, mc-c and monks-central-test.
The two plugin fixes found live were copied to mc-a and monks-central-test (rsync, no deletes).

| Phase | Result |
|---|---|
| 0 | PASS: doctor, one core only. |
| 1 | PASS: 4 sites, mc-b signed in again, WordPress 7.0 refused, damaged secret recovers, Remove revokes, handoff. |
| 2 | PASS: update on 2 sites, rollback, agent refusals; new: no file tools for agents, operator-only writes refused on the REST route. |
| 3 | PASS: recipe and featured image, block edits with every comment kept, builders locked, Basic mode, 2.5.0 refused. |
| 4 | PASS: login links, comments, module undo, users, approval declined. |
| 5 | PASS: `claude -p` lists sites, a held edit approved, plan 53 waits for the person, every socket confirm unknown, plan allowlist; new: media and editor commands are not on the socket, and the agent is refused replace and upload. Decline, confirm, approve and retry mc-b. |
| 6 | PASS: broken update rolled back, security, monitors. |
| 7 | PASS: publish to 3 sites, search, report PDF, zip install then refused, store, reports. |
| Media | PASS: chunked upload (md5 = served bytes), details and Undo, drift refusal, replace and Undo the replace, PDF and PHP refused, odd file name in Basic mode, PNG to JPEG with the new name and back, filters. |
| Editor | PASS: ACF save and Undo on post 40, SCF gallery and repeater on post 20, classic post 76 with the new image, the conflict check. |
| Window | PASS: tray item; hostile site HTML ran nothing and stayed in the editor; inline colours show under the CSP; Media in both themes. |

End state: all 4 sites healthy, 1 Monks Central grant each on mc-a, mc-b and monks-central-test,
Classic Editor 1.7.0 on all three. Test data kept as asked: uploads (mc-a 87, monks-central-test 63,
mc-c 30), the replace backup, post 76's paragraph, post 40's ACF text, post 20's gallery and repeater,
draft post 89 (the hostile-HTML fixture), the review posts and plugin mc-rv-hello.

## Decisions

- **Upload memory (Medium, plausible).** A 256 MB file can briefly use about 1 GB in the core. Only the
  window can send files, and it is marked `shortcut:` at `MAX_FILE`. Stream from the window if needed.
- **"Undo the replace" without a token (Low).** It is reversible, and the activity log's Undo checks
  the token.
- **"Open the file" is https only and not tied to the site's host (Low).** Media can be on a CDN.
- **Unsilenced `copy()` and `rename()` warnings in the plugins (Low).** They only show with
  `display_errors` on.
- **TinyMCE 7.9.3 advisory (Dependabot, moderate).** It affects the media plugin, which is never
  loaded. Update when a patched 7.x is published.
- **Perf budget flake.** The 300-site Sites key budget (100 ms) fails on and off on this machine, on the
  pre-review commit too. Left as is. Run `e2e/perf.spec.ts` on a quiet machine before release.
- **Housekeeping:** `/tmp` was full of old `ci.sh` scratch sites (about 3.5 GB from 10-27 and killed
  runs). They were deleted, and the plugin suites ran with `CM_SITE_ROOT` under `~/.cache/cm-review/ci/`.
