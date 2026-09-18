# Operations handbook

Running the site day to day.

## Services

| Service | Does | Port |
| --- | --- | --- |
| `clik-web` | The website and CMS | 3000, localhost only |
| `mailpit` | Captures outgoing mail on staging | 1025 SMTP, 8025 web |
| `nginx` | Reverse proxy and TLS | 80, 443 (8080 on staging) |
| `postgresql` | Database `clik_web` | 5432 |

```bash
systemctl status clik-web
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

Schedule it nightly:

```
0 2 * * * /home/dnugroho/clikwebsite/deploy/backup.sh
```

Kept for 30 days in `/var/backups/clik`. The script fails loudly if the dump
comes out suspiciously small, because a backup nobody checks is not a backup.

**The restore path has been tested**, not just written: a dump was restored
into a scratch database and every table matched the live one.

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
| Database | `clik_web` | `bpjs_db`, `bpjstk_mock`, `clu_db` |
| Ports | 3000, 8080 | 8001, 8010, 8011, 8799 |
| nginx site | `clik-staging` | `bpjs-sim` |

## Known gaps

Deliberate, and recorded rather than forgotten:

- **No automated tests, penetration test or load testing** — deferred by the
  product owner.
- **No uptime monitoring or alerting.** Nobody is paged if the site goes down.
- **No device testing.** The responsive behaviour is implemented and reasoned
  about, but nobody has opened the site on a real phone.
