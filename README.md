# Scaalus brand system

The source of truth for every Scaalus post, ad, banner and image prompt: **the message** (who Scaalus serves, what it delivers and how to say it, always the result, never the service) in [`business.json`](business.json), and **the colours** in [`dist/brand.json`](dist/brand.json). **Elements only, not visuals.** This repo supplies the message, colours, gradients, glows, mood colour recipes, contrast-checked text pairs, logo colour rules and image checks. The visual itself (layout, composition, shapes, imagery, typography, copy) is decided fresh by whoever makes it: an agent, a designer or a visual tool. Never copy a layout from the guidelines or from earlier posts. The colour cards in the PDF are abstract colour illustrations, not templates.

- **Agents:** this repo is the Claude skill `scaalus-brand`. Start with [`SKILL.md`](SKILL.md), then read [`dist/brand.json`](dist/brand.json). This folder is the **main** version; the installed skill is a separate read-only copy, so other sessions can't change the main project.
- **People:** open [`guidelines/scaalus-colour-guidelines.pdf`](guidelines/scaalus-colour-guidelines.pdf) (28 pages), or the live version at `guidelines/index.html` (`node scripts/serve.mjs`).

## Install the skill

**Claude Code** (any computer). This installs a separate, read-only copy and updates it when you run it again:

```bash
curl -fsSL https://raw.githubusercontent.com/usmanakram22265/scaalus-brand/main/scripts/install_skill.sh | bash
```

Never link the installed skill to the main repo: a link lets every Claude session that uses the skill edit the main project.

**Claude chat (claude.ai):** download [`dist/scaalus-brand.skill`](dist/scaalus-brand.skill) (slim, 1 MB) and upload it in Claude's skills settings. For the complete repo (PDF, guidelines page, all scripts and logo originals), run `python3 scripts/package_skill.py --full` and upload `dist/scaalus-brand-full.skill` (about 14 MB) instead.

Once installed, ask for anything Scaalus-coloured ("make an Insta post about missed calls", "is this on brand?") and Claude loads the skill automatically.

## The system at a glance

**Three hero colours:** Navy `#0D2847` (dark, headline ink), Scaalus Blue `#2457D6` (action), Mist `#F1F5FF` (light).
**One signature:** the logo gradient, Logo Blue `#4B78EB` → Logo Indigo `#574EDA` → Logo Violet `#582AC2`. It is always small: the accent bar, a highlight end, and the logo itself. Blue leads; violet is never a main colour.

| Family | Colours |
|---|---|
| Logo · fixed | Logo Blue `#4B78EB`, Logo Indigo `#574EDA` (accent), Logo Violet `#582AC2` (accent) |
| Blues | Scaalus Blue `#2457D6`, Navy Royal `#21387B`, Royal Blue `#123499`, Cobalt `#1D46BA`, Electric `#0033FF`, Periwinkle `#91AEFD`, Ice `#BED0FE` |
| Darks | Navy `#0D2847`, Deep Royal `#0A2472`, Night Blue `#06174A`, Abyss `#040A26` |
| Lights | White `#FFFFFF`, Mist `#F1F5FF`, Cloud `#DEE8FF` |
| Ink | Slate Blue `#3A4566`, Haze `#BFCCF0`, Fog `#8E9BC4` |

**Logo:** single posts, stories and ads use the icon with "scaalus" on its right. Carousels use the icon alone on the first slide and every slide in between, and the icon + "scaalus" only on the last slide.

**Two themes, six moods.** Posts alternate one dark, one light: Electric → Daylight → Midnight → Sky → Cobalt → Frost → repeat.

| Mood | Theme | Colour idea |
|---|---|---|
| Electric | dark | The Electric aurora (Night Blue → Royal Blue → Electric) glowing out of deep blue; Royal Aurora as the calmer alternative |
| Midnight | dark | A rising band of blue light across Navy |
| Cobalt | dark | The Cobalt ground (Deep Royal → Royal Blue → Cobalt) with frosted white glass |
| Daylight | light | Crisp white with the logo gradient |
| Sky | light | Mist to Cloud with one glossy blue |
| Frost | light | Mist with an ice haze and glossy blue |

Every text colour in every mood passes WCAG AA, measured at the worst point of its gradient and glow (`node scripts/check-contrast.mjs`).

## Repo map

```
SKILL.md                  the skill: message, palette, rhythm, mood recipe, rules (agent entry point)
business.json             who we serve, services → results, messaging rules, voice
AGENTS.md                 pointer to SKILL.md for non-Claude agents
dist/brand.json           everything resolved to hex (generated, the file agents read)
dist/tokens.css           CSS variables, one [data-mood] block per mood (generated)
dist/scaalus-brand.skill  the skill packaged for Claude chat (generated)
tokens/palette.json       20 colours, W3C design-token format
tokens/gradients.json     accent, grounds, colour masses, highlights, overlay
moods/*.json              6 mood colour recipes
system.json               principles, heroes, rhythm, proportions, contrast, logo, image checks
platforms/*.json          Instagram, LinkedIn, Facebook formats and theme mix
image-prompts.md          colour wording for AI image prompts, per mood
MIGRATION.md              v1 → v3
assets/logos/             icon-left lockup, icon, avatars, banners (+ _source originals)
guidelines/               the guidelines page and its PDF export
scripts/                  build, contrast check, PDF export, preview server, logo tiles, image check, skill install
```

## Changing a colour

1. Edit `tokens/palette.json`, `tokens/gradients.json`, a `moods/*.json` file or `system.json`.
2. `node scripts/build.mjs`
3. `node scripts/check-contrast.mjs` must print "All moods pass".
4. `node scripts/export_pdf.mjs` refreshes the PDF.
5. If Navy, Scaalus Blue, White or Mist changed, run `python3 scripts/make_logo_tiles.py`.
6. `python3 scripts/package_skill.py` rebuilds `dist/scaalus-brand.skill` for Claude chat.
7. Commit the sources and `dist/` together.

Requires Node 22+, Google Chrome (PDF export only) and Python 3 with Pillow (logo tiles and image checks).
