# Step 1: plugin-media-acf

Run 2026-10-28/29. Plan: `media-and-editor-plan.md`, step 1. The plugin work is on `feat/monks-central` in Classic Monks Pro and
Free (never main). The app branch `feat/media-editor` was made from `main` and pushed; its only change in this step is a
driver verb for the live checks.

## What changed

New and extended abilities, the same in Pro and Free (Free's copies differ only in the phpcs header, single-string
descriptions for Plugin Check, and helper paths):

| Ability | What it does | Who |
|---|---|---|
| `upload-media` (extended) | Takes any file type the site allows (PDFs, documents, video), not only images. Images keep content sniffing and SVG sanitizing (Pro) or refusal (Free). Other files go through core's `wp_check_filetype_and_ext`. | operator only, as before |
| `get-media` (extended) | Each item adds `author`, `author_id`, `caption`, `description`, `file_name` and `usage`. The reply adds `allowed_types` (extension to MIME) and `upload_limit` (bytes). New inputs: `id`, `month` (YYYY-MM), and `usage` (off by default because it reads post content). Usage counts posts and pages, not revisions, that use the item as the featured image or in the content (`wp-image-ID`, a block `"id":ID`, or the file name of any size). | read, `upload_files` |
| `update-media` | Alt text (`_wp_attachment_image_alt`), title, caption (excerpt) and description (content). Only the fields sent change. Post fields go through `wp_update_post`, so kses applies. Undo restores the earlier values. | operator only; `upload_files` + `edit_post` on the attachment |
| `replace-media` | Chunked like `upload-media` (same chunk helper and protocol, plus `id` on every call). The attachment ID stays the same. By default the URL stays too: the old name is kept, with the new extension if the type changes; `keep_name` uses the new file's name instead. Images (not SVG) replace images; other files only the same MIME type. Sizes and metadata are made again, old sizes are deleted, and page caches are flushed. When the Replace media module is loaded, its `?ver=` cache busting is used. The old original is kept as one backup in `uploads/cm-replaced/<id>/<token>-<name>` until the next replace. Deleting the attachment deletes its backup. | operator only, never an agent tool |
| `restore-replaced-media` | Swaps the backup back in; the current file becomes the backup, so running it again swaps back. Undo of a replace or a restore is the same swap, refused if the file was swapped again since (backup token check). | operator only |
| `get-acf-fields` | Field groups for the entry from ACF's own API (`acf_get_field_groups(['post_id', 'post_type'])` + `acf_get_fields`). Each field has key, name, label, type, instructions, required, `editable`, settings (choices, limits, formats, post types, taxonomy and so on) and the raw value as ACF stores it (sub-fields and repeater rows keyed by field key). `refs` gives titles and URLs for the media, posts, terms and users the values point at, minus what the user can't read. Layout types (tab, accordion, message, separator) are left out. | read, `edit_post` |
| `update-acf-fields` | Saves through `update_field()`. Every value is checked with `acf_validate_value` first; if one fails, nothing is saved, and the messages come back as plain text naming the field ("Email: 'nope' is not a valid email address"). Only fields of the entry's own groups can be written. Flexible content, clone and unknown types are read-only ("can only be changed in WordPress"). Undo restores old values and deletes fields that had none. | operator only; `edit_post` |

Both ACF abilities register only when ACF (free or PRO) or Secure Custom Fields is active. Without them the tools are
not listed at all, so the app can hide the ACF section.

Every write is logged in the activity log. Pro keeps undo data and undoes through `undo-operation` / the app's Undo.
Free keeps the same undo data for Pro, since Free has no undo. Pro's log no longer copies a chunk's base64 `data`
into the undo copy of the input.

### Commits

Classic Monks Pro (`feat/monks-central`):

