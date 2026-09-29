# Operations handbook

Running the site day to day.

## Services

| Service | Does | Port |
| --- | --- | --- |
| `clik-web` | The website and CMS | 3000, localhost only |
| `umami` | Website analytics, at `/analytics` | 3100, localhost only |
| `mailpit` | Captures outgoing mail on staging | 1025 SMTP, 8025 web |
| `nginx` | Reverse proxy and TLS | 80, 443 (8080 on staging) |
| `postgresql` | Databases `clik_web` and `umami` | 5432 |

```bash
systemctl status clik-web umami
systemctl restart clik-web
journalctl -u clik-web -f          # live logs
journalctl -u clik-web -n 100      # the last hundred lines
```

## Releasing

```bash
sudo ./deploy/release.sh            # releases origin/main
sudo ./deploy/release.sh <ref>      # or a tag or commit
```

Production uses a release layout, set up once at cutover (see the
[cutover runbook](./cutover-runbook.md)):

```
/srv/clik/
  repo/                 a git clone releases are taken from
  releases/<time>-<sha>/  one folder per release, built in place
  shared/.env           configuration, linked into every release
  shared/media/         uploaded files, linked into every release
  current -> releases/…   what the service runs (deploy/clik-web.service)
```

The script builds the new release in its own folder while the live site keeps
running from the old one, then backs up, migrates, switches `current` in one
step, restarts and checks both `/` and `/admin/login` answer. If they do not,
it switches back and says whether the site is answering again. The last five
releases are kept.

What was verified on 29 September, on a separate test instance:

| Test | Result |
| --- | --- |
| First release | Built and live in 130 s |
| Release while a visitor loads the site every 0.2 s | 443 of 443 answered during the 2.5 min install and build; 8 failed in the few seconds of restart |
| A release whose build fails | Live site untouched (229 of 229 answered), no backup or migration run, the half-built folder removed |
| Manual rollback | Previous release answering within seconds |
| A release that does not answer | Switched back automatically |

The old script installed and built inside the live folder — deleting the
running app's packages while it served — and migrated before building, so a
failed build left the new database under the old code.

Rolling back:

```bash
sudo ./deploy/rollback.sh                 # to the release before current
sudo ./deploy/rollback.sh <release-dir>   # to a specific one
```

Rollback does not undo migrations. They only ever add, copy, and drop in a
later release, so the previous code runs on the newer database; if one ever
did not, restore the backup `release.sh` took first.

**Staging does not use the release layout.** It runs from the working
checkout at `/home/dnugroho/clikwebsite` and is rebuilt in place.

## Page cache

nginx keeps a 60-second copy of public pages for anonymous visitors. Anyone
signed in to the CMS or previewing always bypasses it, as do `/admin`, `/api`,
`/preview`, image resizing, and any request carrying credentials; a response
that sets a cookie is never stored. The cache key includes Next's navigation
headers, so a page and its navigation data at the same address never mix.

Measured with 50 simultaneous visitors on staging:

| Page | Before | With the cache |
| --- | --- | --- |
| `/` | 17 pages/s, median 2.7 s | 970 pages/s, median 50 ms |
| `/newsroom` | 10 pages/s, median 4.4 s | 962 pages/s, median 48 ms |
| `/laporan` | 31 pages/s, median 1.4 s | 1084 pages/s, median 42 ms |

During ten seconds of that load the database did no work at all.

**The trade-off:** an approved change reaches anonymous visitors within a
minute rather than at once (measured: 51 seconds). Editors see it at once,
because they bypass the cache. To clear it immediately:

```bash
sudo find /var/cache/nginx/clik -type f -delete
```

When a cached page expires only one request rebuilds it; the rest get the
previous copy, which also keeps pages up through a restart or a brief app
failure. The `X-Cache-Status` response header shows `HIT`, `MISS` or `BYPASS`.

## Backups

Nightly at 02:00, by `/etc/cron.d/clik-backup`, into `/var/backups/clik`:

| File | Holds |
| --- | --- |
| `clik_web-<time>.dump` | The site database |
| `umami-<time>.dump` | The analytics database |
| `media-<time>.tar.gz` | Uploaded files |

Kept 30 days. Output goes to `/var/log/clik-backup.log`. The script fails
loudly if a dump comes out suspiciously small.

**Backups are readable by root only.** They hold password hashes and the
personal details people sent through the contact form, and until 29 September
they were written readable by every account on this shared server.

To run one by hand: `sudo ./deploy/backup.sh`. Under the release layout,
`release.sh` passes it `ENV_FILE=/srv/clik/shared/.env` and
`MEDIA_DIR=/srv/clik/shared/media`; set the same when running it yourself
there, and in the cron line.

Verified: cron ran it unattended; both dumps list cleanly with `pg_restore`;
the analytics dump restored into a scratch database with identical counts.

## Restoring

```bash
sudo ./deploy/restore.sh /var/backups/clik/clik_web-YYYYMMDD-HHMMSS.dump \
                         /var/backups/clik/media-YYYYMMDD-HHMMSS.tar.gz
```

It asks for the database name before replacing anything, and must run as root
because the backups are root-only. It restores media into the real folder
behind `MEDIA_DIR`, so the release layout's link is kept. Tested end to end
against a scratch database and folder: counts identical, all 42 files back,
link intact.

