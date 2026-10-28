# Redesign fidelity audit: how the rows are kept

One file per page or board here (`<page>.md`), joined into `../audit.md` at the end. Each file is a
markdown table with one row per difference between the design and the app:

| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|

- **Page**: `01 Overview`, `D03 Updates flow`, `Sidebar`, ...; **Section**: top to bottom (head, filter row,
  table, inspector, empty state, ...).
- **Design / App**: what each shows, concretely (element, copy, size, colour, spacing, state).
- **Fix**: what changed, through the system first (tokens, `styles/*.css`, `components/*`), then the screen.
- **Status**: `done`, or `kept: <why>` when the app can't match: a rule in `docs/ux/README.md` (name it), or
  data the app doesn't have (say what, and what it shows instead), and how close it got.

Compare images: `docs/ux/redesign/compare/<page>-<theme>.png` (`COMPARE=<page prefix> npx playwright test compare` in `ui/`).
