// Theme, keyboard and small helpers shared by the three directions.
// Theme order: ?theme= in the URL, then the saved choice, then the OS setting.
(function () {
  const q = new URLSearchParams(location.search);
  const root = document.documentElement;
  const saved = localStorage.getItem("mc-theme");
  const os = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.dataset.theme = q.get("theme") || saved || os;

  const MC = (window.MC = {
    q,
    toggleTheme() {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("mc-theme", root.dataset.theme);
    },
    esc: (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]),
    ago: (m) => (m < 60 ? `${m} min ago` : `${Math.round(m / 60)} hr ago`),
    statusWord: { ok: "Healthy", warning: "Needs a look", danger: "Down" },
    // The Classic Monks mark from classic-monks/assets/images/classicmonks-icon.svg, recoloured by CSS.
    logo: (cls = "mark") =>
      `<svg class="${cls}" viewBox="0 0 65 64" aria-hidden="true"><path class="mark-body" d="M0 31.63c.002-.353.01-.705.025-1.06C.976 7.459 29.57-6.45 49.447 2.995c20.86 9.913 19.047 37.3 4.514 52.014C34.353 74.861-.144 59.515.001 31.63Z"/><path class="mark-face" d="M32.434 21.865c2.58 0 4.67-2.093 4.67-4.675a4.673 4.673 0 0 0-4.67-4.674 4.673 4.673 0 0 0-4.67 4.674 4.673 4.673 0 0 0 4.67 4.675ZM42.014 25.193c-.75 0-1.497.324-2.068.974a9.906 9.906 0 0 1-14.897 0c-1.141-1.302-2.996-1.302-4.137 0-1.145 1.293-1.145 3.395 0 4.688 6.382 7.24 16.79 7.24 23.171 0 1.145-1.294 1.145-3.395 0-4.688-.57-.65-1.317-.974-2.068-.974ZM32.434 34.18c-7.058 0-14.114 2.691-19.486 8.07a2.925 2.925 0 0 0 0 4.14 2.912 2.912 0 0 0 4.137 0c8.463-8.463 22.235-8.463 30.698 0a2.912 2.912 0 0 0 4.138 0 2.925 2.925 0 0 0 0-4.14c-5.373-5.378-12.428-8.07-19.487-8.07Z"/></svg>`,
    // Each direction sets these two and calls MC.start().
    renderPalette: null,
    palette: null,
    openPalette(query = "") {
      if (!MC.palette) return;
      MC.palette.hidden = false;
      const input = MC.palette.querySelector("input");
      input.value = query;
      input.dispatchEvent(new Event("input"));
      input.focus();
    },
    closePalette() {
      if (MC.palette) MC.palette.hidden = true;
    },
    // Filters commands by query and fills `list` using the direction's row template.
    bindPalette(row) {
      const input = MC.palette.querySelector("input");
      const list = MC.palette.querySelector("[data-list]");
      let active = 0;
      const draw = () => {
        const term = input.value.trim().toLowerCase();
        const hits = MC_DATA.commands.filter((c) => !term || c.label.toLowerCase().includes(term));
        active = Math.min(active, Math.max(hits.length - 1, 0));
        let group = "";
        list.innerHTML = hits
          .map((c, i) => {
            const head = c.group !== group ? ((group = c.group), `<li class="pal-group">${c.group}</li>`) : "";
            return head + row(c, i === active, term);
          })
          .join("") || `<li class="pal-empty">No matches. Try “update” or a site name.</li>`;
        list._hits = hits;
      };
      input.addEventListener("input", () => ((active = 0), draw()));
      input.addEventListener("keydown", (e) => {
        const n = (list._hits || []).length;
        if (e.key === "ArrowDown") (active = (active + 1) % n), draw(), e.preventDefault();
        if (e.key === "ArrowUp") (active = (active - 1 + n) % n), draw(), e.preventDefault();
        if (e.key === "Enter" && list._hits[active]?.href) location.href = list._hits[active].href;
      });
      MC.palette.addEventListener("click", (e) => e.target === MC.palette && MC.closePalette());
    },
    mark: (text, term) => {
      const t = MC.esc(text);
      if (!term) return t;
      const i = text.toLowerCase().indexOf(term);
      return i < 0 ? t : MC.esc(text.slice(0, i)) + `<mark>${MC.esc(text.slice(i, i + term.length))}</mark>` + MC.esc(text.slice(i + term.length));
    },
    start() {
      document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") e.preventDefault(), MC.openPalette();
        if (e.key === "Escape") MC.closePalette();
      });
      document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", MC.toggleTheme));
      document.querySelectorAll("[data-open-palette]").forEach((b) => b.addEventListener("click", () => MC.openPalette()));
      if (q.has("palette")) MC.openPalette(q.get("palette"));
    },
  });
})();
