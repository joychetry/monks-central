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
