# Step 2: app-media

Run 2026-10-29. Plan: `media-and-editor-plan.md`, Part 1 (media manager). App branch `feat/media-editor`. No plugin
changes in this step: it uses the abilities from step 1 (plugin-media-acf) as they are.

## What changed

### Core (`crates/core/src/media.rs`, new)

| Method | What it does |
|---|---|
| `media(id, MediaQuery)` | One page of the library with search, type (`image`, `video`, `audio`, `application`), month (YYYY-MM), one `id`, and optional usage. Returns items, total, the site's allowed types and its upload limit. Classic Monks: `get-media`. Basic mode: `/wp/v2/media` with `context=edit`, `media_type`, `after`/`before` and `x-wp-total`. |
| `media_item(id, media_id)` | One item with its usage (posts and pages that use it). |
| `upload_media(id, name, bytes, Details, progress, stop)` | Classic Monks: `upload-media` in 1 MB chunks. Title and alt go on every call because the plugin reads them on the last one. Caption and description follow through `update-media`. Basic mode: one POST to `/wp/v2/media`, then the details. |
| `replace_media(id, media_id, name, bytes, keep_name, progress, stop)` | `replace-media` in chunks; the ID and, by default, the URL stay the same. Classic Monks only. |
| `restore_replaced_media` | `restore-replaced-media`: puts the earlier file back (Undo the replace). |
| `update_media(id, media_id, Details)` | Alt, title, caption, description. Classic Monks: `update-media`. Basic mode: POST `/wp/v2/media/{id}`. |
| `trash_media(id, ids, back)` | `trash-media` / `restore-media` (Pro, Media Trash module), with the skip reasons in plain words. |

Progress is a callback `(sent, total)`; Stop is an `AtomicBool` checked between chunks ("Stopped. Nothing was added.").
Files over 256 MB are refused in the core (the bytes are held in memory, see Decisions). The old `Media`/`media()` in
`content.rs` moved here; the test site fakes the chunk protocol, `update-media`, replace and restore, trash and restore,
and the REST media routes.

### App (`crates/app/src/main.rs`)

Commands `media_list`, `media_get`, `media_upload`, `media_replace`, `media_stop`, `media_update`,
`media_restore_file`, `media_trash`. Uploads and replaces take the file the person picked in the window, read there
as base64 (`fileBase64`). There is no path argument anywhere, so an agent can't point the app at a file on disk.
Progress reaches the window as `media-progress` events keyed by the window's upload key; `media_stop` sets that key's
flag. Every change is recorded in the app's activity like other human actions.

### Window

- **Media screen** (rewritten): head button "Upload files" opens the upload card above the library. Library card with
  site picker, search, type filter, "Uploaded in" month, Grid / List (remembered), bulk bar (only when the site has
  `trash-media`) with "Move to the trash" and Undo, "N of M items" and Load more.
- **Upload card**: several files at once (picker or drop), each with Alt text, Title and Caption, refusals before
  sending (empty, over the site's limit, a type the site doesn't take), one at a time with a progress bar and Stop,
  a toast per batch. Import an image from a link lives in the same card.
- **Details panel**: preview, facts (file, type, size, dimensions, uploaded, by, used in), address with Copy, the
  form (alt, title, caption, description) with Save and Discard and an Undo toast, Replace the file (FilePicker,
  "Use the new file's name", progress, Stop), Undo the replace, Open the file.
- **MediaPicker** (`components/MediaPicker.tsx`): search, thumbnails, Load more, Use, and upload-and-use with alt
  text and progress. The editor's featured image uses it now (the old `ImagePick` is gone); Add media and ACF fields
  will use it in app-editor.
- `FilePicker` takes several files (`onFiles`) and a hint. The empty month box says "Pick a month" in its name too
  (axe label-content-name-mismatch).

### Commits (monks-central, `feat/media-editor`)

