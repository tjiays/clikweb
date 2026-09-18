#!/usr/bin/env bash
#
# Backs up the database and uploaded media.
#
# Usage:  ./deploy/backup.sh [destination]
# Cron:   0 2 * * *  /home/dnugroho/clikwebsite/deploy/backup.sh
#
# Media lives on disk rather than in the database, so both are needed for a
# restore to be complete.

set -euo pipefail

DEST="${1:-/var/backups/clik}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
KEEP_DAYS=30

mkdir -p "$DEST"

# Read the connection string from .env without printing it.
DB_URI="$(grep -E '^DATABASE_URI=' "$APP_DIR/.env" | cut -d= -f2-)"
if [ -z "$DB_URI" ]; then
  echo "DATABASE_URI not found in $APP_DIR/.env" >&2
  exit 1
fi

echo "Backing up the database…"
pg_dump --no-owner --no-acl --format=custom "$DB_URI" \
  > "$DEST/clik_web-$STAMP.dump"

echo "Backing up uploaded media…"
if [ -d "$APP_DIR/public/media" ]; then
  tar -czf "$DEST/media-$STAMP.tar.gz" -C "$APP_DIR/public" media
else
  echo "  (no media directory yet)"
fi

# A backup nobody checks is not a backup. Fail loudly if the dump is empty.
DUMP_SIZE=$(stat -c%s "$DEST/clik_web-$STAMP.dump")
if [ "$DUMP_SIZE" -lt 10000 ]; then
  echo "Database dump is only $DUMP_SIZE bytes — that is too small. Check it." >&2
  exit 1
fi

echo "Removing backups older than $KEEP_DAYS days…"
find "$DEST" -name 'clik_web-*.dump' -mtime "+$KEEP_DAYS" -delete
find "$DEST" -name 'media-*.tar.gz' -mtime "+$KEEP_DAYS" -delete

echo "Done. $DEST/clik_web-$STAMP.dump ($((DUMP_SIZE / 1024)) KB)"
