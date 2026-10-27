# Phase 3: Content

Run 2026-10-28 on `main`. Plan section 5 and the Phase 3 feature map row (post types, list and
filter, read, create, edit title/body/status in block-safe mode, terms, featured image, media
library with import from a link, trash), plus ticket M6 on both plugin branches. The live acceptance
passes: a custom post type entry was created with an existing and a new term, a Gutenberg page had
two text blocks edited with every block name and attribute unchanged, and Elementor and Bricks pages
were detected and their bodies refused while their titles could still change, with the builder data
unchanged. The created content is left on the sites. The live run found three real bugs (one in
Classic Monks, one in the UI, one in the app). All three are fixed below.

## What changed

### monks-central (`main`)

| Commit | Change |
|---|---|
| `e783327` | **feat(core):** block-safe body editing (`blocks.rs`). Parses Gutenberg block comments by hand, lists every block with its depth, and lets only the inner text of text blocks change (paragraph, heading, list item, preformatted, verse). Every block name, attribute, closer and void block has to stay the same, or the edit is refused before anything is sent. Classic (blockless) bodies are one editable block; stray top-level HTML between blocks is kept and locked. |
| `536cf1c` | **feat(core):** posts, pages and custom post types (`content.rs`): post types with their taxonomies, a page of entries (status filter, search, 20 a page, total), one entry with its terms, featured image, builder and blocks, terms by search, create, edit, trash, the media library and import from a link. Classic Monks over MCP (needs M6 `list-post-types`) or core REST in Basic mode. Edits are refused if the entry changed since it was opened, and the body is read back after saving: if the site changed the block structure, the user is told. Elementor and Bricks pages keep their body. |
| `ac9ea19` | **fix(core):** "Check" on a Classic Monks site reads its tool list again, so a site updated to M6 gets its content tools without being added again. |
| `5c71700` | **feat(app):** window commands `content_types`, `content_list`, `content_get`, `content_terms`, `content_create`, `content_edit`, `content_trash`, `media_list`, `media_import`. |
| `3afc327` | **feat(ui):** Content and Media screens. Content: site picker, one button per post type, status filter, search, paging, and an editor sheet with title, status, terms (existing or new names, as chips), featured image (pick from the library or remove), the body as one field per text block with every other block shown as "Kept as is", a locked note on builder pages, and Move to the trash with a confirm step. Media: browse and search the library with alt text shown, import an image from a link with alt text. Vitest tests in `Content.test.tsx`. |
| `7c728c0` | **test(ui):** mock core content and media data; axe on 8 new screens in both themes and densities; keyboard check of the editor (open from a title, type in a block, Tab stays in the sheet, Esc gives focus back); 200% zoom on Content, the editor and Media. Selects wrapped in their label now carry `aria-label` (Chromium read the options into the name). |
| `748b573`, `c1b9a10` | **docs(ux):** mock screenshots of the Phase 3 screens in `docs/ux/phase-3/` (20). |
| `aa188e1` | **test(core):** acceptance driver: `types`, `get`, `create`, `edit`, `import` (JSON in, JSON out). |
| `3c551f9` | **fix(ui):** content titles were cut at 200px in a wide column (found live). |
| `c404ce7` | **fix(app):** the window's content security policy allowed only the app's own images, so featured images and the media library were broken in the real app (found live; the mock e2e uses `data:` images). `img-src` now also allows http and https; scripts and connections stay limited to the app. |
| `8c34a08` | **docs(acceptance):** `docs/acceptance/phase-3.txt` and 10 real-app screenshots in `docs/acceptance/phase-3/`. |
| `fd785f9` | **docs(ux):** Phase 3 checks and the select naming rule in `docs/ux/README.md`. |

### Classic Monks Pro (`feat/monks-central`)

| Commit | Change |
|---|---|
| `cd74f538` | **feat(mcp): M6.** `create-post` and `update-post` take `terms` for any taxonomy (ids, or names that are made when the caller may add terms), `meta` (custom fields; protected meta refused, `edit_post_meta` checked) and `date`. `update-post` refuses a body write on Elementor and Bricks pages (`builder_page`), and sets or removes the featured image. `get-post-by-id` returns terms by taxonomy, the featured image id and the builder. New tools: `list-post-types`, `list-revisions`, `restore-revision`, `untrash-post`, `upload-media` (base64 in chunks of up to 2 MB, resumable by offset, idempotent on retry, images only with the same hardening as import, alt text). The five new tools are for the Monks Central connection only (`cm_operator_only`), see below. `tests/mcp/m6.sh` (66 checks) runs over an operator grant; `annotations.snapshot` and `ci.sh` updated. |
| `a6fadcc4` | **fix(mcp):** `list-post-types` offers only types with a body editor. WooCommerce orders and coupons and Elementor templates showed up as content (found live). Test in `m6.sh`. |

### Classic Monks Free (`feat/monks-central`)

| Commit | Change |
|---|---|
| `f8e5393` | **feat(mcp): M6**, the same code in `functions/monks-central/abilities/` with the same `m6.sh`. |
| `1a14bb2` | **fix(mcp):** the same `list-post-types` fix and test. |

## Checks (all local; GitHub Actions is blocked by billing)