The analytics database restores separately:

```bash
sudo runuser -u postgres -- pg_restore --clean --if-exists --no-owner -d umami \
  < /var/backups/clik/umami-YYYYMMDD-HHMMSS.dump
```

## Environment variables

Configuration lives in `.env`, which is never committed.

| Variable | Notes |
| --- | --- |
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Signs sessions. Changing it logs everyone out. |
| `SITE_ENV` | `production` opens the site to search engines. Anything else keeps it closed. |
| `SITE_URL` | Read **at runtime**. Used by sitemap.xml, robots.txt and canonical tags. |
| `NEXT_PUBLIC_SERVER_URL` | Inlined **at build time**. Used by browser code. |
| `SMTP_*` | Mail server. Points at Mailpit on staging. |
| `CONTACT_FORM_RECIPIENT` | Where contact submissions are emailed. |
| `ANTHROPIC_API_KEY` | Powers the CMS auto-translate action. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Turns on the tracking script on the public site. Unset = no tracking. |
| `UMAMI_WEBSITE_ID`, `UMAMI_API_KEY`, `UMAMI_BASE_URL` | Let the CMS dashboard read Umami's API over localhost. |
| `UMAMI_DATABASE_URL` | Read-only role `umami_reader`, for time on page and bounce. See [analytics](./analytics.md). |

The distinction between `SITE_URL` and `NEXT_PUBLIC_SERVER_URL` matters: the
first is read when a request arrives, the second is frozen into the build. If
only the second were used, a production deploy built on the staging machine
would advertise staging URLs in its sitemap.

## Media

Uploads live in `public/media`, on disk rather than in the database. They are
**not** in git and are backed up separately by `deploy/backup.sh`.

## The server is shared

It also runs the BPJS simulator. The website touches none of it:

| | Website | BPJS |
| --- | --- | --- |
| Database | `clik_web`, `umami` | `bpjs_db`, `bpjstk_mock`, `clu_db` |
| Ports | 3000, 3100, 8080 | 8001, 8010, 8011, 8799 |
| nginx site | `clik-staging` | `bpjs-sim` |

## Known gaps

Deliberate, and recorded rather than forgotten:

- **No automated tests, penetration test or load testing** — deferred by the
  product owner.
- **No uptime monitoring or alerting.** Nobody is paged if the site goes down.
- **No device testing.** The responsive behaviour is implemented and reasoned
  about, but nobody has opened the site on a real phone.
- **The password-reset email carries a relative link** (`/admin/reset/<token>`),
  so it cannot be clicked from a mail client. Payload's default template; the
  account-verification email builds an absolute link and does not have this
  problem. Until fixed, prefix the link with the site address by hand.
- **Umami stores times 7 hours early**, because PostgreSQL runs on Jakarta time
  and Umami sends times without a zone. Durations and counts are right; hourly
  and daily charts are not. Fix pending — see [analytics](./analytics.md).

## Database connections

The app holds at most 10 PostgreSQL connections. Two rules keep that from
becoming a site-wide freeze, both learned from reproducing one on 29 September
(20 simultaneous saves: 19 never answered, and the public pages stopped
responding until a restart):

- **Anything a hook writes passes `req`**, so it runs in the save's own
  transaction on the save's own connection. The audit log does; a hook that
  called `payload.create` without `req` asked for a second connection while
  holding the first.
- **Payload's document locking is off**, because its lock check does exactly
  that inside Payload, and still did in 3.90.2. With it off, 60 simultaneous
  saves finish in about two seconds.

As a backstop, a query that cannot get a connection within 10 seconds fails
(`connectionTimeoutMillis` in `payload.config.ts`) rather than waiting for ever,
so one request errors instead of the whole site hanging.

The `payload_locked_documents` tables are still in the database, unused. The
next `migrate:create` will offer to drop them, which is correct.

## Analytics

Umami runs beside the site; its screens are at `/analytics` and its login is in
`/opt/umami/ADMIN-CREDENTIALS.txt`. The CMS dashboard reads it. Everything
about it — install, upgrade, how the dashboard computes its numbers — is in
[analytics](./analytics.md).

## Moving to another server

See [migration](./migration.md).


## Outgoing email

Staging sends to Mailpit on `127.0.0.1:1025`, which accepts every message and
delivers none. That is deliberate: a test can never email a real customer or
colleague. Everything captured is readable at `/mailpit/` on the same host.

Nothing has real SMTP credentials yet, so no mail leaves the server. The
account-activation email is the one place this is felt, and a Super Admin can
read the link off the user's own page in the meantime — see
`src/components/admin/VerificationLink.tsx`.

When credentials arrive, the agreed shape is: **relay everything except
cbclik.com**. Mail to outside addresses goes out; mail to our own domain
stays caught, so internal testing keeps landing in Mailpit rather than in
colleagues' inboxes. Mailpit does this itself:

```
--smtp-relay-config /etc/mailpit/relay.conf \
--smtp-relay-matching '^(?!.*@cbclik\.com$).*'
```

with the upstream host, port, username and password in `relay.conf`. Sending
straight to recipients' mail servers from this box is not an option — it sits
behind NAT with no SPF, DKIM or reverse DNS, so Gmail and the like would
refuse it or treat it as spam.
