#!/usr/bin/env bash
#
# Points the site back at the release before the current one and restarts.
# Takes seconds, because every kept release is already built.
#
# It does not undo database migrations. Migrations here only ever add, copy,
# then drop in a later release, so the previous code runs on the newer
# database; if one ever did not, restore the backup release.sh took first.
#
# Usage:  sudo ./deploy/rollback.sh [release-folder]

set -euo pipefail
APP_ROOT="${APP_ROOT:-/srv/clik}"
SERVICE="${SERVICE:-clik-web}"
PORT="${PORT:-3000}"
SUDO=""; [ "$(id -u)" -ne 0 ] && SUDO="sudo"

CURRENT="$(readlink -f "$APP_ROOT/current")"
TARGET="${1:-$(ls -1dt "$APP_ROOT"/releases/*/ | sed 's:/$::' | grep -vxF "$CURRENT" | head -1)}"
[ -n "$TARGET" ] && [ -d "$TARGET" ] || { echo "No earlier release to roll back to." >&2; exit 1; }

echo "==> Rolling back: $CURRENT -> $TARGET"
ln -sfn "$TARGET" "$APP_ROOT/current.next"
mv -Tf "$APP_ROOT/current.next" "$APP_ROOT/current"
$SUDO systemctl restart "$SERVICE"
for _ in $(seq 1 30); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1:$PORT/" || true)" = "200" ] && { echo "Rolled back. Site answering."; exit 0; }
  sleep 2
done
echo "!! Switched, but the site is not answering. journalctl -u $SERVICE -n 100" >&2
exit 1
