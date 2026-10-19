// Loads the token sources, resolves every {color.x} / {gradient.x} reference,
// and measures contrast at the worst point of each mood. Used by build.mjs and
// check-contrast.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contrast, composite, rgba, hexToRgb, luminance } from "./color.mjs";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const listJson = (dir) =>
  (fs.existsSync(path.join(root, dir)) ? fs.readdirSync(path.join(root, dir)) : [])
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => readJson(path.join(dir, f)));

export function load() {
  const palette = readJson("tokens/palette.json");
  const gradients = readJson("tokens/gradients.json");
  const system = readJson("system.json");
  const moods = listJson("moods").sort((a, b) => a.order - b.order);
  const platforms = listJson("platforms");
  return { palette, gradients, system, moods, platforms };
}

// Glow positions as CSS radial-gradient centres.
const POSITIONS = {
  "top-left": "15% 8%",
  "top-right": "88% 8%",
  "top-centre": "50% 0%",
  "top edge": "50% 0%",
  "top edge sheen": "50% 0%",
  centre: "50% 50%",
  "centre-right": "82% 52%",
  "bottom-right": "88% 92%",
  "bottom-left": "12% 92%",
  "along the horizon line": "50% 72%",
};

export function createResolver({ palette, gradients }) {
  const colors = palette.color;

  function color(id) {
    const token = colors[id];
    if (!token) throw new Error(`Unknown colour token: ${id}`);
    return { token: id, name: token.$extensions.scaalus.name, hex: token.$value };
  }

  function gradient(id) {
    const token = gradients.gradient[id];
    if (!token) throw new Error(`Unknown gradient token: ${id}`);
    const meta = token.$extensions.scaalus;
    const stops = token.$value.map((s) => {
      const c = resolve(s.color);
      const alpha = s.alpha ?? 1;
      return { token: c.token, name: c.name, hex: c.hex, alpha, position: s.position };
    });
    const stopCss = stops.map((s) => `${rgba(s.hex, s.alpha)} ${Math.round(s.position * 100)}%`).join(", ");
    const css =
      meta.shape === "radial"
        ? `radial-gradient(circle at ${meta.at || "50% 50%"}, ${stopCss})`
        : `linear-gradient(${meta.angle}deg, ${stopCss})`;
    return { token: id, ...meta, stops, css };
  }

  function resolve(value) {
    if (typeof value === "string") {
      const m = value.match(/^\{(color|gradient)\.([\w-]+)\}$/);
      if (!m) return value;
      return m[1] === "color" ? color(m[2]) : gradient(m[2]);
    }
    if (Array.isArray(value)) return value.map(resolve);
    if (value && typeof value === "object") {
      if (typeof value.color === "string" && value.color.startsWith("{color.")) {
        const c = color(value.color.slice(7, -1));
        const alpha = value.alpha ?? 1;
        const out = { ...value, ...c, alpha, css: rgba(c.hex, alpha) };
        delete out.color;
        if (value.position && POSITIONS[value.position]) out.at = POSITIONS[value.position];
        return out;
      }
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v)]));
    }
    return value;
  }

  return { color, gradient, resolve };
}

// ---------- CSS helpers ----------

const glowCss = (g) => `radial-gradient(circle at ${g.at || "50% 50%"}, ${g.css} 0%, transparent 58%)`;

export function paintCss(p) {
  if (!p) return "none";
  if (p.css && p.stops) return p.css; // gradient
  if (p.css) return p.css; // colour with alpha
  if (p.hex) return p.hex;
  return String(p);
}

export function shadowCss(s) {
  if (!s) return "none";
  return `0 ${s.y}px ${s.blur}px ${s.css}`;
}