| Commit | Change |
|---|---|
| `2381c60` | feat(core): media library commands: filtered list, chunked upload and replace with progress and stop, details, restore, trash |
| `f4dbc7b` | feat(ui): FilePicker takes several files; the empty month box says Pick a month in its name too |
| `4cb6acf` | feat(ui): media manager, details panel, replace and undo, bulk trash, media picker for the featured image; mock core, unit and Playwright screens |
| `9dadb0d` | fix(ui): the upload queue hides its Upload button once nothing is left to send (found in the live run) |
| `72b1131` | docs(ux): media screenshots in both themes |
| last | docs(pipeline): this report and status |

Classic Monks Pro and Free: no commits in this step.

## Tests

| Check | Result |
|---|---|
| `scripts/sidecar.sh` | built |
| `cargo fmt --check` | clean |
| `cargo clippy --workspace --all-targets -D warnings` | clean |
| `cargo test --workspace` | 150 passed (core 132, incl. 3 new media tests: chunked upload of 2.5 MB in 3 chunks with progress and Stop, filters, details, replace and restore, trash and back; Basic mode upload and details without replace; file, month and item helpers) |
| `tsc --noEmit` | clean |
| `vitest` | 20 files, 302 passed (new `Media.test.tsx`, 7 tests; `Content.test.tsx` updated) |
| Playwright (full: axe both themes, keyboard, zoom, native controls, no-shift, screens) | 476 passed, 1 failed: the perf budget "Sites with 300 sites" (120 ms against 100 ms, under load; see Decisions). `perf.spec.ts` alone: 3 of 3 passed |
| `scripts/check-headers.sh` | clean |
| `tauri build --no-bundle` | built (`target/release/monks-central`) |

Screenshots in `docs/ux/media/`, dark and light: `media` (grid and details), `media-list`, `media-upload` (queue
with alt text and a refused file), `media-replaced` (after a replace, with Undo the replace), `media-picker` (featured image).

## Live results

Release build from this branch, default data folder `~/.local/share/com.classicmonks.monks-central`, driven by hand in
the real window (files picked in the GTK file chooser). Checked with `studio wp` (`get_posts`, alt meta,
`wp_get_attachment_url`, `md5_file(get_attached_file())`) and by fetching the URL.

| Step | mc-a | monks-central-test |
|---|---|---|
| Upload 3 images with alt text (garden-bench, harbour-dawn 2.6 MB in 3 chunks with a live bar, market-stall) | IDs 73, 74, 75; alt texts saved; md5 of each file = the local file | IDs 61, 60, 59; same |
| Edit title and caption of market-stall | "Market stall on Saturday" / "Fresh fruit every Saturday morning"; Save toast with Undo | same |
| Replace with market-stall-v2.jpg ("Use the new file's name" off) | URL stays `.../2026/10/market-stall.jpg`; file md5 and served bytes `1450424b…` (new) | same |
| Undo the replace | file md5 and served bytes back to `a139eea7…` (original) | same |

The test data stays on both sites (3 uploads each, the edited title and caption, and the replace backup).

## Decisions

- **Restore = Undo on the trash toast.** `get-media` lists only `inherit` items, so the app can't list the trash.
  Restoring later from the trash is left to WordPress.
- **Trash only with Pro's `trash-media`** (Media Trash module). Without it the bulk bar is hidden; the app never
  deletes media for good.
- **Basic mode** (no Classic Monks): list, upload and details only. Replace, trash and usage need Classic Monks and
  say so.
- **256 MB cap in the core**: the window reads the file as base64 and the core holds it in memory before chunking.
  Marked `shortcut:` in `media.rs`; stream from the window in chunks if larger files are needed.
- **Usage only in the details panel** (one `get-media` with `usage` for one item), not in the list, because usage reads
  post content.
- **Sizes in binary units** like WordPress (1 MB = 1024 KB), so the limit matches what the site says.
- **Progress through global events** keyed per upload, so the picker and the upload card share one listener hook.
- **Title, alt and keep_name on every chunk**, because the plugin reads them on the last call.
- **Upload card opens from the head button** above the library; the details panel stays on the right.
- **Perf flake**: "Sites with 300 sites" fails now and then under load; it fails the same way on `main` (2 of 3 runs
  in a clean worktree), so it is not from this step.
