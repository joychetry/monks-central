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
