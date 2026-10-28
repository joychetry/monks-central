# Step 3: app-editor

Plan Part 2 (`plan/media-and-editor-plan.md`): clicking an entry opens a full-page editor like classic WordPress,
with TinyMCE 7 for text, every ACF field type with real controls, and the Publish box and side boxes. Branch
`feat/media-editor`; plugin work on `feat/monks-central` in Classic Monks Pro and Free.

## What changed

### Classic Monks (Pro and Free, same code)

- `content-write-helpers.php`: `create-post` and `update-post` take slug, author, parent, menu_order, template and
  password. `cm_content_post_fields()` checks each one. The author must be able to edit posts, and the caller needs
  `edit_others_posts` to set one. The parent must be the same hierarchical type and not the entry itself. The
  template must be one of the theme's page templates; empty means the default. The excerpt goes through
  `sanitize_textarea_field`.
- `get-post-by-id.php` also returns password, template and `preview_link`. With `choices: true` it adds:
  - authors, only when the caller can edit others' entries
  - parents (`get_pages`, leaving out the entry's own tree)
  - templates
- `tests/mcp/m6.sh` has an editor-fields block that uses an editor, a subscriber, a parent page and a child. The
  first full CI run then showed the subscriber check also matching a parent page that had the same id, so it now
  matches author entries only.

### Core (`crates/core`)

- `content.rs`: Post carries these extra fields:
  - `preview_link`, `slug` and `excerpt`
  - `author_id`, `author`, `parent`, `menu_order`, `template` and `password`
  - `page_fields` and `choices`

  Draft can set them. It works in both modes:
  - Classic Monks asks for `choices` only when the site lists `replace-media`, which comes from the same plugin
    release, because older plugins refuse unknown input.
  - Basic mode uses `_embed=author`, `/wp/v2/users?capabilities=edit_posts` and the type's own parents.
- `acf_fields()` and `save_acf()` call `get-acf-fields` and `update-acf-fields`. `save_acf` finds the activity row
  for Undo (`undo_row`, now `pub(crate)`).
- `testsite.rs` has an ACF group: a required text field, an email field and a read-only flexible field. It also
  gives author, parent and template choices, and supports `undo-operation` for ACF.
- App commands: `content_acf` and `content_acf_save`. A save is recorded in the activity log.

### Window (`ui/`)

- **Full-page editor** (`screens/Editor.tsx`). It replaces the sheet, from Content and from Search.
  - Main column: title, then the permalink with slug, then the body, then Custom fields, then one card per ACF
    group.
  - Side column:
    - Publish: status, visibility (public, password, private), publish date, Save draft or Save as pending,
      Preview, Move to the trash. The main button is Update, Publish, Schedule or Submit for review.
    - One box per taxonomy.
    - Featured image (media picker), Excerpt, Author, Page attributes (parent, template, order) and Earlier
      versions.
  - Unsaved-changes guard: Back, the rail and every section change ask "Leave without saving?" (`leaveGuard` in
    `App.tsx`).
  - Ctrl+S saves from anywhere, including inside TinyMCE.
  - The conflict check sends `seen_modified`. A "changed on the site" error comes back as a toast with "Open the
    site's version".
  - Errors are toasts, so nothing moves under the pointer. ACF errors also show under their fields.
- **TinyMCE 7.9.3, self-hosted** (`components/tinymce.ts`, `components/RichText.tsx`).
  - `license_key: "gpl"`, no cloud, loaded on demand in its own chunk. Inline mode keeps it in the app's page and
    theme.
  - Oxide skin with overrides from the redesign tokens in dark and light (`styles/screens/editor.css`).
  - `RichText`: the whole body of classic content and new entries, and ACF wysiwyg fields. It has Visual and Text
    tabs and WordPress's two toolbar rows: formats, bold, italic, lists, blockquote, alignments, link and Read more;
    then strikethrough, line, colour, paste as text, clear formatting, characters, indents, undo and redo. Add media
    opens the media picker and inserts `<img class="alignnone size-full wp-image-N">` or a link. On load the body
    goes through the same `autop` as WordPress's classic editor.
  - `InlineText`: one text block of a block page. TinyMCE starts on focus with inline formats only. Enter makes a
    `<br>`, so a new block never starts inside one. Block comments and attributes are never sent: only the edited
    block's inner HTML goes back through `blocks.rs`, and the hash test is unchanged. Builder pages stay locked as
    before.
  - Site HTML is never put into the page raw. TinyMCE's `setContent` sanitizes it. Before an editor starts,
    `safeHtml` keeps only inline tags and safe links, parsed in an inert document.
- **ACF** (`screens/AcfFields.tsx`).
  - Every type uses a control from the kit, never a native one:
    - text, email, url, password: inputs; textarea
    - number: NumberInput; range: Slider
    - select: Select, or MultiSelect when multiple
    - checkbox and radio: the kit's drawn inputs; button group: segmented buttons
    - true/false: checkbox; wysiwyg: RichText
    - image, file and gallery: media picker
    - date: DateInput; date-time: DateInput plus TimeField; time: TimeField; colour: ColorInput
    - link: address, words and new tab
    - post object, page link and relationship: a search combobox
    - taxonomy: Select or MultiSelect; user: Select
    - group: a fieldset; repeater: rows with move, remove and add
  - Required and validation run before saving: required, email, url, number and range limits, max length, and
    min/max counts, also inside groups and repeaters. ACF's own messages are matched to fields by label.
  - Flexible content, clone, oEmbed and unknown types are read-only cards with "Edit in WordPress".
  - Saving shows "Saved N ACF fields" with Undo, which reverts through the activity log.
- **Found in the live run, fixed:**
  - Custom fields listed ACF's own meta keys, including a serialized array as editable text. It now leaves out keys
    an ACF group owns and never offers serialized values as text, as WordPress does.
  - The toolbar's on and off states were hard to read in dark.
  - The Custom fields card had no padding.
  - "A oembed field" is now "An oEmbed field".
  - A number box with a single limit (ACF Count, max 5) only said "Write a number." It now says "Write a number of 5
    or less."
- Mock core: post 25 (classic body) and post 26 (a full ACF group generated from the mc-a dump, plus repeater,
  gallery, flexible content and clone). The fixture is `e2e/acf-fixture.ts`.

### Commits

| Repo | Commit | Change |
|---|---|---|
| classic-monks (Pro) | `4c7c1899` | feat(mcp): editor fields for Monks Central (slug, author, parent, order, template, password, choices, preview link) |
| classic-monks (Pro) | `cd2bc133` | test(mcp): the m6 subscriber check matches author entries only |
| classic-monks-free | `50c52ee` | same as Pro `4c7c1899` |
| classic-monks-free | `bb03836` | same as Pro `cd2bc133` |
| monks-central | `5a019b6` | feat(core): editor fields and ACF read and save with Undo, both modes |
| monks-central | `6951a8e` | feat(ui): TinyMCE 7 self-hosted, RichText and InlineText |
| monks-central | `896317e` | feat(ui): the full-page editor, ACF fields, guard, Ctrl+S, conflict check; mock, unit and Playwright |
| monks-central | `8b1593a` | docs(ux): editor screenshots (also fixes the media-picker screen for the full page) |
| monks-central | `dac5ad8` | fix(ui): the live-run fixes above |
| monks-central | `1b772ba` | docs(ux): screenshots retaken, plus three from the real app on mc-a |
| monks-central | last | docs(pipeline): this report and status |

## Tests

| Check | Result |
|---|---|
| `scripts/sidecar.sh --release` | built |
| `cargo fmt --check` | clean |
| `cargo clippy --workspace --all-targets -D warnings` | clean |
| `cargo test --workspace` | 151 passed (core 133, with `the_editor_sets_page_fields_and_acf_values_with_undo`: fields in both modes, ACF required and email refusals, save and Undo) |
| `tsc --noEmit` | clean |
| `vitest` | 22 files, 313 passed. New: `RichText.test.ts` (autop, safeHtml, Add media HTML, toolbar) and `AcfFields.test.tsx` (rules, a kit control for every type, no native pickers, read-only cards, check before save, ACF errors under fields, Undo, ACF keys and serialized values kept out of Custom fields). `Content`, `Phase7Content` and `Phase7Search` were rewritten for the full page, adding classic body with Ctrl+S, the conflict action, the leave question and page fields. Also a NumberInput single-limit test. |
| Playwright, full (axe in both themes and both densities, keyboard, 200% zoom, native controls, no-shift, screens) | 505 passed and 1 failed: the perf budget "Sites with 300 sites", under load. `perf.spec.ts` alone: 3 of 3 passed. The 2 tests that did not run are the rest of that serial perf file. 264 screenshot tests skipped without `SHOTS`. |
| Playwright, new editor checks | screens `content-classic`, `content-classic-text`, `content-block-text`, `content-acf` and `content-leave` under axe and native controls. Keyboard: open, Tab into a text block, type, Ctrl+S, Back returns focus to the row. Leave guard from Back and from the rail. No-shift: title y unchanged after a body edit and save, ACF field y unchanged after a refused save. |
| `scripts/check-headers.sh` | clean |
| `tauri build --no-bundle` | built (`target/release/monks-central`); TinyMCE is its own 1.1 MB lazy chunk |
| Classic Monks Pro `ci.sh` (CM_WOO, CM_ELEMENTOR, Bricks) | 1379 checks passed and 2 failed. m6's subscriber check (test bug, fixed in `cd2bc133`) and hq-status "pending approval counted" (12 against 13). Rerun of m6 and hq-status after the fix: both passed. |
| Classic Monks Free `ci.sh` | 859 checks passed and 1 failed (the same m6 check). Rerun of m6 after the fix: passed. |

Screenshots in `docs/ux/editor/`, dark and light:
- the block page, with an inline text block being edited
- the classic body in Visual and in Text
- the ACF group
- a new entry with the media picker
- a builder page, locked
- the trash question and earlier versions
- the leave question
- `content-editor` at 200% zoom and 960 px

Plus `live-mc-a-*-dark.png` from the real app after each live save.

## Live results

Release build from this branch, default data folder `~/.local/share/com.classicmonks.monks-central`, driven in the
real window (ydotool and wtype). Each result was checked with `studio wp` on mc-a.

| Step | Result on mc-a |
|---|---|
| Classic post 76 ("Classic editor test post (app-editor)", made with `studio wp` as plain paragraphs) | TinyMCE showed the toolbar themed in dark. Made "bakery" bold, the second paragraph a bulleted list, "specials" a link to `https://mc-a.local/specials/` (themed link dialog), and inserted garden-bench with Add media. After Update the saved content is `<p>Our <strong>bakery</strong> …</p><ul><li>We bake rye…</li></ul><p>… <a href="https://mc-a.local/specials/">specials</a>.<img class="alignnone size-full wp-image-73" src=".../garden-bench.jpg" alt="A wooden bench in a green garden" width="1200" height="800"></p>`. |
| Block page 12 ("Phase 3 block page"), Paragraph 7 | Typed " Closed on Mondays.", bolded "Mondays", saved with Ctrl+S ("Saved "Phase 3 block page" on MC A."). With the new words taken out, the page's md5 is `c2e8193330caef81dc540e5dd50d282a`, the same as before. Every block comment, attribute and other block is byte for byte as it was. |
| ACF post 40 ("Monks test fields post", ACF free) | All 26 editable fields changed and saved; oEmbed is read-only by design. Text, textarea, number 7→5, range 40→43, email, url, password, select blue→green, checkbox [a,c]→[c,b], radio m→s, button group center→right, true/false 1→0, wysiwyg (text plus bold), image 39→74, file 39→73, date 20261028→20261102, date-time →2026-11-03 10:15:00, time →11:45:00, colour #7a5af8→#1d4ed8, link (url, title, no new tab), post object 37→29, page link 13→12, relationship [37]→[37,29], taxonomy [1]→[1,21], user 1→2, and group line and count 4→3. The app said "Saved 25 ACF fields … Undo", then "Saved 1 ACF field" for the select. The Custom fields box shows "None" for this post now, where before the fix it listed every ACF key. |

Test data kept, as asked:
- post 76 with its edits
- page 12's added sentence
- post 40's new ACF values
- the category "Bread" (21), made for the taxonomy field

The preview app (`/home/joy/dev/monks-central-preview`) was stopped for the run and started again after.

## Decisions

- **TinyMCE 7.9.3 and GHSA-mf2p-h6hf-fcwm.** `npm audit` and Dependabot flag 7.9.3. The advisory is in the media
  plugin only, and no patched 7.x is on npm (7.9.4 isn't published). The media plugin is never loaded: Add media goes through the app's picker and inserts plain
  `<img>`. Move to the patched 7.x when it reaches npm.
- **Inline mode, not the iframe editor.** The text then sits in the app's own page, with its fonts, theme and CSP
  (`default-src 'self'`), and needs no iframe content CSS. For block content each text block is a `<p>` or `<pre>`
  inline editor with `newline_behavior: "linebreak"`, so TinyMCE can't wrap it in a new block.
- **New entries are saved as classic HTML** (TinyMCE's paragraphs), as the classic editor does. Publish on several
  sites still makes paragraph blocks.
- **ACF types without an editor of their own** (flexible content, clone, oEmbed, unknown) are read-only cards with
  Edit in WordPress, as the plan says.
- **Choices are sent only to plugins that know them** (`replace-media` present), so older Classic Monks keeps
  working.
- **Custom fields and ACF.** WordPress hides serialized values from its Custom Fields box, and ACF hides its own
  keys. The app now does both, so one value can't be changed in two places, or broken as text.
- **Known flakes:**
  - Playwright's 300-site Sites budget under parallel load (passes alone, as in app-media).
  - Classic Monks hq-status "pending approval counted" in the full Pro run (passes alone; this step didn't touch
    approvals).
