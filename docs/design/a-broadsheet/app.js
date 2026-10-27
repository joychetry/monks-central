// Direction A: Broadsheet. Masthead navigation, editorial front page, ruled tables.
const D = MC_DATA;
const T = D.totals;
const page = document.body.dataset.page;
const words = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const say = (n) => words[n] || String(n);
const reachable = D.sites.filter((s) => s.status !== "danger");
const planSites = T.planSites;
const vuln = D.plan.filter((r) => r.site.plugins.some((x) => x.slug === r.plugin.slug && x.vulnerable));

function shell(content, current) {
  const nav = D.sections
    .map((s) => (D.pages[s] ? `<a href="${D.pages[s]}"${s === current ? ' aria-current="page"' : ""}>${s}</a>` : `<span title="Not in this mock">${s}</span>`))
    .join("");
  return `
  <header class="mast">
    <a class="brand" href="index.html">${MC.logo()}Monks <em>Central</em></a>
    <nav class="nav" aria-label="Main">${nav}</nav>
    <div class="mast-tools">
      <button class="scope"><b>All sites</b> ▾</button>
      <button class="ask" data-open-palette>Search <span class="kbd">Ctrl K</span></button>
      <button class="themebtn" data-theme-toggle><span class="to-dark">Use dark theme</span><span class="to-light">Use light theme</span></button>
    </div>
  </header>
  <div class="dateline">
    <span><b>Tuesday 27 October 2026</b></span><span>${T.sites} sites</span><span>Checked 3 min ago</span>
    <button class="link">Check all sites now</button>
    <span class="push">Checks run only while Monks Central is open</span>
  </div>
  <main>${content}</main>
  <div class="palette" hidden><div class="pal">
    <div class="scopeline"><span>Searching all ${T.sites} sites</span><span>Enter to run, Esc to close</span></div>
    <input placeholder="Type a command or a site" aria-label="Command">
    <ul data-list></ul>
  </div></div>`;
}