export function moodCss(m) {
  const groundLayers = [m.ground.glow ? glowCss(m.ground.glow) : null, m.ground.gradient.css].filter(Boolean);
  const massLayers = [...(m.mass.glows || []).map(glowCss), m.mass.gradient.css];
  const s = m.surfaces;
  const css = {
    "--sc-ground": groundLayers.join(", "),
    "--sc-ground-flat": m.ground.gradient.stops[0].hex,
    "--sc-mass": massLayers.join(", "),
    "--sc-mass-edge": m.mass.edge ? paintCss(m.mass.edge) : "transparent",
    "--sc-mass-shadow": shadowCss(m.mass.shadow),
    "--sc-mass-shadow-color": m.mass.shadow ? m.mass.shadow.css : "transparent",
    "--sc-headline": m.text.headline.hex,
    "--sc-supporting": m.text.supporting.hex,
    "--sc-meta": m.text.meta.hex,
    "--sc-on-mass": m.text["on-mass"].hex,
    "--sc-highlight": m.text.highlight.css,
    "--sc-highlight-solid": m.text.highlight.stops[0].hex,
    "--sc-pill-bg": paintCss(m.pill.fill),
    "--sc-pill-fg": m.pill.text.hex,
    "--sc-pill-border": m.pill.border ? paintCss(m.pill.border) : "transparent",
    "--sc-button-bg": paintCss(m.button.fill),
    "--sc-button-fg": m.button.text.hex,
    "--sc-button-border": m.button.border ? paintCss(m.button.border) : "transparent",
    "--sc-lines": paintCss(m.lines),
    "--sc-l1-bg": paintCss(s.L1.fill),
    "--sc-l1-border": paintCss(s.L1.border),
    "--sc-l1-shadow": shadowCss(s.L1.shadow),
    "--sc-l2-bg": paintCss(s.L2.fill),
    "--sc-l2-border": paintCss(s.L2.border),
    "--sc-l2-shadow": shadowCss(s.L2.shadow),
    "--sc-card": m.cards ? m.cards.hex : paintCss(s.L1.fill),
    "--sc-accent-bar": paintCss(m["accent-bar"]),
  };
  for (const [k, v] of Object.entries(m.mass.parts || {})) css[`--sc-part-${k}`] = paintCss(v);
  return css;
}

// ---------- Contrast ----------

// Every point text may sit on: each ground stop, the ground glow composited at
// full strength over each stop, and the L1 surface when it is opaque.
export function groundPoints(m) {
  const stops = m.ground.gradient.stops.map((s) => ({ hex: s.hex, label: s.name }));
  const points = [...stops];
  const g = m.ground.glow;
  if (g) for (const s of stops) points.push({ hex: composite(g.hex, g.alpha, s.hex), label: `${g.name} ${Math.round(g.alpha * 100)}% glow on ${s.label}` });
  const l1 = m.surfaces.L1.fill;
  if (l1 && l1.hex && (l1.alpha ?? 1) >= 1) points.push({ hex: l1.hex, label: `${l1.name} surface` });
  return points;
}

function worst(fgHex, points) {
  let best = null;
  for (const p of points) {
    const r = contrast(fgHex, p.hex);
    if (!best || r < best.ratio) best = { ratio: r, bg: p };
  }
  return best;
}

const floor1 = (r) => Math.floor(r * 10) / 10;

