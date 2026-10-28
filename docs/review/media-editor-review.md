# Media and editor review: findings and fixes

A strict code and security review of the media manager and full-page editor, run on 2026-10-29 before
v0.3.0. The spec is the plan `media-and-editor-plan.md`. It covers:

- everything on `feat/media-editor` against `main` in this repo (`crates/core`, `crates/app`, `ui/src`)
- the plugin commits on `feat/monks-central` since 2026-10-28 18:00 in classic-monks (Pro) and
  classic-monks-free (Free): `upload-media`, `get-media`, `update-media`, `replace-media`,
  `restore-replaced-media`, `get-acf-fields`, `update-acf-fields` and the editor fields

The areas were:

- file handling: types, size limits, path traversal, chunk reassembly, replace backups
- XSS from TinyMCE content and ACF values shown in the app, and the CSP with TinyMCE
- capability checks, agent refusals, Undo, races, error messages
- accessibility of the editor and media screens

Three reviewers read the code separately (the app's Rust, the UI, the plugins). Then every phase's live
acceptance was run again, plus the media and editor flows and a hostile-content check in the real
window. Every finding below marked with a commit has a test in that commit. The live results are in
`docs/acceptance/media-editor-review.txt`.

## Severity key

| Level | Meaning |
|---|---|
| High | A change can land on a site or item the person didn't pick, or a secret or the person's control can leak. |
| Medium | Wrong data, lost edits, a way around the operator-only rule, or site content that can take over the window. |
| Low | A wrong message, a weaker check than it should be, focus or announcements, or defence in depth. |

## Monks Central (`feat/media-editor`)

### Writes on the right site and the right item

| Sev | Finding | Fix |
|---|---|---|
| High | The media library and picker kept whichever answer came last. If you switched from a slow site A to site B and A's page arrived second, A's items showed under B. Save, Replace and Trash then sent A's ids to B, changing B's attachments that happened to share those ids. A picker search or Load more had the same race. | `e3c0b3b`: both keep only the newest answer (a request counter). Tests: a slow site's library never shows under the next site; the picker keeps the newest search. |
| Medium | An ACF save's Undo was looked up as the newest `update-acf-fields` row with the same first field key. Field keys belong to a group, so another entry's save could be picked, and Undo reverted the wrong entry. A failed lookup after a good save also reported the save as failed. | `8018d18`: the row must also have this entry's `post_id`; a failed lookup only loses the Undo. Live: row 185 on post 40, Undo put the old values back. |
| Medium | Changing "Sites to show" closed an open editor with no question, and the editor then opened the same id on the next site. | `1f0fd96`: the select asks first, like the rail; an open editor belongs to its site and closes when that site leaves the list. Unit and Playwright tests. |
| Low | An upload the site took could still come back as an error: a reply without an attachment id, or a failed caption. Trying again added the file twice. A bulk trash that failed after the first 50 lost the items already moved and their Undo. | `177068d`: a missing id is said plainly, and the details are best effort. A partial trash keeps what moved and lists the rest with the reason. |
| Low | The month filter was checked but sent as typed (`2026-1`, `2026-+3`). Any 400 in Basic mode read as an empty page. An absurd page number could overflow. | `177068d`: sent as `YYYY-MM`; a 400 is an empty page only after page 1; `saturating_mul`. Live: `2026-10` finds the new upload. |
| Low | A long file name was cut at 200 characters, sometimes through the extension. A `;` in a picked name cut the name short in Basic mode (WordPress splits `Content-Disposition` on it). | `177068d`: the extension is kept; `"` and `;` become `_`. Live: `rv "evil";name.png` arrived on mc-c as `rv-_evil__name.png`. |

### Agents and the operator-only rule

| Sev | Finding | Fix |
|---|---|---|
| Low | `agent_call` trusted the site's tags for the file tools. The plugin hides `cm_operator_only` tools from an agent's grant, so this wasn't reachable, but the app had no rule of its own. | `f5d42cd`: agents are refused `upload-media`, `replace-media` and `restore-replaced-media` by name: "Files are only uploaded or replaced in the Monks Central app." Live: `claude -p` and the socket got that answer on MC A. |

### Site content in the window (XSS, CSP, navigation)

No script ran from site content. TinyMCE's parser drops event attributes, `<script>`, `javascript:` and
obfuscated variants. `safeHtml` rebuilds a text block's preview from an inert document. ACF values,
labels and media titles render as React text. The CSP is unchanged from `main`: `default-src 'self'`
with `'unsafe-inline'` only in `style-src`. In the real window, a draft post and ACF fields holding
`<img onerror>`, `<script>`, `javascript:` links and an outside `<iframe>` left the window title as it
was, and loaded nothing. Inline colours still show, so the CSP needs no nonce change.

| Sev | Finding | Fix |
|---|---|---|
| Medium | TinyMCE's inline mode puts site HTML in the app's own page. A post with `position: fixed; inset: 0` could cover the whole window, for example with a fake "paste your app password" box, and whatever was typed was saved into that post. | `fd7dbe0`: `.rte-body` and `.blk-text` get `position: relative; contain: paint`, so fixed content stays in the editor's box. Playwright test; live: the overlay stayed inside the editor. |
| Medium | A text block's preview kept `https:` and `/` links live until TinyMCE started. A click could take the whole window to another page, with no way back. | `fd7dbe0`: the preview has no `href`. `8b3f206`: the webview may only go to the app's own pages (an `on_navigation` guard; the dev server only in debug builds). |
| Medium | TinyMCE's default `sandbox_iframes` added `sandbox=""` to iframes such as maps and forms. Fixing a typo saved the body, and broke those embeds on the live site. | `899ad22`: `sandbox_iframes: false`. Remote frames still can't load in the app, because of the CSP. |
| Low | Preview and other site links were https only, so they failed on http test sites. | `cbbbd64`: http is allowed when the link is checked against a site added over http; everywhere else stays https. |

### Lost or stale edits

| Sev | Finding | Fix |
|---|---|---|
| Medium | Anything typed while a save was on its way was dropped, because the answer refilled the page. | `501ca45`: the form is `inert` and `aria-busy` while saving, and focus comes back after. |
| Medium | Repeater rows were keyed by position, so after Move or Remove each wysiwyg kept the wrong row's text, and one row could overwrite another. After an ACF Undo or "Open the site's version", the editors still showed the undone text and saved it again. | `455a4e6`: rows have stable ids that move with them; the ACF groups remount when they are read again. |
| Low | ACF saves had no conflict check: they could overwrite a value changed on the site since the page opened. | `e580e14`: the save reads the fields first and refuses if a value it would write changed. The toast offers "Open the site's version". |
| Low | A text block whose editor failed to start stayed read-only with no word. An editor that started after its block went away stayed on the page. Keys typed before the editor was ready were lost. | `e45573b`: `aria-busy` while starting, "The editor didn't open: …" as an alert, and a late editor is removed. |

### Accessibility and wording

| Sev | Finding | Fix |
|---|---|---|
| Low | Opening the editor left focus on `<body>`. Remove row lost focus. The media picker's error was not announced. | `37d6fbb`: the heading takes focus; Remove row moves focus to Add a row; the error is `role="alert"`. |
| Low | The Media screen's Load more added items without a word to a screen reader. | `4905cbe`: the "N of M items" count is a polite live region. |
| Low | Found in the live run: the editor opened from Search everything said "Back to posts", but it goes back to the results. | `1cc2914`: "Back to the results". |

## Classic Monks (`feat/monks-central`)

| Sev | Finding | Fix |
|---|---|---|
| Medium | The operator-only rule was enforced on the MCP route only. The wp-admin AI chat lists and runs abilities through core's `wp-abilities/v1` REST routes, so its agent could call `replace-media`, `restore-replaced-media`, `update-media` and `update-acf-fields` with no approval. In Free (no chat) a plain app password could, so it is Low there. | Pro `d0ddd4dd`, Free `7ec3135`: one `wp_pre_execute_ability` check refuses `cm_operator_only` writes on the REST routes unless the request is the Monks Central operator; the chat also leaves them out of its list. Live: refused to a plain app password on mc-a. |
| Medium | The replace swap deleted the old files before it recorded the new backup and never checked the final move. A timeout while making thumbnails left the backup pointer on an older file, and a failed move left the item pointing at nothing. | Pro `2fa8ef84`, Free `126c8cc`: the backup is recorded first, the move is checked and rolled back on failure. |
| Low | Two replaces or restores of one item at the same time could each delete the other's file. | same commits: one swap per item at a time (a lock option, stale after 5 minutes). |
| Low | The backup path came from post meta as stored. Anything else that wrote that meta could move or delete any file (`../../wp-config.php`). | same commits: the path must be inside `cm-replaced/<id>/` with no `..`, at restore and at delete. Test: a backup path outside its folder is refused and nothing moves. |
| Low | `cm-replaced/` had no index file, so a host with directory listing on showed old files. | same commits: an `index.html` is written there. |
| Low | Undo of `update-media` and `update-acf-fields` restored old values over a newer edit. | Pro `f7709f8c`, Free `d0619d3`: a preview callback records the values, and Undo is refused if they changed since. Live: refused after the caption was changed on the site. |
| Low | ACF fields a site hides with `acf/prepare_field` were listed and writable. | Pro `a888e609`, Free `9cabd0e`: skipped, as on the edit screen. |
| Low | The parent choices listed titles of other people's drafts and private entries. | Pro `32175e9b`, Free `c57e4ad`: only entries the user may read. |
| Low | Free's SVG refusal said "imported from a URL" for an upload or a replace. | Free `95d2481`. |
| Low | Found in the live run: a refused Undo said "changed again after the AI change" when the person had made the change in the app. | Pro `608b6865`: "This was changed again since, …". Free has no undo. |
| Low | Found in the live run: the type refusal read "A image/jpeg file can only be replaced by an image or a file of the same type". | Pro `1322b875`, Free `f9ef302`: "This image can only be replaced by another image, not application/pdf." A non-image names its own type. |

Checked and sound in the plugins: images are typed by their content and other files by WordPress's own
check. `x.php.jpg` becomes `x.php_.jpg`, and a `.php` upload is refused (live). The size cap applies to
the running total. Chunks out of order are refused, and a repeated offset is ignored. Upload ids are 20
random characters tied to the user. Abandoned uploads go after an hour. Media writes need `upload_files`
and `edit_post` on the item. ACF reads and writes are limited to the entry's own groups and editable
types. Strings go through kses for users without `unfiltered_html`.

## Decisions (not changed)

- **Memory for large uploads (Medium, plausible).** The window sends a file as one base64 string. A
  256 MB file can briefly hold about 1 GB in the core. Only the window can send files, so this is not a
  security issue. It is marked `shortcut:` at `MAX_FILE` in `media.rs`. Stream chunks from the window if
  bigger files or low-memory machines matter.
- **"Undo the replace" calls `restore-replaced-media` without a token (Low).** If someone else replaced
  the file after you, Undo swaps in their earlier file. The swap can be undone again, and the activity
  log's Undo does check the token.
- **"Open the file" on the Media screen is https only (Low).** It isn't checked against the site's
  host, because a media file can sit on a CDN.
- **Plugin `copy()` and `rename()` warnings are not silenced (Low).** With `display_errors` on, they could
  show server paths in a REST reply, as other WordPress code does. Production sites have it off.
- **A Stop pressed before the upload command registers is lost.** Stop during the last chunk lets the
  upload finish. The window shows the result either way.
- **TinyMCE 7.9.3 and GHSA-mf2p-h6hf-fcwm** (Dependabot, moderate). The advisory is in TinyMCE's media
  plugin, which is never loaded. Move to the patched 7.x when it is published on npm (unchanged from
  app-editor).
- **Hostile-content fixture kept.** Draft post 89 on mc-a holds the payloads used for the window check.
  They only set the page title, so it is safe to keep for the next review.

## What was not checked

- Windows and macOS webviews: the navigation guard and the containment were checked on WebKitGTK only.
- Very large files (over 100 MB) were not uploaded live. The chunk path was run with 1.6 and 2.4 MB
  files (2 and 3 chunks).
- ACF Pro itself: the Pro-only types were checked with Secure Custom Fields on monks-central-test.
