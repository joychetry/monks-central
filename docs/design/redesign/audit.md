# Redesign fidelity audit

Every difference between Joy's design and the app, page by page (joined from `audit/*.md`; how rows are kept: `audit/README.md`). Compare images: `docs/ux/redesign/compare/<page>-<theme>.png`.

## sidebar

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| Sidebar | Icons | The design's 24-grid line icons (dashboard, globe, download, plug, palette, file, image, users, message, activity, shield, briefcase, bag, chart, sparkle, gear, search), 17px | Hand-drawn 16-grid icons, several different (Updates refresh, Themes grid, Classic Monks smiley) | `components/icons.ts` holds the design's 60 icons; `Glyph` draws them; nav uses them, Classic Monks shows the Classic Monks mark | done |
| Sidebar | Counts | Count badge on Sites (sites), Updates, Plugins and Themes (updates waiting), Comments, Classic Monks (approvals), AI; amber on Overview, Monitoring, Security; green on the current page | Counts only on Overview, Sites ("1 down"), Updates, Monitoring ("1 down"), Security, AI | Counts from the data the shell has: sites, waiting updates by kind, pending approvals, monitors down, vulnerabilities, live plans; numbers only, the meaning in screen-reader words | done |
| Sidebar | Comments count | "3" comments waiting | none | No count | kept: the core has no fleet-wide count of comments waiting; it would mean asking every site on every start. The Comments screen shows them |
| Sidebar | Sites to show | Small select (34px), "All sites (4)", "Group: Bakery clients" | 40px select, "Bakery clients (2)" | `scope sm`, "Group: name" options | done |
| Sidebar | Spacing | 18px between brand, scope and nav; groups 14px above | 16/12, groups 16px | Matched | done |
| Sidebar | Footer | Next check note in the well, theme switch, "v1.0.0" mono | "Version 0.1.0" | `v0.1.0` in mono | done |
| Sidebar | Next check time | "14:30" (24-hour) | "05:00 PM" in an en-US browser | Uses the computer's time format | kept: the OS locale decides the clock, as everywhere in the app |
| Sidebar | Brand image | `<img>` logo (broken in the bundle) | Classic Monks mark | Keeps the mark | kept: the design's logo file isn't in the bundle |
| Top bar | Attention link | Green bold on Overview, plain muted on other pages, no underline | Underlined green everywhere | `.link.go` / `.link.quiet` | done |
| Top bar | Check all sites now | Primary ink pill with disc on Overview; secondary pill with refresh icon on pages whose head holds the main action | Primary everywhere | Primary on Overview, secondary elsewhere | done |
| Page head | Actions | Each page's main actions on the right of the title (secondary, then primary with a disc) | Only Overview had one; others had actions in a bar inside the card | `<HeadActions>` portal into the page head; screens move their main actions there | done |
| Sidebar | Scrolling | The board shows the whole rail; no scrollbar drawn | In a 900px-tall window the rail scrolled with a 12px grey scrollbar beside the nav (live app) | `.rail` keeps an 8px gutter (no shift) and its thumb shows only on hover or focus (`styles/controls.css`) | done |

## 01-overview

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 01 Overview | Page head | "What needs you across the fleet, right now." and Add a site A | The fleet sentence ("One site is down. ...") and Add a site A | Kept the sentence | kept: it says what the stat cards show in words (docs/ux README, "Every number says what it counts"); same place, size and colour |
| 01 Overview | Add a site key | "A" | The key was shown but did nothing on the Overview | A adds a site on the Overview too | done |
| 01 Overview | Stat cards | Sites, Updates waiting, Vulnerable plugins (alert paper), Waiting on you; bars and keys | Same four cards, bars and keys | Already matched; numbers and words from the app's data | done |
| 01 Overview | Waiting on you | "3 comments to approve", "1 AI plan to confirm" | "N changes waiting for approval on sites", "1 AI plan to confirm" | Kept approvals on sites | kept: no fleet-wide count of comments waiting in the core; the approvals count is the closest real data |
| 01 Overview | Needs attention | Icon tiles, bold title, muted line, one pill action; amber count badge | Same, plus the slow-site note row | Matched; the slow note stays | kept: slow sites are a note (docs/ux README "A slow site is a note") |
| 01 Overview | Your sites | 30px site tiles in four inks, status pill, WordPress, uptime, response | One ink tile for every site; "Uptime, 30 days" head wrapped | `SiteTile` (favicon or four-ink monogram); heads after the first stay on one line | done |
| 01 Overview | Your sites: missing response | "—" | "none" | Kept "none" | kept: missing values are words (docs/ux README, Clarity) |
| 01 Overview | Latest changes | Sentences "You updated **X** to 2.5.0 on **MC D**.", times "Today, 10:42", "Yesterday, 17:20", "Oct 26, 11:15" | "An AI agent: **Update post** on MC A.", times "4 min ago" | Sentences built from the log ("You turned on AI agent access on **MC A**.", "An AI agent ran **Update post** on **MC A**."), times as Today / Yesterday / date in the computer's clock format | done |
| 01 Overview | Latest changes: version words | "to 2.5.0" | The log keeps the job's words | Shows what the log says | kept: the activity log stores the change's title, not the versions |
| 01 Overview | Versions card | not in the design | WordPress, PHP and connection spread | Kept under Latest changes, in the design's card look | kept: existing feature |
| 01 Overview | Next steps card | not in the design | Shown for a new fleet of up to 2 sites until hidden | Kept | kept: existing feature (first-run help) |

## 02-sites

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 02 Sites | Page head | Primary "Add a site" pill with a plus disc | Small "Add a site" in the card's bar | In the page head (`HeadActions`), A still adds | done |
| 02 Sites | Filter row | Outside the card: segmented All / Needs attention / Up with mono counts, search pill, dashed "Connection and group" chip with sliders icon | Inside the card: dashed Status and Connection chips, search, Add | Segmented with counts, search pill, dashed chip with icon, all on the ground | done |
| 02 Sites | Filter row: Down | Three tabs | Status chip could show only down sites | Kept as a fourth tab "Down" so no filter is lost | kept: keeps an existing feature (Down only); the design's three are there |
| 02 Sites | Search placeholder | "Filter by name or address" | "Filter by name, address, group or tag" | Kept the longer words | kept: the box also matches groups and tags, so the words say so |
| 02 Sites | Table: columns | Tick, Site (tile, name, mono address), Status pill, WordPress (mono, "↑ 7.1.3" badge when core waits), Connection (mark or link icon + word), row actions | Tick, Site (name, tags), Status (word + checked when), Group, Versions (WP + PHP), Connection | Design columns; group, tags, PHP and last checked are in the panel; tags still in the name's tooltip and the filter | done |
| 02 Sites | Table: head tick | "Tick every site shown" checkbox | none | Added (mixed when some are ticked) | done |
| 02 Sites | Site tiles | 30px rounded monogram tiles in four inks | none | `SiteTile`: the site's favicon, else a monogram in the design's four inks | done |
| 02 Sites | Status | Pill with a dot and the word: Up, Couldn't reach, Connection expired | Shape icon + word, no pill | `.st.pill` with the shape icon | kept: status shape rule (docs/ux/README.md "Status is never colour alone") keeps the icon for the dot and the app's words (Healthy, Down, Sign in again, No tools yet) |
| 02 Sites | Rows | 62px; open row tinted with a 3px green edge; ticked rows not tinted; sign-in rows on warn paper | 48px; ticked rows tinted | 62px comfortable (50 compact); only the open row tints; sign-in and no-tools rows on warn paper | done |
| 02 Sites | Row actions | Log in and open icons; "Check again" on a site that can't be reached; "Sign in again" on an expired connection | none in the table | Added (mouse shortcuts, Tab skips them; the panel has the same actions); hidden under 1300px so the table fits | done |
| 02 Sites | Bulk bar | Ink bar attached on top of the table: "2 sites ticked", Move to group select, Check them now, Clear selection Esc | Ink bar stuck under the table: "2 selected", Check now, group box, Clear | Design copy and ghost buttons; "Move to group" box keeps typing a new group | kept: stays under the table (no-shift rule in docs/ux/README.md); the look and words match |
| 02 Sites | Card foot | "Showing 4 of 4 sites", keys R check the open site · A add a site | Legend above the table, keys at the bottom of the panel | Foot with the count and keys (J K, X, /, R, A), tied to the table as its description | done |
| 02 Sites | Panel head | 44px site tile, name (Outfit 20), "mc-a.test · Corner Bakery" mono, status pill, close | Name and address only | Tile, name, address · client, status pill (the panel follows the focused row, so no close) | done |
| 02 Sites | Panel actions | Full-width primary "Log in to the dashboard" with disc, then Open the site and Check now R side by side | Four small pills | Same; Sign in again takes the primary slot when the connection needs it | done |
| 02 Sites | Panel facts | Definition rows: WordPress, Connection, Last checked | Health/Versions sections with a 120px key column | One definition list (WordPress, PHP, Classic Monks, Connection, Last checked, Detail) in the design's rows | done |
| 02 Sites | Updates callout | Green well "3 plugin updates waiting  Review →" to Updates | none | Built from the inventory (updates waiting on this site, by kind), opens Updates | done |
| 02 Sites | Organise | Mono label "Organise", Group select and Tags field with chips | Separate Group and Tags sections | One Organise section; the Group box still takes a new group name | done |
| 02 Sites | Notes | Notes as wells (bold text, mono date, trash icon), then the box and "+ Add the note" | Box first, notes under with a "Delete note" pill | Design order and look; the icon button keeps the name "Delete note" | done |
| 02 Sites | Remove | Ghost danger "Remove from Monks Central" with trash icon | Danger pill | Ghost with icon, same confirm step | done |
| 02 Sites | Panel shape | Drawer: radius 16, float shadow | Card, radius 14, no shadow | `.insp` takes the drawer look (shared) | done |
| 02 Sites | "What Monks Central can do here" | not in the design | Tools, access, approvals, modules | Kept, in the design's definition rows | kept: existing information (feature kept) |

