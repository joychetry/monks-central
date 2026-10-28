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
