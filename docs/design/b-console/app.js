// Direction B: Console. Sidebar, dense tables, inspector, side sheet for bulk actions.
const D = MC_DATA;
const T = D.totals;
const page = document.body.dataset.page;
const short = { "Advanced Custom Fields": "ACF", "Wordfence Security": "Wordfence", "Akismet Anti-spam": "Akismet", "The Events Calendar": "Events Cal.", "Yoast Duplicate Post": "Dup. Post", "Contact Form 7": "CF7", "Gravity Forms": "Gravity" };
const counts = { Sites: T.sites, Updates: T.updates, Plugins: D.plugins.length, Content: 1, Comments: 12, Security: T.warning };
const groups = [
  ["", ["Overview"]],
  ["Fleet", ["Sites", "Updates", "Plugins", "Themes"]],
  ["Content", ["Content", "Media", "Users", "Comments"]],
  ["Care", ["Security", "Reports"]],
  ["App", ["AI", "Settings"]],
];

function shell(current, crumb, content, extra = "") {
  const nav = groups
    .map(
      ([g, items]) =>
        (g ? `<div class="navgroup">${g}</div>` : "") +
        items
          .map((s) => {
            const n = counts[s] != null ? `<span class="n${s === "Sites" ? "" : ""}">${counts[s]}</span>` : "";
            const attrs = s === current ? ' aria-current="page"' : "";
            return D.pages[s] ? `<a class="navitem" href="${D.pages[s]}"${attrs}>${s}${n}</a>` : `<span class="navitem" title="Not in this mock">${s}${n}</span>`;
          })
          .join("")
    )
    .join("");
  return `<div class="app">
    <aside class="side">
      <a class="brand" href="index.html">${MC.logo()}Monks Central</a>
      <button class="scope"><b>All sites</b><span class="mono dim">${T.sites}</span><span class="dim">▾</span></button>
      <button class="search" data-open-palette>Search or run<span class="kbd">Ctrl K</span></button>
      ${nav}
      <div class="foot">
        <span>Checks run while the app is open. Next check in 12 min.</span>
        <button data-theme-toggle><span class="to-dark">Use dark theme</span><span class="to-light">Use light theme</span></button>
      </div>
    </aside>
    <div class="main">
      <div class="top"><div class="crumb">${crumb}</div><div class="fresh">Checked 3 min ago <button class="btn sm">Check all sites now</button></div></div>
      <div class="body">${content}</div>
    </div>
  </div>${extra}
  <div class="palette" hidden><div class="pal">
    <div class="ctx"><span class="tag">All sites</span><span class="tag">Anywhere</span></div>
    <input placeholder="Type a command, a page or a site" aria-label="Command">
    <ul data-list></ul>
    <div class="foot"><span><span class="kbd">↑</span> <span class="kbd">↓</span> Move</span><span><span class="kbd">Enter</span> Run</span><span><span class="kbd">Esc</span> Close</span></div>
  </div></div>`;
}

function sitesTable(sel = [2, 5, 8], focus = 2, wide = false) {
  return `<table class="t"><thead><tr><th style="width:34px"></th><th>Site</th>${wide ? "<th>Address</th>" : ""}<th>Status</th><th>Group</th><th>WP</th><th>PHP</th><th class="r">Plugins</th><th class="r">Updates</th><th>Connection</th>${wide ? `<th class="r">Uptime</th><th class="r">SSL</th>` : ""}<th>Checked</th></tr></thead><tbody>${D.sites
    .map(
      (s, i) => `<tr class="${sel.includes(i) ? "sel" : ""} ${i === focus ? "focus" : ""}">
      <td><i class="box${sel.includes(i) ? " on" : ""}"></i></td>
      <td class="name">${s.name}</td>${wide ? `<td class="url">${s.url}</td>` : ""}
      <td><span class="st ${s.status}">${s.status === "ok" ? "Healthy" : s.status === "danger" ? "Down" : "Needs a look"}</span></td>
      <td>${s.group}</td><td class="m">${s.wp}</td><td class="m">${s.php}</td>
      <td class="r">${s.plugins.length}</td><td class="r ${s.updates ? "" : "zero"}">${s.updates}</td>
      <td>${s.mode}</td>${wide ? `<td class="r">${s.uptime.toFixed(2)}%</td><td class="r">${s.ssl}d</td>` : ""}
      <td class="m">${MC.ago(s.checked)}</td></tr>`
    )
    .join("")}</tbody></table>`;
}

