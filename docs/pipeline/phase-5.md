# Phase 5: AI (`monks mcp`)

Run 2026-10-28 on `main`. Plan section 5.6 and the Phase 5 row: an MCP server for AI apps over the
local core, AI agent access per site, multi-site plans that only a person confirms, and an activity
log that says who did what. No Classic Monks plugin work was needed: the site's existing approval
gate (non-operator grants wait for a person on the site) does the per-site guarding, so both plugin
branches are unchanged this phase. The live acceptance passes with Claude Code (`claude -p`) as the
MCP client. It listed all 4 sites. It edited a post on mc-a, which waited for the site's approval
and then ran once. It planned a Classic Editor update on 3 sites that ran only after Confirm in the
real app. Every way the agent could try to confirm on its own is refused. The live run found four
bugs, all fixed below.

## What changed

### monks-central (`main`)

| Commit | Change |
|---|---|
| `30e9e94` | **feat(core):** AI agents' own grant per site (`agents.rs`, migration `0004_agent_access`). A second OAuth client "Monks Central (AI agents)", signed in with "operator" unticked; the core reads the new grant's capabilities and gives it back if it is an operator. Agent reads use the app's grant; agent changes use only the agents' grant, so the site's approval gate stops them (`SiteError::NeedsApproval` with the approve link). Without access a change is refused before anything is sent. Refresh, revoke on remove, and "access ended" when the site drops the grant, without touching the app's own sign-in. |
| `4dfcb33` | **feat(core):** plans and the activity log (migration `0005_plans_activity`). Jobs carry `proposed_by`, `confirmed_at` and `declined_at`; an agent's plan waits with nothing run until `confirm_plan` (window only) or `decline_plan`. Plugin and theme names are matched against the site's inventory, 200 changes at most. `activity` table: actor (human, agent, agent_confirmed), site, what, outcome (done, failed, refused, waiting), detail. Socket methods: `sites.list`, `site.describe`, `site.run`, `plan.create`, `plan.get`; there is no confirm method. |
| `5438e66` | **feat(cli):** `monks mcp`, a stdio MCP server (protocol 2024-11-05 to 2025-11-25) with `sites_list`, `site_describe`, `run_ability`, `plan_changes` and `plan_status`, and instructions that say what waits for whom. It starts the core headless if the app isn't open. README section "AI apps". |
| `8f718c1` | **feat(app):** window commands `agent_access_on`, `agent_access_off`, `plans_waiting`, `plan_confirm`, `plan_decline`, `activity_list`; every window write is logged as You. |
| `fff1d8f` | **feat(ui):** AI screen: Plans to confirm (each change with its versions, Decline, "Confirm and run N changes"), Agent access per site, Activity (who, site, what, result, 50 a page), Connect an AI app (copyable commands). The rail shows how many plans wait. Vitest in `Phase5.test.tsx`. |
| `6fb95e2` | **test(ui):** mock core data for the AI screen; axe on 6 new screens; keyboard checks for confirming a plan and turning on access; 200% zoom on four AI tabs. |
| `ba5d11c` | **feat(ui):** the palette's "Review the AI agent's plan" puts focus on that plan. |
| `8f426ed` | **fix(ui):** after "Try the failed change again" focus fell out of the progress sheet, so Esc and Tab stopped working (found live). The sheet now remounts per job. |
| `54feb8c` | **fix(core):** a job item the site held for approval showed the agent's wording ("Ask the user to open ...") to a person (found live). It now says "The site asks you to approve this change first. Approve it on the site at <link>, then try this change again." The test site now gates every non-operator grant, as Classic Monks does. |
| `5306069` | **docs(cli):** `plan_changes` says any connected site can be in a plan and, once confirmed, runs as the person (the live agent wasn't sure). |
| `891d1a4` | **fix(ui):** a long reason in a table row pushed Result out of the window (found live in Activity). Reasons wrap; an e2e check covers it. |
| `5b665cf` | **test(core):** acceptance driver: `agent-access`, `agent-access-off`, `plans`, `log`, `approve` (the site's approve page, as its admin) and `socket` (raw socket calls). |
| `e65c06f` | **docs(acceptance):** `docs/acceptance/phase-5.txt` and 6 real-app screenshots in `docs/acceptance/phase-5/`. |
| `1c3dd03` | **docs(ux):** mock screenshots of the AI tabs in `docs/ux/phase-5/` (12) and the checks in `docs/ux/README.md`. |

### Classic Monks Pro and Free (`feat/monks-central`)

No changes. The approval gate (`cm_approval_required`, approve page, run-once retry) and the
per-grant operator flag from earlier tickets were enough.

## Checks (all local; GitHub Actions is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | pass |
| `cargo clippy --workspace --all-targets -- -D warnings` | pass, 0 warnings |
| `cargo test --workspace` | 100 passed, 0 failed (core 84, ipc 9, cli 4, cli mcp 1, autostart 2) |
| Core coverage (`cargo llvm-cov -p monks-core`) | 94.50% lines, 93.06% regions, 94.09% functions (bar: 80%); `agents.rs` 97.43% lines, `activity.rs` 96.63%, `ipc.rs` 92.69% |
| `tsc` (incl. e2e) and `tauri build` from the repo root | pass |
| `npm test` (Vitest) | 175 passed, 0 failed |
| `npm run e2e` (Playwright: axe in both themes and densities, keyboard, 200% zoom, text size) | 224 passed, 0 failed (120 skipped: screenshot specs, run only with `SHOTS`) |
| Classic Monks `tests/mcp/ci.sh` | not run: no plugin changes this phase (last run green in Phase 4) |

## Live acceptance: all pass

Details are in `docs/acceptance/phase-5.txt`. The run used the app's default data folder and the
Studio sites mc-a, mc-b, mc-c and monks-central-test. The MCP client was `claude -p` with a
temporary config that runs only `monks mcp`. The person was the real app window, driven from the
keyboard.

- **Lists all sites:** `sites_list` gave all 4 with health, WordPress version and whether agents may change each one.
- **Edits a post, with the site's approval:** `run_ability update-post` on mc-a came back "needs approval" with the approve link (op 47), and the title stayed "Hello world!". After Approve on the site's own page, the same call ran once. The title is now "Hello world, edited by an AI agent".
- **A 3-site plugin update that waits for Confirm:** `plan_changes` made plan 14 (Classic Editor 1.6.5 to 1.7.0 on MC A, mc-b and Monks Central Test). After 92 s it was still unconfirmed, with all three sites on 1.6.5. Confirm in the app ran it: MC A and Monks Central Test done, and mc-b held for approval by its Classic Monks 2.5.0. After Approve on mc-b and "Try the 1 failed change again", all three are on 1.7.0. `plan_status` reports the plan finished.
- **The agent alone cannot confirm:** the agent said so, and the socket answers `method_not_found` to `plan.confirm`, `plan.run`, `job.start`, `jobs.start`, `confirm` and `plan.decide`. `plan.create` with `"confirmed": true` still waits; it was declined in the window and nothing ran. Covered by `ipc` test `an_agents_plan_waits_for_a_person_and_the_socket_cannot_confirm_it`.
- **Activity shows human vs agent:** You (confirm, decline, retry), AI agent (post edits, proposals), and AI agent, confirmed by you (the plan's three changes), each with its result.
- **End state:** all 4 sites connected. mc-a has 1 Monks Central grant and 1 Monks Central (AI agents) grant, kept as test data. mc-b and monks-central-test have 1 grant each, and mc-c keeps its application password. The preview build moved to `main` (`1c3dd03`), was rebuilt, and is running on the same data folder.

## Open questions, decided

- **Who is the agent?** Every socket client is the agent role, and only the app window is the person. `monks mcp` is a socket client. The threat model is an AI app speaking MCP or the socket. A program with a shell as the user is out of scope, since it could drive the window too.
- **No confirm over the socket at all.** There is no "agent confirms with a flag" path to get wrong. Only the window's `plan_confirm` sets `confirmed_at`, through a conditional update that also refuses a second decision.
- **Agents get their own grant per site, never the app's.** One-site changes go through a non-operator grant, so the site's own approval gate decides, and approving happens on the site, never in Monks Central. Reads use the app's grant and need no access.
- **A confirmed plan runs as the person,** on any connected site, with or without agent access. The person's Confirm is the approval. Each item is logged "AI agent, confirmed by you".
- **Basic mode sites get no agent access.** They have no approval gate, so agents can only plan changes there.
- **Agent reads aren't logged.** Only changes, refusals and plans are, so the log stays readable.
- **The log is append-only.** A proposal keeps its "Waiting for you" row; the later confirm or decline is its own row.
- **Plans aren't deleted.** Declined plans stay as a record and never run. Unfinished agent plans aren't closed when the app restarts; they keep waiting.
- **A retry after a failed plan item is the person's own job,** so `plan_status` keeps the plan's first result.
- **`site_describe` lists tool names, not input schemas.** The agent recovered from the site's own validation error ("post_id is required"). Schemas can come later if agents keep guessing.
- **Older Classic Monks (2.5.0) has no operator grants,** so even the app's own changes there wait for approval. The job item now says so in plain words and links the approve page.
