| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D07 Classic Monks | Settings | A row per setting with its box and its own Save button, hint under it | Form with one Save | Each setting saves on its own (Save <name>), NumberInput for numbers, hints | done |
| D07 Classic Monks | Undo, confirm | Dialog "Undo this change on MC A?" with what goes back, Keep it / Undo with disc | Undo ran at once | `useUndo` asks first in a dialog: the change, who made it and when; Keep it or Undo | done |
| D07 Classic Monks | Undo before and after | Old value struck, new value in green | Change name and who made it | Shows the logged change's summary | kept: data, the site's activity log (`ActivityRow`) gives a summary, not the old and new values |
| D07 Classic Monks | Activity | Feed with avatar, change, who and when, Undo or the outcome, pager | Table | Feed with avatars (You, initials), Undo or status, Previous / Next page | done |
| D07 Classic Monks | Waiting for approval | Clock tile, change, who asked and when, "Approve or decline on the site" | Table | List with tiles, time left, the button opens the site's approve page | done |
| D07 Classic Monks | Reports | Module activity on MC A with 7/30/90 days, three numbers, a bar per day | Tables | Card with range segmented, the module numbers, 404 and searches tables | done |
| D07 Classic Monks | Daily bars | A bar per day | none | Numbers for the range | kept: data, `CmReports` gives totals for the range, not a per-day series |
