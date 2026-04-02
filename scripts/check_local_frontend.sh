#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-innos-site}"

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "ERROR: directory '$ROOT_DIR' not found"
  exit 2
fi

echo "Checking HTML files in '$ROOT_DIR' for forbidden external frontend links..."

status=0

while IFS= read -r -d '' file; do
  if rg -n '(<script[^>]+src="https?://)|(<link[^>]+href="https?://)|(<img[^>]+src="https?://)' "$file" >/dev/null; then
    echo
    echo "Forbidden external link(s) in: $file"
    rg -n '(<script[^>]+src="https?://)|(<link[^>]+href="https?://)|(<img[^>]+src="https?://)' "$file"
    status=1
  fi
done < <(find "$ROOT_DIR" -type f -name '*.html' -print0)

if [[ "$status" -eq 0 ]]; then
  echo "OK: no forbidden external frontend links found."
else
  echo
  echo "FAILED: remove external links and replace with local assets."
fi

exit "$status"
