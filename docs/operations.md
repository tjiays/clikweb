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
cd /home/dnugroho/clikwebsite
./deploy/release.sh
```

It backs up first, pulls, installs from the lockfile, migrates, builds,
restarts, and checks the site answers. It stops on the first failure rather
than continuing into a broken state.

## Backups

```bash
./deploy/backup.sh                 # database + uploaded media
```

**It is not scheduled yet.** Today it runs only as the first step of
`release.sh`; the newest backups in `/var/backups/clik` are from 21 September.
Schedule it nightly:

```
0 2 * * * /home/dnugroho/clikwebsite/deploy/backup.sh
```

Kept for 30 days in `/var/backups/clik`. The script fails loudly if the dump
comes out suspiciously small, because a backup nobody checks is not a backup.

**The restore path has been tested**, not just written: a dump was restored
into a scratch database and every table matched the live one.

`backup.sh` covers `clik_web` and `public/media` only. **The `umami` analytics
database is not included.** Until it is, back it up by hand:

```bash
su - postgres -c "pg_dump --format=custom umami" > /var/backups/clik/umami-$(date +%Y%m%d-%H%M%S).dump
```

## Restoring

```bash
./deploy/restore.sh /var/backups/clik/clik_web-YYYYMMDD-HHMMSS.dump \
                    /var/backups/clik/media-YYYYMMDD-HHMMSS.tar.gz
```

It asks for the database name before replacing anything.

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
- **No scheduled backups, and none of analytics** — see Backups above.
- **The password-reset email carries a relative link** (`/admin/reset/<token>`),
  so it cannot be clicked from a mail client. Payload's default template; the
  account-verification email builds an absolute link and does not have this
  problem. Until fixed, prefix the link with the site address by hand.
- **Umami stores times 7 hours early**, because PostgreSQL runs on Jakarta time
  and Umami sends times without a zone. Durations and counts are right; hourly
  and daily charts are not. Fix pending — see [analytics](./analytics.md).

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
