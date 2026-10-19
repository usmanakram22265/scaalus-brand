---
name: scaalus-brand
description: Scaalus brand system — who Scaalus serves (high-ticket US home service businesses like roofing, HVAC, plumbing, landscaping, remodeling), what it delivers and how to talk about it (always the end result, never the service), plus the exact colour palette (3 hero colours, the logo accents, 20 hex values), 6 dark/light colour moods, gradients, logo rules, contrast-checked text pairs, the one-dark-one-light rhythm and image colour checks. Elements only — every visual and every line of copy is created fresh. Use this skill whenever you write, design, prompt, review or plan ANYTHING for Scaalus or scaalus.com — Instagram, LinkedIn or Facebook posts, carousels, captions, hooks, ads, banners, AI image prompts, emails, landing copy — or when someone asks "on-brand", "our colours", "what do we offer", "write a post about missed calls", even if they never name the skill.
---

# Scaalus brand

Scaalus is a done-for-you growth system for US home service businesses. Promise: *"A calendar full of booked jobs. Not a phone full of missed calls."*

This skill gives two kinds of elements: **the message** (who Scaalus serves, what it delivers, the results to talk about and the rules for saying it — `business.json`) and **the colours** (palette, gradients, moods, contrast-safe text, logo rules — `dist/brand.json`). Why it matters: every post on every platform should read as one brand, speak to the owner's results, and stay readable at its worst point.

> **Do not edit this skill's files.** This installed copy is read-only and is replaced on every update. If something looks wrong or missing, tell the user what you would change; changes are made only in the main Scaalus brand repo.

All paths are relative to this skill's base directory.

## Elements, not visuals

This skill hands you **elements**: colours, gradients, glows, text/background pairs, logo colour rules, the dark/light rhythm and image colour checks. **The visual itself is yours to decide, fresh every time** — layout, composition, shapes, imagery, illustration, typography, copy and format come from you, the user's request or the visual tool being used.

- Never copy a layout, shape or composition from the guidelines PDF (its colour cards are abstract illustrations of colour, not templates) or from earlier posts.
- Mood recipes say which colour plays which *role* (ground, colour mass, headline, highlight, pill, button…), not what the design looks like. Any design that uses the right colours in the right roles is on-brand.
- If a user asks for a visual, design it yourself with these colours; if they bring their own design or tool, recolour it with these elements.

## Who we serve and what we say

- **Who:** US home service owners with **high-ticket jobs** — roofing, HVAC, plumbing, landscaping, remodeling, electrical, general contractors. One missed call or slow reply can lose a job worth thousands, and they're on a job site, not at a desk.
- **Promise:** *A calendar full of booked jobs. Not a phone full of missed calls.*
- **Never** name any software, platform, CRM or vendor behind Scaalus, and never call it white-label or resold. Scaalus is always its own system.

**Write the result, not the service.** Owners don't know (or care about) the services — they know results. Turn every service into the outcome:

| Service (internal) | What the post says |
|---|---|
| Website built to book and rank | A website that turns visitors into booked jobs — day and night |
| Google Business Profile + local SEO | Show up first when homeowners search nearby |
| Missed-call text back | Every missed call gets a text back in seconds — the job stays yours |
| AI calling agent | Every call answered, 24/7 — even on a job site |
| AI chatbot | Questions answered and appointments booked, even at 2 a.m. |
| SMS follow-up | Every lead followed up until they book — no lead goes cold |
| Automatic calendar booking | Jobs land straight in your calendar — no phone tag |
| Dedicated app | Every lead, call and message in one place on your phone |
| Reactivation campaigns | Past customers come back for their next job |
| Review requests | More 5-star reviews, on autopilot |

Rules for copy (full list with reasons in `business.json` → `messaging-rules`): speak the owner's language (jobs, calls, calendar, reviews, Google — no tech jargon); make the cost of a lost job felt; one message per post, headline under ~10 words; **never invent numbers, stats, testimonials or client names** — real figures or a clear placeholder like [X jobs]; end on scaalus.com or a clear next step. Voice: simple, clear, confident, results-first. Pricing and trial terms are unconfirmed — don't state them unless the user gives them.

## Files

| File | Use it for |
|---|---|
| `business.json` | The message: company, audience and pains, every service → result, outcomes, messaging rules, voice. Also included in `dist/brand.json` as `business`. |
| `dist/brand.json` | Read first for colours. Everything resolved to hex: `palette`, `gradients` (with ready `css`), `moods` (complete colour recipes + verified `contrast` rows), `system` (heroes, rhythm, rules, logo files, image-check thresholds), `platforms`. |
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
