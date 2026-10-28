# Final review: findings and fixes

A whole-product code review and hardening pass, run on 2026-10-28 after Phase 7. It covers:

- every crate (`crates/core`, `crates/cli`, `crates/app`)
- every UI module (`ui/src`)
- the Monks Central parts of both Classic Monks plugin branches (`feat/monks-central` in
  classic-monks and classic-monks-free)

It was read as a strict senior reviewer and a security auditor. The areas were:

- secrets and the keychain
- the IPC role model (D6)
- OAuth and login links
- SSRF, path traversal, injection, and XSS in rendered content
- unsafe Rust, panics, error handling and races
- migrations, dead code and flaky tests

Every finding below that says **fixed** has a test in the same commit. Live results are in
`docs/acceptance/final-review.txt`.

## Severity key

| Level | Meaning |
|---|---|
| High | A secret or the person's control can leak to a site, an agent or the network. |
| Medium | Wrong data, a crash, or a denial of service that a site or file can cause. |
| Low | A wrong message, a stuck screen, or a check that is weaker than it should be. |

## Monks Central (`main`)

### Secrets, OAuth and the network

| Sev | Finding | Fix |
|---|---|---|
| High | The addresses from OAuth discovery were stored as the site gave them: resource, token, registration and revocation endpoints. A site, or a proxy that hides HTTPS, could send tokens, codes and the bearer over plain http or to another host, and point the browser at any URL scheme. | `eca41f7`: `oauth::on_site` requires every address to be on the site's host, with the site's origin or https. The issuer is checked before it is fetched. |
| High | Basic mode used the REST root from the home page's `Link` header as given. A proxy that hid HTTPS made the app password go over plain http. A malformed header (brackets the wrong way round) panicked the sign-in. | `8349cce`: `connect::rest_root_from_link` keeps the site's origin and moves http back to https. It parses without slicing. |
| High | The site client used reqwest's default redirect policy: 10 hops, anywhere. reqwest drops `Authorization` on another host but kept `X-CM-Authorization`. A 307 from a token endpoint replayed the refresh token, code or Google client secret to the new host. | `d0638ed`: the site client follows same-host redirects only (http to https allowed). RDAP and Basic mode image import carry no credentials and use the probe client. |
| High | `normalize_url` took `http://` for any host, so the first request could carry an app password or token across the internet in cleartext. | `177462b`: http only for loopback, private addresses and local-only names (`.local`, `.test`, `localhost` and the like), as plan 5.5 says. |
| Medium | The loopback sign-in read had no timeout. An idle connection held up the real redirect for the whole wait, and a return with the wrong state ended the sign-in. | `e465f70`: 5 s per connection. A stranger gets a page and the wait goes on. |
| Medium | `now() + expires_in` panicked in debug and wrapped in release on a huge value, so the token always looked expired. | `2d0ea47`: one clamped helper (0 to 365 days) for Classic Monks and Google. |
| Medium | `monks doctor` made a master key outside the core lock. A core and a doctor that both found no key could each make one, which orphaned the core's records. | `4b5a6b8`: `vault::load_master_key` only reads. Doctor makes the key only while it holds the core lock. |

### The IPC role model (D6) and agents

| Sev | Finding | Fix |
|---|---|---|
| High | `plan.create` turned any job action into a plan, with labels the agent wrote. An agent could propose trash, publish, product or zip changes that read as something else, and install plugins from any link. | `dccc578`: `Action::agent_may_propose` allows only the plugin, theme, core and translation actions, plus installs by WordPress.org slug. `PLAN_MAX` is checked before any site lookup. |
| High | `agent_call` sent `create-login-link` through the agent grant. An approved call would hand the agent a link that signs in as the app's user. | `3bf01d3`: refused before any call: "Login links are only made in the Monks Central app." |
| Medium | The socket's accept loops (Unix and Windows) ended on their first error. The core then held the lock and answered nothing. | `734cc79`: wait 100 ms and carry on. |

### Jobs, races and panics

