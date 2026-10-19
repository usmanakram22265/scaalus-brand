"""Package this repo as a .skill file for Claude chat (claude.ai / Cowork).

python3 scripts/package_skill.py          →  dist/scaalus-brand.skill       (slim: what an agent needs)
python3 scripts/package_skill.py --full   →  dist/scaalus-brand-full.skill  (the complete repo)

Slim leaves out the guidelines PDF, original logo files and dev tooling. Full includes
everything except git internals, local editor config and the packages themselves.
(Claude Code uses the repo directly via ~/.claude/skills/scaalus-brand.)
"""
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAME = "scaalus-brand"
OUT = ROOT / "dist" / f"{NAME}.skill"

INCLUDE = [
    "SKILL.md", "AGENTS.md", "README.md", "MIGRATION.md", "image-prompts.md", "system.json", "package.json",
    "dist/brand.json", "dist/tokens.css",
    "tokens", "moods", "platforms",
    "assets/logos/icon", "assets/logos/icon-left", "assets/logos/avatars", "assets/logos/banners",
    "scripts/build.mjs", "scripts/check-contrast.mjs", "scripts/check_image.py", "scripts/make_logo_tiles.py",
    "scripts/lib/system.mjs", "scripts/lib/color.mjs",
]
SKIP = {".DS_Store"}
FULL_SKIP_DIRS = {".git", ".claude", "__pycache__", "node_modules"}
FULL = "--full" in sys.argv
if FULL:
    OUT = ROOT / "dist" / f"{NAME}-full.skill"


def files():
    if FULL:
        for p in sorted(ROOT.rglob("*")):
            rel = p.relative_to(ROOT)
            if not p.is_file() or p.name in SKIP or p.suffix == ".skill" or p.suffix == ".pyc":
                continue
            if any(part in FULL_SKIP_DIRS for part in rel.parts):
                continue
            yield p
        return
    for item in INCLUDE:
        path = ROOT / item
        if path.is_dir():
            yield from sorted(p for p in path.rglob("*") if p.is_file() and p.name not in SKIP)
        elif path.is_file():
            yield path
        else:
            raise SystemExit(f"Missing: {item}")


if __name__ == "__main__":
    OUT.parent.mkdir(exist_ok=True)
    count = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        for f in files():
            z.write(f, f"{NAME}/{f.relative_to(ROOT)}")
            count += 1
    print(f"Wrote {OUT.relative_to(ROOT)} — {count} files, {OUT.stat().st_size / 1e6:.1f} MB")
