#!/usr/bin/env bash
# Screenshots every screen of one or more directions in dark and light: ./shoot.sh a-broadsheet b-console
set -euo pipefail
cd "$(dirname "$0")"
screens="overview=index.html sites=sites.html plugins=plugins.html update-plan=update.html?step=plan update-confirm=update.html?step=confirm update-progress=update.html?step=progress editor=editor.html palette=sites.html?palette="
for dir in "$@"; do
  mkdir -p "$dir/shots"
  for s in $screens; do
    name=${s%%=*} url=${s#*=}
    for theme in dark light; do
      sep='?'; [[ $url == *\?* ]] && sep='&'
      /usr/bin/chromium --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --window-size=1440,900 --virtual-time-budget=3000 --allow-file-access-from-files \
        --screenshot="$dir/shots/$name-$theme.png" "file://$PWD/$dir/$url${sep}theme=$theme" 2>/dev/null
    done
  done
done
