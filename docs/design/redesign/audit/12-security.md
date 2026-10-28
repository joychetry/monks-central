| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 12 Security | Head | Scan all sites now (secondary) and "Update 1 vulnerable plugin" primary with disc | Buttons in a bar | `HeadActions` | done |
| 12 Security | Stats | Open vulnerabilities (amber card), Sites clear, Last scan | One sentence | Three stat cards, amber when any are open | done |
| 12 Security | Finding card | Shield tile, severity tag, plugin and type in mono, title, description, a key-value well (affected versions, fixed in, sites affected with tiles, not affected), warning when a site couldn't be reached, "Update to fixed version" soft button and Read more link | Table rows | A card per vulnerability with the same parts and favicons in "Sites affected" | done |
| 12 Security | Affected versions | "2.3.1 and earlier" | Installed version | Shows Installed and Fixed in | kept: data, WPVulnerability gives the affected range as words in the title; the app shows what each site runs |
| 12 Security | Side column | Sites with nothing known (tile, plugins and themes scanned, Clear pill) | A list in text | Card with favicons and Clear pills; Not checked card for sites not scanned | done |
| 12 Security | Abandoned plugins | Not in the design | Table of abandoned plugins | Kept as a card under the findings | kept: existing feature (closed or two-year-old plugins); every control stays |
| 12 Security | Plugin tiles | Plugin and type in mono beside the severity tag | Name only | An 18px plugin or theme tile before the name in each finding's meta line; a 24px tile in the Abandoned plugins rows. The shield tile stays (it carries the severity) | done |