| Sev | Finding | Fix |
|---|---|---|
| Medium | Two jobs could change one site at once, so one safe update's home page check could roll back the other's good update. | `f111533`: a per-site lock runs them one after the other. |
| Medium | A saved change that no longer decoded ran as `update-translations` with the app's grant. A site task that panicked left its items "running" in a finished job. | `f111533`: the item fails with a reason and nothing is sent. Leftover items are marked failed when the job ends. |
| Medium | Two edits to one block cut the body at a place the first edit had moved. That could split a multi-byte character (a panic) or drop a closing tag. | `6468089` refuses it. `c9c259f` (found live) gives it its own message. |
| Medium | Basic mode image import read the whole download before it checked the size. | `8c867cb`: status, type and Content-Length are checked first, and the body is read in chunks up to 25 MB. |
| Medium | The PDF writer cut over-long words by re-measuring shorter and shorter copies, which is cubic: a 64 KB title held a worker for hours. WinAnsi 0x82 to 0x9F printed as `?`. | `ae0df30`: one pass, and the full WinAnsi table. |

### Injection, links and files

| Sev | Finding | Fix |
|---|---|---|
| High | The window's `browser()` opened any URL, so a site's sign-in details could name `smb:`, `file:` or `search-ms:`. `file_show` took any path. | `9cc3f0e`: http(s) only. `file_show` only shows files in Downloads. A search result's link must be on its own site. |
| Medium | CSV export wrote a site title such as `=HYPERLINK(...)` as a live formula. | `f69539d`: formula-like cells start with `'`, and import removes it. |
| Low | Import made a nameless client from a blank name, dropped costs for missing sites without saying so, and re-read every cost for every row. | `afebc8a`. |

### UI

| Sev | Finding | Fix |
|---|---|---|
| Medium | Content, Store, Users and Comments showed whichever answer came last. After a site switch, a slow reply from the old site showed under the new one, and ticking entries acted on the new site's posts with the old ids. | `9e23cbe`: only the newest request's answer is kept. The AI log no longer repeats rows. |
| Low | One click deleted a bundle, and a failed delete closed the editor. | `46c831e`. |
| Low | The Security mock's undefined answer made an unhandled rejection in tests. | `08c70fe`. |

### Reports

| Sev | Finding | Fix |
|---|---|---|
| Low | A past month's posts vanished once the site posted 20 more, because only the newest 20 were read. Uptime rows were kept 30 days. Logins and SEO were labelled as the month but counted back from today. "No known problems" was shown when a check hadn't answered. | `2e41c7a`: pages back by month, keeps 62 days, says "last N days", "latest" and "partly checked". |
| Low | The security line said "changed files in 0 places" next to a vulnerability. Found live. | `6aa0c3c`. |

### Flaky test (known item)

`net::tests::closed_port_says_could_not_reach` bound a listener, dropped it and connected to the
port. A parallel test could take the port in between. `b1de145` holds a bound socket that never
listens, so the port stays reserved and refuses connections. The OAuth refresh test had the same
pattern and is fixed in `eca41f7`. Results after the fix:

- `net::` and `oauth::` together: 40 runs in a row, 0 failures
- the full workspace: 5 runs, 0 failures

## Classic Monks plugins (`feat/monks-central`)

These changes are the same in Pro (classic-monks) and Free (classic-monks-free).

| Sev | Finding | Fix (Pro / Free) |
|---|---|---|
| High | `install-zip` and `set-maintenance-mode` were open over plain REST and to any MCP grant with the scope. | `00bdf9d9` / `7346fcc`: left out of REST, and they run only for an operator (Monks Central) connection (`cm_operator_only`). |
| High | Any client could be ticked as operator, including a web app with an https return address. Operator grants skip approvals and can make login links. The consent page didn't say that. | `a9fa065a` / `592f622`: `CM_MCP_OAuth::operator_possible()` allows http loopback only, checked in the view and on POST. The consent page now says "It can also open the dashboard signed in as you". More dangerous schemes are refused at registration. |
| Medium | A new post's custom fields skipped their own `auth_callback`, and a failed meta write left the post behind. | `7311f5a7` / `3589cc9`. |
| Medium | The refresh-token replay grace could grant before the rotation's own row existed. | `e9f8037d` / `30c479d`: it waits up to 2 s for it. |
| Medium | A chunk retry that raced the first try appended the chunk twice. | `ae170f86` / `0d6f1d1`: `flock` around the append. |
| Medium | `get-post-meta` showed protected fields to editors. | `61d5a95f` / `ac3616e`: protected fields are shown to administrators only. |
| Medium | The fatal check after a theme change fetched whatever URL the site's home option named (SSRF). | `3cfc486a` / `8239ea1`: only the site's own host. |
| Low | Array values in OAuth and MCP fields, such as `client_id[]=x`, became PHP warnings and `"Array"` in the consent form. | `f562be7a` / `2ad57a7`: they read as empty and give a clean OAuth error. |
| Low | Tests: `show_in_rest` expectations, and the operator suite's web-app check, which lacked the toolset it reads. | `8b62ca28`, `cc4e689f` / `4a3267d`, `a9a1fb6`. |
| Low | Free tracked a stray `get-http-status.php.orig`. | `adbda3f`. |

