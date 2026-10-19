# Colour wording for AI image prompts

Colour only. Your visual tool decides the subject, layout and style; paste the block for the post's mood to lock the colours. Image models follow hex values and plain colour words better than mood names. After generating, run `python3 scripts/check_image.py <image> --mood <id>`.

**End every prompt with:**

> Colour palette strictly Scaalus blues: brand navy #0D2847, Scaalus Blue #2457D6, logo blue #4B78EB, cool white #F1F5FF. Blue leads; a touch of indigo #574EDA at most. No purple or violet areas, no teal, no cyan-green, no orange, no yellow, no red, no warm light, no neon, no rainbow.

---

## Dark theme

### Electric
> Colours: night blue #06174A fading to near-black blue #040A26, a soft royal-blue #123499 glow top-left. The main colour element glows in an Electric aurora — night blue #06174A → royal blue #123499 → vivid electric blue #0033FF — lit from inside with logo blue #4B78EB and periwinkle #91AEFD, with a thin pale-blue edge. White text, ice-blue #BED0FE highlights. One light source, never neon.
> Calmer alternative: swap the aurora for navy #0D2847 → navy royal #21387B → Scaalus Blue #2457D6.

### Midnight
> Colours: brand navy #0D2847 fading to near-black blue #040A26. One soft band of blue light rises diagonally from bottom-left to top-right — Scaalus Blue #2457D6 with a brighter logo-blue #4B78EB core, fading to transparent at both sides. Calm, premium, lots of dark space. White text, ice-blue #BED0FE highlights.

### Cobalt
> Colours: deep royal #0A2472 at the top-left through royal blue #123499 to cobalt #1D46BA at the bottom-right, a soft logo-blue #4B78EB glow bottom-right. Elements in frosted white glass (white at 5–30% with a fine white edge), soft dark-blue shadows. White text, cloud #DEE8FF supporting text. Saturated and confident, never dark-black.

## Light theme

### Daylight
> Colours: crisp white #FFFFFF fading to cool white #F1F5FF. One bold element in the logo gradient — logo blue #4B78EB into indigo #574EDA, with only a sliver of violet #582AC2 at the very end. Navy #0D2847 text, slate-blue #3A4566 supporting text. Clean and airy; no glow, no grey.

### Sky
> Colours: cool white #F1F5FF to pale sky #DEE8FF with a white glow top-left. One glossy element from logo blue #4B78EB to navy royal #21387B with a periwinkle #91AEFD sheen and a soft navy-blue tinted shadow. Navy #0D2847 text. Bright, friendly, clearly light.

### Frost
> Colours: cool white #F1F5FF to white, with a soft ice-blue #BED0FE haze from the bottom-left. One glossy blue element — logo blue #4B78EB → Scaalus Blue #2457D6 → navy royal #21387B — with a white sheen and a soft blue-tinted shadow. Navy #0D2847 text. Fresh, inviting, built for a click.

---

## Colour rules for generated images

- Dark images: one glow source; the rest stays deep blue. Light images: no dark blocks — punch comes from one saturated blue element.
- Violet appears only in the logo, the accent bar, or the last sliver of the logo gradient — never as a background or main colour.
- Keep a plain-ground area wherever text and the logo will sit; text never sits on the brightest glow.
- Photos with text on them get the navy overlay: `#0D2847` at 70% → 92%.
