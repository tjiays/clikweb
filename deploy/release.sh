#!/usr/bin/env bash
#
# Deploys the current main branch.
#
# Usage:  ./deploy/release.sh
#
# Takes a backup first, so a bad release can be undone.

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "==> Backing up before anything changes"
./deploy/backup.sh

echo "==> Fetching"
git fetch --all --tags
git pull --ff-only

echo "==> Installing dependencies from the lockfile"
npm ci

echo "==> Applying database migrations"
npm run migrate

echo "==> Building"
npm run build

echo "==> Restarting"
sudo systemctl restart clik-web
sleep 5

echo "==> Checking the site responds"
CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 http://127.0.0.1:3000/)
if [ "$CODE" != "200" ]; then
  echo "The site returned HTTP $CODE after the restart. Check: journalctl -u clik-web -n 50" >&2
  exit 1
fi

echo "Released. Site responding with HTTP 200."
