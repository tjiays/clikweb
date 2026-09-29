#!/usr/bin/env bash
#
# Restores the site database, and optionally the uploaded media, from backups
# made by deploy/backup.sh.
#
# Usage:  sudo ./deploy/restore.sh <clik_web-….dump> [media-….tar.gz]
#
# This REPLACES the current database. It asks before doing so.
#
# Settings, overridable from the environment (as for backup.sh):
#   ENV_FILE   where DATABASE_URI is read from   (default: <repo>/.env)
#   MEDIA_DIR  the uploaded files                 (default: <repo>/public/media)
#   SERVICE    the systemd unit to stop and start (default: clik-web)
# Under the release layout: ENV_FILE=/srv/clik/shared/.env
#                           MEDIA_DIR=/srv/clik/shared/media
#
# The analytics database is restored separately, as root:
#   runuser -u postgres -- pg_restore --clean --if-exists --no-owner -d umami < umami-….dump

set -euo pipefail

DUMP="${1:?Usage: restore.sh <dump file> [media tarball]}"
MEDIA="${2:-}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
MEDIA_DIR="${MEDIA_DIR:-$APP_DIR/public/media}"
SERVICE="${SERVICE:-clik-web}"

# Backups are readable by root only (backup.sh writes them that way).
[ "$(id -u)" -eq 0 ] || { echo "Run as root: sudo $0 $*" >&2; exit 1; }
[ -f "$DUMP" ] || { echo "No such file: $DUMP" >&2; exit 1; }
[ -z "$MEDIA" ] || [ -f "$MEDIA" ] || { echo "No such file: $MEDIA" >&2; exit 1; }

DB_URI="$(grep -E '^DATABASE_URI=' "$ENV_FILE" | cut -d= -f2-)"
DB_NAME="$(echo "$DB_URI" | sed -E 's|.*/([^/?]+).*|\1|')"

echo "This will REPLACE the contents of the database '$DB_NAME'."
echo "Backup file: $DUMP"
[ -n "$MEDIA" ] && echo "Media:       $MEDIA -> $MEDIA_DIR"
read -r -p "Type the database name to confirm: " CONFIRM
[ "$CONFIRM" = "$DB_NAME" ] || { echo "Cancelled."; exit 1; }

echo "Stopping the application…"
systemctl stop "$SERVICE"

echo "Restoring the database…"
pg_restore --clean --if-exists --no-owner --no-acl --dbname="$DB_URI" < "$DUMP"

if [ -n "$MEDIA" ]; then
  echo "Restoring media…"
  # MEDIA_DIR may be a link (the release layout links public/media to the
  # shared folder). Empty the real folder and unpack into it, rather than
  # deleting the path and leaving a plain folder where the link was.
  REAL="$(readlink -f "$MEDIA_DIR")"
  mkdir -p "$REAL"
  find "$REAL" -mindepth 1 -delete
  tar -xzf "$MEDIA" -C "$REAL" --strip-components=1
fi

echo "Starting the application…"
systemctl start "$SERVICE"

echo "Done. Check the site before telling anyone it is back."