export function contrastReport(m, system) {
  const mins = system.contrast.minimums;
  const points = groundPoints(m);
  const rows = [];
  const add = (role, label, fg, w, min) =>
    rows.push({ role, label, fg: fg.hex, fgName: fg.name, fgToken: fg.token, bg: w.bg.hex, bgLabel: w.bg.label, ratio: floor1(w.ratio), min, pass: w.ratio >= min });

  add("headline", "Headline", m.text.headline, worst(m.text.headline.hex, points), mins.headline);
  m.text.highlight.stops.forEach((s, i, arr) =>
    add("highlight", i === 0 ? "Highlight start" : i === arr.length - 1 ? "Highlight end" : "Highlight middle", s, worst(s.hex, points), mins.headline)
  );
  add("supporting", "Supporting", m.text.supporting, worst(m.text.supporting.hex, points), mins.text);
  add("meta", "Meta", m.text.meta, worst(m.text.meta.hex, points), mins.text);

  const pf = m.pill.fill;
  const pillPoints = pf.stops
    ? pf.stops.map((s) => ({ hex: s.hex, label: s.name }))
    : (pf.alpha ?? 1) < 1
      ? points.map((p) => ({ hex: composite(pf.hex, pf.alpha, p.hex), label: `${pf.name} ${Math.round(pf.alpha * 100)}% on ${p.label}` }))
      : [{ hex: pf.hex, label: pf.name }];
  add("pill-text", "Pill text", m.pill.text, worst(m.pill.text.hex, pillPoints), mins.text);

  const b = m.button;
  const buttonPoints =
    (b.fill.alpha ?? 1) < 1
      ? points.map((p) => ({ hex: composite(b.fill.hex, b.fill.alpha, p.hex), label: `glass on ${p.label}` }))
      : [{ hex: b.fill.hex, label: b.fill.name }];
  add("button-text", "Button text", b.text, worst(b.text.hex, buttonPoints), mins.text);

  // Text on the mass sits at its darkest end (for light text) — the best point by rule.
  const onMass = m.text["on-mass"];
  // See-through stops (glass) are blended over each ground point first.
  const massStops = m.mass.gradient.stops.flatMap((s) =>
    (s.alpha ?? 1) < 1 ? points.map((p) => ({ hex: composite(s.hex, s.alpha, p.hex), name: `${s.name} ${Math.round(s.alpha * 100)}% over ${p.label}` })) : [s]
  );
  const darkest = massStops.reduce((a, s) => (luminance(s.hex) < luminance(a.hex) ? s : a));
  add("on-mass", "Text on the mass", onMass, { ratio: contrast(onMass.hex, darkest.hex), bg: { hex: darkest.hex, label: `${darkest.name} (mass, darkest end)` } }, mins.headline);

  if (m.text["headline-alt"]) {
    m.text["headline-alt"].stops.forEach((s, i, arr) =>
      add("headline-alt", i === arr.length - 1 ? "Chrome headline end" : i === 0 ? "Chrome headline start" : "Chrome headline middle", s, worst(s.hex, points), mins.headline)
    );
  }

  // Forbidden pairs from system.json ("light grounds" / "dark grounds").
  const forbidden = [];
  const textRoles = new Set(["headline", "highlight", "supporting", "meta", "headline-alt"]);
  for (const f of system.contrast.forbidden) {
    const scope = f.bg === "light grounds" ? "light" : f.bg === "dark grounds" ? "dark" : null;
    if (scope !== m.theme) continue;
    const token = typeof f.fg === "string" ? f.fg.slice(7, -1) : f.fg.token;
    for (const r of rows) if (textRoles.has(r.role) && r.fgToken === token) forbidden.push({ ...r, why: f.why });
  }

  return { points, rows, forbidden, pass: rows.every((r) => r.pass) && forbidden.length === 0 };
}

export function build() {
  const src = load();
  const { resolve } = createResolver(src);

  const palette = Object.fromEntries(
    Object.entries(src.palette.color).map(([id, t]) => {
      const x = t.$extensions.scaalus;
      return [id, { name: x.name, hex: t.$value, rgb: hexToRgb(t.$value), family: x.family, status: x.status, description: t.$description, text: x.text }];
    })
  );
  const gradients = Object.fromEntries(Object.keys(src.gradients.gradient).map((id) => [id, resolve(`{gradient.${id}}`)]));
  const system = resolve(src.system);

  const moods = {};
  for (const raw of src.moods) {
    const m = resolve(raw);
    delete m.$description;
    m.css = moodCss(m);
    m.contrast = contrastReport(m, system);
    moods[m.id] = m;
  }

  const platforms = Object.fromEntries(src.platforms.map((p) => { const { $description, ...rest } = p; return [p.platform, rest]; }));

  return {
    name: "Scaalus colour system",
    version: system.version,
    date: system.date,
    families: src.palette.families,
    palette,
    "palette-notes": src.palette.retired,
    "logo-only": Object.fromEntries(Object.entries(src.palette["logo-only"]).filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, v.$value])),
    gradients,
    moods,
    system,
    platforms,
    business: fs.existsSync(path.join(root, "business.json")) ? readJson("business.json") : undefined,
  };
}
