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
