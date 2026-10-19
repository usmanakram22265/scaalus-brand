// Renders the Scaalus brand guidelines from window.SCAALUS (dist/brand.js).
// Every colour, gradient, rule and contrast figure comes from the token build;
// this file only holds page layout.
(() => {
  const D = window.SCAALUS;
  const P = D.palette;
  const G = D.gradients;
  const S = D.system;
  const R = S.rhythm;
  const moods = Object.values(D.moods);
  const byTheme = (t) => moods.filter((m) => m.theme === t);
  const PAGE_MOOD = { dark: "midnight", light: "daylight" };

  // ---------- helpers ----------

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const pct = (a) => `${Math.round(a * 100)}%`;
  const two = (n) => String(n).padStart(2, "0");
  const logoSrc = (theme, kind = "icon-left") => "../" + S.logo[theme].files[kind];

  function lum(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const s = parseInt(hex.slice(i, i + 2), 16) / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const inkOn = (hex) => (lum(hex) > 0.36 ? P.navy.hex : P.white.hex);

  function paint(p) {
    if (!p) return "—";
    if (typeof p === "string") return p;
    if (p.stops) return p.stops.map((s) => (s.alpha < 1 ? `${s.hex} ${pct(s.alpha)}` : s.hex)).join(" · ");
    if (p.alpha !== undefined && p.alpha < 1) return `${p.name} ${p.hex} at ${pct(p.alpha)}`;
    return `${p.name} ${p.hex}`;
  }
  const stopsText = (g) => g.stops.map((s) => (s.alpha < 1 ? `${s.hex} ${pct(s.alpha)}` : s.hex)).join(" · ");
  const isOverlay = (g) => g.stops.some((s) => s.alpha === 0);
  const nextOf = (id) => R.sequence[(R.sequence.indexOf(id) + 1) % R.sequence.length];

  // Abstract colour card: ground, colour mass, logo, accent bar, pill, headline + highlight, supporting, button.
  function card(m) {
    return `<div class="cc" data-mood="${m.id}"><div class="cc-in">
      <i class="cc-mass${isOverlay(m.mass.gradient) ? " cc-mass--full" : ""}"></i>
      <img class="cc-logo" src="${logoSrc(m.theme)}" alt="">
      <i class="cc-meta"></i><i class="cc-bar"></i><i class="cc-pill"></i>
      <i class="cc-h cc-h1"></i><i class="cc-h cc-h2"></i><i class="cc-h cc-h3"></i>
      <i class="cc-s cc-s1"></i><i class="cc-s cc-s2"></i>
      <i class="cc-btn"></i>
    </div></div>`;
  }

  // ---------- page frame ----------

  let count = 0;
  const starts = {};

  function page(theme, { eyebrow, title, sub, body, section, mood, cls = "" }) {
    count += 1;
    if (section && !starts[section]) starts[section] = count;
    return `<section class="page ${cls}" data-mood="${mood || PAGE_MOOD[theme]}">
      ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ""}
      ${title ? `<h2 class="title">${title}</h2>` : ""}
      ${sub ? `<p class="sub">${sub}</p>` : ""}
      ${body}
      <div class="foot"><img src="${logoSrc(theme)}" alt="Scaalus"><span>${two(count)}</span></div>
    </section>`;
  }

  const OVERALL = "01 · Overall colour";
  const SECTION = { dark: "02 · Dark theme", light: "03 · Light theme" };
  const monthYear = new Date(S.date + "T12:00:00").toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  // ---------- 01 overall colour ----------

  function cover() {
    count += 1;
    return `<section class="page cover" data-mood="electric">
      <div class="cover__aura"></div>
      <img class="cover__logo" src="${logoSrc("dark")}" alt="Scaalus">
      <div class="cover__bar"></div>
      <h1 class="cover__title">Brand<br><span class="hl">Guidelines</span></h1>
      <p class="cover__meta">Social media · colour system v${esc(D.version)}${D.typography ? ` · typography v${esc(D.typography.version)}` : ""} · three heroes, two themes, six moods${D.typography ? `, ${D.typography.fonts.length} fonts` : ""} · ${monthYear}</p>
    </section>`;
  }

  function contents() {
    const rows = [
      ["01", "Overall colour", "Principles · hero colours · palette · gradients · themes and moods · rhythm · proportions · contrast · logo", "overall"],
      ["02", "Dark theme", `Overview · ${byTheme("dark").map((m) => m.name).join(" · ")} · surfaces · text and contrast · glows and checks · rules`, "dark"],
      ["03", "Light theme", `Overview · ${byTheme("light").map((m) => m.name).join(" · ")} · surfaces · text and contrast · glows and checks · rules`, "light"],
      ...(D.typography ? [["04", "Typography", "Font roles · workhorse fonts · display fonts · accent and label fonts · pairings · type rules", "type"]] : []),
    ];
    return page("light", {
      eyebrow: "Contents",
      title: "What's inside",
      body: `<div class="toc">${rows
        .map(([n, t, d, key]) => `<div class="toc__row"><div class="toc__n hl">${n}</div><div><div class="toc__t">${t}</div><div class="toc__d">${d}</div></div><div class="toc__p">p. {{${key}}}</div></div>`)
        .join("")}</div>`,
    });
  }

  function principles() {
    return page("light", {
      section: "overall",
      eyebrow: OVERALL,
      title: "Principles",
      sub: "The rules behind every colour decision. Elements come from here; the visual is always yours.",
      body: `<div class="principles">${S.principles
        .map((p) => `<div class="principle"><div class="principle__n hl">${two(p.n)}</div><div><div class="principle__t">${esc(p.title)}</div><div class="principle__b">${esc(p.body)}</div></div></div>`)
        .join("")}</div>`,
    });
  }

  function heroes() {
    const hero = (c) => `<div class="core__sw" style="background:${c.hex};color:${inkOn(c.hex)}"><div class="core__name">${c.name}</div><div class="core__hex">${c.hex}</div><div class="core__rgb">RGB ${c.rgb.join(" ")}</div></div>`;
    const logo = ["logo-blue", "logo-indigo", "logo-violet"].map((k) => P[k]);
    return page("light", {
      eyebrow: OVERALL,
      title: "Three heroes, one signature",
      sub: esc(S.core.rule),
      body: `<div class="core" style="grid-template-columns:repeat(3,1fr);margin-block-start:26px">${S.core.hero.map((c) => hero(P[c.token])).join("")}</div>
        <div style="display:grid;grid-template-columns:2fr repeat(3,1fr);gap:22px;margin-block-start:34px;align-items:end">
          <div><div class="gbar" style="block-size:70px;background:${G["accent-bar"].css}"></div><p class="gbar__cap">Signature · logo gradient · ${stopsText(G["accent-bar"])}</p></div>
          ${logo.map((c) => `<div><div class="gbar" style="block-size:70px;background:${c.hex}"></div><p class="gbar__cap">${c.name} · ${c.hex}</p></div>`).join("")}
        </div>
        <ul class="bullets" style="margin-block-start:18px;font-size:15px"><li>${esc(S.core["accent-bar"].rule)}</li></ul>`,
    });
  }

  function palette() {
    const rows = Object.entries(D.families)
      .map(([fam, label]) => {
        const chips = Object.values(P)
          .filter((c) => c.family === fam)
          .map((c) => {
            const badge = /HERO/.test(c.description) ? "HERO" : /ACCENT ONLY/.test(c.description) ? "ACCENT" : "";
            return `<div class="chip" style="background:${c.hex};color:${inkOn(c.hex)}">${badge ? `<span class="chip__badge">${badge}</span>` : ""}<div class="chip__name">${c.name}</div><div class="chip__hex">${c.hex}</div><div class="chip__rgb">RGB ${c.rgb.join(" ")}</div></div>`;
          })
          .join("");
        return `<div class="palette__row"><div class="palette__fam">${label}</div>${chips}</div>`;
      })
      .join("");
    return page("light", {
      eyebrow: OVERALL,
      title: "Full palette",
      sub: `${Object.keys(P).length} colours in ${Object.keys(D.families).length} families. HERO marks the three that do most of the work; ACCENT marks the logo colours that stay small.`,
      body: `<div class="palette" style="gap:9px;margin-block-start:18px">${rows}</div><p class="note-line">Never: ${esc(D["palette-notes"].never)}</p>`,
    });
  }

  function gradients() {
    const list = Object.values(G);
    return page("light", {
      eyebrow: OVERALL,
      title: "Gradients",
      sub: "Fixed stops. Accents, grounds, colour masses and highlights.",
      body: `<div class="grads" style="grid-template-columns:repeat(4,1fr);gap:14px 22px;margin-block-start:22px">${list
        .map((g) => `<div><div class="grad__bar" style="block-size:36px;background:${g.css}${g.stops.some((s) => s.alpha < 1) ? `, ${P.navy.hex}` : ""}"></div><div class="grad__name">${g.name}</div><div class="grad__stops">${esc(stopsText(g))}</div></div>`)
        .join("")}</div>`,
    });
  }

  function themesAndMoods() {
    return page("light", {
      eyebrow: OVERALL,
      title: "Themes and moods",
      sub: "Two themes, three moods each. Every mood is a complete colour recipe. The cards only show which colour plays which role. They are not layouts; the visual is always designed fresh.",
      body: `<div class="moods" style="margin-block-start:30px">${moods
        .map((m) => `<div>${card(m)}<div class="mood__name">${m.name}</div><div class="mood__for">${m.theme} · ${esc(m.tagline)}</div></div>`)
        .join("")}</div>`,
    });
  }

  function rhythm() {
    const seq = R.sequence
      .map((id, i) => {
        const m = D.moods[id];
        return `<div><div class="week__day" data-mood="${m.id}"><div class="week__d">${two(i + 1)}</div><div class="week__m">${m.name}</div></div><div class="week__p">${m.theme}</div></div>`;
      })
      .join("");
    const good = R.sequence
      .map((id) => {
        const m = D.moods[id];
        return `<div class="ptable__row"><div class="mtag"><span class="mtag__sw" data-mood="${m.id}"></span><span>${m.name}<br><small>${m.theme} theme</small></span></div>
          <div class="ptable__about">${m["good-for"].map(esc).join(" · ")}</div><div class="ptable__about">next → ${D.moods[nextOf(id)].name}</div></div>`;
      })
      .join("");
    return page("light", {
      eyebrow: OVERALL,
      title: "One dark, one light",
      sub: esc(R.rule),
      body: `<div class="week" style="margin-block-start:26px">${seq}</div>
        <div class="ptable" style="margin-block-start:18px">${good}</div>
        <p class="small" style="margin-block-start:14px">${esc(R.how)}</p>`,
    });
  }

  function proportions() {
    const segs = {
      light: [D.moods.daylight.ground.gradient.css, G["mass-sky-block"].css, P.navy.hex, G["accent-bar"].css],
      dark: [D.moods.midnight.ground.gradient.css, G["mass-royal-aurora"].css, P.white.hex, G["highlight-ice"].css],
    };
    const block = (theme) => {
      const parts = S.proportions[theme];
      const bar = parts.map((p, i) => `<div style="flex:${p.percent};background:${segs[theme][i]}"></div>`).join("");
      const keys = parts.map((p) => `<div class="prop__key" style="flex:${p.percent}"><b>${p.percent}%</b><span>${esc(p.part)}</span></div>`).join("");
      return `<div class="prop"><div class="prop__label">${theme} theme</div><div class="prop__bar" style="outline:1px solid var(--sc-lines)">${bar}</div><div class="prop__keys">${keys}</div></div>`;
    };
    return page("light", {
      eyebrow: OVERALL,
      title: "Proportions",
      sub: "How much of each colour a post uses. The ground dominates; the accent stays small.",
      body: `${block("light")}${block("dark")}<ul class="bullets" style="margin-block-start:30px">${S.proportions.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`,
    });
  }

  function crow(r, tight) {
    return `<div class="crow${tight ? " crow--tight" : ""}"><div class="crow__aa" style="background:${r.bg};color:${r.fg}">Aa</div>
      <div class="crow__label">${esc(r.label)}<span class="crow__detail">${r.fg} on ${r.bg}${tight ? "" : " (worst case)"}</span></div>
      <div class="crow__ratio">${r.ratio.toFixed(1)}:1</div><div class="crow__ok">${r.pass ? "OK" : "FAIL"}</div></div>`;
  }

  function contrastGlance() {
    const pick = (m) => ["Headline", "Supporting", "Highlight end"].map((l) => m.contrast.rows.find((r) => r.label === l)).filter(Boolean);
    const col = (theme) => byTheme(theme).map((m) => `<div class="cmood">${m.name}</div>${pick(m).map((r) => crow(r, true)).join("")}`).join("");
    return page("light", {
      eyebrow: OVERALL,
      title: "Contrast at a glance",
      sub: `Worst case across each mood's ground and glow. ${S.contrast.minimums.text}:1 for small text, ${S.contrast.minimums.headline}:1 for headlines.`,
      body: `<div class="ctabs" style="margin-block-start:16px"><div>${col("dark")}</div><div>${col("light")}</div></div>`,
    });
  }

  function logoPage() {
    const tile = (mood, theme, kind, cap) => `<div><div class="logo__tile" data-mood="${mood}"><img src="${logoSrc(theme, kind)}" alt="Scaalus" style="${kind === "icon" ? "inline-size:auto;block-size:120px" : ""}"></div><div class="logo__cap">${cap}</div></div>`;
    return page("light", {
      eyebrow: OVERALL,
      title: "Logo colours",
      sub: "Icon + name for single posts and a carousel's last slide. Icon only on every other carousel slide.",
      body: `<div class="logos">
          ${tile("daylight", "light", "icon-left", "Icon + name · single posts · carousel last slide")}
          ${tile("sky", "light", "icon", "Icon only · carousel first + middle slides")}
          ${tile("midnight", "dark", "icon-left", "Icon + name · white · dark moods")}
          ${tile("cobalt", "dark", "icon", "Icon only · white · dark carousels")}
        </div>
        <ul class="bullets" style="margin-block-start:30px">${S.logo.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`,
    });
  }

  // ---------- 02 / 03 theme sections ----------

  function overview(theme) {
    const T = S.themes[theme];
    const list = byTheme(theme);
    return page(theme, {
      section: theme,
      eyebrow: SECTION[theme],
      title: T.name,
      sub: esc(T.tagline),
      body: `<div class="overview"><div><div class="overview__posts">${list.map((m) => `<div>${card(m)}<div class="mood__name">${m.name}</div><div class="mood__for">${esc(m.tagline)}</div></div>`).join("")}</div>
        <p class="muted" style="margin-block-start:20px;font-size:14.5px">${list.map((m) => `<b>${m.name}:</b> ${esc(m.description)}`).join("<br>")}</p></div>
        <div><div class="overview__h">What stays the same in every mood</div><ul class="bullets">${T["same-in-every-mood"].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="overview__h" style="margin-block-start:28px">What changes with the mood</div><ul class="bullets"><li>${esc(T["changes-with-mood"].join(", "))}</li></ul></div></div>`,
    });
  }

  function role(title, swatch, detail) {
    return `<div class="role">${swatch}<div><div class="role__t">${title}</div><div class="role__d">${detail}</div></div></div>`;
  }

  function moodPage(m) {
    const sw = (style, inner = "") => `<div class="role__sw" data-mood="${m.id}" style="${style}">${inner}</div>`;
    const g = m.ground;
    const mass = m.mass;
    const glowText = (x) => `${x.name} ${x.hex} at ${pct(x.alpha)} (${x.position})`;
    const massExtra = [mass.edge ? `edge ${paint(mass.edge)}` : "", mass.shadow ? `shadow ${paint(mass.shadow)}` : "", mass.alternative ? `calmer alternative: ${mass.alternative.gradient.name} ${stopsText(mass.alternative.gradient)}` : ""].filter(Boolean).join(" · ");
    const massSw = mass.gradient.stops.some((s) => s.alpha < 1) ? "background:var(--sc-mass), var(--sc-ground)" : "background:var(--sc-mass)";
    const roles = [
      role("Ground", sw("background:var(--sc-ground)"), `${esc(stopsText(g.gradient))}${g.glow ? `<br>glow ${esc(glowText(g.glow))}` : ""}`),
      role(`Colour mass · ${mass.gradient.name}`, sw(massSw), `${esc(stopsText(mass.gradient))} · ${mass.coverage} of the frame${massExtra ? `<br>${esc(massExtra)}` : ""}`),
      role("Headline", sw(`background:${m.text.headline.hex}`), esc(paint(m.text.headline))),
      role("Highlight words", sw("background:var(--sc-highlight)"), `1–3 words · ${esc(stopsText(m.text.highlight))}`),
      role("Supporting text", sw(`background:${m.text.supporting.hex}`), `Sublines, captions · ${esc(paint(m.text.supporting))}`),
      role("Meta text", sw(`background:${m.text.meta.hex}`), `Counters, labels, scaalus.com · ${esc(paint(m.text.meta))}`),
      role("Pill", sw("background:var(--sc-ground)", `<span style="padding:5px 14px;border-radius:20px;font-size:13px;background:var(--sc-pill-bg);color:var(--sc-pill-fg);border:1.5px solid var(--sc-pill-border)">Aa</span>`), `Text ${m.pill.text.hex} · fill ${esc(paint(m.pill.fill))}`),
      role(`Button · ${m.button.style}`, sw("background:var(--sc-ground)", `<span style="padding:5px 14px;border-radius:20px;font-size:12px;background:var(--sc-button-bg);color:var(--sc-button-fg);border:1.5px solid var(--sc-button-border)">Aa</span>`), `Text ${m.button.text.hex} · fill ${esc(paint(m.button.fill))}`),
      role("Lines and borders", sw("background:var(--sc-ground)", '<span style="display:block;inline-size:70%;block-size:60%;border-radius:8px;border:1.5px solid var(--sc-lines)"></span>'), `Hairlines, card borders · ${esc(paint(m.lines))}`),
      role("Logo and accent bar", sw("background:var(--sc-ground)", `<img src="${logoSrc(m.theme)}" alt="">`), `${m.logo} lockup · accent bar ${esc(paint(m["accent-bar"]))}`),
    ].join("");
    return page(m.theme, {
      eyebrow: SECTION[m.theme],
      title: m.name,
      sub: `${esc(m.tagline)} ${esc(m.description)} Good for: ${m["good-for"].map(esc).join(", ")}.`,
      body: `<div class="mood-page"><div>${card(m)}</div><div class="roles">${roles}</div></div>`,
    });
  }

  function surfaces(theme) {
    const panel = (m) => {
      const s = m.surfaces;
      const l3 = [m.mass.edge ? `edge ${paint(m.mass.edge)}` : "", m.mass.shadow ? `shadow ${paint(m.mass.shadow)}` : ""].filter(Boolean).join(" · ") || "no edge, no shadow";
      return `<div class="spanel" data-mood="${m.id}"><div class="spanel__l0">L0 Ground · ${esc(stopsText(m.ground.gradient))}</div><div class="spanel__name">${m.name}</div>
        <div class="slevel slevel--1">L1 ${s.L1.name} · ${esc(paint(s.L1.fill))}<small>border ${esc(paint(s.L1.border))}${s.L1.shadow ? ` · shadow ${esc(paint(s.L1.shadow))}` : ""}</small></div>
        <div class="slevel slevel--2">L2 ${s.L2.name} · ${esc(paint(s.L2.fill))}<small>border ${esc(paint(s.L2.border))}${s.L2.note ? ` · ${esc(s.L2.note)}` : ""}</small></div>
        <div class="slevel slevel--3">L3 ${m.mass.gradient.name}<small>${esc(l3)}</small></div></div>`;
    };
    return page(theme, {
      eyebrow: SECTION[theme],
      title: "Surfaces and depth",
      sub: theme === "dark" ? "Depth from edges and glow, never drop shadows." : "Four levels. Shadows are tinted with the mood colour, never grey.",
      body: `<div class="surfaces">${byTheme(theme).map(panel).join("")}</div>`,
    });
  }

  function textContrast(theme) {
    const block = (m) => `<div><div class="cmood">${m.name}</div>${m.contrast.rows.map((r) => crow(r, true)).join("")}</div>`;
    return page(theme, {
      eyebrow: SECTION[theme],
      title: "Text colour and contrast",
      sub: "Measured at the worst point of each ground gradient and glow, and on pills, buttons and the colour mass.",
      body: `<div class="ctabs" style="gap:4px 50px;margin-block-start:10px">${byTheme(theme).map(block).join("")}</div>
        <p class="small" style="position:absolute;inset-inline:80px;inset-block-end:62px">Text on the colour mass: White only, headline size, at the mass's darkest end. Body text never sits on the mass.</p>`,
    });
  }

  function glowsAndChecks(theme) {
    const C = S["image-checks"];
    const sw = (m, x) => `<div class="glow__sw" data-mood="${m.id}" style="background:linear-gradient(${x.css}, ${x.css}), var(--sc-ground)"></div>`;
    const mood = (m) => {
      const lines = [];
      if (m.ground.glow) lines.push([m.ground.glow, `Ground glow: ${m.ground.glow.name} ${m.ground.glow.hex} at ${pct(m.ground.glow.alpha)}, ${m.ground.glow.position}, ${m.ground.glow.blur}`]);
      for (const x of m.mass.glows || []) lines.push([x, `Mass glow: ${x.name} ${x.hex} at ${pct(x.alpha)}, ${x.position}`]);
      if (m.mass.edge) lines.push([m.mass.edge, `Mass edge: ${m.mass.edge.name} at ${pct(m.mass.edge.alpha)}, ${m.mass.edge.width}`]);
      if (m.mass.shadow) lines.push([m.mass.shadow, `Mass shadow: ${m.mass.shadow.name} at ${pct(m.mass.shadow.alpha)}, offset ${m.mass.shadow.y} px down, blur ${m.mass.shadow.blur} px`]);
      if (!lines.length) lines.push([{ css: "transparent" }, "No glow — crisp by design"]);
      return `<div><div class="glow-mood__h">${m.name}</div>${lines.map(([x, t]) => `<div class="glow">${sw(m, x)}<span>${esc(t)}</span></div>`).join("")}</div>`;
    };
    const t = C[theme];
    const checks =
      theme === "dark"
        ? [`Mean luminance of the image at most ${t["mean-luminance-max"]}`, `At least ${t["glow-pixels-min-percent"]}% of pixels brighter than luminance ${t["glow-luminance-threshold"]} (the glow)`, `Glow and highlight together cover at most ${t["glow-and-highlight-max-percent"]}% of the frame`]
        : [`Mean luminance of the image at least ${t["mean-luminance-min"]}`, `At most ${t["dark-pixels-max-percent"]}% of pixels darker than luminance ${t["dark-luminance-threshold"]} (text and logo only)`];
    const b = C.both;
    checks.push(`Blue leads: at least ${b["blue-share-min-percent"]}% of coloured pixels are blue`, `Violet at most ${b["purple-pixels-max-percent"]}% of pixels — accent only`, `Orange, yellow or red at most ${b["warm-pixels-max-percent"]}%`);
    return page(theme, {
      eyebrow: SECTION[theme],
      title: "Glows and automatic checks",
      sub: "Exact glow recipes, and the checks run on every image made with these colours.",
      body: `<div class="glows"><div class="glow-list">${byTheme(theme).map(mood).join("")}</div>
        <div class="check-card"><h3 class="hl">Automatic check · ${theme}</h3><ul class="bullets">${checks.map((c) => `<li>${esc(c)}</li>`).join("")}<li>${esc(C.$description.replace(/^.*?\)\.\s*/, ""))}</li></ul>
        <p class="small" style="margin-block-start:14px">python3 scripts/check_image.py &lt;image&gt; --mood &lt;id&gt;</p></div></div>`,
    });
  }

  function doDont(theme) {
    const T = S.themes[theme];
    return page(theme, {
      eyebrow: SECTION[theme],
      title: "Do and don't",
      body: `<div class="dodont"><div class="dd"><h3 class="hl">Do</h3><ul class="bullets">${T.do.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="dd"><h3>Don't</h3><ul class="bullets bullets--x">${T.dont.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>`,
    });
  }

  function closing() {
    count += 1;
    return `<section class="page cover" data-mood="midnight">
      <div class="cover__aura" style="background:var(--sc-mass);-webkit-mask-image:none;mask-image:none;opacity:1"></div>
      <h1 class="cover__title" style="inset-block-start:300px;font-size:76px">A calendar full of booked jobs.<br><span class="hl">Always on brand.</span></h1>
      <p class="cover__meta" style="inset-block-start:500px">scaalus.com · colour system v${esc(D.version)}${D.typography ? ` · typography v${esc(D.typography.version)}` : ""} · ${monthYear}</p>
      <img src="${logoSrc("dark")}" alt="Scaalus" style="position:absolute;inset-inline-start:80px;inset-block-end:64px;block-size:40px">
    </section>`;
  }

  // ---------- 04 typography ----------

  const TY = D.typography;
  const TYPE = "04 · Typography";
  const F = Object.fromEntries(TY.fonts.map((f) => [f.id, f]));
  const byRole = (r) => TY.fonts.filter((f) => f.role === r);
  const fam = (name) => `font-family:'${name}', sans-serif`;
  const ff = (id) => fam(F[id]["css-family"]);
  const sourceName = { google: "Google Fonts", fontshare: "Fontshare" };
  // Specimen words only — real copy is always written fresh from business.json.
  const SAMPLE = {
    poppins: "Every call answered.",
    "plus-jakarta-sans": "No lead goes cold.",
    "general-sans": "A calendar full of jobs.",
    satoshi: "Found first on Google.",
    manrope: "Jobs land in your calendar.",
    outfit: "Booked jobs, not missed calls.",
    urbanist: "Your phone still gets answered.",
    geist: "Every lead, in one place.",
    inter: "Every lead, followed up.",
    "clash-display": 'Booked <span class="hl">solid.</span>',
    "cabinet-grotesk": 'Every call <span class="hl">answered.</span>',
    syne: 'Found <span class="hl">first.</span>',
    unbounded: '<span class="hl">24/7</span>',
    "bricolage-grotesque": 'Your calendar, <span class="hl">full.</span>',
    archivo: 'NO LEAD GOES <span class="hl">COLD</span>',
    sora: 'Jobs, not <span class="hl">missed calls.</span>',
  };
  const BODY = "Every lead followed up until they book.";
  const TUNE = { archivo: ";font-stretch:62.5%;text-transform:uppercase;word-spacing:0.12em", "clash-display": ";letter-spacing:0;word-spacing:0.1em" };
  const variant = (id) => TUNE[id] || "";
  const serif = (id, text, italic = true) => `<span class="hl tserif" style="${ff(id)};font-style:${italic ? "italic" : "normal"}">${text}</span>`;

  function typeOverview() {
    const col = (r) => `<div><div class="trole__h">${r}</div><div class="trole__d">${esc(TY.roles[r])}</div>
      <div class="trole__list">${byRole(r).map((f) => `<div class="trole__font" style="${ff(f.id)}${variant(f.id)}">${f.name}</div>`).join("")}</div></div>`;
    return page("dark", {
      section: "type",
      mood: "electric",
      eyebrow: TYPE,
      title: `Modern, minimal, <span class="hl tserif" style="${ff("instrument-serif")};font-style:italic;font-weight:400">creative.</span>`,
      sub: `${TY.fonts.length} free fonts, picked by eye from what premium brands use on Pinterest, and ${TY.pairings.length} ready pairings. Fonts are elements too: pick a pairing, then design the visual fresh.`,
      body: `<div class="troles">${["workhorse", "display", "accent", "label"].map(col).join("")}</div>
        <p class="small tnote">Default pairing: ${TY.pairings.find((p) => p.id === TY["default-pairing"]).name} (Poppins). All fonts are free for commercial use: Google Fonts (Open Font License) and Fontshare (ITF Free Font License). Load them from the official source; never send the font files around.</p>`,
    });
  }

  function workhorseFonts() {
    const cardOf = (f) => `<div class="fcard"><div class="fcard__aa" style="${ff(f.id)}">Aa</div>
      <div><div class="fcard__name" style="${ff(f.id)}">${f.name}</div><div class="fcard__style">${esc(f.style)}</div></div>
      <div class="fcard__head" style="${f.id === "inter" ? fam("Inter Tight") : ff(f.id)}">${SAMPLE[f.id]}</div>
      <div class="fcard__body" style="${ff(f.id)}">${BODY}</div>
      <div class="fcard__meta">${sourceName[f.source]} · ${esc(f.weights)} · ${esc(f["seen-on-pinterest"])}</div></div>`;
    return page("light", {
      eyebrow: TYPE,
      title: "Workhorse fonts",
      sub: esc(TY.roles.workhorse) + " Any of these can carry a whole post.",
      body: `<div class="fgrid">${byRole("workhorse").map(cardOf).join("")}</div>`,
    });
  }

  function displayFonts() {
    const list = byRole("display");
    const cardOf = (f, i) => `<div class="dcard${i < 3 ? " dcard--wide" : ""}">
      <div class="dcard__sample" style="${ff(f.id)}${variant(f.id)}${f.id === "unbounded" ? ";font-size:72px" : ""}">${SAMPLE[f.id]}</div>
      <div class="dcard__name">${f.name}</div><div class="dcard__d">${esc(f.style)} · ${esc(f.weights)} · ${sourceName[f.source]}</div>
      <div class="dcard__use">${f.use ? `Use: ${esc(f.use)}` : esc(f.why)}${f.avoid ? ` · Avoid: ${esc(f.avoid)}` : ""}</div></div>`;
    return page("dark", {
      eyebrow: TYPE,
      title: "Display fonts",
      sub: esc(TY.roles.display) + " Pair each with a workhorse font for the rest of the post.",
      body: `<div class="dgrid">${list.map(cardOf).join("")}</div>`,
    });
  }

  function accentFonts() {
    const spec = {
      "instrument-serif": `<div class="acard__sample" style="${ff("clash-display")};font-weight:600${variant("clash-display")}">A calendar full of ${serif("instrument-serif", "booked jobs.")}</div>`,
      fraunces: `<div class="acard__sample" style="${ff("fraunces")};font-weight:600">Time back for <span class="hl">your crew.</span></div>`,
      "playfair-display": `<div class="acard__sample" style="${ff("sora")};font-weight:700">Found ${serif("playfair-display", "first")} on Google.</div>`,
      syncopate: `<div class="acard__sample"><div class="tlabel" style="${ff("syncopate")};font-size:20px;color:var(--sc-headline)">Booked jobs</div><div class="tlabel" style="${ff("syncopate")};font-size:13px;margin-block-start:14px">14-day free trial · No contract</div></div>`,
    };
    const cardOf = (f) => `<div class="acard">${spec[f.id]}
      <div class="dcard__name">${f.name} <span class="acard__role">${f.role}</span></div><div class="dcard__d">${esc(f.style)} · ${esc(f.weights)} · ${sourceName[f.source]}</div>
      <div class="dcard__use">Use: ${esc(f.use)} · Avoid: ${esc(f.avoid)}</div></div>`;
    return page("light", {
      eyebrow: TYPE,
      title: "Accent and label fonts",
      sub: `${esc(TY.roles.accent)} ${esc(TY.roles.label)}`,
      body: `<div class="agrid">${[...byRole("accent"), ...byRole("label")].map(cardOf).join("")}</div>`,
    });
  }

  const PAIR_HEAD = {
    signature: 'Every call <span class="hl">answered.</span>',
    "clean-premium": 'No lead goes <span class="hl">cold.</span>',
    "creative-editorial": "A calendar full of {booked jobs.}",
    "tech-premium": 'Found first <span class="hl">on Google.</span>',
    "bold-numbers": 'Answered <span class="hl">24/7.</span>',
    impact: 'STOP LOSING <span class="hl">JOBS</span>',
    "soft-luxe": 'Time back for <span class="hl">your crew.</span>',
    artsy: 'Booked <span class="hl">solid.</span>',
    "grotesk-character": 'Your next job is <span class="hl">calling.</span>',
    "calm-geometric": 'A calendar that <span class="hl">fills itself.</span>',
    "modern-edge": "Your phone, {always answered.}",
  };

  function pairTile(p, i) {
    const m = D.moods[R.sequence[i % R.sequence.length]];
    const head = PAIR_HEAD[p.id].replace(/\{(.+?)\}/, (_, w) => serif(p.accent, w));
    const labelFam = p["labels-variant"] ? fam(p["labels-variant"]) : ff(p.labels || p.body);
    const label = D.business.audience.industries[i % 6];
    const result = D.business.offer.services[i % D.business.offer.services.length].result;
    const fonts = [`${F[p.headline].name}${p["headline-variant"] ? " condensed" : ""}`, p.body !== p.headline ? F[p.body].name : "", p.accent ? `accent ${F[p.accent].name}` : "", p.labels ? `labels ${p["labels-variant"] || F[p.labels].name}` : ""].filter(Boolean).join(" + ");
    return `<div><div class="ptile" data-mood="${m.id}">
        <div class="tlabel ptile__label" style="${labelFam}">${esc(label)}</div><div class="ptile__mood">${m.name}</div>
        <div class="ptile__head" style="${ff(p.headline)}${variant(p.headline)}${p.headline === "urbanist" ? ";font-weight:500" : ""}">${head}</div>
        <div class="ptile__body" style="${ff(p.body)}">${esc(result)}</div></div>
      <div class="pcap__name">${p.name}${p.id === TY["default-pairing"] ? ' <span class="acard__role">default</span>' : ""}</div><div class="pcap__fonts">${fonts}</div><div class="pcap__feel">${esc(p.feel)}</div></div>`;
  }

  function pairings(part) {
    const list = TY.pairings.slice(part * 6, part * 6 + 6);
    const note = list.length < 6 ? `<div class="pnote"><div class="pnote__h">Any pairing, any mood</div><p>${esc(TY.rules[1].rule)}</p><p>${esc(TY.rules[0].rule)}</p></div>` : "";
    return page("light", {
      eyebrow: TYPE,
      title: `Pairings${part ? " (continued)" : ""}`,
      sub: part ? "Shown on rotating moods — fonts and colours are chosen separately." : "Ready font pairs. Specimens on rotating moods, not layouts — design every visual fresh.",
      body: `<div class="pgrid">${list.map((p, i) => pairTile(p, part * 6 + i)).join("")}${note}</div>`,
    });
  }

  function typeRules() {
    const tag = (t) => `<div class="tspec__tag">${t}</div>`;
    return page("light", {
      eyebrow: TYPE,
      title: "Type rules",
      body: `<div class="trules"><div class="tspec" data-mood="electric">
          <div class="tlabel" style="${ff("syncopate")};font-size:12px">Roofing · HVAC · Plumbing</div>${tag("Label · Syncopate or mono · uppercase, tracked wide")}
          <div class="tspec__head" style="${ff("clash-display")}${variant("clash-display")}">Never lose a job to a <br>${serif("instrument-serif", "missed call.")}</div>${tag("Headline · display font · −2% letter-spacing")}${tag("Accent serif · 1–3 words · same words as the highlight")}
          <div class="tspec__body" style="${ff("satoshi")}">Every missed call gets a text back in seconds, so the job stays yours.</div>${tag("Supporting · always the workhorse font")}
        </div>
        <div class="trule-list">${TY.rules.map((r, i) => `<div class="trule"><div class="trule__n hl">${two(i + 1)}</div><div><div class="trule__t">${esc(r.rule)}</div><div class="trule__w">${esc(r.why)}</div></div></div>`).join("")}</div></div>`,
    });
  }

  const typography = () => (TY ? [typeOverview(), workhorseFonts(), displayFonts(), accentFonts(), pairings(0), pairings(1), typeRules()] : []);

  const theme = (t) => [overview(t), ...byTheme(t).map(moodPage), surfaces(t), textContrast(t), glowsAndChecks(t), doDont(t)];

  const html = [cover(), contents(), principles(), heroes(), palette(), gradients(), themesAndMoods(), rhythm(), proportions(), contrastGlance(), logoPage(), ...theme("dark"), ...theme("light"), ...typography(), closing()]
    .join("")
    .replace(/\{\{(\w+)\}\}/g, (_, k) => two(starts[k]));

  const root = document.getElementById("pages");
  root.innerHTML = html;

  const exporting = new URLSearchParams(location.search).has("export");
  function fit() {
    root.style.setProperty("--fit", exporting ? 1 : Math.min(1, (window.innerWidth - 32) / 1334));
  }
  fit();
  window.addEventListener("resize", fit);
  document.fonts.ready.then(() => {
    document.body.dataset.ready = "1";
  });
})();
