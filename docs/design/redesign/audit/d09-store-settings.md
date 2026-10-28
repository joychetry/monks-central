| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| D09 Store | Change a product | Dialog with product tile, Price, Sale price (hint), Stock (now n), Close without changing / Review the change | Sheet | Centred dialog with the same fields and copy | done |
| D09 Store | Confirm | The exact change (stock 4 → 30, price no change) then "Change Rye loaf: stock 30" | Sentence and button | Review the change opens the shared plan sheet at its Confirm step, which lists the exact change ("Change “Rye loaf”: stock 30") on the site; the before value isn't shown | kept: layout, the confirm is the one plan sheet every change uses (D03), not a separate small dialog; the stock before is in the dialog's hint ("Now 4") |
| D09 Settings | Search Console | Dialog: Client ID, Client secret, "Kept encrypted on this computer", Cancel / Save the client | Inline form | Dialog with the same fields; the note says "Kept in this computer's keychain" | kept: copy, the secret is in the OS keychain, so the words say where it is |
| D09 Toasts | Exported | Ink pill with tick, file name, Show in folder | Banner | `toast(text, { action })`: ink pill as wide as its words, green tick, action button | done |
| D09 Toasts | Saved | Ink pill with tick and close | Banner | Same toast, close button with the x glyph | done |