## Reviewed and found sound

- **Vault.** XChaCha20-Poly1305 with the record name as associated data, so a blob moved to
  another record doesn't open. Secrets are held in `Zeroizing`. There is one keychain item per
  data folder, and a keychain error never makes a new key. Nothing logs a secret. The acceptance
  transcripts were checked for tokens, nonces and cookies.
- **D6.** Every socket client is the agent role. No confirm, run or job method exists on the
  socket. These were checked live: `plan.confirm`, `plan.run`, `job.start`, `jobs.start`,
  `confirm` and `plan.decide` all return `method_not_found`, and `plan.create` with
  `confirmed: true` stays unconfirmed.
- **Login links.** They are made only for the app's own grant and used once. GET shows a form,
  POST signs in, and `Referrer-Policy: no-referrer` is sent. The window opens them only on the
  site's own scheme, host and port.
- **Rendered content.**
  - The UI has no `dangerouslySetInnerHTML`.
  - The report preview runs no scripts.
  - Site errors are shown without HTML.
  - Report HTML escapes every value.
- **Unsafe Rust.** Only in the Windows named-pipe security descriptor (`ipc.rs`): Win32 calls to
  build, read and free the descriptor, and `Send`/`Sync` on a descriptor the OS only reads. It
  isn't compiled on this machine (see Open items).
- **Panics.** The remaining `unwrap` and `expect` calls outside tests are on lock poisoning,
  serializing plain structs, the OS random source, and a JSON object the code just built.
- **Migrations.** `0001` to `0009` are forward only. The store refuses a data folder made by a
  newer schema.
- **Dead code.** clippy with `-D warnings` is clean.

## Decisions

### Should MCP `plan_changes` offer the Phase 7 actions? No.

The actions in question are `publish_post`, `set_post_status`, `trash_post`, `untrash_post`,
`update_product` and `install_zip`. They are kept out of `plan_changes`, and the core now enforces
this (`dccc578`) instead of only leaving them out of the tool's schema. The reasons:

1. **The labels would be the agent's own words.** A plan's labels and titles are what the person
   reads before Confirm. For plugin and theme actions, the core resolves the name and the from and
   to versions from the site's inventory, so the label can't lie. For content and products, the
   label would come from the agent's own text: a "trash" plan could name a different post than
   the id it carries.
2. **`install_zip` needs a person to pick a file.** The zip is staged in the data folder under
   its SHA-256 from a file the person chose. An agent has no such file to offer, and taking a path
   or a link from the agent would bring back the SSRF and path problems this review closed.
3. **The site's approval already covers content.** Agents with agent access can already change
   posts and products through `run_ability`, which the site holds for the owner's approval
   (proved live in Phase 5, op 80). A plan would add a second, weaker way in.

When to revisit: if agents need multi-site content changes, add them with labels the core reads
from the site (title by id) and a fresh check at confirm time.

### Other decisions

- `install-zip` doesn't need approval under skip-off, because only the operator connection can
  run it.
- Login links stay available to any operator grant, as the M3 design says. To stop a stolen
  operator token, the owner revokes the connection on the site.

## Open items (not changed, and why)

| Item | Why it is left |
|---|---|
| Windows named-pipe owner check | This machine has no MinGW, so the Windows target doesn't build here. The pipe's DACL (`D:P(A;;GA;;;<user SID>)`) already admits only the user. Build and run the owner check on Windows before a Windows release. |
| `SOCKET_METHODS` list | It documents the socket's methods. Dispatch doesn't read it; a test checks that it has no confirm method. Dispatch's own `method_not_found` is what enforces D6, and that was checked live. |
| Plans never expire | A plan that waits is harmless: it runs only on Confirm, and Confirm shows the current versions. An expiry would hide what the agent asked for. |
| Search Console | Tested against a local stand-in only, by the brief. Never run against Google. |
| Per-user upload cap for chunked zips | Only an operator can upload, and staged files are capped at 64 MB and kept a week. |
| Length caps on group, tag and note text | Only the person sets them, by typing or importing their own file. No site or agent can set them. |
| Free: phpcs ignores without justification | Style only: `file_put_contents` in upload-media, `base64_decode`, `@` calls, and the `.maintenance` include. |
