#!/usr/bin/env bash
#
# Releases a commit without touching the running site until it is ready.
#
#   APP_ROOT/
#     releases/<time>-<sha>/   one folder per release, built in place
#     shared/.env              configuration, linked into every release
#     shared/media/            uploaded files, linked into every release
#     current -> releases/…    what the service runs
#
# Order: build the new release in its own folder -> back up -> migrate ->
# switch `current` in one step -> restart -> check -> switch back if the
# check fails. The live site is untouched until the switch, so a failed
# install or build changes nothing.
#
# The old script ran `npm ci` and `next build` in the live folder while it was
# serving, and migrated before building, so a failed build left the new
# database under the old code with nothing to fall back to.
#
# Usage:  sudo ./deploy/release.sh [ref]          (default ref: origin/main)
#
# Settings, all overridable from the environment:
#   APP_ROOT   /srv/clik       where releases live
#   REPO_DIR   $APP_ROOT/repo  a git clone to release from
#   SERVICE    clik-web        the systemd unit to restart
#   PORT       3000            where the service answers, for the check
#   KEEP       5               releases kept for rollback

set -euo pipefail

APP_ROOT="${APP_ROOT:-/srv/clik}"
REPO_DIR="${REPO_DIR:-$APP_ROOT/repo}"
SERVICE="${SERVICE:-clik-web}"
PORT="${PORT:-3000}"
KEEP="${KEEP:-5}"
REF="${1:-origin/main}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUDO=""; [ "$(id -u)" -ne 0 ] && SUDO="sudo"

say()  { echo "==> $*"; }
fail() { echo "!! $*" >&2; exit 1; }

[ -f "$APP_ROOT/shared/.env" ] || fail "Missing $APP_ROOT/shared/.env — see docs/migration.md."
mkdir -p "$APP_ROOT/releases" "$APP_ROOT/shared/media"

if git -C "$REPO_DIR" remote get-url origin >/dev/null 2>&1; then
  say "Fetching"
  git -C "$REPO_DIR" fetch --all --tags --quiet
fi
SHA="$(git -C "$REPO_DIR" rev-parse --short "$REF")"
NEW="$APP_ROOT/releases/$(date +%Y%m%d-%H%M%S)-$SHA"
PREVIOUS=""; [ -L "$APP_ROOT/current" ] && PREVIOUS="$(readlink -f "$APP_ROOT/current")"

# Anything that fails before the switch leaves the live site as it was; the
# half-built folder is removed so it is never mistaken for a release.
cleanup_failed_build() { say "Removing the unfinished release $NEW"; rm -rf "$NEW"; }
trap cleanup_failed_build ERR

say "Unpacking $REF ($SHA) into $NEW"
mkdir -p "$NEW"
git -C "$REPO_DIR" archive "$SHA" | tar -x -C "$NEW"
ln -s "$APP_ROOT/shared/.env" "$NEW/.env"
rm -rf "$NEW/public/media"
ln -s "$APP_ROOT/shared/media" "$NEW/public/media"

say "Installing dependencies from the lockfile (live site untouched)"
(cd "$NEW" && npm ci --no-audit --no-fund)

say "Building (live site untouched)"
(cd "$NEW" && npm run build)

# The service runs as its own user and writes Next's cache inside the build,
# so the release must be theirs, not root's.
RUN_AS="$(systemctl show -p User --value "$SERVICE" 2>/dev/null || true)"
if [ -n "$RUN_AS" ] && [ "$RUN_AS" != "root" ]; then
  $SUDO chown -R "$RUN_AS:" "$NEW"
fi

trap - ERR

say "Backing up before the database changes"
ENV_FILE="$APP_ROOT/shared/.env" MEDIA_DIR="$APP_ROOT/shared/media" "$HERE/backup.sh"

say "Applying database migrations"
if ! (cd "$NEW" && npm run migrate); then
  fail "Migrations failed. The live site still runs $PREVIOUS. The backup just taken is in /var/backups/clik — restore it if a migration half-applied."
fi

switch_to() {
  ln -sfn "$1" "$APP_ROOT/current.next"
  mv -Tf "$APP_ROOT/current.next" "$APP_ROOT/current"
}

say "Switching to the new release"
switch_to "$NEW"
$SUDO systemctl restart "$SERVICE"

say "Checking the site answers"
ok=""
for _ in $(seq 1 30); do
  home=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1:$PORT/" || true)
  admin=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1:$PORT/admin/login" || true)
  if [ "$home" = "200" ] && [ "$admin" = "200" ]; then ok=1; break; fi
  sleep 2
done

if [ -z "$ok" ]; then
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    echo "!! The new release did not answer (home $home, admin $admin). Switching back." >&2
    switch_to "$PREVIOUS"
    $SUDO systemctl restart "$SERVICE"
    back="NOT answering"
    for _ in $(seq 1 30); do
      [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1:$PORT/" || true)" = "200" ] && { back="answering again"; break; }
      sleep 2
    done
    fail "Rolled back to $PREVIOUS — the site is $back. Its migrations stay applied; they are additive by rule, but check. Logs: journalctl -u $SERVICE -n 100"
  fi
  fail "The new release did not answer and there is no previous release to return to. Logs: journalctl -u $SERVICE -n 100"
fi

say "Keeping the last $KEEP releases"
ls -1dt "$APP_ROOT"/releases/*/ | tail -n +$((KEEP + 1)) | while read -r old; do
  [ "$(readlink -f "$old")" = "$(readlink -f "$APP_ROOT/current")" ] || rm -rf "$old"
done

echo "Released $SHA. Previous: ${PREVIOUS:-none}. Roll back with: sudo ./deploy/rollback.sh"
