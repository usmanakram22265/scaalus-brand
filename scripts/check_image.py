"""Automatic colour checks for a generated Scaalus post image.

Reads the thresholds from system.json ("image-checks") and reports pass/fail for
each check. Exit code 1 if any check fails — regenerate the image.

Usage:
  python3 scripts/check_image.py <image> --theme dark|light [--mood <id>]
  python3 scripts/check_image.py post.png --mood electric      (theme taken from the mood)

Needs Pillow (pip install pillow).
"""
import argparse
import colorsys
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SYSTEM = json.loads((ROOT / "system.json").read_text())
CHECKS = SYSTEM["image-checks"]


def channel(v):
    s = v / 255
    return s / 12.92 if s <= 0.04045 else ((s + 0.055) / 1.055) ** 2.4


LUT = [channel(v) for v in range(256)]


def analyse(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((540, 540))  # plenty for colour statistics, fast
    px = list(im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata())
    n = len(px)
    both = CHECKS["both"]
    p_lo, p_hi = both["purple-hue-range"]
    warm_ranges = both["warm-hue-ranges"]
    b_lo, b_hi = both["blue-hue-range"]
    col_sat = both["coloured-min-saturation"]
    lum_total = 0.0
    bright = dark = purple = warm = coloured = blue = 0
    glow_t = CHECKS["dark"]["glow-luminance-threshold"]
    dark_t = CHECKS["light"]["dark-luminance-threshold"]
    for r, g, b in px:
        lum = 0.2126 * LUT[r] + 0.7152 * LUT[g] + 0.0722 * LUT[b]
        lum_total += lum
        if lum > glow_t:
            bright += 1
        if lum < dark_t:
            dark += 1
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        hue = h * 360
        if v > 0.2 and s >= both["purple-min-saturation"] and p_lo <= hue < p_hi:
            purple += 1
        if v > 0.2 and s >= both["warm-min-saturation"] and any(lo <= hue < hi for lo, hi in warm_ranges):
            warm += 1
        if v > 0.15 and s >= col_sat:
            coloured += 1
            if b_lo <= hue < b_hi:
                blue += 1
    pct = lambda k: 100 * k / n
    return {
        "mean_luminance": lum_total / n,
        "bright_pct": pct(bright),
        "dark_pct": pct(dark),
        "purple_pct": pct(purple),
        "warm_pct": pct(warm),
        "blue_share": 100 * blue / coloured if coloured else 100.0,
    }


def run(path, theme):
    a = analyse(path)
    both = CHECKS["both"]
    results = []
    if theme == "dark":
        t = CHECKS["dark"]
        results += [
            ("Mean luminance <= %.2f" % t["mean-luminance-max"], a["mean_luminance"] <= t["mean-luminance-max"], "%.3f" % a["mean_luminance"]),
            ("Glow present: >= %s%% pixels brighter than %.2f" % (t["glow-pixels-min-percent"], t["glow-luminance-threshold"]), a["bright_pct"] >= t["glow-pixels-min-percent"], "%.1f%%" % a["bright_pct"]),
            ("Glow + highlight <= %s%% of the frame" % t["glow-and-highlight-max-percent"], a["bright_pct"] <= t["glow-and-highlight-max-percent"], "%.1f%%" % a["bright_pct"]),
        ]
    else:
        t = CHECKS["light"]
        results += [
            ("Mean luminance >= %.2f" % t["mean-luminance-min"], a["mean_luminance"] >= t["mean-luminance-min"], "%.3f" % a["mean_luminance"]),
            ("Dark pixels <= %s%% (text and logo only)" % t["dark-pixels-max-percent"], a["dark_pct"] <= t["dark-pixels-max-percent"], "%.1f%%" % a["dark_pct"]),
        ]
    results += [
        ("Violet <= %s%% (accent only)" % both["purple-pixels-max-percent"], a["purple_pct"] <= both["purple-pixels-max-percent"], "%.2f%%" % a["purple_pct"]),
        ("Orange/yellow/red <= %s%%" % both["warm-pixels-max-percent"], a["warm_pct"] <= both["warm-pixels-max-percent"], "%.2f%%" % a["warm_pct"]),
        ("Blue leads: >= %s%% of coloured pixels are blue" % both["blue-share-min-percent"], a["blue_share"] >= both["blue-share-min-percent"], "%.0f%%" % a["blue_share"]),
    ]
    return results


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image")
    ap.add_argument("--theme", choices=["dark", "light"])
    ap.add_argument("--mood", help="mood id from moods/*.json; sets the theme")
    args = ap.parse_args()
    theme = args.theme
    if args.mood:
        mood = json.loads((ROOT / "moods" / f"{args.mood}.json").read_text())
        theme = mood["theme"]
    if not theme:
        ap.error("pass --theme or --mood")
    results = run(args.image, theme)
    for label, ok, value in results:
        print(f"{'ok  ' if ok else 'FAIL'}  {label:55s} {value}")
    failed = [r for r in results if not r[1]]
    print(f"\n{'PASS' if not failed else 'FAIL — regenerate'} ({theme} theme)")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