## 03-updates

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 03 Updates | Layout | Page on the ground: filter row, table card, right column of side cards (`mc-split-r`) | One big card (`.scroll` with a `.bar`) | `.scroll.page` + `.split-r`, main `.stack` and side `.stack` | done |
| 03 Updates | Page head | "Read every site again" secondary pill with refresh icon, "Update all N" primary pill with green disc | Small buttons in the card's bar | Both moved into the page head with `HeadActions`; refresh glyph; `.btn.primary.disc` with arrow disc; names unchanged | done |
| 03 Updates | Filter row | Kind segmented tabs with mono counts: All, Core, Plugins, Themes | None | `.segmented.inline` with `aria-pressed` buttons and `<small>` counts; filters the table | done |
| 03 Updates | Filter row | Translations are not in the design | App has translation updates | A "Translations" tab shows only when some are waiting | kept: real app data the design doesn't show |
| 03 Updates | Filter row | "Group by site" checkbox at the right | None | Drawn checkbox (`label.row.check`) pushed right with `.end`; off gives a flat list with the site in each row's second line | done |
| 03 Updates | Table head | Check, Update, From → to, Good to know; mono uppercase on the well | Check, Site, Type, Name, Installed, Available | Four columns as the design; "Select every update" box in the head (mixed when some are ticked); fixed widths 44 / auto / 190 / 224 | done |
| 03 Updates | Site group rows | 44px row on the well: site tile, bold name, "N updates", the site's status pill when it can't be reached, "From the last read, ..." | Site name repeated in every row | Group row per site with `SiteTile`, name, count, a "Select every update on X" box; status pill (shape + word) and "From the last read, X ago" when the site's status isn't healthy | done |
| 03 Updates | Site group rows | A site that couldn't be reached still lists its updates | Down, sign-in and no-tools sites can't run updates, so the app leaves them out | Those sites stay out of the table and are listed in "Not in this list"; the pill shows for sites that can update but aren't healthy (e.g. "Needs a look") | kept: the app can't run updates on a site it can't reach |
| 03 Updates | Rows | 56px rows: 30px letter tile (core on ink, theme with palette icon), bold name, kind line | Plain text cells | `.item` with `.ptile` (core `.ptile.ink` "W", theme palette glyph, translations globe), name (cut with tooltip), kind line | done |
| 03 Updates | Rows | Plugin tiles show the plugin's own icon where known (Classic Monks) | Letter only | Letter tile | kept: the inventory has no plugin icons |
| 03 Updates | From → to | `.mc-ver--to`: old quiet, arrow icon, new bold green, mono | Two mono columns | `.vto` (with a screen-reader "to"); translations say "new files" | done |
| 03 Updates | Good to know | Badges "Security fix" (danger), "1 step after updating" (warn); words "Minor release", "Active theme" | None | "Security fix" danger badge when the site's last security report has a vulnerability for that item fixed in the new version (tooltip: its title); "Major release" warning badge when the first version number changes; words "Active theme", "Not active", "Language files", "Minor release" | done |
| 03 Updates | Good to know | "1 step after updating" from release notes | None | Not shown | kept: Monks Central doesn't read release notes or upgrade steps |
| 03 Updates | Right column | What's waiting: label, 36px count, "updates on N sites", segmented bar by kind, key | None | `.stat` with `.mix` bar and `.mix-key` (core, plugins, themes; translation sets in a grey part when present); words beside every colour | done |
| 03 Updates | Right column | Action needed card (warn paper): tile, title, version badge, text, "After updating" steps, "Read the notes" link | None | Same card look (`.upd-alert`: warn paper, warn line, warning tile, "Action needed", count badge) listing the updates that fix known vulnerabilities, each with the vulnerability's title; only there when some are waiting | kept: release-note steps and links need data the app doesn't have; the card carries the security fixes instead |
| 03 Updates | Right column | Roll-back note (`.mc-note` with history icon): "A release misbehaves? Open the plugin in Plugins..." | The legend paragraph above the table | `.callout` with history glyph and the design's words, plus the app's note that a broken plugin update is put back automatically | done |
| 03 Updates | Selection | No selection bar in the design | "Update selected" in the bar | Card foot under the table, always there: "Read X ago" or "N updates selected", and "Update selected" | kept: the app's pick-some flow, in the design's card foot so nothing moves when ticking |
| 03 Updates | Not in this list | Not in the design | A mono heading and a plain list under the table | Its own card under the table: head "Not in this list" + count, rows with site tile, bold name and why | done |
| 03 Updates | Empty state | Not in the design | `.empty` in the card | Same `.empty` inside the table card | done |
| 03 Updates | Type sizes | 11px labels and badges, 12.5 / 13.5px text | n/a | App tokens: 12 / 13 / 14px (`docs/ux/README.md`: nothing under 12px) | kept: type floor rule |

