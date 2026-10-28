| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 18 Search | Search row | Wide search box and Search primary with arrow disc | Box and plain button | `.srch-go` with SearchInput and disc button | done |
| 18 Search | Filters | All / Pages / Posts / Products chips with counts, "4 results on 2 sites" | Separate tables per kind | Segmented chips with counts for the kinds found, result count line | done |
| 18 Search | Results | One list card: kind tile, title with the term marked, "Page · MC A · Published", Edit, View on site | Tables | One list, `<mark>` on the term, Edit opens the editor sheet in place, View on site | done |
| 18 Search | Excerpt and date | "Published Oct 24 · Breads, pastries…" | none | Kind, site and status only | kept: data, `content_search` returns title, status and link per post, not an excerpt or date |
| 18 Search | Products | Products in the results with Open in Store | none | Sites, plugins, themes and clients from what the app knows are in the list instead | kept: data, the core's content search asks for posts and pages, not WooCommerce products |
| 18 Search | Ctrl K hint | Callout with the command icon | none | Callout with Kbd | done |
| 18 Search | View label | Visible "View on MC A" | aria-label "View Our menu on MC A" (axe label-content-name-mismatch) | "View on MC A: Our menu" | done |
| 18 Search | Plugin and theme results | Letter tile | Letter tile | `PkgTile`: the WordPress.org icon or screenshot, monogram otherwise | done |
