"""Package this repo as a .skill file for Claude chat (claude.ai / Cowork):
python3 scripts/package_skill.py  →  dist/scaalus-brand.skill

Only what an agent needs goes in: the skill, tokens, moods, rules, logos and the
colour scripts. The guidelines PDF, original logo files and dev tooling stay out.
(Claude Code uses the repo directly via ~/.claude/skills/scaalus-brand.)
"""
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


def files():
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
