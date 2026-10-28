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
