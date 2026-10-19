# Migration: v1.0 → v3.1

v3 rebuilds the palette around the logo. Blue leads, the logo's indigo and violet are small accents, and three hero colours do most of the work.

## What stayed

| v1.0 | Hex | v3.1 |
|---|---|---|
| Navy | `#0D2847` | **Navy**: hero dark, headline ink, the Midnight and Royal Aurora darks |
| Body text on dark | `#B9C2D0` | Replaced by **Haze** `#BFCCF0`, a slightly cooler blue tint |
| Royal Blue | `#123499` | **Royal Blue**: back in v3.1 — Electric aurora middle, Cobalt ground |
| Deep Blue | `#0A2472` | **Deep Royal**: back in v3.1 — the Cobalt ground start |

## What changed

| v1.0 | Hex | v3.1 | Hex | Why |
|---|---|---|---|---|
| Brand Blue | `#2B59D8` | **Scaalus Blue** | `#2457D6` | A touch deeper and more saturated; matches the Royal Aurora end |
| Light Blue | `#6E93F0` | **Periwinkle** / **Logo Blue** | `#91AEFD` / `#4B78EB` | Split into a dark-theme highlight and the real logo blue |
| Background | `#FAF9F6` | **Mist** | `#F1F5FF` | Cool white instead of warm off-white, so blues stay clean |
| Card | `#F3F1EC` | **Cloud** / **White** | `#DEE8FF` / `#FFFFFF` | Tinted blue, never grey or cream |
| Grey Text | `#5B6573` | **Slate Blue** | `#3A4566` | Tinted blue, and more readable (7.7:1 on Cloud) |
| Dark gradient end | `#0033FF` | **Electric** | `#0033FF` | Back in v3.1, inside the Electric aurora only |

**New in v3:** the logo colours Logo Blue `#4B78EB`, Logo Indigo `#574EDA` and Logo Violet `#582AC2`, plus Navy Royal `#21387B`, Ice `#BED0FE`, Abyss `#040A26` and Fog `#8E9BC4`.

**Brought back from v2 in v3.1:** Cobalt `#1D46BA`, Night Blue `#06174A`, the Cobalt ground (`#0A2472` · `#123499` · `#1D46BA`) and the Electric aurora (`#06174A` · `#123499` · `#0033FF`).

## Gradients and themes

- v1.0's brand gradient (`#6E93F0` → `#2B59D8`) is replaced by the **logo gradient** as the accent bar on every post.
- v1.0's dark gradient (`#0D2847` · `#123499` · `#0033FF`) lives on in the **Electric aurora** (`#06174A` · `#123499` · `#0033FF`); the **Royal Aurora** (`#0D2847` · `#21387B` · `#2457D6`) is its calmer alternative.
- v1.0's two social themes (dark and light) become **2 themes × 3 moods**, alternated one dark, one light.

## Logo

- Use only the **icon + "scaalus" on the right** lockup, or the **icon alone**.
- The name-first lockup is retired (moved to `assets/logos/_source/retired-name-first/`).
- Avatars and banners are rebuilt on exact Navy, Scaalus Blue, White and Mist.

## Not yet migrated

- `../website/scaalus.com` (Tailwind) and `../website/ghl-forms` still use v1.0 colours. To move them to v3, map each colour with the "What changed" table above.
- Accent colours (alert red, success green, star gold) are still undecided.
