| Page | Section | Design | App (before) | Fix | Status |
|---|---|---|---|---|---|
| 14 Store | Head | SITE picker and 7/30/90 days segmented in the head | In a bar inside the card | `HeadActions`, the picker shows the site's favicon | done |
| 14 Store | Orders card | Revenue (big), trend "+12%", orders and average, a bar per day | Plain numbers | Card with revenue, paid orders, average order; orders by status bar and key, to-send and out-of-stock counts, Running low note | done |
| 14 Store | Daily bars and trend | 30 bars, one per day; "+12%" against the period before | none | Orders by status bar instead | kept: data, the core reads WooCommerce's totals for the period (`shop::Overview`), not a per-day series or the period before; closest real data is shown |
| 14 Store | Products | Search, STOCK select, Product (image tile, SKU), Price (sale struck through), Stock with Low / Out of stock tags, Sold 30 days, row action | Plain table | Design table, tags, struck regular price, Change price or stock; options products say "Change it in wp-admin" | done |
| 14 Store | Sold, 30 days | Per product | none; app has Status | Status column instead | kept: data, the product list (`shop::Product`) has no sales count |
| 14 Store | Change a product | D09: dialog with product tile, Price / Sale price / Stock, Review the change, then the exact change and one click | Sheet | Dialog with the same fields; Review the change goes to the plan sheet's Confirm step | done |