const render = {
  overview() {
    const attn = D.sites.filter((s) => s.status !== "ok").sort((a, b) => (a.status === "danger" ? -1 : 1) - (b.status === "danger" ? -1 : 1));
    const action = (s) => (s.note.startsWith("Login") ? "Reconnect" : s.note.startsWith("Not") ? "Check again" : s.note.startsWith("SSL") ? "Open hosting" : s.note.startsWith("Classic") ? "Update Classic Monks" : s.note.startsWith("PHP") ? "Open site details" : "Update the plugin");
    const wp = D.sites.filter((s) => s.wp === "7.1.1").length;
    const cm = D.sites.filter((s) => s.mode.startsWith("Classic Monks") && s.mode !== "Classic Monks 2.5").length;
    return shell(
      `<p class="kicker">Front page</p>
      <h1 class="headline">${say(T.danger)} sites are down. ${say(T.warning)} need a look. <span class="dim">The other ${T.ok} are fine, with ${T.updates} updates waiting.</span></h1>
      <div class="front">
        <section><p class="kicker">Needs you</p><ul class="attn">${attn
          .map((s) => `<li><h3><span class="dot ${s.status}"></span>${s.name}</h3><p>${s.note}</p><button class="btn${s.status === "danger" ? " solid" : ""}">${action(s)}</button></li>`)
          .join("")}</ul></section>
        <section><p class="kicker">Updates waiting</p>
          <div class="bignum">${T.updates}</div>
          <p class="bignum-cap">across ${T.sitesWithUpdates} sites. Down sites are not counted.</p>
          <table class="ledger"><tr><td>Plugins</td><td>${T.pluginUpdates}</td></tr><tr><td>Themes</td><td>${T.themes}</td></tr><tr><td>WordPress 7.1.1</td><td>${T.core}</td></tr></table>
          <a class="btn solid" href="update.html">Review the update plan →</a>
        </section>
        <section><p class="kicker">Today</p><ul class="log">${D.activity
          .slice(0, 5)
          .map((a) => `<li><time>${a.when}</time><b>${a.who}.</b> ${a.what}</li>`)
          .join("")}</ul><a class="textbtn" href="#">Open the full activity log</a></section>
      </div>
      <div class="band">
        <div><p class="kicker">All ${T.sites} sites</p><div class="cells">${D.sites.map((s) => `<i class="cell ${s.status}" title="${s.name}"></i>`).join("")}</div>
          <p class="honest">Each square is a site. Red is down, amber needs a look.</p></div>
        <div class="facts">
          <div><b>${wp}</b><span>on WordPress 7.1.1</span></div>
          <div><b>${cm}</b><span>with Classic Monks 2.6</span></div>
          <div><b>${D.sites.filter((s) => s.mode === "Basic mode").length}</b><span>in Basic mode</span></div>
          <div><b>1</b><span>post waiting for your approval</span></div>
        </div>
      </div>`,
      "Overview"
    );
  },

  sites() {
    const rows = D.sites
      .map(
        (s, i) => `<tr class="${i === 2 ? "focus" : ""}">
        <td><i class="check${[2, 5, 8].includes(i) ? " on" : ""}"></i></td>
        <td class="site">${s.name}<small>${s.url}</small></td>
        <td><span class="dot ${s.status}"></span><span class="s-${s.status}">${s.status === "ok" ? "Healthy" : s.note}</span></td>
        <td>${s.group}</td>
        <td class="mono">${s.wp}</td><td class="mono">${s.php}</td>
        <td class="num">${s.plugins.length}</td>
        <td class="num ${s.updates ? "pending" : "zero"}">${s.updates || "0"}</td>
        <td>${s.mode}</td>
        <td class="mono">${MC.ago(s.checked)}</td></tr>`
      )
      .join("");
    return shell(
      `<div class="pagehead"><h1 class="title">Sites<sup>${T.sites}</sup></h1>
        <div class="actions"><button class="btn quiet">Export as CSV</button><button class="btn quiet">Check all sites</button><button class="btn solid">Add a site</button></div></div>
      <div class="filters">
        <a href="#" aria-current="true">All<b>${T.sites}</b></a><a href="#">Down<b>${T.danger}</b></a><a href="#">Needs a look<b>${T.warning}</b></a><a href="#">Updates waiting<b>${T.sitesWithUpdates}</b></a><a href="#">Basic mode<b>${D.sites.filter((s) => s.mode === "Basic mode").length}</b></a>
        <input class="search" placeholder="Filter by name, address or tag   /">
      </div>
      <table class="data"><thead><tr><th></th><th>Site</th><th>Status</th><th>Group</th><th>WordPress</th><th>PHP</th><th class="num">Plugins</th><th class="num">Updates</th><th>Connection</th><th>Checked</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="keybar"><span><span class="kbd">J</span><span class="kbd">K</span>Move</span><span><span class="kbd">X</span>Select</span><span><span class="kbd">Enter</span>Open site</span><span><span class="kbd">L</span>Log in to wp-admin</span><span><span class="kbd">U</span>Update selected</span><span class="push">3 selected. Press U to update ${[2, 5, 8].reduce((n, i) => n + D.sites[i].pluginUpdates, 0)} plugins.</span></div>`,
      "Sites"
    );
  },

  plugins() {
    const head = D.sites.map((s) => `<th class="site ${s.status}"><div>${s.name}</div></th>`).join("");
    const rows = D.plugins
      .map((p) => {
        let cur = 0, old = 0, on = 0;
        const cells = D.sites
          .map((s) => {
            const x = s.plugins.find((x) => x.slug === p.slug);
            if (!x) return `<td><i class="g none"></i></td>`;
            on++;
            if (x.vulnerable) return (old++, `<td title="${s.name}: ${x.version}, known vulnerability"><i class="g vuln"></i></td>`);
            if (x.version !== p.latest) return (old++, `<td title="${s.name}: ${x.version}"><i class="g old"></i></td>`);
            cur++;
            return `<td title="${s.name}: ${x.version}${x.active ? "" : ", inactive"}"><i class="g ${x.active ? "cur" : "off"}"></i></td>`;
          })
          .join("");
        return `<tr><td class="name"><b>${p.name}</b><small>${p.latest}</small></td>${cells}<td class="tally">${on} sites${old ? `, <span class="s-warning">${old} behind</span>` : ""}</td></tr>`;
      })
      .join("");
    return shell(
      `<div class="pagehead"><h1 class="title">Plugins<sup>${D.plugins.length} across ${T.sites} sites</sup></h1>
        <div class="actions"><button class="btn quiet">Install a plugin</button><a class="btn solid" href="update.html">Update ${D.plan.length} plugins</a></div></div>
      <div class="legend"><span><i class="g cur"></i>Up to date</span><span><i class="g off"></i>Installed, not active</span><span><i class="g old"></i>Update waiting</span><span><i class="g vuln"></i>Known vulnerability</span><span><i class="g none"></i>Not installed</span></div>
      <table class="matrix"><thead><tr><th></th>${head}<th></th></tr></thead><tbody>${rows}</tbody></table>`,
      "Plugins"
    );
  },

  update() {
    const step = MC.q.get("step") || "plan";
    const idx = ["plan", "confirm", "progress"].indexOf(step);
    const steps = [
      ["Plan", "Pick what to update"],
      ["Confirm", "Check what will happen"],
      ["Progress", "Watch it run"],
    ]
      .map(([t, d], i) => `<li class="${i < idx ? "done" : ""}"${i === idx ? ' aria-current="step"' : ""}><b>${i + 1}. ${t}</b><span>${d}</span></li>`)
      .join("");
    const byPlugin = D.plugins
      .map((p) => ({ p, rows: D.plan.filter((r) => r.plugin === p) }))
      .filter((g) => g.rows.length);
    let body = "";
    if (step === "plan") {
      body = `<h2>Update ${D.plan.length} plugins on ${planSites} sites</h2>
        <p class="lede">Every plugin with a newer version, on every site that answered. ${say(T.danger)} sites are down and left out. Untick anything you want to keep as it is.</p>
        ${byPlugin
          .map(
            (g) => `<div class="group"><i class="check on"></i><b>${g.p.name}</b><span class="mono">to ${g.p.latest}, on ${g.rows.length} site${g.rows.length > 1 ? "s" : ""}</span>
            <span class="who">${g.rows.map((r) => r.site.name).slice(0, 4).join(", ")}${g.rows.length > 4 ? ` and ${g.rows.length - 4} more` : ""}</span></div>`
          )
          .join("")}
        <div class="footbar"><span class="sum">${D.plan.length} updates selected</span><button class="btn quiet">Save as a plan for later</button><a class="btn solid" href="update.html?step=confirm">Continue to confirm</a></div>`;
    } else if (step === "confirm") {
      body = `<h2>Ready to update ${D.plan.length} plugins on ${planSites} sites</h2>
        <p class="lede">Nothing changes until you press Start. You can pause at any point and the sites already done stay done.</p>
        <ul class="terms">
          <li><span>Order</span>Four sites at a time, staging sites first</li>
          <li><span>Before each site</span>A backup with UpdraftPlus where it is installed (${D.sites.filter((s) => s.plugins.some((x) => x.slug === "updraftplus")).length} sites)</li>
          <li><span>If a site fails</span>That site stops. Nothing else on it changes. The rest carry on.</li>
          <li><span>Afterwards</span>Each site is checked again and you get a summary</li>
          <li><span>Left out</span>${D.sites.filter((s) => s.status === "danger").map((s) => s.name).join(" and ")} (not answering)</li>
        </ul>
        ${vuln.map((r) => `<div class="notice">${r.plugin.name} ${r.from} on ${r.site.name} has a known vulnerability. This plan updates it to ${r.to}.</div>`).join("")}
        <div class="footbar"><span class="sum">Takes about 6 minutes</span><a class="btn quiet" href="update.html?step=plan">Back to the plan</a><a class="btn solid" href="update.html?step=progress">Start ${D.plan.length} updates</a></div>`;
    } else {
      const done = D.plan.filter((r) => r.state === "done").length;
      const failed = D.plan.filter((r) => r.state === "failed").length;
      const pct = Math.round(((done + failed) / D.plan.length) * 100);
      const order = ["failed", "running", "done", "waiting"];
      const rows = [...D.plan].sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state)).slice(0, 14);
      body = `<p class="kicker">Updating ${D.plan.length} plugins on ${planSites} sites</p>
        <p class="pct">${pct}%</p>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <p class="lede">${done} done, ${failed} failed, ${D.plan.length - done - failed} to go. About 2 minutes left.</p>
        <div class="runlog"><ul>${rows
          .map((r) => `<li><span class="st ${r.state}">${r.state.toUpperCase()}</span><span>${r.site.name}</span><span>${r.plugin.name} ${r.from} → ${r.to}</span>${r.error ? `<span class="err">${r.error}</span>` : "<span></span>"}</li>`)
          .join("")}</ul></div>
        <div class="footbar"><span class="sum">You can close this window. Updates keep running while the app is open.</span><button class="btn quiet">Pause after the current sites</button><button class="btn solid">Retry the failed update</button></div>`;
    }
    return shell(`<p class="kicker">Bulk update</p><div class="flow"><ol class="steps">${steps}</ol><div>${body}</div></div>`, "Updates");
  },

  editor() {
    const P = D.post;
    return shell(
      `<div class="editor">
        <aside class="drawer"><p class="kicker">${P.site}, posts</p>${P.recent
          .map(([t, s, w], i) => `<a href="#"${i === 0 ? ' aria-current="true"' : ""}><b>${t}</b>${s}, ${w}</a>`)
          .join("")}<p style="margin-top:16px"><button class="textbtn">Write a new post</button></p></aside>
        <article class="manuscript">
          <div class="crumbs"><span>${P.site}</span><span>Post</span><span>${P.updated}</span></div>
          <h1 contenteditable="true">${P.title}</h1>
          <p class="standfirst" contenteditable="true">${P.excerpt}</p>
          <div class="body" contenteditable="true">${P.body.map(([t, x]) => `<${t}>${x}</${t}>`).join("")}</div>
          <p class="safe">Block-safe editing: you change the words, the blocks and layout on the site stay exactly as they are.</p>
        </article>
        <aside class="margin">
          <div class="acts"><button class="btn quiet">Preview on site</button><button class="btn">Save draft</button><button class="btn solid">Publish</button></div>
          <dl>
            <dt>Status</dt><dd><span class="dot warning"></span>Draft, not published</dd>
            <dt>Author</dt><dd>${P.author}</dd>
            <dt>Address</dt><dd class="mono" style="font:400 12px var(--mono)">harbourbakery.co.uk/${P.slug}</dd>
            <dt>Categories</dt><dd>${P.categories.join(", ")}</dd>
            <dt>Tags</dt><dd>${P.tags.join(", ")}</dd>
            <dt>Featured image</dt><dd><div class="img">Choose an image</div></dd>
          </dl>
        </aside>
      </div>`,
      "Content"
    );
  },
};

document.body.innerHTML = render[page]();
MC.palette = document.querySelector(".palette");
MC.bindPalette(
  (c, on, term) =>
    `<li class="pal-row${on ? " on" : ""}"><a href="${c.href || "#"}">${MC.mark(c.label, term)}${c.hint ? `<small>${c.hint}</small>` : ""}${c.keys ? `<span class="kbd">${c.keys}</span>` : ""}</a></li>`
);
MC.start();
