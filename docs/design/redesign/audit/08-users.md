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
