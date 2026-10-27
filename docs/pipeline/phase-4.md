# Phase 4: People and control

Run 2026-10-28 on `main`. Plan section 5 and the Phase 4 feature map row: users across sites (list,
create, change role, delete with reassign), a comment moderation inbox across sites with reply,
one-click login (M3), and Classic Monks Features, Settings, Activity, Undo and Approvals. Ticket M7
(`send-password-reset`, delete with reassign) is on both plugin branches. The live acceptance passes.
One-click login signs in to wp-admin only as the site user who owns Monks Central's grant, works
once, and is refused to AI agents. A pending comment was approved from the real app on mc-a
(Classic Monks) and on mc-c (Basic mode). A Classic Monks feature was turned on and undone, both
from the notice and from the activity log, with the option checked on the site each time. The live
run found three bugs, all fixed below.

## What changed

### monks-central (`main`)

| Commit | Change |
|---|---|
| `ae4260f` | **feat(core):** users and comments (`people.rs`). Users across a site (search, 50 a page, the site's assignable roles), create (nobody sees a password: Basic mode sets a random one the person never learns), change role, delete with reassign, send a password reset. Comments in four states (pending, approved, spam, trash; 100 a page, newest first), approve, unapprove, spam, trash, reply. Classic Monks over MCP, core REST in Basic mode. |
| `a7702b1` | **feat(core):** one-click login and Classic Monks control (`control.rs`). `login_link` asks the site for a single-use link and only opens it if it points at the site's own scheme, host and port. Features grouped by section (locked ones read-only), the settings marked `hq_editable`, the activity log (25 a page) with undo, the changes waiting for approval and their approve page on the site. A feature change returns its activity row so the window can offer Undo. |
| `02e7d66` | **feat(app):** window commands `users_list`, `user_create`, `user_set_role`, `user_delete`, `user_reset`, `comments_list`, `comment_moderate`, `comment_reply`, `site_login`, `cm_features`, `cm_set_feature`, `cm_settings`, `cm_set_setting`, `cm_activity`, `cm_undo`, `cm_approvals`, `cm_approval_open`. |
| `f2e3649` | **feat(ui):** Users (one table for every site; Add a user, Change role and Delete sheets, Send password reset where the site has M7), Comments (one inbox, four lists, inline reply), Classic Monks (site picker; Features with search, Settings, Activity with Undo, Waiting for approval; each tab only where the site has its tool), "Log in to the dashboard" in the Sites inspector and the palette. Vitest in `Phase4.test.tsx`. |
| `7cbe236` | **test(ui):** mock core data for Phase 4; axe on 11 new screens in both themes and densities; keyboard checks for answering a comment, turning a feature on and undoing it, and focus kept in the Add a user sheet; 200% zoom on Users, Add a user, Comments, Classic Monks and its activity. |
| `6c4360e` | **fix(ui):** after Undo in the notice, Features and Settings read the site again. The option went back on the site but the list still said On (found live). |
| `1990864` | **fix(core):** a site's error messages lose their HTML, on both the MCP and the REST path. The reset email failure showed `<strong>Error:</strong> … <a href=…>` (found live). |
| `4360111` | **fix:** adding a user and emailing the reset link are two steps. A failed email came back as a failed add, and the sheet stayed open to add the same user again (found live). The sheet now closes, and the note says the user was added and the email didn't go out. |
| `5c2e52c` | **test(core):** acceptance driver: `users`, `add-user`, `set-role`, `delete-user`, `reset`, `comments`, `moderate`, `reply`, `login-check` (uses the link like a browser and never prints it), `agent`, `features`, `set-feature`, `undo`, `activity`, `approvals`, `settings`. |
| `e556cb1` | **docs(acceptance):** `docs/acceptance/phase-4.txt` and 14 real-app screenshots in `docs/acceptance/phase-4/`. |
| `766cdb4` | **docs(ux):** mock screenshots of the Phase 4 screens in `docs/ux/phase-4/` (26) and the checks in `docs/ux/README.md`. |

### Classic Monks Pro (`feat/monks-central`)

| Commit | Change |
|---|---|
| `1abde360` | **feat(mcp): M7.** New `send-password-reset` (`edit_user` checked; WordPress' own reset email; honours `allow_password_reset`; Monks Central connection only, `cm_operator_only`). `get-users` takes any role the site has (an unknown one gets `cm_user_role_not_found`) and returns `roles`: the roles the caller may hand out, none without `promote_users`. Delete with reassign was already in `delete-user` and is now tested. `tests/mcp/m7.sh` (26 checks; the email is caught by a `pre_wp_mail` mu-plugin); `annotations.snapshot`, `ci.sh` and the README updated. |

### Classic Monks Free (`feat/monks-central`)

| Commit | Change |
|---|---|
| `dc97ed6` | **feat(mcp): M7**, the same code in `functions/monks-central/abilities/` with the same `m7.sh`. |

## Checks (all local; GitHub Actions is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | pass |
| `cargo clippy --workspace --all-targets -- -D warnings` | pass, 0 warnings |
| `cargo test --workspace` | 90 passed, 0 failed (core 76, ipc 9, cli 3, autostart 2) |
| Core coverage (`cargo llvm-cov -p monks-core`) | 94.38% lines, 92.79% regions, 93.53% functions (bar: 80%); `people.rs` 99.81% lines, `control.rs` 99.41% |
| `tsc` (incl. e2e) and `tauri build` from the repo root | pass |
| `npm test` (Vitest) | 169 passed, 0 failed |
| `npm run e2e` (Playwright: axe in both themes and densities, keyboard, 200% zoom, text size) | 192 passed, 0 failed (108 skipped: screenshot specs, run only with `SHOTS`) |
| Classic Monks Pro `tests/mcp/ci.sh` (CM_PORT 8888, CM_WOO, CM_ELEMENTOR, Bricks zip) | 37 suites, 1051 pass, 0 fail, 0 skip (m7: 26) |
| Classic Monks Free `tests/mcp/ci.sh` (CM_PORT 8889, same flags) | 24 suites, 575 pass, 0 fail, 0 skip (m7: 26) |

## Live acceptance: all pass

Details are in `docs/acceptance/phase-4.txt`. The run used the app's default data folder and the
Studio sites mc-a, mc-b, mc-c and monks-central-test. The real app was the preview build of `main`.

- **One-click login, as yourself only:** on mc-a and monks-central-test the link shows only the form on GET, signs in on POST (302 to `/wp-admin/`, `Referrer-Policy: no-referrer`) as the grant's own user (admin, joy), and is refused the second time (403). The site's log shows "create-login-link" and "use-login-link" by Monks Central as that user. From the real app, "Log in to the dashboard" opened "Dashboard ‹ MC A" in the browser. An AI agent asking for a link is refused. mc-c (Basic mode) and mc-b (2.5.0) say plainly why they can't.
- **Approve a pending comment on 2 sites:** in the real app's Comments inbox (4 pending from 3 sites), Approve on mc-c's Guest Reader (REST) and MC A's Mira Patel (MCP). `studio wp comment list` shows both approved and the others still pending.
- **Toggle a Classic Monks module and undo it:** `enable_folder_manager` on mc-a turned on by the driver (option true, activity row 27) and undone from the app's Activity tab (option false, row says Undone). In the app, Folder Duplication and then Folder Manager were turned on and undone from the notice, with the option read on the site after each step.
- **Users:** on MC A, mira_editor's role changed Editor to Author. A throwaway user was added (Studio can't send mail, so the window says the email didn't go out), given a draft, then deleted with the draft handed to admin. The same add and delete with reassign worked on mc-c over REST.
- **Approvals:** a throwaway AI-client connection on mc-a asked for a settings change and was told to wait for approval. The app listed it with its time left and opened the site's own approve page. It was then declined, the setting never changed, and the connection was revoked.
- **End state:** all 4 sites connected with health Ok. mc-a, mc-b and monks-central-test have 1 Monks Central OAuth grant each; mc-c has its one application password. The approved comments, mira_editor and the reassigned drafts stay on the sites.

## Open questions, decided

- **Approvals are decided on the site only.** The app lists what is waiting and opens the site's approve page. There is no approve tool, so an AI app (or Monks Central itself) can never approve its own change.
- **Password reset only where the site has M7.** Older Classic Monks and Basic mode don't offer the button. The Add a user sheet says to use "Lost your password?" instead, and a new user is never given a password anyone sees.
- **Add and reset are separate calls.** The user is added first and the email follows, so a mail failure can't hide a user that was created.
- **Roles:** the site's own assignable roles with M7. Older Classic Monks and Basic mode fall back to WordPress' core roles plus any the site reports.
- **Caps:** 50 users per site per search and 100 comments per site per list. The window says when a site has more ("search to find the others", "deal with these to see the rest").
- **Locked features stay locked.** Security and login features show "Locked" and change only in WordPress, so a mistake from the app can't lock anyone out.
- **Settings shows only `hq_editable` settings.**
- **Writes are direct, not jobs.** Each change touches one thing on one site and comes back with its result (and an undo row where the site logs one). Jobs stay for fleet changes.
- **Login links are opened only on the site's own scheme, host and port.**
- **`confirm_admin_role` is sent when adding a user.** The person picks the role in the window, which warns when the role can run the site, so that is the confirmation.
- **mc-b (Classic Monks 2.5.0) has no one-click login.** It needs a newer Classic Monks.

## Notes

- Undoing a feature change adds two rows to the site's log ("Undo operation" and the "Update features" it replays). That is how Classic Monks logs an undo; it was left as is.
- After Undo or a moderation, the notice above the list pushes the rows down by one line. Nothing breaks, but a fast second click can land one row higher than intended. Left for the UI review phase.
