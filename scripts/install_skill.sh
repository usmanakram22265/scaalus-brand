#!/usr/bin/env bash
# Installs (or updates) the scaalus-brand skill for Claude Code as a SEPARATE,
# READ-ONLY copy downloaded from GitHub. The main repo is never linked, so other
# Claude sessions using the skill cannot edit the main project.
#
#   bash scripts/install_skill.sh                 # → ~/.claude/skills/scaalus-brand
#   curl -fsSL https://raw.githubusercontent.com/usmanakram22265/scaalus-brand/main/scripts/install_skill.sh | bash
#
# Run it again any time to update to the latest version on GitHub.
set -euo pipefail

REPO="${SCAALUS_REPO:-https://github.com/usmanakram22265/scaalus-brand.git}"
DEST="${1:-$HOME/.claude/skills/scaalus-brand}"

# Safety: only ever replace a folder named scaalus-brand inside a skills folder.
case "$DEST" in
  */skills/scaalus-brand) ;;
  *) echo "Refusing to install to '$DEST' (must end in /skills/scaalus-brand)." >&2; exit 1 ;;
esac

if [ -L "$DEST" ]; then
  rm "$DEST"                                  # an old link to a working folder — remove the link only
elif [ -d "$DEST" ]; then
  chmod -R u+w "$DEST" && rm -rf "$DEST"      # previous read-only copy
fi

mkdir -p "$(dirname "$DEST")"
git clone --depth 1 --quiet "$REPO" "$DEST"
rm -rf "$DEST/.git"                           # a plain copy, not a working repo
chmod -R a-w "$DEST"                          # read-only: edits happen only in the main repo

VERSION="$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$DEST/system.json" | head -1)"
echo "Installed scaalus-brand $VERSION as a read-only copy at $DEST"
