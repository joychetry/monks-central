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