| Commit | Change |
|---|---|
| `b448f42a` | feat(mcp): upload-media takes any file type the site allows (`cm_ai_prepare_media_file`) |
| `75afd960` | feat(mcp): get-media details, usage, allowed types, upload limit, `id` and `month` |
| `85244995` | feat(mcp): update-media |
| `204380a8` | feat(mcp): replace-media and restore-replaced-media; the activity log drops chunk data from the undo input copy |
| `0daec23f` | feat(mcp): get-acf-fields and update-acf-fields |
| `10ab64bf` | test(mcp): media2.sh, acf.sh, acf-fixture.php; ci.sh and README |
| `57ccd5e4` | feat(mcp): replace-media flushes page caches and uses the Replace media cache busting (`update_recently_replaced` made public) |
| `d7b1f6c0` | test(mcp): media2 follows the site's upload rules for HTML named .pdf (Bricks turns the content check off) |
| `d4266231` | test(mcp): updates.sh offers its fake theme update on twentytwentyfour (Bricks's own updater now reports its real 2.4.4) |

Classic Monks Free (`feat/monks-central`): `04e2385` upload-media, `f63dc1a` get-media, `186e0ce` update-media,
`241b71d` replace-media and restore (includes the cache flush and the public `update_recently_replaced`), `c4b1d08` ACF
abilities, `fc48d20` suites, `d0d3e33` media2 Bricks rule, `ebefea6` updates.sh theme offer.

monks-central (`feat/media-editor`): `666c438` test(acceptance): the `ability <url> <tool> [json]` driver verb calls
any Classic Monks ability as the operator (used for the live checks below).

## Tests

Full `tests/mcp/ci.sh` with `CM_WOO=1 CM_ELEMENTOR=1 CM_BRICKS_ZIP=bricks-2.4.3.zip`, WordPress 7.1.3:

| Repo | Port | Result |
|---|---|---|
| Pro | 8888 | All 42 suites passed, 1356 checks, 0 failures |
| Free | 8889 | All 28 suites passed, 835 checks, 0 failures |

The new suites have 79 checks in `media2.sh` and 61 in `acf.sh`, the same in both repos. Free's copies run undo
through each ability's undo callback on the logged data, since Free has no `undo-operation`.

- `media2.sh` covers:
  - Uploads of a JPEG and a PDF; PHP is refused.
  - `get-media` by id: author, file name, dimensions, size, allowed types, upload limit.
  - Usage counts: 0, then 2 (a featured image and an inline block; a near-miss id isn't counted). Month filter and a bad month.
  - `update-media`: fields, plain-text alt, clearing, undo.
  - Refusals: a post id, and an author on media that belongs to someone else.
  - `replace-media`: same ID, same URL and new bytes; sizes made again, with no old size files left. The backup is the old file, and the undo row stays small.
  - Restore and swap back. Undo of a stale replace is refused; undo of the restore works; one backup on disk.
  - jpg to png keeps the name with the new extension; undo brings the jpg back. `keep_name` uses the new file name.
  - Type rules: image to PDF and PDF to image are refused; PDF to PDF works. No-backup refusals.
  - An upload started for one item can't finish on another.
  - Deleting the item deletes its backup.
- `acf.sh` covers:
  - Without ACF the tools are not listed. With ACF free from wordpress.org, `get-acf-fields` is listed and `update-acf-fields` is operator only.
  - Only the entry's groups are returned: 27 value fields, no layout fields. Required flag, settings and sub-fields come with each field.
  - Saving 11 fields by key or name. Checks: ACF's reference meta is written; values come back keyed by field key; refs for an image, a post, a term and a user.
  - Validation: email, required, number max and a group sub-field. Nothing is saved when one fails.
  - Refusals: another group's field, an unknown key, a read-only type, `_edit_lock`, empty fields, a contributor.
  - Undo of two saves.
  - Then Secure Custom Fields: repeater and gallery editable, flexible content read-only. Rows saved and read back, a required sub-field inside a row is checked, and the rows are undone.
- `acf-fixture.php` makes the "every type" field group for the suites and for Studio sites.

Plugin Check (`wp plugin check`, as the Free workflow runs it) reports nothing on the new and changed Free files. Its
older warnings in `functions/performance/media/replace-media.php` are unchanged.

App: `cargo fmt --all --check`, `cargo clippy --workspace --all-targets -D warnings` and `scripts/check-headers.sh`
are clean after the driver change. No UI or core code changed in this step, so the UI suites were not run.

## Live (Studio, app's default data folder)

The Pro branch was rsynced onto mc-a and monks-central-test (no deletes; .git and tests left out). Then the checks
ran through the app's own operator grant, with the new acceptance `ability` verb:

- **mc-a, media.** `get-media` with usage: 4 items, upload limit 2 GiB, 96 allowed types. Uploaded `monks-live-photo.jpg`
  (ID 39) and set its title, caption and description. `replace-media` with an 800×600 JPEG: same ID and URL, and the
  bytes on the site match the new file (md5). Restore brought back the 640×480 file (md5 match); restoring again swapped
  back to 800×600 with the backup kept. The app's Undo (activity row 120) put the details back. Undo of the earlier
  replace was refused: "This file was replaced or restored again since, so this change can no longer be undone." The
  details were set again and kept.
- **mc-a, ACF.**
  - ACF free 6.8.10 from wordpress.org is installed. The field group "Monks test fields" (`group_monks_test_fields`, on posts) has one field of every type ACF free has and Monks Central edits. That means 26 editable fields, including a group, plus oEmbed shown read-only, a tab and a message.
  - "Monks test fields post" (ID 40) is filled in. `get-acf-fields` returns 27 fields, with refs for 1 image, 2 posts, 1 term and 1 user.
  - A save with a bad email and number 12 was refused with "Email: 'not-an-email' is not a valid email address" and "Number: Value must be equal to or lower than 10", and nothing was saved.
  - The textarea, select and group were saved. The app's Undo (row 129) restored them, and they were saved again and kept.
- **monks-central-test.**
  - Secure Custom Fields is installed with the same group, which there also has a repeater, a gallery and flexible content. `get-acf-fields` lists 30 fields; flexible content and oEmbed are read-only.
  - "Monks test fields post" (ID 20) is filled in, and the uploaded `monks-live-photo.jpg` (ID 19) is used in its image fields.
  - A repeater row with an empty required label was refused ("Label value is required"). Three rows were then saved and read back on the site.

Test data is kept: the uploads, their backup, both field groups and the edited posts.

Before the live run, mc-a and monks-central-test answered every request with a PHP fatal. Their Studio PHP servers had
been started on Oct 27 with an `auto_prepend_file` in another tool's scratch folder (`~/.hermes/.../studio-siteurl-prepend-oQrguj/prepend.php`),
and that folder has since been deleted. Restarting both sites (`studio stop` / `studio start`) fixed it.

Separately, the app's saved sign-in for mc-a, monks-central-test and mc-b would no longer open, so the app showed "Sign
in again". The credentials were rewritten at 15:34 UTC on Oct 28, before this run. I signed in again on mc-a and
monks-central-test; each has one Monks Central grant. **mc-b still says "Sign in again"**; I left it alone because this
step doesn't use it. The preview app was stopped for the live run and relaunched afterwards.

## Decisions

- **ACF free has no repeater, gallery, flexible content or clone; those are ACF PRO only.** So on mc-a the "every type"
  group has everything ACF free offers, including a group, but no repeater. The repeater, gallery and flexible content
  live on monks-central-test through Secure Custom Fields: the wordpress.org fork, with the same `acf_*` and
  `update_field` API. `acf.sh` tests both plugins.
- `replace-media` does not call the existing wp-admin Replace media module (`CM_Media_Replace::replace_media`). That
  module needs a second attachment and keeps no backup. Only its cache flush and `?ver=` stamp are reused.
- The type check follows the site's own upload rules, as wp-admin does. Bricks turns WordPress's content check off for
  every upload, so on Bricks sites a file is typed by its extension. Images are still sniffed and SVG is still
  sanitized (Pro) or refused (Free).
- `get-media` usage is opt-in (`usage: true`) because it reads post content: one query per item. Page builders' own
  data (Elementor, Bricks) is not read, so their uses are not counted.
- The ACF validation errors are joined into the error message (one line per field); the error data has `errors`
  (`field`, `message`) too.
- Reads (`get-media`, `get-acf-fields`) stay available to AI clients with the scope; every new write is operator only.
- For the app steps: Free has no `trash-media` / `restore-media` (Pro only), so the library's bulk delete needs another
  way on Free sites, or Pro.
