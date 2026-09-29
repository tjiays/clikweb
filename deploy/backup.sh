#!/usr/bin/env bash
#
# Backs up the site database, the analytics database and uploaded media.
#
# Usage:  sudo ./deploy/backup.sh [destination]
# Cron:   /etc/cron.d/clik-backup runs it nightly at 02:00 (docs/operations.md)
#
# Settings, overridable from the environment:
#   ENV_FILE   where DATABASE_URI is read from   (default: <repo>/.env)
#   MEDIA_DIR  the uploaded files                 (default: <repo>/public/media)
# Under the release layout (deploy/release.sh) these are
# /srv/clik/shared/.env and /srv/clik/shared/media, and release.sh passes them.
#
# Media lives on disk rather than in the database, so both are needed for a
# restore to be complete.

set -euo pipefail

# Everything written here is readable by root only. The dumps hold password
# hashes and the personal details people sent through the contact form, and
# this server is shared; they used to be written readable by every account.
umask 077

DEST="${1:-/var/backups/clik}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
MEDIA_DIR="${MEDIA_DIR:-$APP_DIR/public/media}"
STAMP="$(date +%Y%m%d-%H%M%S)"
KEEP_DAYS=30

mkdir -p "$DEST"
chmod 700 "$DEST"

# Read the connection string without printing it.
DB_URI="$(grep -E '^DATABASE_URI=' "$ENV_FILE" | cut -d= -f2-)"
if [ -z "$DB_URI" ]; then
  echo "DATABASE_URI not found in $ENV_FILE" >&2
  exit 1
fi

echo "Backing up the site database…"
pg_dump --no-owner --no-acl --format=custom "$DB_URI" > "$DEST/clik_web-$STAMP.dump"

# Analytics has its own database. It is read as the postgres superuser because
# the umami role's password lives in /opt/umami, not in the site's .env.
UMAMI_SIZE=""
if [ "$(id -u)" -eq 0 ] && runuser -u postgres -- psql -Atqc "select 1 from pg_database where datname='umami'" 2>/dev/null | grep -q 1; then
  echo "Backing up the analytics database…"
  runuser -u postgres -- pg_dump --no-owner --no-acl --format=custom umami > "$DEST/umami-$STAMP.dump"
  UMAMI_SIZE=$(stat -c%s "$DEST/umami-$STAMP.dump")
else
  echo "  (analytics database skipped: needs root, or no umami database here)"
fi

echo "Backing up uploaded media…"
if [ -d "$MEDIA_DIR" ]; then
  tar -czf "$DEST/media-$STAMP.tar.gz" -C "$(dirname "$(readlink -f "$MEDIA_DIR")")" "$(basename "$(readlink -f "$MEDIA_DIR")")"
else
  echo "  (no media directory yet)"
fi

# A backup nobody checks is not a backup. Fail loudly if a dump is empty.
DUMP_SIZE=$(stat -c%s "$DEST/clik_web-$STAMP.dump")
if [ "$DUMP_SIZE" -lt 10000 ]; then
  echo "Site database dump is only $DUMP_SIZE bytes — that is too small. Check it." >&2
  exit 1
fi
if [ -n "$UMAMI_SIZE" ] && [ "$UMAMI_SIZE" -lt 2000 ]; then
  echo "Analytics dump is only $UMAMI_SIZE bytes — that is too small. Check it." >&2
  exit 1
fi

echo "Removing backups older than $KEEP_DAYS days…"
find "$DEST" \( -name 'clik_web-*.dump' -o -name 'umami-*.dump' -o -name 'media-*.tar.gz' \) -mtime "+$KEEP_DAYS" -delete

echo "Done. $DEST/clik_web-$STAMP.dump ($((DUMP_SIZE / 1024)) KB)${UMAMI_SIZE:+, umami-$STAMP.dump ($((UMAMI_SIZE / 1024)) KB)}"
