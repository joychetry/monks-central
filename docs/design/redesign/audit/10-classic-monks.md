| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 10 Classic Monks | Head | Classic Monks mark beside the title, Site picker on the right of the head | Title only, site picker inside the card bar | Mark in the page head (App.tsx `.marked`), `SITE` label and picker in `HeadActions` with the site's favicon | done |
| 10 Classic Monks | Tabs | Features, Settings, Activity, Waiting for approval (count), Reports on the ground, green underline | Tabs inside the card | Shared `Tabs` on the ground, amber count chip | done |
| 10 Classic Monks | Filter row | SECTION select, Find a feature search, "6 switched on" at the right | Section select and search in a bar | `.filters` row, count from the features read | done |
| 10 Classic Monks | Feature list | One card, mono section labels, a switch beside each feature with its line | Rows with On/Off words and Turn on/off buttons | Drawn switches (`role="switch"`), section labels; locked features show a lock and stay read only | done |
| 10 Classic Monks | Feature count | 9 features over three sections | Mock site has 3 features | Same component, the site's own list | kept: data, the features shown are the ones the site's Classic Monks reports |
| 10 Classic Monks | Side column | Site card (tile, version, "2.5.0 ready" tag, how changes work), amber approvals card with See what's waiting, Recent changes with Undo and Activity link | Notes under the table | Three cards in the side column; update tag shows when inventory has a Classic Monks update | done |
| 10 Classic Monks | Site tile | Monogram tile | Text only | `SiteTile`: the site's favicon, monogram when none | done |
