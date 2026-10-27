// Direction C: Cloister. Grouped sidebar, cards on a soft canvas, a centred wizard for bulk work.
const D = MC_DATA;
const T = D.totals;
const page = document.body.dataset.page;
const initials = (n) => n.replace(/\(.*\)/, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
const groups = [
  ["", ["Overview"]],
  ["Your sites", ["Sites", "Updates", "Plugins", "Themes", "Security"]],
  ["Content", ["Content", "Media", "Users", "Comments"]],
  ["More", ["Reports", "AI", "Settings"]],
];
const badges = { Sites: `<em class="attn">${T.danger} down</em>`, Updates: `<em>${T.updates}</em>`, Comments: "<em>12</em>" };
const vuln = D.plan.filter((r) => r.site.plugins.some((x) => x.slug === r.plugin.slug && x.vulnerable));

function shell(current, title, sub, content, extraTools = "") {
  const nav = groups
    .map(([g, items]) => (g ? `<h6>${g}</h6>` : "") + items.map((s) => (D.pages[s] ? `<a href="${D.pages[s]}"${s === current ? ' aria-current="page"' : ""}>${s}${badges[s] || ""}</a>` : `<span title="Not in this mock">${s}${badges[s] || ""}</span>`)).join(""))
    .join("");
  return `<div class="app">
    <aside class="side">
      <a class="brand" href="index.html">${MC.logo()}<span>Monks Central<small>by Classic Monks</small></span></a>
      <nav class="nav">${nav}</nav>
      <div class="foot"><b>Checked 3 min ago</b>Sites are checked every 15 minutes while the app is open.</div>
    </aside>
    <main>
      <div class="head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>
        <div class="tools">${extraTools}<button class="pill">All sites ▾</button><button class="pill search" data-open-palette>Search or run a command<kbd>Ctrl K</kbd></button>
        <button class="pill" data-theme-toggle><span class="to-dark">Use dark theme</span><span class="to-light">Use light theme</span></button></div></div>
      ${content}
    </main>
  </div>
  <div class="palette" hidden><div class="pal"><input placeholder="What do you want to do?" aria-label="Command"><ul data-list></ul></div></div>`;
}

const render = {
  overview() {
    const attn = D.sites.filter((s) => s.status !== "ok");
    return shell(
      "Overview",
      "Good afternoon, Joy",
      `${T.ok} of ${T.sites} sites are healthy. ${T.danger} are down and ${T.warning} need a look.`,
      `<div class="grid g3">
        <section class="card"><h2>Every site</h2><p class="sub">One square per site, in the same order as Sites.</p>
          <div class="monos">${D.sites.map((s) => `<span class="mono ${s.status}" title="${s.name}">${initials(s.name)}</span>`).join("")}</div>
          <div class="legend"><span><i></i>Healthy ${T.ok}</span><span><i class="warning"></i>Needs a look ${T.warning}</span><span><i class="danger"></i>Down ${T.danger}</span></div></section>
        <section class="card"><h2>Updates waiting</h2><p class="sub">On ${T.sitesWithUpdates} sites. Down sites are not counted.</p>
          <div class="big">${T.updates}</div>
          <div class="split"><span class="sp plain">${T.pluginUpdates} plugins</span><span class="sp plain">${T.themes} themes</span><span class="sp plain">${T.core} WordPress</span>${vuln.length ? `<span class="sp danger">${vuln.length} security fix</span>` : ""}</div>
          <a class="btn primary" href="update.html">Review ${D.plan.length} plugin updates</a></section>
        <section class="card"><h2>Waiting for you</h2><p class="sub">Changes an agent asked to make.</p>
          <div class="approval"><span class="sp warning">Needs approval</span><b>Draft post on Harbour Bakery</b><p>Claude wrote “Our autumn menu is here” 9 min ago.</p>
            <a class="btn sm primary" href="editor.html">Review the draft</a> <button class="btn sm">Turn it down</button></div>
          <p class="quiet">Agents can read your sites freely. Anything that changes a site waits here first.</p></section>
      </div>
      <div class="grid g2" style="margin-top:16px">
        <section class="card"><h2>Needs attention</h2><p class="sub">Sorted by how urgent it is.</p><ul class="list">${attn
          .sort((a, b) => (b.status === "danger") - (a.status === "danger"))
          .map((s) => `<li><span class="av ${s.status}">${initials(s.name)}</span><span class="grow"><b>${s.name}</b><span class="t2">${s.note}</span></span><button class="btn sm">${s.note.startsWith("Login") ? "Reconnect" : s.note.startsWith("Not") ? "Check again" : "Open site"}</button></li>`)
          .join("")}</ul></section>
        <section class="card"><h2>Recent activity</h2><p class="sub">Everything you and your agents did.</p><ul class="list">${D.activity
          .slice(0, 6)
          .map((a) => `<li><span class="grow"><b>${a.who}</b><span class="t2">${a.what}</span></span><span class="when">${a.when}</span></li>`)
          .join("")}</ul></section>
      </div>`
    );
  },

  sites() {
    const sel = [2, 5, 8];
    const rows = D.sites
      .map(
        (s, i) => `<tr class="${i === 2 ? "focus" : ""}"><td style="width:44px"><i class="cb${sel.includes(i) ? " on" : ""}"></i></td>
        <td><div class="who"><span class="av ${s.status === "ok" ? "" : s.status}">${initials(s.name)}</span><div><b>${s.name}</b><span>${s.url}</span></div></div></td>
        <td><span class="sp ${s.status}">${s.status === "ok" ? "Healthy" : s.status === "danger" ? "Down" : "Needs a look"}</span></td>
        <td>${s.group}</td><td>${s.wp}</td><td>${s.php}</td>
        <td class="n"><span class="upd${s.updates ? "" : " zero"}">${s.updates}</span></td>
        <td>${s.mode}</td><td style="color:var(--text-3)">${MC.ago(s.checked)}</td>
        <td class="n"><button class="btn sm rowact">Log in</button></td></tr>`
      )
      .join("");
    return shell(
      "Sites",
      "Sites",
      `${T.sites} sites in 4 groups.`,
      `<section class="card tablecard">
        <div class="tbar"><div class="seg"><a href="#" aria-current="true">All <em>${T.sites}</em></a><a href="#">Needs attention <em>${T.danger + T.warning}</em></a><a href="#">Updates waiting <em>${T.sitesWithUpdates}</em></a></div>
          <button class="pill">Group: any ▾</button><span class="grow"></span><input placeholder="Find a site"><button class="btn primary">Add a site</button></div>
        <table class="t"><thead><tr><th></th><th>Site</th><th>Status</th><th>Group</th><th>WordPress</th><th>PHP</th><th class="n">Updates</th><th>Connection</th><th>Checked</th><th></th></tr></thead><tbody>${rows}</tbody></table>
      </section>
      <div class="floatbar">3 sites selected<button class="btn sm">Update ${sel.reduce((n, i) => n + D.sites[i].pluginUpdates, 0)} plugins <span class="k">U</span></button><button class="btn sm ghost">Check now</button><button class="btn sm ghost">Clear</button></div>`
    );
  },

  plugins() {
    const cards = D.plugins
      .map((p) => {
        let on = 0, old = 0;
        const cells = D.sites
          .map((s) => {
            const x = s.plugins.find((x) => x.slug === p.slug);
            if (!x) return `<i title="${s.name}: not installed"></i>`;
            on++;
            const cls = x.vulnerable ? "vuln" : x.version !== p.latest ? "old" : x.active ? "cur" : "off";
            if (cls === "vuln" || cls === "old") old++;
            return `<i class="${cls}" title="${s.name}: ${x.version}"></i>`;
          })
          .join("");
        return `<section class="card pl"><div><b>${p.name}</b><span class="t2">Latest ${p.latest}</span></div><div class="strip">${cells}</div>
          <div class="right"><span class="t2">On ${on} sites<br>${old ? `${old} behind` : "All up to date"}</span>${old ? `<a class="btn sm" href="update.html">Update ${old}</a>` : ""}</div></section>`;
      })
      .join("");
    return shell(
      "Plugins",
      "Plugins",
      `${D.plugins.length} plugins across ${T.sites} sites. Each row shows every site, in the same order as Sites.`,
      `<section class="card" style="padding:14px 22px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
        <div class="keyrow"><span><i class="cur"></i>Up to date</span><span><i class="off"></i>Not active</span><span><i class="old"></i>Update waiting</span><span><i class="vuln"></i>Known vulnerability</span><span><i></i>Not installed</span></div>
        <div class="tools"><button class="btn sm">Install a plugin</button><a class="btn sm primary" href="update.html">Update all ${D.plan.length}</a></div></section>
      ${cards}`
    );
  },

  update() {
    const step = MC.q.get("step") || "plan";
    const idx = ["plan", "confirm", "progress"].indexOf(step);
    const steps = ["Plan", "Confirm", "Progress"].map((t, i) => `<span class="${i < idx ? "done" : i === idx ? "on" : ""}"><i>${i < idx ? "✓" : i + 1}</i>${t}</span>`).join("");
    const byPlugin = D.plugins.map((p) => ({ p, rows: D.plan.filter((r) => r.plugin === p) })).filter((g) => g.rows.length);
    let body;
    if (step === "plan") {
      body = `<h2>Update ${D.plan.length} plugins on ${T.planSites} sites</h2><p class="sub">These are all the plugin updates on sites that answered. Switch off anything you want to leave for now.</p>
        ${byPlugin
          .slice(0, 8)
          .map((g) => `<div class="prow"><i class="sw on"></i><span class="grow"><b>${g.p.name}</b><span class="t2">${g.rows.map((r) => r.site.name).join(", ")}</span></span><span class="ver">${g.rows.length} site${g.rows.length > 1 ? "s" : ""}, to ${g.p.latest}</span></div>`)
          .join("")}
        <div class="prow" style="background:none;justify-content:center"><button class="btn sm">Show ${byPlugin.length - 8} more plugins</button></div>
        <div class="wfoot"><span class="grow">${D.plan.length} updates selected</span><a class="btn" href="index.html">Cancel</a><a class="btn primary" href="update.html?step=confirm">Continue</a></div>`;
    } else if (step === "confirm") {
      body = `<h2>Start ${D.plan.length} updates?</h2><p class="sub">Here is what will happen. Nothing changes on any site until you press Start.</p>
        <div class="three"><div><b>Backup first</b><span>UpdraftPlus runs on the sites that have it.</span></div><div><b>4 sites at a time</b><span>Staging and local sites go first.</span></div><div><b>Failures stay small</b><span>If a site fails, only that site stops.</span></div></div>
        ${vuln.map((r) => `<div class="banner">${r.plugin.name} ${r.from} on ${r.site.name} has a known vulnerability. This update fixes it.</div>`).join("")}
        <div class="banner muted">${D.sites.filter((s) => s.status === "danger").map((s) => s.name).join(" and ")} are left out because they are not answering.</div>
        <div class="wfoot"><span class="grow">About 6 minutes</span><a class="btn" href="update.html?step=plan">Back</a><a class="btn primary" href="update.html?step=progress">Start ${D.plan.length} updates</a></div>`;
    } else {
      const done = D.plan.filter((r) => r.state === "done").length;
      const failed = D.plan.filter((r) => r.state === "failed").length;
      const pct = Math.round(((done + failed) / D.plan.length) * 100);
      const order = ["failed", "running", "done"];
      body = `<h2>Updating your sites</h2><p class="sub">You can leave this page. Updates keep running while the app is open.</p>
        <div class="track"><i style="width:${pct}%"></i></div>
        <div class="stats"><div><b>${done}</b><span>done</span></div><div class="danger"><b>${failed}</b><span>failed</span></div><div><b>${D.plan.length - done - failed}</b><span>to go</span></div><div><b>2 min</b><span>left, about</span></div></div>
        ${D.plan
          .filter((r) => r.state !== "waiting")
          .sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state))
          .slice(0, 5)
          .map(
            (r) => `<div class="prow"><span class="av">${initials(r.site.name)}</span><span class="grow"><b>${r.site.name}</b><span class="t2">${r.error ? `<span class="err">${r.error}</span>` : `${r.plugin.name} ${r.from} to ${r.to}`}</span></span>
            <span class="sp ${r.state === "done" ? "" : r.state === "failed" ? "danger" : "plain"}">${r.state === "done" ? "Done" : r.state === "failed" ? "Failed" : "Updating"}</span>${r.state === "failed" ? '<button class="btn sm">Try again</button>' : ""}</div>`
          )
          .join("")}
        <div class="wfoot"><span class="grow">${done + failed} of ${D.plan.length} finished</span><button class="btn">Pause</button><button class="btn primary">Go to the overview</button></div>`;
    }
    return shell("Updates", "Bulk update", "", `<div class="wizard"><div class="steps">${steps}</div><section class="card">${body}</section></div>`);
  },

  editor() {
    const P = D.post;
    return shell(
      "Content",
      P.site,
      `<span class="crumbs"><a href="#">← All posts</a> <span>Post, ${P.updated.toLowerCase()}</span></span>`,
      `<div class="ed">
        <article class="card paper"><div class="inner">
          <h1 contenteditable="true">${P.title}</h1>
          <p class="excerpt" contenteditable="true">${P.excerpt}</p>
          <div class="body" contenteditable="true">${P.body.map(([t, x]) => `<${t}>${x}</${t}>`).join("")}</div>
          <p class="note">Safe editing is on. You can change the words. Blocks and layout on the site stay as they are.</p>
        </div></article>
        <div class="stack">
          <section class="card"><h3>Publish</h3><dl class="kv"><dt>Status</dt><dd><span class="sp warning">Draft</span></dd><dt>Author</dt><dd>${P.author}</dd><dt>Address</dt><dd>/${P.slug}</dd></dl>
            <div style="display:flex;gap:8px;margin-top:16px"><button class="btn sm">Save draft</button><button class="btn sm primary">Publish now</button></div></section>
          <section class="card"><h3>Categories</h3><div class="chips">${P.categories.map((c) => `<span class="chip">${c}</span>`).join("")}<span class="chip" style="color:var(--text-3)">Add</span></div></section>
          <section class="card"><h3>Tags</h3><div class="chips">${P.tags.map((c) => `<span class="chip">${c}</span>`).join("")}</div></section>
          <section class="card"><h3>Featured image</h3><div class="drop">Choose an image from the media library</div></section>
          <section class="card"><h3>Also publish on</h3><div class="chips"><span class="chip">Harbour Bakery (staging)</span><span class="chip" style="color:var(--text-3)">Add a site</span></div></section>
        </div>
      </div>`,
      `<button class="btn">Preview on site</button>`
    );
  },
};

document.body.innerHTML = render[page]();
MC.palette = document.querySelector(".palette");
const kind = { Actions: "Action", "Go to": "Page", Sites: "Site" };
MC.bindPalette(
  (c, on, term) =>
    `<li class="pal-row${on ? " on" : ""}"><a href="${c.href || "#"}"><span class="kind">${kind[c.group]}</span>${MC.mark(c.label, term)}${c.hint ? `<small>${c.hint}</small>` : ""}${c.keys ? `<span class="k">${c.keys}</span>` : ""}</a></li>`
);
MC.start();
