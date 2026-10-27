// Sample data shared by all three design directions. Deterministic, so screenshots match run to run.
(function () {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const pick = (a) => a[Math.floor(rnd() * a.length)];

  const names = [
    ["Harbour Bakery", "harbourbakery.co.uk", "Clients"],
    ["Northfield Dental", "northfielddental.com", "Clients"],
    ["Kite and Key Studio", "kiteandkey.studio", "Retainer"],
    ["Alder Physio", "alderphysio.ie", "Clients"],
    ["Goodmonks", "goodmonks.com", "Own sites"],
    ["Classic Monks", "classicmonks.com", "Own sites"],
    ["Juniper Yoga", "juniperyoga.org", "Clients"],
    ["Brightwater Law", "brightwaterlaw.com", "Retainer"],
    ["Marlow Cycles", "marlowcycles.co.uk", "Clients"],
    ["Fernhill Farm Shop", "fernhillfarm.shop", "Retainer"],
    ["Oaktree Nursery", "oaktreenursery.org.uk", "Clients"],
    ["Saltmarsh Coffee", "saltmarsh.coffee", "Retainer"],
    ["Hollis Architects", "hollisarchitects.com", "Clients"],
    ["Pinecrest Vets", "pinecrestvets.com", "Retainer"],
    ["Copperline Electrical", "copperline.co", "Clients"],
    ["Bluebell Weddings", "bluebellweddings.com", "Clients"],
    ["Ridgeway Lettings", "ridgewaylettings.co.uk", "Retainer"],
    ["Tandem Bookshop", "tandembooks.com", "Clients"],
    ["Ember Pizza", "emberpizza.co", "Clients"],
    ["Wildflower Florist", "wildflowerflorist.com", "Clients"],
    ["Lumen Opticians", "lumenoptics.co.uk", "Retainer"],
    ["Stonebridge School", "stonebridge.sch.uk", "Retainer"],
    ["Atlas Movers", "atlasmovers.com", "Clients"],
    ["Quayside Gallery", "quaysidegallery.art", "Clients"],
    ["Meadow Pet Supply", "meadowpets.com", "Retainer"],
    ["Brook and Vale Homes", "brookandvale.com", "Clients"],
    ["Sable Tattoo", "sabletattoo.studio", "Clients"],
    ["Northwind Sailing", "northwindsailing.club", "Clients"],
    ["Clover Accountants", "cloveraccounts.co.uk", "Retainer"],
    ["Fieldnote Journal", "fieldnote.blog", "Own sites"],
    ["Granite Gym", "granitegym.fit", "Clients"],
    ["Lantern Theatre", "lanterntheatre.org", "Retainer"],
    ["Orchard Cider Co", "orchardcider.co", "Clients"],
    ["Paperplane Print", "paperplaneprint.com", "Clients"],
    ["Riverside Clinic", "riversideclinic.health", "Retainer"],
    ["Thistle Tours", "thistletours.scot", "Clients"],
    ["Velvet Barbers", "velvetbarbers.com", "Clients"],
    ["Willow Counselling", "willowcounselling.org", "Retainer"],
    ["Harbour Bakery (staging)", "staging.harbourbakery.co.uk", "Staging"],
    ["Goodmonks (local)", "goodmonks.local", "Staging"],
  ];

  const plugins = [
    { slug: "classic-monks", name: "Classic Monks", latest: "2.6.1", share: 1 },
    { slug: "woocommerce", name: "WooCommerce", latest: "10.3.2", share: 0.45 },
    { slug: "wordpress-seo", name: "Yoast SEO", latest: "26.2", share: 0.5 },
    { slug: "gravityforms", name: "Gravity Forms", latest: "2.9.18", share: 0.4 },
    { slug: "advanced-custom-fields", name: "Advanced Custom Fields", latest: "6.6.1", share: 0.6 },
    { slug: "wp-rocket", name: "WP Rocket", latest: "3.20.0.2", share: 0.35 },
    { slug: "wordfence", name: "Wordfence Security", latest: "8.1.0", share: 0.55 },
    { slug: "updraftplus", name: "UpdraftPlus", latest: "1.25.8", share: 0.65 },
    { slug: "contact-form-7", name: "Contact Form 7", latest: "6.1.3", share: 0.4 },
    { slug: "redirection", name: "Redirection", latest: "5.5.2", share: 0.45 },
    { slug: "the-events-calendar", name: "The Events Calendar", latest: "6.15.9", share: 0.2 },
    { slug: "wpml", name: "WPML", latest: "4.8.4", share: 0.15 },
    { slug: "akismet", name: "Akismet Anti-spam", latest: "5.5", share: 0.7 },
    { slug: "query-monitor", name: "Query Monitor", latest: "3.19.0", share: 0.2 },
    { slug: "safe-svg", name: "Safe SVG", latest: "2.3.3", share: 0.3 },
    { slug: "duplicate-post", name: "Yoast Duplicate Post", latest: "4.5", share: 0.35 },
  ];
  const older = (v, n) => {
    const p = v.split(".");
    p[p.length - 1] = String(Math.max(0, Number(p[p.length - 1]) - n));
    return p.join(".");
  };

  // Hand-set problems so every direction shows the same story.
  const issues = {
    22: { status: "danger", note: "Not responding. Last seen 41 min ago." },
    16: { status: "danger", note: "Login was refused. Reconnect the site." },
    13: { status: "warning", note: "SSL certificate expires in 6 days." },
    27: { status: "warning", note: "PHP 8.1 no longer gets security fixes." },
    35: { status: "warning", note: "Classic Monks 2.5. Update for full control." },
    9: { status: "warning", note: "Contact Form 7 has a known vulnerability." },
  };

  const sites = names.map(([name, url, group], i) => {
    const issue = issues[i] || { status: "ok", note: "" };
    const env = group === "Staging" ? (url.endsWith(".local") ? "Local" : "Staging") : "Production";
    const mode =
      i === 35 ? "Classic Monks 2.5" : i % 9 === 4 ? "Basic mode" : i % 3 === 0 ? "Classic Monks Free" : "Classic Monks Pro";
    const wp = i % 5 === 0 ? "7.1.0" : "7.1.1";
    const php = i === 27 ? "8.1" : pick(["8.2", "8.3", "8.3", "8.4"]);
    const installed = plugins
      .filter((p, j) => (j === 0 ? mode !== "Basic mode" : rnd() < p.share || (i === 9 && p.slug === "contact-form-7")))
      .map((p) => {
        const vulnerable = i === 9 && p.slug === "contact-form-7";
        const behind = issue.status === "danger" ? 0 : rnd() < 0.3 ? 1 + Math.floor(rnd() * 2) : 0;
        return {
          slug: p.slug,
          version: p.slug === "classic-monks" && i === 35 ? "2.5.4" : vulnerable ? "6.0.5" : behind ? older(p.latest, behind) : p.latest,
          active: p.slug === "classic-monks" || vulnerable || rnd() > 0.12,
          vulnerable,
        };
      });
    const pluginUpdates = installed.filter((x) => x.version !== plugins.find((p) => p.slug === x.slug).latest).length;
    const themeUpdates = rnd() < 0.2 ? 1 : 0;
    return {
      id: i + 1,
      name,
      url,
      group,
      env,
      mode,
      wp,
      php,
      status: issue.status,
      note: issue.note,
      plugins: installed,
      pluginUpdates,
      themeUpdates,
      coreUpdate: wp === "7.1.0" && issue.status !== "danger",
      checked: issue.status === "danger" ? 41 : 1 + Math.floor(rnd() * 14),
      ssl: i === 13 ? 6 : 20 + Math.floor(rnd() * 300),
      uptime: issue.status === "danger" ? 97.2 : 99.5 + Math.round(rnd() * 49) / 100,
      posts: 12 + Math.floor(rnd() * 400),
      theme: pick(["Bricks", "Bricks", "Twenty Twenty-Six", "Kadence", "GeneratePress", "Astra"]),
    };
  });
  sites.forEach((s) => (s.updates = s.pluginUpdates + s.themeUpdates + (s.coreUpdate ? 1 : 0)));

  const totals = {
    planSites: 0,
    sites: sites.length,
    ok: sites.filter((s) => s.status === "ok").length,
    warning: sites.filter((s) => s.status === "warning").length,
    danger: sites.filter((s) => s.status === "danger").length,
    updates: sites.reduce((n, s) => n + s.updates, 0),
    pluginUpdates: sites.reduce((n, s) => n + s.pluginUpdates, 0),
    sitesWithUpdates: sites.filter((s) => s.updates).length,
    core: sites.filter((s) => s.coreUpdate).length,
    themes: sites.reduce((n, s) => n + s.themeUpdates, 0),
  };

  // The bulk update plan: every plugin update on every reachable site.
  const plan = [];
  sites.forEach((s) =>
    s.plugins.forEach((x) => {
      const p = plugins.find((p) => p.slug === x.slug);
      if (x.version !== p.latest) plan.push({ site: s, plugin: p, from: x.version, to: p.latest });
    })
  );
  totals.planSites = new Set(plan.map((r) => r.site.id)).size;
  // Progress snapshot: first 61% done, one failure, two running, the rest waiting.
  const doneUntil = Math.floor(plan.length * 0.61);
  plan.forEach((row, i) => {
    row.state = i < doneUntil ? "done" : i < doneUntil + 2 ? "running" : "waiting";
    if (i === 7) {
      row.state = "failed";
      row.error = "The site took too long to answer. Nothing was changed.";
    }
  });

  const activity = [
    { when: "2 min ago", who: "You", what: "Updated WooCommerce to 10.3.2 on 6 sites", status: "ok" },
    { when: "9 min ago", who: "Claude (agent)", what: "Drafted “Autumn menu is here” on Harbour Bakery. Waiting for your approval.", status: "warning" },
    { when: "24 min ago", who: "Schedule", what: "Checked 40 sites. 2 did not answer.", status: "danger" },
    { when: "1 hr ago", who: "You", what: "Turned on Login protection on 12 sites", status: "ok" },
    { when: "3 hr ago", who: "Cursor (agent)", what: "Read plugin lists on 40 sites", status: "ok" },
    { when: "Yesterday", who: "You", what: "Rolled back Gravity Forms on Pinecrest Vets to 2.9.16", status: "ok" },
    { when: "Yesterday", who: "You", what: "Added Velvet Barbers in Basic mode", status: "ok" },
  ];

  const post = {
    site: "Harbour Bakery",
    type: "Post",
    title: "Our autumn menu is here",
    status: "Draft",
    author: "Maya Lund",
    updated: "Edited 4 min ago",
    slug: "autumn-menu",
    categories: ["News", "Seasonal"],
    tags: ["menu", "autumn", "sourdough"],
    excerpt: "Pumpkin sourdough, spiced pear buns and the return of the Saturday bake.",
    body: [
      ["p", "The ovens are warm and the mornings are dark again, which can only mean one thing. The autumn menu starts on Monday 2 November, and it is our favourite one yet."],
      ["h2", "What is new"],
      ["p", "Pumpkin and rye sourdough, baked with roasted squash from Fernhill Farm. Spiced pear buns with a brown butter glaze. A proper apple crumble slice, sold warm from ten until it runs out."],
      ["h2", "The Saturday bake is back"],
      ["p", "From 7 November we open at seven on Saturdays with a short run of laminated pastries. Come early. Last year they were gone by half past eight."],
      ["p", "As always, everything is made on site, by hand, with flour from Shipton Mill."],
    ],
    recent: [
      ["Our autumn menu is here", "Draft", "4 min ago"],
      ["Christmas orders open 1 December", "Scheduled", "Mon 30 Nov"],
      ["Meet the team: Ola, our new baker", "Published", "12 Oct"],
      ["Why we switched to Shipton Mill flour", "Published", "28 Sep"],
      ["Summer opening hours", "Published", "2 Jun"],
      ["Sourdough masterclass tickets", "Pending review", "Yesterday"],
    ],
  };

  const sections = ["Overview", "Sites", "Updates", "Plugins", "Themes", "Content", "Media", "Users", "Comments", "Security", "Reports", "AI", "Settings"];
  const pages = { Overview: "index.html", Sites: "sites.html", Updates: "update.html", Plugins: "plugins.html", Content: "editor.html" };

  const commands = [
    { group: "Actions", label: `Update ${plan.length} plugins on ${totals.planSites} sites`, keys: "U", href: "update.html" },
    { group: "Actions", label: "Add a site", keys: "A" },
    { group: "Actions", label: "Refresh all sites", keys: "R" },
    { group: "Actions", label: "Write a new post", keys: "N", href: "editor.html" },
    { group: "Actions", label: "Update WordPress on 8 sites" },
    { group: "Actions", label: "Reconnect Ridgeway Lettings" },
    { group: "Go to", label: "Overview", keys: "G O", href: "index.html" },
    { group: "Go to", label: "Sites", keys: "G S", href: "sites.html" },
    { group: "Go to", label: "Plugins", keys: "G P", href: "plugins.html" },
    { group: "Go to", label: "Updates", keys: "G U", href: "update.html" },
    { group: "Go to", label: "Content", keys: "G C", href: "editor.html" },
    ...sites.slice(0, 12).map((s) => ({ group: "Sites", label: s.name, hint: s.url, href: "sites.html" })),
  ];

  window.MC_DATA = { sites, plugins, totals, plan, activity, post, sections, pages, commands };
})();
