"""Rebuild the square avatars and the banner from the transparent master logos,
on exact palette colours read from tokens/palette.json. Nothing is redrawn —
the master PNG is only scaled and centred.

Usage: python3 scripts/make_logo_tiles.py   (needs Pillow)
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGOS = ROOT / "assets" / "logos"
PALETTE = json.loads((ROOT / "tokens" / "palette.json").read_text())["color"]


def colour(token):
    return PALETTE[token]["$value"]


def master(rel):
    im = Image.open(LOGOS / rel).convert("RGBA")
    return im.crop(im.getbbox())  # drop transparent margins


# (output, size, background token, master, fit as (fraction, "h" or "w"), vertical centre)
TILES = [
    ("avatars/scaalus-avatar-icon-navy.png", (1024, 1024), "navy", "icon/scaalus-icon-white.png", (0.42, "h"), 0.5),
    ("avatars/scaalus-avatar-icon-royal.png", (1024, 1024), "royal", "icon/scaalus-icon-white.png", (0.42, "h"), 0.5),
    ("avatars/scaalus-avatar-icon-white.png", (1024, 1024), "white", "icon/scaalus-icon-color.png", (0.42, "h"), 0.5),
    ("avatars/scaalus-avatar-icon-navy-max.png", (1024, 1024), "navy", "icon/scaalus-icon-white.png", (0.72, "h"), 0.5),
    ("avatars/scaalus-avatar-lockup-navy.png", (1024, 1024), "navy", "icon-left/scaalus-logo-icon-left-white.png", (0.72, "w"), 0.5),
    ("avatars/scaalus-avatar-lockup-mist.png", (1024, 1024), "mist", "icon-left/scaalus-logo-icon-left-color.png", (0.72, "w"), 0.5),
    ("banners/scaalus-banner-lockup-navy.png", (1748, 900), "navy", "icon-left/scaalus-logo-icon-left-white.png", (0.46, "w"), 0.5),
]


def build(out, size, bg, src, fit, cy):
    w, h = size
    logo = master(src)
    frac, axis = fit
    scale = (h * frac) / logo.height if axis == "h" else (w * frac) / logo.width
    logo = logo.resize((round(logo.width * scale), round(logo.height * scale)), Image.LANCZOS)
    tile = Image.new("RGBA", size, colour(bg))
    tile.alpha_composite(logo, (round((w - logo.width) / 2), round(h * cy - logo.height / 2)))
    path = LOGOS / out
    path.parent.mkdir(parents=True, exist_ok=True)
    tile.convert("RGB").save(path, optimize=True)
    note = " (upscaled)" if scale > 1 else ""
    print(f"{out}  {w}x{h} on {bg} {colour(bg)}{note}")


if __name__ == "__main__":
    for t in TILES:
        build(*t)
