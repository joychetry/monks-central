| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D10 Palette | Frame | 640px panel 110px from the top, 16px radius, float shadow, dimmed page | Plain panel, input on top, no search icon | Panel size, radius, shadow and position from the board | done |
| D10 Palette | Search row | Search icon, borderless input, Esc key on the right, line under | Bare input | Search icon, input, Esc key, line under | done |
| D10 Palette | Search focus | No ring on the input | n/a | The input keeps the app's focus ring | kept: docs/ux/README.md wants a visible focus on every control |
| D10 Palette | Groups | Actions, then site-named groups, then Pages, small caps headings | Groups in mixed order, pages unlabelled | Actions first, Sites, Pages last ("Go to Updates") | done |
| D10 Palette | Rows | 24px tile with an icon (site rows: favicon or monogram), label with the match in bold, muted hint, value on the right, Enter on the selected row, tinted selected row | Text rows | Tile with the design icon or SiteTile, Marked label, hint, keys; Enter shows on the selected row; 48px rows, --sel tint | done |
| D10 Palette | Foot | Up Down to move, Enter to run, Esc to close, "Every action, site and page" on the right, panel ground | Hint line | Same keys and words on the panel ground | done |
| D10 Palette | Query | Board shows "upd" typed | Screen opens empty | Same palette, the screen shot opens before typing | kept: the shot is the open state; typing filters the same rows (vitest App.test) |