const render = {
  overview() {
    const attn = D.sites.filter((s) => s.status !== "ok");
    const byPlugin = D.plugins.map((p) => [p, D.plan.filter((r) => r.plugin === p).length]).filter(([, n]) => n).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const max = byPlugin[0][1];
    const dist = (key) => {
      const m = {};
      D.sites.forEach((s) => (m[s[key]] = (m[s[key]] || 0) + 1));
      return Object.entries(m).sort((a, b) => b[0].localeCompare(a[0]));
    };
    const distBlock = (label, key) => {
      const d = dist(key);
      return `<h3 class="dim" style="font:500 11.5px var(--sans);margin:0">${label}</h3><div class="seg">${d.map(([, n]) => `<i style="flex:${n}"></i>`).join("")}</div><p>${d.map(([v, n]) => `<span><b>${n}</b>${v}</span>`).join("")}</p>`;
    };
    return shell(
      "Overview",
      "Overview",
      `<div class="scroll">
        <div class="kpis">
          <div class="kpi"><div class="v">${T.sites}</div><div class="l">Sites</div></div>
          <div class="kpi"><div class="v danger">${T.danger}</div><div class="l">Down</div></div>
          <div class="kpi"><div class="v warning">${T.warning}</div><div class="l">Need a look</div></div>
          <div class="kpi"><div class="v">${T.updates}</div><div class="l">Updates on ${T.sitesWithUpdates} sites</div></div>
          <div class="kpi"><div class="v">1</div><div class="l">Agent change waiting for you</div></div>
        </div>
        <div class="panels">
          <section class="panel"><h2>Needs attention <a href="sites.html">Open in Sites</a></h2>
            <table class="t"><tbody>${attn
              .map((s) => `<tr><td><span class="st ${s.status}"></span></td><td class="name">${s.name}</td><td>${s.note}</td><td class="r"><button class="btn sm">${s.status === "danger" ? (s.note.startsWith("Login") ? "Reconnect" : "Check again") : "Open site"}</button></td></tr>`)
              .join("")}</tbody></table></section>
          <section class="panel"><h2>Activity <a href="#">Full log</a></h2><ul class="feed">${D.activity
            .slice(0, 6)
            .map((a) => `<li><time>${a.when}</time><span><span class="who">${a.who}</span> ${a.what}</span></li>`)
            .join("")}</ul></section>
          <section class="panel"><h2>Plugin updates waiting <a href="update.html">Review the plan</a></h2><div class="hbars">${byPlugin
            .map(([p, n]) => `<div class="hb"><span>${p.name}</span><i style="width:${(n / max) * 100}%"></i><span class="r">${n}</span></div>`)
            .join("")}</div></section>
          <section class="panel"><h2>Versions</h2><div class="dist">${distBlock("WordPress", "wp")}${distBlock("PHP", "php")}${distBlock("Connection", "mode")}</div></section>
        </div>
        <p class="note">Monks Central checks your sites while it is open. Sites cannot send alerts to it on their own.</p>
      </div>`
    );
  },

  sites() {
    const s = D.sites[2];
    return shell(
      "Sites",
      `Sites <span>/ All</span>`,
      `<div class="scroll">
        <div class="bar"><button class="chip on"><b>Status</b> any</button><button class="chip"><b>Group</b> any</button><button class="chip"><b>Connection</b> any</button><button class="chip">Add a filter</button><span class="grow"></span><input placeholder="Filter sites   /"><button class="btn sm">Add a site</button></div>
        <div class="selbar"><b>3 selected</b><button class="btn sm primary">Update ${[2, 5, 8].reduce((n, i) => n + D.sites[i].pluginUpdates, 0)} plugins <span class="kbd">U</span></button><button class="btn sm">Check now <span class="kbd">R</span></button><button class="btn sm">Add a tag</button><button class="btn sm">Clear selection <span class="kbd">Esc</span></button></div>
        ${sitesTable()}
      </div>
      <aside class="insp">
        <header><h2>${s.name}</h2><span class="url mono dim">${s.url}</span>
          <div class="acts"><button class="btn sm primary">Log in to wp-admin <span class="kbd">L</span></button><button class="btn sm">Open the site</button><button class="btn sm">Check now</button></div></header>
        <section><h3>Health</h3><dl class="kv"><dt>Status</dt><dd><span class="st ok">Healthy</span></dd><dt>Uptime, 30 days</dt><dd class="mono">${s.uptime.toFixed(2)}%</dd><dt>SSL</dt><dd>Valid for ${s.ssl} days</dd><dt>Checked</dt><dd>${MC.ago(s.checked)}</dd></dl></section>
        <section><h3>Stack</h3><dl class="kv"><dt>WordPress</dt><dd class="mono">${s.wp}</dd><dt>PHP</dt><dd class="mono">${s.php}</dd><dt>Theme</dt><dd>${s.theme}</dd><dt>Connection</dt><dd>${s.mode}</dd><dt>Group</dt><dd>${s.group}, ${s.env}</dd></dl></section>
        <section><h3>Updates waiting</h3><ul class="ulist">${D.plan
          .filter((r) => r.site === s)
          .map((r) => `<li><span>${r.plugin.name}</span><span class="mono dim">${r.from} → ${r.to}</span></li>`)
          .join("")}</ul><div class="acts"><a class="btn sm" href="update.html">Update these plugins</a></div></section>
        <section><h3>Notes</h3><p style="margin:0;color:var(--text-2)">Client pays for care plan B. Ask before updating WooCommerce in December.</p></section>
      </aside>`
    );
  },

  plugins() {
    const head = D.plugins.map((p) => `<th class="p">${short[p.name] || p.name}<small>${p.latest}</small></th>`).join("");
    const rows = D.sites
      .map(
        (s) => `<tr><td class="site">${s.name}</td>${D.plugins
          .map((p) => {
            const x = s.plugins.find((x) => x.slug === p.slug);
            if (!x) return `<td><span class="no">·</span></td>`;
            const cls = x.vulnerable ? "vuln" : x.version !== p.latest ? "old" : x.active ? "cur" : "off";
            return `<td><span class="${cls}" title="${s.name}: ${p.name} ${x.version}">${x.version}</span></td>`;
          })
          .join("")}</tr>`
      )
      .join("");
    const foot = D.plugins.map((p) => `<td>${D.plan.filter((r) => r.plugin === p).length || "·"}</td>`).join("");
    return shell(
      "Plugins",
      `Plugins <span>/ Across all sites</span>`,
      `<div class="scroll">
        <div class="bar"><button class="chip on"><b>Show</b> every site</button><button class="chip">Only sites with updates</button><button class="chip">Only inactive plugins</button><span class="grow"></span>
          <span class="dim" style="font-size:12px">Grey is current, <span style="color:var(--warn)">amber</span> has an update, <span style="color:var(--danger)">red</span> is a known risk, struck through is not active</span>
          <button class="btn sm">Install a plugin</button><a class="btn sm primary" href="update.html">Update ${D.plan.length} plugins</a></div>
        <table class="t grid"><thead><tr><th class="site">Site</th>${head}</tr></thead><tbody>${rows}</tbody><tfoot><tr><td class="site">Updates waiting</td>${foot}</tr></tfoot></table>
      </div>`
    );
  },

  update() {
    const step = MC.q.get("step") || "plan";
    const idx = ["plan", "confirm", "progress"].indexOf(step);
    const stepper = ["1. Plan", "2. Confirm", "3. Progress"].map((t, i) => `<span class="${i < idx ? "done" : i === idx ? "on" : ""}">${t}</span>`).join("");
    const bySite = [...new Set(D.plan.map((r) => r.site))];
    let head, content, foot;
    if (step === "plan") {
      head = `<h2>Update ${D.plan.length} plugins on ${T.planSites} sites</h2><p>Every plugin with a newer version. Down sites are left out. Untick what should stay.</p>`;
      content = bySite
        .map(
          (s) => `<div class="sitegroup"><h4><i class="box on"></i>${s.name}<span class="dim">${s.url}</span></h4><ul>${D.plan
            .filter((r) => r.site === s)
            .map((r) => `<li><i class="box on"></i><span>${r.plugin.name}</span><span class="mono">${r.from} → ${r.to}</span></li>`)
            .join("")}</ul></div>`
        )
        .join("");
      foot = `<span class="sum">${D.plan.length} selected</span><button class="btn">Close without changes</button><a class="btn primary" href="update.html?step=confirm">Review ${D.plan.length} updates <span class="kbd">Enter</span></a>`;
    } else if (step === "confirm") {
      const vuln = D.plan.filter((r) => r.site.plugins.some((x) => x.slug === r.plugin.slug && x.vulnerable));
      head = `<h2>Confirm ${D.plan.length} updates</h2><p>Nothing changes until you start. You can pause at any time.</p>`;
      content = `<div class="summary"><div><b>${D.plan.length}</b><span>plugin updates</span></div><div><b>${T.planSites}</b><span>sites</span></div><div><b>~6 min</b><span>estimated time</span></div></div>
        ${vuln.map((r) => `<div class="alert">${r.plugin.name} ${r.from} on ${r.site.name} has a known vulnerability. This plan fixes it.</div>`).join("")}
        <div class="opts">
          <div class="opt"><b>Back up first</b><p>Runs UpdraftPlus before updating, on sites that have it.</p><i class="sw on"></i></div>
          <div class="opt"><b>Stop a site on its first failure</b><p>The rest of that site is skipped. Other sites carry on.</p><i class="sw on"></i></div>
          <div class="opt"><b>Staging sites first</b><p>Harbour Bakery (staging) and Goodmonks (local) go before the live sites.</p><i class="sw on"></i></div>
          <div class="opt"><b>Update 4 sites at a time</b><p>Lower this if your host is slow.</p><span class="mono">4</span></div>
          <div class="opt"><b>Left out</b><p>${D.sites.filter((s) => s.status === "danger").map((s) => s.name).join(", ")}. Not answering.</p><span></span></div>
        </div>`;
      foot = `<a class="btn" href="update.html?step=plan">Back to the plan</a><span class="sum"></span><a class="btn primary" href="update.html?step=progress">Start ${D.plan.length} updates</a>`;
    } else {
      const done = D.plan.filter((r) => r.state === "done").length;
      const failed = D.plan.filter((r) => r.state === "failed").length;
      const pct = Math.round(((done + failed) / D.plan.length) * 100);
      const order = ["failed", "running", "waiting", "done"];
      head = `<h2>Updating. ${done + failed} of ${D.plan.length} finished</h2><p>${done} done, ${failed} failed, about 2 min left. You can close this panel.</p><div class="prog"><i style="width:${pct}%"></i></div>`;
      content = `<div class="sitegroup"><ul class="runs" style="padding:8px 18px">${[...D.plan]
        .sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state))
        .slice(0, 22)
        .map(
          (r) =>
            `<li><span class="tag ${r.state === "done" ? "ok" : r.state === "failed" ? "danger" : ""}">${r.state === "done" ? "Done" : r.state === "failed" ? "Failed" : r.state === "running" ? "Running" : "Waiting"}</span><span>${r.site.name}, ${r.plugin.name}</span><span class="mono dim">${r.from} → ${r.to}</span>${r.error ? `<span class="err">${r.error}</span>` : ""}</li>`
        )
        .join("")}</ul></div>`;
      foot = `<button class="btn">Pause after current sites</button><span class="sum"></span><button class="btn">Retry 1 failed update</button><button class="btn primary">Hide this panel</button>`;
    }
    return shell(
      "Updates",
      `Updates <span>/ ${T.updates} waiting</span>`,
      `<div class="scroll under">${sitesTable([], -1, true)}</div>`,
      `<aside class="sheet"><header>${head}<div class="stepper">${stepper}</div></header><div class="content">${content}</div><footer>${foot}</footer></aside>`
    );
  },

  editor() {
    const P = D.post;
    const stateTag = (s) => (s === "Draft" || s === "Pending review" ? "warning" : s === "Published" ? "ok" : "");
    return shell(
      "Content",
      `Content <span>/ ${P.site} / Posts</span>`,
      `<nav class="posts"><div class="types"><button class="chip on">Posts 214</button><button class="chip">Pages 18</button><button class="chip">Menu items 31</button></div>${P.recent
        .map(([t, s, w], i) => `<a href="#"${i === 0 ? ' aria-current="true"' : ""}><b>${t}</b><span class="tag ${stateTag(s)}">${s}</span><span class="dim">${w}</span></a>`)
        .join("")}</nav>
      <div class="doc"><div class="inner">
        <h1 contenteditable="true">${P.title}</h1>
        ${P.body.map(([t, x], i) => `<div class="blk${i === 2 ? " focus" : ""}"><span>${t === "h2" ? "Heading" : "Paragraph"}</span><${t} contenteditable="true">${x}</${t}></div>`).join("")}
        <p class="safe">Block-safe editing. You can change text in these blocks. Layout blocks stay as they are on the site.</p>
      </div></div>
      <aside class="insp">
        <header><div class="acts" style="margin:0"><button class="btn sm">Preview on site</button><button class="btn sm">Save draft <span class="kbd">Ctrl S</span></button><button class="btn sm primary">Publish</button></div></header>
        <section><h3>Post</h3><dl class="kv"><dt>Status</dt><dd><span class="tag warning">Draft</span></dd><dt>Author</dt><dd>${P.author}</dd><dt>Address</dt><dd class="mono">/${P.slug}</dd><dt>Last edit</dt><dd>${P.updated}</dd></dl></section>
        <section><h3>Categories</h3>${P.categories.map((c) => `<span class="tag">${c}</span> `).join("")}</section>
        <section><h3>Tags</h3>${P.tags.map((c) => `<span class="tag">${c}</span> `).join("")}</section>
        <section><h3>Excerpt</h3><p style="margin:0;color:var(--text-2)">${P.excerpt}</p></section>
        <section><h3>Featured image</h3><button class="btn sm">Choose an image</button></section>
        <section><h3>Also publish to</h3><ul class="ulist"><li><span><i class="box"></i> Harbour Bakery (staging)</span></li><li><span><i class="box"></i> Fieldnote Journal</span></li></ul></section>
      </aside>`
    );
  },
};

document.body.innerHTML = render[page]();
MC.palette = document.querySelector(".palette");
MC.bindPalette(
  (c, on, term) =>
    `<li class="pal-row${on ? " on" : ""}"><a href="${c.href || "#"}">${MC.mark(c.label, term)}${c.hint ? `<small>${c.hint}</small>` : ""}${c.keys ? `<span class="keys">${c.keys.split(" ").map((k) => `<span class="kbd">${k}</span>`).join("")}</span>` : ""}</a></li>`
);
MC.start();