| Check | Result |
|---|---|
| `cargo fmt --all --check` | pass |
| `cargo clippy --workspace --all-targets -- -D warnings` | pass, 0 warnings |
| `cargo test --workspace` | 79 passed, 0 failed (core 65, ipc 9, cli 3, autostart 2) |
| Core coverage (`cargo llvm-cov -p monks-core`) | 93.47% lines, 91.72% regions, 92.28% functions (bar: 80%); `blocks.rs` 99.67% lines, `content.rs` 99.00% |
| `tsc` (incl. e2e) and `tauri build` from the repo root | pass |
| `npm test` (Vitest) | 152 passed, 0 failed |
| `npm run e2e` (Playwright: axe in both themes and densities, keyboard incl. the content editor, 200% zoom) | 140 passed, 0 failed (86 skipped: screenshot specs, run only with `SHOTS`) |
| Classic Monks Pro `tests/mcp/ci.sh` (CM_PORT 8888, CM_WOO, CM_ELEMENTOR, Bricks zip) | 36 suites, 1025 pass, 0 fail, 0 skip (m6: 66) |
| Classic Monks Free `tests/mcp/ci.sh` (CM_PORT 8889, same flags) | 23 suites, 549 pass, 0 fail, 0 skip (m6: 66) |

## Live acceptance: all pass

Details and the full transcript are in `docs/acceptance/phase-3.txt`. The run used the app's default
data folder and the Studio sites mc-a, mc-b, mc-c and monks-central-test.

- **CPT entry with terms:** on mc-a, a "Recipes" post type and "Courses" taxonomy made with Classic Monks' own post type builder. Monks Central created "Phase 3 sourdough pancakes" (published) with Breakfast (existing) and Brunch (new); `studio wp` shows both terms. An image imported from a link with alt text became its featured image.
- **Gutenberg page:** two text blocks edited (a drop-cap paragraph and a list item three levels deep) on a page with columns, a separator, buttons and a latest-posts block. The hash of every block name and attribute is the same before and after, and the diff of `post_content` is exactly the two changed lines.
- **Elementor (mc-a) and Bricks (monks-central-test):** detected, body locked with the reason, a block edit refused with a plain message, the title changed; `_elementor_data`, `_bricks_page_content_2` and `post_content` unchanged. Classic Monks refuses a body write on its own too.
- **Basic mode (mc-c):** a post with a category and a tag made by name, a text edit inside a quote with the quote kept, and an Elementor page detected from the rendered page with its body edit refused.
- **Older Classic Monks (mc-b, 2.5.0):** told to update Classic Monks; nothing written.
- **Real app:** the same screens on the live sites in both themes (Content, the Recipe editor with terms and image, the block page, the Elementor and Bricks pages, Media).
- **End state:** all 4 sites connected with health Ok and 1 Monks Central grant each. The created content stays on the sites.

## Open questions, decided

- **Writes are direct, not jobs.** The editor needs the saved entry back at once, and a content change touches one entry on one site. Trash has its own confirm step in the sheet. Jobs stay for fleet changes (Phase 2).
- **No content cache.** Lists and entries are read live from the site, so there is no migration this phase and nothing to go stale.
- **Classic Monks sites need M6.** Without `list-post-types`, the Content and Media screens say to update Classic Monks and check the site; there is no fallback to the older tools (they can't list custom post types or protect builder pages). "Check" re-reads the tool list, so updating the plugin is enough.
- **The five new M6 tools are for Monks Central only.** Adding them to the default tool groups took AI clients past VS Code's 128-tool cap (`site.sh` caught it). They use the existing `cm_operator_only` flag, like `create-login-link`. The new `terms`, `meta` and `date` fields on `create-post` and `update-post` stay available to every client.
- **Block-safe means text only.** Only the inner HTML of paragraph, heading, list item, preformatted and verse blocks can change. Everything else, including every block's settings, is shown and kept as is. A new entry's text becomes paragraph blocks (a blank line between paragraphs).
- **Builder pages:** Elementor (`_elementor_edit_mode` builder) and Bricks (`_bricks_page_content_2` with an editor mode other than WordPress) keep their body; title, status, terms and featured image can still change. Basic mode can't read meta, so it detects builders from the rendered page (Elementor's and Bricks' own markup). That is a heuristic; Classic Monks reads the meta.
- **Basic mode sees only post types in the REST API.** Types without REST (like `cm_book` in the tests) need Classic Monks.
- **Post types offered** are the ones with a body editor and an admin screen the user can edit. Orders, coupons and builder templates are records, not content.
- **Scheduling, revisions, untrash and file upload** exist on the plugins (M6) but have no UI yet; the feature map puts them in v0.2. Import from a link covers Phase 3's media row. Upload is images only, with the same checks as import.
- **Media alt text editing and deleting media** are not in the Phase 3 row and are not built.
- **M6 is on both Pro and Free.** Monks Central works with either plugin, so the content tools are needed in both.
- **Images from the sites in the window:** `img-src` allows http and https, because the media and featured images come from the user's own sites, at any address. Scripts, styles and connections stay limited to the app.
- **Trash is checked by the core integration tests and the UI tests,** not live: the goal says to leave the created content on the sites.
- **Free's `m6.sh` run on its own, first, on a new site:** the OAuth sign-in step failed once ("authorization code is invalid") when m6 was the first suite. It passes in `ci.sh`'s order (after `content`) and in the full run, the same as the other suites that connect over OAuth. Not chased further.
- **Test sites:** the Pro branch was copied onto mc-a and monks-central-test (rsync, no deletes). AI Custom Fields was turned on for mc-a to build the post type, and left on. mc-b stays on 2.5.0 on purpose.
- **Preview app:** closed before the live run, moved to `main`, rebuilt and relaunched.
