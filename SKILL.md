---
name: scaalus-brand
description: Scaalus brand colour system (colour elements only — the visual itself is always decided fresh by you) — the exact palette (3 hero colours, the logo's blue-indigo-violet accents, 20 hex values), dark and light themes with 6 colour moods, gradients, glows, logo colour rules, contrast-checked text pairs, the one-dark-one-light posting rhythm, and automatic colour checks for images. Use this skill whenever you choose, apply, check or describe colours for ANYTHING Scaalus or scaalus.com — Instagram, LinkedIn or Facebook posts, carousels, stories, ads, banners, thumbnails, AI image prompts, slides, web or email graphics — or when someone asks "what colours", "on-brand", "our blue", "dark or light post", "which gradient", "is this on brand", even if they never name the skill.
---

# Scaalus colours

Scaalus is a done-for-you growth system for US home service businesses. Promise: *"A calendar full of booked jobs. Not a phone full of missed calls."*

This skill is **colour only**: which colours, gradients and glows to use, which text colour goes on which ground, and how to check a finished image. Layout, typography, illustration and copy come from other tools — feed them the colours from here. Why it matters: every post on every platform should read as one brand, and every text colour here is already proven readable at its worst point.

All paths are relative to this skill's base directory.

## Elements, not visuals

This skill hands you **elements**: colours, gradients, glows, text/background pairs, logo colour rules, the dark/light rhythm and image colour checks. **The visual itself is yours to decide, fresh every time** — layout, composition, shapes, imagery, illustration, typography, copy and format come from you, the user's request or the visual tool being used.

- Never copy a layout, shape or composition from the guidelines PDF (its colour cards are abstract illustrations of colour, not templates) or from earlier posts.
- Mood recipes say which colour plays which *role* (ground, colour mass, headline, highlight, pill, button…), not what the design looks like. Any design that uses the right colours in the right roles is on-brand.
- If a user asks for a visual, design it yourself with these colours; if they bring their own design or tool, recolour it with these elements.

## Files

| File | Use it for |
|---|---|
| `dist/brand.json` | Read first. Everything resolved to hex: `palette`, `gradients` (with ready `css`), `moods` (complete colour recipes + verified `contrast` rows), `system` (heroes, rhythm, rules, logo files, image-check thresholds), `platforms`. |
| `dist/tokens.css` | Building in HTML/CSS: put `data-mood="<id>"` on an element and use `var(--sc-ground)`, `var(--sc-mass)`, `var(--sc-headline)`, `var(--sc-supporting)`, `var(--sc-highlight)`, `var(--sc-pill-bg)`, `var(--sc-button-bg)`, `var(--sc-accent-bar)`… plus `var(--sc-color-<id>)` for any palette colour. |
| `image-prompts.md` | Writing a prompt for an image model: paste the mood's colour block. |
| `platforms/<name>.json` | Gradient angle per format and calm zones for Instagram, LinkedIn, Facebook. |
| `guidelines/scaalus-colour-guidelines.pdf` | Showing a human the system (28 pages; in the repo, not in the chat package). Use `dist/brand.json` for values. |

## The palette in one look

- **Heroes** — do most of the work: **Navy `#0D2847`** (dark, headline ink), **Scaalus Blue `#2457D6`** (action), **Mist `#F1F5FF`** (light).
- **Signature** — the logo gradient **Logo Blue `#4B78EB` → Logo Indigo `#574EDA` → Logo Violet `#582AC2`**, used small: the accent bar, a highlight end, the logo. Indigo and violet are accents only.
- **Support** — blues: Navy Royal `#21387B`, Royal Blue `#123499`, Cobalt `#1D46BA`, Electric `#0033FF` (inside colour masses only), Periwinkle `#91AEFD`, Ice `#BED0FE`; darks: Deep Royal `#0A2472`, Night Blue `#06174A`, Abyss `#040A26`; lights: White `#FFFFFF`, Cloud `#DEE8FF`; ink: Slate Blue `#3A4566`, Haze `#BFCCF0`, Fog `#8E9BC4`.

## Step 1 — dark or light, then the mood

Posts alternate **one dark, one light**. Moods rotate so none repeats until all six have run:

**Electric (dark) → Daylight (light) → Midnight (dark) → Sky (light) → Cobalt (dark) → Frost (light) → repeat**

- If you know the last post's mood, use the next one in the sequence (`system.rhythm.sequence`). If not, start at Electric.
- Content never locks a mood. Each mood has `good-for` hints; you may swap to another mood **of the same theme** when it clearly fits better — never break the dark/light alternation.
- A carousel is one post: one mood for every slide. Logo: icon alone on every slide except the last; icon + "scaalus" on the last slide only.

| Mood | Theme | Feel | Good for |
|---|---|---|---|
| electric | dark | Electric aurora (Night Blue → Royal Blue → Electric) out of deep blue; Royal Aurora as calmer alternative | Problems, urgency, bold statements |
| midnight | dark | A rising sweep of blue light across navy | Offers, launches, big promises |
| cobalt | dark | Cobalt ground (Deep Royal → Royal Blue → Cobalt) + frosted white glass | Results, reviews, growth |
| daylight | light | Crisp white + the logo gradient | Tips, lists, inner slides |
| sky | light | Mist to cloud + one glossy blue element | How it works, explainers |
| frost | light | Mist with ice haze + glossy blue | Calls to action, invites |

## Step 2 — apply the mood's colours

From `moods.<id>` in `dist/brand.json`, hand these to whatever tool makes the visual:

1. **Ground** — `ground.gradient` (+ `ground.glow` at its position, very soft).
2. **Colour mass** — the one saturated colour element: `mass.gradient` (+ `mass.glows`), 15–30% of the frame. Dark: fine `mass.edge`, no drop shadow. Light: `mass.shadow`, tinted in its own colour. Midnight's mass is an overlay band of light, not a block. Electric lists `mass.alternative` (Royal Aurora) for a calmer post.
3. **Text** — headline `text.headline`; 1–3 highlighted words in `text.highlight` (gradient on the text); supporting `text.supporting`; meta (labels, scaalus.com) `text.meta`.
4. **Pill / label** — `pill.fill` + `pill.text` (+ `pill.border`). **Button** — `button.fill` / `button.text` / `button.border`.
5. **Cards and lines** — `surfaces.L1`/`L2`, borders `lines`.
6. **Accent bar** — `accent-bar` (logo gradient; White on Cobalt), on every post.
7. **Logo** — `logo` says colour (light moods) or white (dark moods). Files in `system.logo.<light|dark>.files`:
   - **Single posts, stories, reels, ads, banners:** `icon-left` — the icon with "scaalus" on its right.
   - **Carousels:** `icon` (the icon alone) on the **first slide and every slide in between**; `icon-left` (icon + "scaalus") **only on the last slide**.
   - The name-first lockup is retired. Never recolour the logo, never put it on the colour mass, no glow or outline.

Proportions: about 65% ground, 25% colour mass, 6% text, 4% highlight + accent.

## Step 3 — check the finished image

```bash
python3 scripts/check_image.py <image> --mood <id>
```

Checks luminance (light stays light, dark has a glow), that blue leads (≥ 60% of coloured pixels), that violet stays under 5%, and that no warm cast crept in. Fail → regenerate or recolour.

## Rules, and why

- **Only these 20 colours** — anything else hasn't been contrast-checked and drifts the brand.
- **Blue leads; never purple-led.** Violet only as the logo, the accent bar, or the last sliver of the logo gradient. No teal, cyan-green, yellow, orange, red or coral — accent colours are an open decision; don't invent them.
- **Light posts stay light** (no Navy, Deep Royal, Night Blue or Abyss fills). **Dark posts glow from one source** (no pure black, grey grounds or drop shadows).
- **Text colours have homes:** Ice, Periwinkle, Logo Blue never small text on light; Scaalus Blue, Electric and Logo Indigo never text on dark; Electric never a flat full-frame fill. Use only pairs in the mood's `contrast.rows`.
- **Body text never sits on the colour mass** — only a white headline, at its darkest end.

## Changing the system

Only when asked. Edit sources (`tokens/palette.json`, `tokens/gradients.json`, `moods/*.json`, `system.json`, `platforms/*.json`) — never `dist/` — then run from the base directory:

```bash
node scripts/build.mjs              # rebuild dist/
node scripts/check-contrast.mjs     # must print "All moods pass"
node scripts/export_pdf.mjs         # refresh the guidelines PDF (Google Chrome)
python3 scripts/make_logo_tiles.py  # if Navy, Scaalus Blue, White or Mist changed
python3 scripts/package_skill.py    # rebuild dist/scaalus-brand.skill for Claude chat
```

Preview: `node scripts/serve.mjs` → http://127.0.0.1:4173/guidelines/. Needs Node 22+, Python 3 + Pillow, Google Chrome (PDF only).