## 04-plugins

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 04 Plugins | Page head | "Install a plugin" secondary pill with a plus, "Update 4 plugins" primary pill with a green disc, in the page head | Both buttons small, in a bar on the card's top edge | `<HeadActions>`: secondary with `plus` glyph, primary `.disc` with the arrow disc; names and the disabled "No plugin updates" kept | done |
| 04 Plugins | Layout | Filter row on the ground, then the table card, the legend under it, the inspector as a floating card on the right | One card holding bar, legend, table and notes; inspector full height | `.scroll.page` + `.stack` (filters, `.card`, legend, notes); inspector `.insp.mx-insp` 380px, as tall as its content, soft shadow | done |
| 04 Plugins | Filter row | Search pill "Find a plugin", dashed chips "Show: Every site", "Status: Any" with chevrons | One toggle chip "Show every site" | `SearchInput` (finds by name or slug), two `Menu` chips (`className="chip"`): Show (every site / only sites with updates), Status (Any, Update ready, Inactive, Known vulnerability, Not on every site) | done |
| 04 Plugins | Table orientation | One row per plugin, one column per site | One row per site, one column per plugin | Transposed; arrow keys, Home/End and the single Tab stop move with it (unit test and a11y e2e updated, same behaviours) | done |
| 04 Plugins | Column heads | Site names, mono uppercase on the well; first head "Plugin" | "Site", then plugin names clamped to 2 lines | Site names (clamped, full name in the tip), first head "Plugin" | done |
| 04 Plugins | Row heads | Plugin icon tile 30px, bold name, slug line in subtle 12px, rows 64px | Site name in bold | `.ptile` letter tile, name, slug (`slugOf`), 64px rows; name column sticky when sites scroll sideways, wraps past 240px | done |
| 04 Plugins | Row heads: icon | Classic Monks shows the plugin's own icon image | — | Letter tiles for every plugin | kept: the inventory has no plugin icons (the core reads none); the design's letter tiles are used for all |
| 04 Plugins | Cells | 128px boxes, two lines: mono version 12.5px and a state word 12px; update tinted with green bold word, active in the well, inactive outlined, not installed dashed with "—", vulnerable on the danger ground, open cell with a 2px green ring | Mono version on one line, struck through when inactive, a dot when missing, a yellow "Update" tag | `.cell` + tone (`up`, `on`, `idle`, `none`, `vuln`), words "Update to X", "Active", "Inactive", "Not installed", "Vulnerable · fix ready"; ring as a box-shadow so the focus outline still shows; 12.5px becomes `--fs-sm` 13px | done |
| 04 Plugins | Cells: vulnerable | "Vulnerable · fix ready" from the security check | Not shown | Read from `api.security()` (version must match); "fix ready" when a fix exists and an update waits | done |
| 04 Plugins | Cells: held back | "Held back" on MC B | — | No such state | kept: the core has no held-back (pinned) versions; the cell says "Update to X" or "Active" |
| 04 Plugins | Cells: dark | An accent "↑" before the update word | — | `[data-theme="dark"] .cell.up .w::before` | done |
| 04 Plugins | Legend | Swatches under the table: Update ready, Active, Inactive, Not installed, Known vulnerability | A sentence legend above the table with struck-through and dot samples | Swatch list under the card (`aria-label="What the cells mean"`, still the grid's description), plus the keyboard hint at its end | done |
| 04 Plugins | Legend: keyboard hint | No hint | "Arrow keys move, Enter opens..." | Kept as the legend's last, right-aligned item | kept: keyboard users need to learn the grid's arrows (docs/ux/README.md keyboard model) |
| 04 Plugins | Sites not in this table | (not on the board) | Bold name + reason rows under a mono label inside the card | The design's notes: mono label, then one `.callout` per site with an info glyph | done |
| 04 Plugins | Inspector head | Plugin tile 40px, name, mono "on MC A · Active", close X | Name, "on MC A", a Close pill among the actions | `.ihead`: `.ptile.lg`, h2, mono small with the state, `icon-btn` "Close" with the `x` glyph | done |
| 04 Plugins | Inspector callout | Green note with a download icon: "11.2.1 is ready. This site runs 11.1.0." | "Update: 10.3.0 is waiting" as a definition row | `.callout.ok` with `download`; a danger callout with the vulnerability title instead when the version is vulnerable; a quiet callout when not installed | done |
| 04 Plugins | Inspector actions | "Update to 11.2.1" primary with disc, "Deactivate" with the power icon | Small pills, Delete and the auto-update toggle mixed in | Primary `.disc`, Deactivate/Activate with `power`, Use this theme with `palette`, Install here with `download` | done |
| 04 Plugins | Automatic updates | Switch row between hairlines: "Automatic updates" / "Off on this site" | "Turn automatic updates on" button, and a definition row | Switch (`role="switch"`, the kit's look) named "Automatic updates", described by "Off on this site" / "On for this site"; disabled when the connection can't change it | done |
| 04 Plugins | On every site | Mono label, definition rows "MC A: 11.1.0 · update ready", soft "Update WooCommerce on 1 site" | A sentence "Installed on 3 sites, with an update waiting on 2." and a pill | `.dl` with one row per site that has it (mono version · update ready / inactive), `soft` button | done |
| 04 Plugins | Inspector foot | "Choose an older version" ghost with history icon, Delete danger with trash at the right, above a hairline | A "Roll back" section, Delete among the actions | `.mx-foot`: ghost button with `history` opening the roll back sheet, Delete with `trash` pushed right | done |
| 04 Plugins | Version facts | — | Version / Status / Update / Automatic updates definition rows | Folded into the head line, the callout and the switch row | done |

## 05-themes

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 05 Themes | Page head | "Install a theme" secondary, "Update 1 theme" primary with disc | "Update 1 theme" small, in the card's bar | `<HeadActions>` primary `.disc` (shared with Plugins) | done |
| 05 Themes | Page head: Install a theme | "Install a theme" secondary pill | — | Not added | kept: installing a theme is only possible from a zip (in the Install sheet, "A theme"); the core can't search WordPress.org themes |
| 05 Themes | Filter row | Search pill "Find a theme", dashed "Show: Every site" | Toggle chip | `SearchInput` + Show `Menu` chip; no Status chip, like the design | done |
| 05 Themes | Table | One row per theme with a palette tile and slug, one column per site; cells "Active theme", "Update to 1.3 · active", "Installed", "Not installed" | One row per site, one column per theme, struck-through versions | Same transposed grid as Plugins; theme words from `cellOf("themes")`; palette glyph in the `.ptile` | done |
| 05 Themes | Legend | (none on the board) | Sentence legend | The Plugins swatch legend, "Installed" for the outlined swatch | done |
| 05 Themes | Right column | Card "Active theme on each site": site tile, site name, "Twenty Twenty-Six 1.3", "Current" pill or "Update ready" badge | — | `aside.insp.mx-insp` card when no cell is open: `SiteTile`, name, active theme and version, `st pill ok` "Current" (check shape + word) or `tag ok` "Update ready"; the cell inspector replaces it while a cell is open | done |
| 05 Themes | Inspector | Same panel as Plugins | Name, Close, Use this theme / Delete | Same inspector as Plugins; the theme in use says why it can't be deleted in a callout | done |

## 06-content

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 06 Content | Layout | Page on the ground: a filter card, then a flush table card | One big card with two `.bar` rows, a legend row and a pager | `.scroll.page` > `.stack`: `.card.cfilter` then `section.card.ctable` (screens/content.css) | done |
| 06 Content | Page head | "Publish on several sites" secondary pill with copy icon, "New post" primary pill with a plus disc, in the head | Both small buttons at the end of the second bar | `<HeadActions>`: Button + `Glyph copy`, primary `.disc` + `Glyph plus`; names unchanged | done |
| 06 Content | Filter card | Mono uppercase SITE label, 150px select, type segmented, SHOW label + select, search pill pushed right | Sans "Site"/"Show" labels, plain segmented, "Search posts" box + Search button | Mono labels, `.segmented.inline`, `SearchInput` pill (`.end`); Enter searches, clearing the box shows everything | done |
| 06 Content | Filter card | Site select shows only the name | Name only | `<SiteTile size="sm">` before each site name in the select and its list (the brief: tiles in site pickers) | done |
| 06 Content | Filter card | Type tabs carry counts (Posts 18, Pages 9, Books 6) | No counts | None added | kept: the core lists one post type at a time; counts per type would cost one request per type per site. The open type's total is in the footer |
| 06 Content | Filter card | "Everything" | "All but the trash" | Kept the copy | kept: the filter does leave the trash out; "Everything" would say otherwise |
| 06 Content | Filter card | 150px selects | Selects shrink to content | 200px fixed (long site names fit, nothing moves when the site changes) | done |
| 06 Content | Bulk bar | Ink band on the card's top edge: "2 entries ticked", ghost Publish (2), Make drafts (2), trash icon + Move to the trash (2), Clear selection + Esc | Light bar under a legend row: "None ticked" and outlined small buttons, trash in red | `.ctable .bulk` ink band, ghost buttons, trash glyph, "N entries ticked", Clear selection with Esc (Esc in the card clears) | done |
| 06 Content | Bulk bar | Shown with ticked entries | Always shown | Always shown, actions disabled with none ticked | kept: docs/ux/README.md no layout shift (a bar that comes with a selection is always there) |
| 06 Content | Legend | No legend row | "Select a title to open it..." row above the table | Moved to `.sr-only` (still the table's description); shown only when the trash can't be restored | done |
| 06 Content | Table | Title bold, not underlined | Underlined medium link | `.ctable .linkish` 600, underline on hover only | done |
| 06 Content | Table | Status pills: dot + word, green Published, amber Scheduled, grey Draft | Mono grey `.tag` | `st pill` with the tone's shape icon + word (publish ok, future warning, trash danger, rest neutral) | done (shape icon in place of the dot: docs/ux/README.md status never colour alone) |
| 06 Content | Table | Author muted | Plain | `.who` text-2 | done |
| 06 Content | Table | Categories column | None | None added | kept: the list API (Summary) has no terms; adding them is a core change |
| 06 Content | Table | DATE column, mono 12px subtle "Oct 24, 2026" | "LAST CHANGED", sans "2026-10-27 15:42:00" | "Date" column, mono `.when` with `dayLabel` ("27 Oct 2026", the app's date format), full time on hover | done |
| 06 Content | Table | 56px rows, 16px cell padding, 44px check column, ticked row tinted | 48px rows | `.ctable .t` 56px, 16px padding, 44px tick column, `tr.sel` | done |
| 06 Content | Footer | `.card-foot`: "1–5 of 18 posts" subtle, Previous/Next on the right | "Page 1 of 1, 3 entries" | `.card-foot` with "first–last of total posts" | done |
| 06 Content | Dark | Published pill neutral with green dot (dark2) | Green pill | Shared `.st.pill.ok` | kept: shared Status pill, owned by the system |

## 07-media

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 07 Media | Layout | `split-r`: library card left, a 380px column right (Import card, Selected card) | One big card: two bars, a legend row, a grid | `.scroll.page` > `.split-r`: `section.card.mlib` + `.stack.mside` (screens/media.css) | done |
| 07 Media | Library head | Card head: mono SITE label + select (pushed left), search pill 280px, Search button | Bar with sans label, search box and button | `.card-head` form: SitePick (tile + name), `SearchInput` pill, small Search | done |
| 07 Media | Thumbnails | `.mc-thumbs` grid minmax(132px), rounded 10px 4:3 tiles, mono 12px name, small meta line, selected outline 2px green offset 2 | 160px grid, 10px radius images, name + alt text under each | `.mthumbs`/`.mthumb` buttons with `aria-pressed`; image cover or file glyph; mono name; meta "JPEG · 20 Oct 2026" | done |
| 07 Media | Thumbnails | Meta "1600 × 1200" / "PDF · 340 KB" | Alt text | Type and upload date | kept: the media API has no dimensions or file size |
| 07 Media | Footer | "10 of 214 items" + Load more | "Show more" pager only when more | `.card-foot` "N items" ("so far" when more) + "Load more" | kept (count): the API has no total, so the count is what is loaded |
| 07 Media | Import card | Card head "Import an image" with link icon; Image link (https://), Alt text with help line; primary "Import the image" with download disc | A bar with inline label/inputs and a small primary button | Card with `Glyph link` head, two `.field`s, help text as the box's description, primary `.disc` with `Glyph download` | done |
| 07 Media | Import card | Button enabled | Disabled until a link is typed | Kept | kept: nothing to import without a link |
| 07 Media | Selected card | 64px thumb, name, mono meta; dl Alt text, Used in, Uploaded | None (alt text under each tile) | Card for the picked (or newest) item: thumb, name, mono mime; `.dl` Alt text, Uploaded, File (Open the file) | done |
| 07 Media | Selected card | "Used in: Our menu" | None | Not shown | kept: the core doesn't know where an item is used |

## 08-users

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 08 Users | Layout | Page on the ground: a filter row, then one flush card | One big card with a `.bar`, a legend row and a notes list | `.scroll.page.users` > `.stack`: `form.filters`, `section.card` (screens/users.css) | done |
| 08 Users | Page head | "Add a user" primary pill with a plus disc, in the head | Small primary button at the end of the bar | `<HeadActions>` primary `.disc` + `Glyph plus`; name unchanged | done |
| 08 Users | Filter row | Search pill 260-340px "Search users by name or email", secondary Search | Small box "Search by name, username or email" + small Search | `SearchInput` pill (flex 1 1 260px, max 340px), normal Search button; Enter still searches | done |
| 08 Users | Filter row | Dashed chips "Site: Any" and "Role: Any" with a chevron | None | `Menu className="chip"` for Site (Any + every site shown) and Role (Any + every role the sites have); filter the rows already read; a chosen one gets `.chip.on` | done |
| 08 Users | Table | Columns User, Site, Role, Last seen, Actions (right) | Name, Email, Role, Site, (actions) | User, Site, Role, Joined, Actions (`.r`) | done |
| 08 Users | Table | User: 36px initials avatar, bold name, mono email under it | Bold name, dim username, email in its own column | `.site`: `.av.lg.well` initials, `b` name, mono `small` email (username when there is no email) | done |
| 08 Users | Table | One avatar tinted green (`mc-av--me`, the signed-in person) | None | All avatars on the well | kept: the app doesn't know which site user is you |
| 08 Users | Table | Site: 22px site letter tile + name, 13px muted | Site name text | `.conn` with `<SiteTile size="sm">` (22px here) + name | done |
| 08 Users | Table | Role as a 28px well pill; Administrator green (`cm-chip--brand`) | Plain text | `.pchip`, `.pchip.brand` for administrators (new shared class, base.css) | done |
| 08 Users | Table | LAST SEEN, mono 12px subtle ("Today", "3 days ago") | None | "Joined": the user's registered date, mono `.when`, full time on hover | kept: WordPress keeps no last-seen time; the users API has the registered date, shown instead |
| 08 Users | Table | Actions: ghost small "Change role", ghost small mail icon "Send password reset", 32px trash icon button | Outlined small buttons, red "Delete" button | `.btn.ghost.sm`, `Glyph mail`, `.icon-btn` with `Glyph trash`; accessible names unchanged ("Delete X from Y") | done |
| 08 Users | Table | 56px rows, 16px cell padding | 48px rows | 60px (the 36px avatar and two lines), 16px padding | done |
| 08 Users | Legend | No legend | "Users on every site shown..." row above the table | `.sr-only` (still the table's description) | done |
| 08 Users | Card foot | "5 accounts for 4 people on 4 sites" subtle | None | `.card-foot` count: accounts, people (by email), sites | done |
| 08 Users | Notes | None (all sites read) | Text rows under the table | A `.callout` each under the card (info; warning when a site failed) | done |
| 08 Users | Dark | Same structure on dark2 | Same as light before | Same classes; tokens carry the theme | done |

## 09-comments

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 09 Comments | Layout | 1000px page on the ground: a row with the lists and a Site filter, then a card per comment | One big card with a bar, a legend and divided rows | `.scroll.page.comments` > `.stack` (max 1000px), `.filters`, `ul.stack.inbox` of `li.card` (screens/comments.css) | done |
| 09 Comments | Layout | Head and page centred in a 1000px column | Head on the left | The cards are 1000px wide at most, from the left edge under the head | kept: the page head is the App shell's; centring only the cards would put them out of line with it |
| 09 Comments | Filter row | `.segmented` with counts (Waiting for approval 3, Spam 12) | Segmented without counts | `.segmented.inline`; the open list shows its total (sum over sites) in `small` | done |
| 09 Comments | Filter row | Counts on lists that aren't open | None | Only the open list's count | kept: a count for each list would cost one request per list per site |
| 09 Comments | Filter row | Dashed "Site: Any" chip pushed right | None | `Menu className="chip"` after `.end`; filters the comments already read | done |
| 09 Comments | Comment card | 36px initials avatar, bold name, subtle "on **MC A**, on <link>Our menu</link>", mono time on the right | One meta line: name, email, post, site, date | `.cwho`: `.av.lg.well`, `b` name (email in the tooltip), `.on` line with `<SiteTile sm>` + bold site, post title; mono `.when` | done |
| 09 Comments | Comment card | Post title is a green link to Content | Plain text | Plain text, full title in the tooltip | kept: Content opens one site's list, not a single post from here |
| 09 Comments | Comment card | "18 minutes ago" | "2026-10-28 09:41:00" | "28 Oct 2026, 09:41" (the app's date format), raw value on hover | kept: the API gives the site's local time without its zone, so "minutes ago" could be hours off |
| 09 Comments | Comment card | Text 15px / 23px | 14px | `.said` `--fs-md` / 23px | done |
| 09 Comments | Comment card | One avatar tinted (`mc-av--me`) | None | All on the well | kept: the app doesn't know which commenter is you |
| 09 Comments | Comment card | "Looks like spam" amber badge on one comment | None | None | kept: the comments API has no spam score |
| 09 Comments | Actions | Soft "Approve" with check, ghost "Mark as spam", ghost trash "Move to the trash", secondary reply icon "Reply" (aria-expanded) | Small primary Approve, outlined Spam, red Trash, Reply hidden while replying | `.btn.soft` + `Glyph check`, `.ghost` buttons with the design's words and icons, Reply stays with `aria-expanded` and toggles | done |
| 09 Comments | Actions | (names) | "Mark X's comment on Y as spam", "Move X's comment on Y to the trash" | "Mark as spam: X's comment on Y", "Move to the trash: X's comment on Y" (axe label-in-name: the visible words start the name) | done |
| 09 Comments | Reply | A well (14px, 12px radius): label, 84px textarea, help, then ghost Cancel and primary "Send the reply" with an arrow disc on the right | Plain form, Send then Cancel on the left | `.reply` well, textarea min 84px, `.rowacts` right: ghost Cancel, primary `.disc` + `Glyph arrow` (a11y.spec now tabs through Cancel to Send) | done |
| 09 Comments | Legend | None | "Newest first..." row | `.sr-only`, still the list's description | done |
| 09 Comments | Notes | None | Text rows under the list | A `.callout` each under the cards | done |
| 09 Comments | Dark | Same structure on dark2 | Same as light before | Same classes; tokens carry the theme | done |

## 10-classic-monks

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 10 Classic Monks | Head | Classic Monks mark beside the title, Site picker on the right of the head | Title only, site picker inside the card bar | Mark in the page head (App.tsx `.marked`), `SITE` label and picker in `HeadActions` with the site's favicon | done |
| 10 Classic Monks | Tabs | Features, Settings, Activity, Waiting for approval (count), Reports on the ground, green underline | Tabs inside the card | Shared `Tabs` on the ground, amber count chip | done |
| 10 Classic Monks | Filter row | SECTION select, Find a feature search, "6 switched on" at the right | Section select and search in a bar | `.filters` row, count from the features read | done |
| 10 Classic Monks | Feature list | One card, mono section labels, a switch beside each feature with its line | Rows with On/Off words and Turn on/off buttons | Drawn switches (`role="switch"`), section labels; locked features show a lock and stay read only | done |
| 10 Classic Monks | Feature count | 9 features over three sections | Mock site has 3 features | Same component, the site's own list | kept: data, the features shown are the ones the site's Classic Monks reports |
| 10 Classic Monks | Side column | Site card (tile, version, "2.5.0 ready" tag, how changes work), amber approvals card with See what's waiting, Recent changes with Undo and Activity link | Notes under the table | Three cards in the side column; update tag shows when inventory has a Classic Monks update | done |
| 10 Classic Monks | Site tile | Monogram tile | Text only | `SiteTile`: the site's favicon, monogram when none | done |

## 11-monitoring

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 11 Monitoring | Head | "Load every home page now" primary with disc | Button in a bar | `HeadActions` primary | done |
| 11 Monitoring | Note | Green well: monitoring runs only while the app or tray agent runs | Plain paragraph | `.callout` on the tint | done |
| 11 Monitoring | Stats | Home pages up (bar), Uptime 30 days, Average response, PageSpeed mobile; mono labels | Three plain numbers | Four stat cards from the monitors read | done |
| 11 Monitoring | Table | Site tile + address, status pill + ms, Last 24 hours line, Uptime 30 days, PageSpeed tag, row action | Plain table | Design columns, favicons, pills, tags, row actions (Check again, Run PageSpeed again) | done |
| 11 Monitoring | Last 24 hours | A green response-time line, red dots where it was down | A share bar ("100%") | Core: `Monitor.day`, 24 hourly points from the checks already kept (`uptime` table); UI: `Day` draws the line and red dots, screen-reader words give uptime and the ms range | done |
| 11 Monitoring | Renewals column | Not in the design | Certificate and domain expiry per site | Kept as its own column between Uptime and PageSpeed | kept: an existing feature (certificate and domain expiry warnings) the design leaves out; e2e/screens.ts keeps every control |
| 11 Monitoring | Check again label | Visible "Check again" | aria-label "Check X again" (axe label-content-name-mismatch) | "Check again: X" | done |
| 11 Monitoring | Footer | None | Checked time and how monitoring works | Kept as the card foot | kept: says what the numbers mean (docs/ux/README.md: plain words for every number) |

## 12-security

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 12 Security | Head | Scan all sites now (secondary) and "Update 1 vulnerable plugin" primary with disc | Buttons in a bar | `HeadActions` | done |
| 12 Security | Stats | Open vulnerabilities (amber card), Sites clear, Last scan | One sentence | Three stat cards, amber when any are open | done |
| 12 Security | Finding card | Shield tile, severity tag, plugin and type in mono, title, description, a key-value well (affected versions, fixed in, sites affected with tiles, not affected), warning when a site couldn't be reached, "Update to fixed version" soft button and Read more link | Table rows | A card per vulnerability with the same parts and favicons in "Sites affected" | done |
| 12 Security | Affected versions | "2.3.1 and earlier" | Installed version | Shows Installed and Fixed in | kept: data, WPVulnerability gives the affected range as words in the title; the app shows what each site runs |
| 12 Security | Side column | Sites with nothing known (tile, plugins and themes scanned, Clear pill) | A list in text | Card with favicons and Clear pills; Not checked card for sites not scanned | done |
| 12 Security | Abandoned plugins | Not in the design | Table of abandoned plugins | Kept as a card under the findings | kept: existing feature (closed or two-year-old plugins); every control stays |

## 13-clients

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 13 Clients | Layout | Page on the ground: three stat cards, then a table card with Renewing soon beside it (`split-r`) | One card: a bar, a legend, the Clients table, a "Costs and charges" heading and a second table | `.scroll.page.clients` > `.stack`: `section.g3` of `.stat`, `.split-r` with two cards (screens/clients.css) | done |
| 13 Clients | Page head | Secondary "Add a cost or charge" with plus icon, primary "Add a client" with plus disc | Small buttons in the bar | `<HeadActions>`; names unchanged | done |
| 13 Clients | Stats | CHARGED EACH MONTH $340 "from 2 clients"; COSTS EACH MONTH $86 "hosting, licences, email"; LEFT OVER $254 "a month" + a cost/left bar | None (count in the bar) | `.stat` cards with `.label`, 36px `strong` (whole amounts drop ".00"), the clients paying, the first cost names (cut, full in the tooltip), and a `.mix` bar (`k-off` costs, `k-up` left, `role="img"` "Costs are N% of charges") | done |
| 13 Clients | Stats | One currency | Amounts in several currencies | The currency most amounts use is the big number; any other is a quiet "Also $23.25" line | done |
| 13 Clients | Table | Columns Client or cost, Sites, Charged, Costs, Monthly (numbers right) | Client, Sites, Costs a month, Charges a month, Left a month, Next renewal | The design's columns, `.r` mono amounts, one line per currency; a column leaves out a currency with nothing in it | done |
| 13 Clients | Table | Client: 36px initials avatar, bold name, mono email; the open client tinted | Underlined link, email under it | `.site` with `.av.lg.well`, name button (bold, underline on hover), mono `small`; the row of the client being edited gets `tr.sel` | done |
| 13 Clients | Table | Sites as well pills ("MC A") | "MC A, Corner Bakery" text | `.pchip` per site with `<SiteTile sm>` (the brief: tiles in client site lists) | done |
| 13 Clients | Table | Costs and charges set in under their client (62px): name 500, "Charge · monthly · renews Jan 4", the amount in its column | A separate "Costs and charges" table | `tr.item` rows under each client (charges first); name opens the cost sheet; meta: kind, how often, the site when the client has several, renews/due date; raw amount in Charged or Costs | done |
| 13 Clients | Table | "No client yet / Costs you pay yourself" with a dashed "?" avatar | "No client" | Same words and dashed `.av.none`; holds sites without a client and costs on them (and any cost whose client is gone) | done |
| 13 Clients | Table | Monthly negative in red "−$10" | "minus €x" in red | Intl's "-$10.00" in red, bold: sign and colour | done |
| 13 Clients | Table | Next renewal column | Next renewal column | Moved to Renewing soon and each cost's meta line | done |
| 13 Clients | Table | No legend | "Per month: a yearly amount counts a twelfth..." row | A subtle `.card-foot` line, the table's description | kept: the Monthly numbers need the rule (yearly counted as a twelfth, one-off left out); it sits quietly in the foot |
| 13 Clients | Renewing soon | Card head with a calendar icon; `.mc-item` rows: neutral tile (server/globe), "Hosting · Studio North", "Nov 12 · yearly · $180", amber "15 days" badge, others grey | None | `.card-head` + `Glyph calendar`; `.fix` rows: `.tile.sm.neutral` (globe for domains, monitor for hosting, package otherwise; the icon set has no server), label · client or site, date · how often · amount, `.tag` days (amber within 30 days, red when passed) | done |
| 13 Clients | Dark | Same structure on dark2 | Same as light before | Same classes; tokens carry the theme | done |

## 14-store

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 14 Store | Head | SITE picker and 7/30/90 days segmented in the head | In a bar inside the card | `HeadActions`, the picker shows the site's favicon | done |
| 14 Store | Orders card | Revenue (big), trend "+12%", orders and average, a bar per day | Plain numbers | Card with revenue, paid orders, average order; orders by status bar and key, to-send and out-of-stock counts, Running low note | done |
| 14 Store | Daily bars and trend | 30 bars, one per day; "+12%" against the period before | none | Orders by status bar instead | kept: data, the core reads WooCommerce's totals for the period (`shop::Overview`), not a per-day series or the period before; closest real data is shown |
| 14 Store | Products | Search, STOCK select, Product (image tile, SKU), Price (sale struck through), Stock with Low / Out of stock tags, Sold 30 days, row action | Plain table | Design table, tags, struck regular price, Change price or stock; options products say "Change it in wp-admin" | done |
| 14 Store | Sold, 30 days | Per product | none; app has Status | Status column instead | kept: data, the product list (`shop::Product`) has no sales count |
| 14 Store | Change a product | D09: dialog with product tile, Price / Sale price / Stock, Review the change, then the exact change and one click | Sheet | Dialog with the same fields; Review the change goes to the plan sheet's Confirm step | done |

## 15-reports

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 15 Reports | Layout | Two columns: Make a report card and its result on the left, the report's page on a well on the right | One settings-style column, the preview iframe under it after making | `.rep-split` (0.62fr / 1fr), `styles/screens/reports.css` | done |
| 15 Reports | Make a report | Card head; Which sites segmented (A client's sites / Sites I pick), Client select with "Covers MC A and MC B", Month, "Make the report" primary with arrow disc | Long intro paragraph, no Covers line, plain button | Card, Covers line, disc button; picked sites show favicons | done |
| 15 Reports | Ready card | Tick tile, "September report for Corner Bakery is ready", Open the PDF (soft), Open the HTML, Show in folder link | Green alert with three buttons | Card with tick tile, soft PDF button, HTML button, Show in folder link, left-out sites in a warning callout | done |
| 15 Reports | Report preview | White page: MONTHLY REPORT · month, client, site names, accent rule, business name, three stat tiles, What we did this month, Search bars, footer line and Made with Monks Central | Nothing before making; iframe after | Drawn page from Settings (business name, footer, accent, white label) and the picked client and sites; after making, the real report in the sandboxed iframe in the same well | done |
| 15 Reports | Preview numbers | 98.7% uptime, 11 updates, 1 security fix, Search Console bars | none | "What it covers" list until the report is made; the real numbers show in the made report | kept: data, the numbers are read from each site when the report is made (`report::make`); no stand-in numbers before that |
| 15 Reports | Footnote | "Branding, the footer line and data sources live in Settings" with a link | none | Footnote with a link that opens Settings | done |

## 16-ai

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 16 AI | Head | Connect an AI app (secondary, link icon) in the head | A fourth tab | `HeadActions` button opening the Connect dialog (D08) | done |
| 16 AI | Tabs | Plans to confirm (amber count), Agent access, Activity | Four tabs, collapsed to 1px in the grid page so they couldn't be clicked | Three tabs; `.tabs { flex: none; min-height: max-content }` in controls.css keeps every tab strip clickable | done |
| 16 AI | Plan card | Agent avatar, name, "Connected AI app · asked 12 minutes ago", Waiting for you tag; title; the agent's reason in quotes; EXACTLY WHAT WILL CHANGE boxes per site (old version struck in red, new in green); warning callout; foot with "Nothing runs until you confirm", Decline, Confirm and run with tick disc | Plain list and buttons | Same parts; a box per site with favicon; callout when a site is down or needs sign-in again | done |
| 16 AI | Agent name and reason | "Claude", and the agent's own words for why | "AI agent" | Shows "AI agent" | kept: data, a plan (`Job`) records that an agent proposed it, not which app or why |
| 16 AI | Side column | Agent access card with a switch per site (tile, On/Off), How agents work here card | Separate tab only | Access card beside the plans, How card under it; the Agent access tab shows the full list with what each setting means | done |
| 16 AI | Activity | Feed: avatar, sentence with bold names, time | Table | Feed with the Overview's sentences, outcome pill where not done, Show older entries | done |

## 17-settings

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 17 Settings | Layout | Two columns of cards (Look, Data sources, Your data; Reports), centred about 1040px wide | One long form | `.setpage > .g2` two columns, max 1040px | done |
| 17 Settings | Look | Theme segmented with icons, Density segmented | Selects | Segmented choices with icons; label "Density" as the design | done |
| 17 Settings | Text size | Not in the design | Slider | Kept under Density | kept: existing feature (browser text size rule, docs/ux/README.md 6a Slider) |
| 17 Settings | Data sources | Switch rows: AgentedSEO, Search Console with Set up | Checkboxes | Switches, Set up opens the D09 dialog | done |
| 17 Settings | Your data | Export as JSON, Export as CSV, Import link | Export menu button | Two buttons and the import drop area; the saved path comes as a toast with Show in folder (D09) | done |
| 17 Settings | Reports | Business name, footer line, accent colour (hex + swatch), white label, preview, Save with tick disc | Same fields, no preview | Preview block on the well in the accent colour; ColorInput swatch | done |
| 17 Settings | Updates for Monks Central | Not in the design | Check for a new version | Kept as its own card | kept: existing feature (signed app updates) |

## 18-search

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 18 Search | Search row | Wide search box and Search primary with arrow disc | Box and plain button | `.srch-go` with SearchInput and disc button | done |
| 18 Search | Filters | All / Pages / Posts / Products chips with counts, "4 results on 2 sites" | Separate tables per kind | Segmented chips with counts for the kinds found, result count line | done |
| 18 Search | Results | One list card: kind tile, title with the term marked, "Page · MC A · Published", Edit, View on site | Tables | One list, `<mark>` on the term, Edit opens the editor sheet in place, View on site | done |
| 18 Search | Excerpt and date | "Published Oct 24 · Breads, pastries…" | none | Kind, site and status only | kept: data, `content_search` returns title, status and link per post, not an excerpt or date |
| 18 Search | Products | Products in the results with Open in Store | none | Sites, plugins, themes and clients from what the app knows are in the list instead | kept: data, the core's content search asks for posts and pages, not WooCommerce products |
| 18 Search | Ctrl K hint | Callout with the command icon | none | Callout with Kbd | done |
| 18 Search | View label | Visible "View on MC A" | aria-label "View Our menu on MC A" (axe label-content-name-mismatch) | "View on MC A: Our menu" | done |

## d01-empty-error

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D01 Overview empty | Layout | One centred card: brand disc, "Every WordPress site you look after, in one place" (Outfit), one line, primary Add a site with a plus disc, "or press A", stepper 1 Add a site, 2 Sign in once, 3 See what needs you | Three step cards with long text, Add a site in the first, Open the command palette in the third | The design's card and stepper; the privacy line and the palette (now a link) stay under the card | done |
| D01 Overview empty | Brand disc | Logo image in a tint disc (broken image in the bundle) | none | Classic Monks mark in a 56px tint disc | done |
| D01 Error | Card | Danger disc with the alert icon, "Couldn't load the fleet", "**Nothing was changed.** Check this computer's internet connection, then try again.", Try again (refresh icon), mono detail | Inbox picture, title, error text and advice in body text, Try again | Danger disc, bold "Nothing was changed.", Try again with the icon, the error in mono under it; the card is as tall as its content | done |
| D01 Error | Wording | Internet connection advice | Restart advice | Kept the app's advice for each case (the core didn't start; the sites list didn't load) | kept: the app's two errors have different causes, so each says its own next step |
| D01 Toast | Toast | Ink box, green tick, words, close | Ink toast with tick and close | See D09 | done |

## d02-add-site

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D02 Add a site | Frame | Centred dialog, 18px radius, float shadow, no line under the head, panel-ground foot | Side sheet | `Sheet dialog` (new variant): centred, 480px, same paddings; the side sheet stays for the long flows | done |
| D02 Add a site | Head | "Add a site", stepper 1 Address, 2 Sign in, close x | Title and "needs WordPress 7.1" intro | Title, the job flow's stepper (done steps carry a tick), close x | done |
| D02 Add a site | How to connect | Two stacked choice cards: tile, name, "Recommended" badge, one line; picked card tinted with a green ring | Two radio cards side by side with long text | Stacked cards with the Classic Monks mark and a link tile, "Recommended" tag, the design's lines; the radio is inside the card (sr-only), the card shows focus | done |
| D02 Add a site | Classic Monks steps | none | Five-step list | One info callout with the same steps (tick the tool groups, tick the operator box) and the WordPress 7.1 note | kept: without the tool groups and the operator tick the connection can't do anything; the words must be there before the browser opens |
| D02 Add a site | Address check | none | Error line under the box | Kept; the line only takes room when there is an error | kept: docs/ux/README.md wants the problem in words beside the field |
| D02 Basic mode | Step 2 | Basic is its own step: host chip with globe, "Basic mode" chip, user name, application password with a lock line, "Where do I make one?" link; Back / Add the site with a tick disc | Fields under the cards in one step | Next on step 1, then step 2 as designed; the link opens the site's own profile page where application passwords are made | done |
| D02 Foot | Buttons | Ghost "Close without adding", primary with external disc; "Press Enter to continue" under the dialog | Plain buttons | Ghost and disc primary; the Enter hint is the key chip inside the primary button | kept: the app shows keys on the button that takes them (one rule for every sheet) |
| D02 Sign in again | Dialog | Warn tile with the login icon, "MC C: the connection expired", mono "mc-c.test · Classic Monks", the sentence about notes, tags and group, info note "Until you sign in…", Later / Sign in again with an external disc | Side sheet "Sign in to X again", read-only address, the radio cards | As designed; Basic mode sites also get the user name and password fields; a site with no tools gets "X: sign in again" and a line about ticking tool groups | done |
| D02 Sign in again | Close x | none | n/a | Kept the x | kept: every dialog closes the same way (Esc or x) |
| D02 Waiting | Browser | not drawn | "Waiting for you in the browser" and Cancel the sign-in | Kept in the foot; the stepper moves to Sign in while waiting | done |

## d03-updates-flow

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D03 Updates flow | Sheet frame | Dialog / drawer: radius 18 / 16, float shadow, head, body, foot on the well | Side sheet, radius 18, no close button | Kept as the side drawer (it is the app's sheet for every flow); radius 16 (the drawer's), float shadow, foot on the well | done |
| D03 Updates flow | Sheet frame | Centred dialogs, three side by side on a board | Side sheet at the right | Side sheet | kept: the board shows the three steps at once; the app shows one step at a time in the shared side sheet that every flow uses |
| D03 Updates flow | Head | Title, stepper under it, close icon button at the top right | Title and intro line; stepper in the body | Head is title + quiet line + stepper (new `steps` slot in `Sheet`) and a close icon button (`.sheet-x`, "Close", Esc tooltip) at the top right of every sheet; focus still lands on the first real control | done |
| D03 Updates flow | Stepper | `.mc-steps`: Pick, Review, Run; 20px rings joined by 18px hairlines; current ink filled, done tint with a tick | "1. Plan", "2. Confirm", "3. Progress", 22px rings by CSS counter | `.jobsteps` with an `<i>` ring per step: number, or a check glyph when done (tint ground, brand ink); current ink (green in dark); "Pick / Review / Run"; ", done" for screen readers | done |
| D03 Updates flow | Pick | Per site: bold "Every change on MC A" + count; changes indented under a 2px hairline, each "Name 1.0 → 1.1 · security fix"; the whole line toggles | Site name heading, rows "Update X" with versions at the right | `.jobpick`: site line with box, `SiteTile`, "Every change on X" and count; changes under a 2px hairline with box, the item's name, quiet "from → to · security fix"; the whole line toggles; box names unchanged | done |
| D03 Updates flow | Review | Mono label "On MC A" per site, rows "Update X" with mono versions at the right | One list, "Site, Update X" | `.jobreview`: mono label per site, label at left, versions at right in ink | done |
| D03 Updates flow | Review | "Action needed after updating" warn note | None | Not shown | kept: Monks Central doesn't read release notes or upgrade steps |
| D03 Updates flow | Run | "5 of 6 done" + "1 failed" over a 6px meter | 6px bar only | `.jobmeter-head` ("N of M finished", what didn't finish) and `.jobmeter` (6px, well track, green fill); progressbar name unchanged | done |
| D03 Updates flow | Run | `.mc-prog` rows: state icon, bold name, quiet "MC A · now 11.2.1" (danger ink when failed), mono state word right; odd rows on the well | Mono state tag at left, "Site, label", why under | `.jobprog`: check-circle / x-circle / undo / loader (spins; still when the OS asks for less motion) / clock; bold label; "site · now X · message" (danger when failed); mono state word at the right; odd rows on the well | done |
| D03 Updates flow | Run | Rows name the plugin ("WooCommerce") | The core's label ("Update plugin" in the mock) | The job item's label | kept: the core's job item has only its label |
| D03 Updates flow | Foot | Ghost "Close without changes" / "Back" / "Close", primary pill with a disc (arrow on Review, check on Make these changes); "Try the 1 failed change again" is the primary with a refresh icon | Outlined secondary buttons, plain primary | Every sheet foot's non-primary, non-danger buttons are ghost; disc on Review (arrow) and Make these changes (check, not on the red risky confirm); retry is the primary with refresh, Close goes ghost | done |
| D03 Updates flow | Foot | No "N selected" | "N selected" status at left of the Pick foot | Kept | kept: app's live count of what will run |
| D03 Updates flow | Errors | n/a | `.alert.danger` | `.callout.danger` with alert glyph, still `role="alert"` | done |

## d04-plugins-install

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D04 Install | Sheet chrome (head, steps, foot) | Title, numbered steps, "A plugin / A theme" in the head, footer actions | Title, intro, footer | Owned by the Sheet agent; only the title now names the pick ("Install Rank Math SEO", "Install the New shop bundle") | kept: Sheet chrome is another agent's |
| D04 Install | Head: A plugin / A theme | Segmented choice in the sheet head for the whole install | The choice sits with the zip, where it applies | Left with the zip | kept: only a zip can hold a theme; search and links are WordPress.org plugins |
| D04 Install | Search | Search pill and a secondary "Search" pill | Primary "Search" | `SearchInput` + secondary button | done |
| D04 Install | Results | One bordered card, a row per plugin: letter tile, bold name, "author · ★ 4.9 · 200,000+ installs", "Choose …" soft for the first, secondary for the rest | Plain rows: name, version, summary paragraph, installs | `.ins-found` card rows: `.ptile`, name, the summary cut to one line (full text in the tip), mono version · "10M sites use it"; first Choose is `soft` | done |
| D04 Install | Results: author and rating | Author and star rating | — | Version and installs shown instead | kept: the core's WordPress.org search returns no author or rating |
| D04 Install | Link to a zip | Label, field, "Use this link", then a warning note "Needs Classic Monks Pro on the site. Only use links you trust…" | Small grey help line | `.callout.warning` with the `alert` glyph, the first sentence bold | done |
| D04 Install | Zip from this computer | "Replace it where it's already installed" with a quiet "for a new version of a paid plugin or theme", a ghost "Choose a zip file" | Bracketed help in the label; the kit's file picker | Quiet trailing words; the kit's `FilePicker` (drop area) kept | kept: the file picker is the shared kit control (docs/ux/README.md, no native controls) |
| D04 Install | Sections | Hairlines between search, link and bundles | 24px gaps | `hr.ins-rule` before the link and before Bundles | done |
| D04 Install | Bundles | "Bundles" label; a card in the well: box tile, name, "5 plugins", ghost "Edit the Starter bundle", soft "Install Starter"; ghost "+ New bundle" | "Or a bundle" legend; name and plugin names on one line, "Edit" (named by aria-label) and "Install …" pills | `.ins-bundles` cards: `tile sm` with `package`, name, "N plugins: names", visible "Edit the … bundle" (ghost), soft "Install …", ghost "New bundle" with plus | done |
| D04 Edit a bundle | Layout | Its own dialog "Edit the Starter bundle" | Edited in place in the Install sheet | Kept in place | kept: the sheet holds the edit so the bundle list and install stay one step; fields and buttons styled to the dialog |
| D04 Edit a bundle | Buttons | Delete the bundle (danger, trash) left; "Close without saving" ghost; "Save the bundle" primary with a check disc | Small pills | Danger with `trash`, ghost, primary `.disc` with `check` | done |
| D04 Install · Where | Site list | Checkbox rows "Install on MC A"; a site that can't take it greyed with "Already installed" beside the name; a hairline, then "Activate it after installing" | Box, name, reason pushed right | `.ins-sites`: box, `SiteTile sm`, name with the reason beside it, greyed when it can't; hairline above the activate box | done |
| D04 Install · Where | Zip / bundle notes | Two side cards: "From a zip: only sites with Classic Monks Pro…", "A bundle: same site list…" | Reasons per site, bundle contents above the list | Per-site reasons kept | kept: the cards annotate the board; the app says the same on each site's row |
| D04 Roll back | Where | A dialog "Roll back WooCommerce on MC A", "Now on 11.1.0" | An inline list in the inspector with a "Roll back to X" button per version | `RollBack` sheet opened by "Choose an older version"; then the job sheet confirms it as a risky change (unchanged) | done |
| D04 Roll back | Versions | "Choose a version": rows with the mono version, the chosen one tinted with a green edge | Danger pills | Radio rows (`role="radiogroup"`, the first older stable release chosen), `.mx-vers` | done |
| D04 Roll back | Version dates | A date on each row | — | No dates | kept: the site's version list (`list-plugin-versions`) has no release dates |
| D04 Roll back | Automatic updates | "Turn automatic updates off so MC A stays on the version you pick", ticked | — | Shown when automatic updates are on for the plugin there and the connection can change them; adds "Turn automatic updates off" before the roll back in the plan | done |
| D04 Roll back | Footer | "Close without changes", primary "Roll back WooCommerce" with a disc | — | Same, the disc holds the `history` glyph | done |

## d05-content-flows

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D05 Content flows | Sheet chrome | Centred dialogs; head, foot | Side sheet | None here | kept: the Sheet chrome belongs to the sheet agent; this pass styles what's inside |
| D05 Content flows | Editor, new | Two columns: title + text left, a well side panel (status, date, terms, image, fields) right | One column | One column | kept: the 560px side sheet has no room for a 380px side panel |
| D05 Content flows | Editor, new | Title box 46px, display 20px 600 | Plain 40px box | `.input.title-lg` on new entries | done (existing entries keep 40px: their custom fields line up with the title, a11y.spec) |
| D05 Content flows | Editor, head | Mono line under the title ("Opening hours · Draft") | Plain link line | Intro in mono (the entry's link, or title · status) | done |
| D05 Content flows | Terms | `.mc-tag` pills: 26px, bordered, round x button | Grey mono `.tag` with "×" | `.terms .term` pills, 24px round button with `Glyph x` | done |
| D05 Content flows | Terms | "Add to Genres" select + Add | Combobox (type new or existing) + Add | Kept the Combobox | kept: new terms can be typed; a select can't add one |
| D05 Content flows | Featured image | 4-up `.mc-thumb` grid, picked one ringed, soft "Use rye.jpg", ghost "Keep the current image" | A grid of images each with its own "Use ..." button | `.mthumbs.small` buttons with `aria-pressed`; soft "Use {name}" for the picked (or first); quiet Keep | done |
| D05 Content flows | Featured image | "Choose image" with image icon, ghost "Remove the image" | Plain buttons | `Glyph image` on Choose an image, quiet Remove | done |
| D05 Content flows | Custom fields | Field name as the label (sans), outlined square x to remove | Mono name, "Remove" button | Sans label, `.icon-btn.line` with `Glyph x` (same name "Remove the field ..."), placeholders "New field name/value", plus icon on Add the field | done |
| D05 Content flows | Custom fields | Name and value in a 2-column grid, Add below | Name, value and Add in one row | Kept one row | kept: a11y.spec checks Add lines up with the boxes; the sheet fits it |
| D05 Content flows | Blocks | "Text block 1" fields, 72px textareas | Textareas from 2 rows | `textarea` min-height 72px; labels keep the block's type | done |
| D05 Content flows | Earlier versions | List: avatar (initials, AI sparkle), name bold, date line; the one asked tinted with a pressed "Put this version back"; others ghost; "Keep the current one" + "Put it back" | Text rows "date by author: title", the row's button swapped for Keep/Put it back | `.vlist`: `.av` initials, name, mono date · title; tinted `li.on`, `aria-pressed` button; a `.callout` under the list with the question and Keep/Put it back | done |
| D05 Content flows | Earlier versions | First row "Current" badge | None | Not shown | kept: the revisions API lists earlier versions only, not who made the current one |
| D05 Content flows | Earlier versions | Show earlier versions with a history icon | Plain button | `Glyph history` | done |
| D05 Content flows | Bulk change | Title + one line naming the entries; ghost close, primary "Make these 2 changes" | JobSheet plan | None here | kept: JobSheet belongs to the sheet agent |
| D05 Content flows | Trash confirm | Danger note with trash icon "Move this post to the trash? It comes off the site...", ghost "Keep it", solid red "Move it to the trash" with icon | Plain sentence in the footer, outlined red button | `.callout.danger` in the footer with `Glyph trash`; `.btn.danger.solid` with `Glyph trash` | done |
| D05 Content flows | Footers | Primary with a check disc (Save changes, Add the book), arrow disc (Review the plan) | No discs | `.disc` + `Glyph check` / `Glyph arrow` | done |
| D05 Content flows | Publish on several sites | Post/Page segmented in the head | Segmented in a "What to add" field | `.segmented.inline` in the field | kept: the head is Sheet chrome |
| D05 Content flows | Publish on several sites | Date and Categories side by side | Stacked | Stacked | kept: the date + time boxes need the full 560px sheet width |
| D05 Content flows | Publish on several sites | Site rows: check, name, a quiet reason; off rows subtle | Check, name, dim reason | Check, `SiteTile sm`, name, small reason; unavailable rows text-3 | done |
| D05 Content flows | Toast | "Moved to the trash." with "Bring it back from the trash" | Toast without an undo | The toast kit's Undo on "Moved ... to the trash" when the site has untrash-post; it brings the entry back and refreshes the list | done (the kit's button reads "Undo") |

## d06-users-clients

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D06 Users and clients | Sheet chrome | Centred dialogs; head with an x close; Delete has a red trash tile and "Delete Sam Okafor from MC A" / "Their account on MC B stays as it is." | Side sheet, title + intro | None here | kept: Sheet chrome (03/D03), owned by the sheet agent; this pass styles what's inside |
| D06 Users and clients | Sheet chrome | Add a cost or charge: the kind segmented sits in the head | Segmented at the top of the body | Kept in the body | kept: Sheet chrome (03/D03), the head takes no controls |
| D06 Users and clients | Add a user | Site select | Name only | `<SiteTile sm>` before each site in the Site select | done |
| D06 Users and clients | Add a user | Username and Email side by side (`mc-g2`, 12px gap), help under Username | Stacked | `.g2.pair` (new shared class, base.css: 12px gap, top aligned so Email doesn't drop when the help wraps) | done |
| D06 Users and clients | Add a user | Amber note with alert icon: "**An administrator can change everything on MC A,** including plugins, users and settings." | Small help line under Role | `.callout.warning.admin-note` with `Glyph alert`, the design's words; Change role uses the same note | done |
| D06 Users and clients | Add a user | Footer: ghost Cancel, primary "Add the administrator" with plus disc | Primary first, outlined Cancel | Ghost Cancel then primary `.disc` + `Glyph plus`; Change role: primary with check disc | done |
| D06 Users and clients | Delete a user | Select starts on "Choose a user"; solid red "Delete Sam Okafor" with trash icon, disabled until chosen; ghost Cancel first | The first other user picked; outlined red Delete | `placeholder="Choose a user"`, nobody picked; `.btn.danger.solid` + `Glyph trash`, disabled until a user is chosen (Phase4 test chooses now) | done |
| D06 Users and clients | Delete a user | Options are names ("Mira Patel") | "Name (username)" | Kept "Name (username)" | kept: two users can share a display name; the username tells them apart |
| D06 Users and clients | Delete a user | Help: "Sam wrote 12 posts and 3 pages on MC A." | None | "Their posts and pages move to this user before X is deleted from Y." | kept: the users API has no post counts |
| D06 Users and clients | Edit a client | Name and Email side by side; Notes 72px | Stacked; 3-row notes | `.g2.pair`; `.notes-box` min 72px | done |
| D06 Users and clients | Edit a client | Their sites as checkboxes, "now with Studio North" small after a taken site | Multi-select: chips + a type-to-find box ("(now with X)" in the option) | Kept the multi-select | kept: a checkbox per site grows past a screen with a real fleet; the multi-select finds a site by typing (a11y.spec "a client is added from the keyboard") |
| D06 Users and clients | Edit a client | Footer: outlined red "Delete the client" with trash on the left, ghost "Close without saving", primary "Save changes" with check disc | Red outlined Delete, outlined Close, primary without disc | `Glyph trash` on Delete (`.push`), ghost Close, primary `.disc` + `Glyph check` (plus on Add the client); the delete confirm uses `.btn.danger.solid` | done |
| D06 Users and clients | Add a cost or charge | Two-column grid: On / What it is, Amount / Currency (mono), How often / Renews on | Stacked, Amount + Currency in a row | `.g2.pair` around the six fields; `.input.mono` for amount and currency; the amount error stays under Amount | done |
| D06 Users and clients | Add a cost or charge | How often: Monthly, Yearly, Once | Every month, Every year, Once | The design's words (lower case in the table meta) | done |
| D06 Users and clients | Add a cost or charge | Footer: ghost "Close", primary "Add it" with plus disc | Outlined "Close without saving", primary | Ghost "Close" when new ("Close without saving" when editing), primary `.disc` + `Glyph plus` / `check` | done |
| D06 Users and clients | On select | Plain names | Plain names | `<SiteTile sm>` before each site under Sites | done |

## d07-classic-monks-tabs

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D07 Classic Monks | Settings | A row per setting with its box and its own Save button, hint under it | Form with one Save | Each setting saves on its own (Save <name>), NumberInput for numbers, hints | done |
| D07 Classic Monks | Undo, confirm | Dialog "Undo this change on MC A?" with what goes back, Keep it / Undo with disc | Undo ran at once | `useUndo` asks first in a dialog: the change, who made it and when; Keep it or Undo | done |
| D07 Classic Monks | Undo before and after | Old value struck, new value in green | Change name and who made it | Shows the logged change's summary | kept: data, the site's activity log (`ActivityRow`) gives a summary, not the old and new values |
| D07 Classic Monks | Activity | Feed with avatar, change, who and when, Undo or the outcome, pager | Table | Feed with avatars (You, initials), Undo or status, Previous / Next page | done |
| D07 Classic Monks | Waiting for approval | Clock tile, change, who asked and when, "Approve or decline on the site" | Table | List with tiles, time left, the button opens the site's approve page | done |
| D07 Classic Monks | Reports | Module activity on MC A with 7/30/90 days, three numbers, a bar per day | Tables | Card with range segmented, the module numbers, 404 and searches tables | done |
| D07 Classic Monks | Daily bars | A bar per day | none | Numbers for the range | kept: data, `CmReports` gives totals for the range, not a per-day series |

## d08-ai-states

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D08 AI | Plan confirmed | Progress sheet: title, "Asked by Claude · confirmed by you", n of m done bar, a row per change with Done / Failed, Close and Try the failed change again | Job sheet | The shared job sheet (D03) with stepper, bar, rows and retry | done |
| D08 AI | Nothing to confirm | Round tick on the tint, "No plans waiting", the rule in a sentence | Heading and paragraph | `.empty-pic` tick, same copy | done |
| D08 AI | Activity | Feed of what agents ran, "Confirmed by you" | Table | Feed (see 16) | done |
| D08 AI | Connect an AI app | Dialog: Connection snippet on ink with the server name picked out, Copy, lock callout | A tab | Dialog with the Claude Code command and the snippet, Copy for each, lock callout | done |
| D08 AI | "Asked by Claude" | The agent's name | "AI agent" | kept: data, see 16 Agent name | kept: data, plans don't record the agent's name |

## d09-store-settings

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D09 Store | Change a product | Dialog with product tile, Price, Sale price (hint), Stock (now n), Close without changing / Review the change | Sheet | Centred dialog with the same fields and copy | done |
| D09 Store | Confirm | The exact change (stock 4 → 30, price no change) then "Change Rye loaf: stock 30" | Sentence and button | Review the change opens the shared plan sheet at its Confirm step, which lists the exact change ("Change “Rye loaf”: stock 30") on the site; the before value isn't shown | kept: layout, the confirm is the one plan sheet every change uses (D03), not a separate small dialog; the stock before is in the dialog's hint ("Now 4") |
| D09 Settings | Search Console | Dialog: Client ID, Client secret, "Kept encrypted on this computer", Cancel / Save the client | Inline form | Dialog with the same fields; the note says "Kept in this computer's keychain" | kept: copy, the secret is in the OS keychain, so the words say where it is |
| D09 Toasts | Exported | Ink pill with tick, file name, Show in folder | Banner | `toast(text, { action })`: ink pill as wide as its words, green tick, action button | done |
| D09 Toasts | Saved | Ink pill with tick and close | Banner | Same toast, close button with the x glyph | done |

## d10-palette

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D10 Palette | Frame | 640px panel 110px from the top, 16px radius, float shadow, dimmed page | Plain panel, input on top, no search icon | Panel size, radius, shadow and position from the board | done |
| D10 Palette | Search row | Search icon, borderless input, Esc key on the right, line under | Bare input | Search icon, input, Esc key, line under | done |
| D10 Palette | Search focus | No ring on the input | n/a | The input keeps the app's focus ring | kept: docs/ux/README.md wants a visible focus on every control |
| D10 Palette | Groups | Actions, then site-named groups, then Pages, small caps headings | Groups in mixed order, pages unlabelled | Actions first, Sites, Pages last ("Go to Updates") | done |
| D10 Palette | Rows | 24px tile with an icon (site rows: favicon or monogram), label with the match in bold, muted hint, value on the right, Enter on the selected row, tinted selected row | Text rows | Tile with the design icon or SiteTile, Marked label, hint, keys; Enter shows on the selected row; 48px rows, --sel tint | done |
| D10 Palette | Foot | Up Down to move, Enter to run, Esc to close, "Every action, site and page" on the right, panel ground | Hint line | Same keys and words on the panel ground | done |
| D10 Palette | Query | Board shows "upd" typed | Screen opens empty | Same palette, the screen shot opens before typing | kept: the shot is the open state; typing filters the same rows (vitest App.test) |
