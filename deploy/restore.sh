#!/usr/bin/env bash
#
# Restores the database and media from a backup.
#
# Usage:  ./deploy/restore.sh /var/backups/clik/clik_web-20260918-020000.dump
#
# This REPLACES the current database. It asks before doing so.

set -euo pipefail

DUMP="${1:?Usage: restore.sh <dump file> [media tarball]}"
MEDIA="${2:-}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[ -f "$DUMP" ] || { echo "No such file: $DUMP" >&2; exit 1; }

DB_URI="$(grep -E '^DATABASE_URI=' "$APP_DIR/.env" | cut -d= -f2-)"
DB_NAME="$(echo "$DB_URI" | sed -E 's|.*/([^/?]+).*|\1|')"

echo "This will REPLACE the contents of the database '$DB_NAME'."
echo "Backup file: $DUMP"
read -r -p "Type the database name to confirm: " CONFIRM
[ "$CONFIRM" = "$DB_NAME" ] || { echo "Cancelled."; exit 1; }

echo "Stopping the application…"
sudo systemctl stop clik-web

echo "Restoring the database…"
pg_restore --clean --if-exists --no-owner --no-acl --dbname="$DB_URI" "$DUMP"

if [ -n "$MEDIA" ] && [ -f "$MEDIA" ]; then
  echo "Restoring media…"
  rm -rf "$APP_DIR/public/media"
  tar -xzf "$MEDIA" -C "$APP_DIR/public"
fi

echo "Starting the application…"
sudo systemctl start clik-web

echo "Done. Check the site before telling anyone it is back."
