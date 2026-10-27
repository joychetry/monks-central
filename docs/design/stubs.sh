#!/usr/bin/env bash
# Writes the five page stubs for one direction folder: ./stubs.sh a-broadsheet "Broadsheet"
set -euo pipefail
cd "$(dirname "$0")/$1"
for p in index:overview:Overview sites:sites:Sites plugins:plugins:Plugins update:update:Updates editor:editor:Content; do
  IFS=: read -r file page title <<<"$p"
  cat > "$file.html" <<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$title · Monks Central · $2</title>
<link rel="stylesheet" href="../fonts/fonts.css">
<link rel="stylesheet" href="style.css">
<script src="../shared/core.js"></script>
</head>
<body data-page="$page">
<script src="../shared/data.js"></script>
<script src="app.js"></script>
</body>
</html>
HTML
done
