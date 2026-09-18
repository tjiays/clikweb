# Environments and deployment

## Environments

| | Staging | Production |
| --- | --- | --- |
| Where | This server, `202.150.74.187:8080` | cbclik.com (Phase 6) |
| Protected by | HTTP basic auth | Public |
| Indexed by search engines | No | Yes |
| Email | Captured by Mailpit | Corporate SMTP |
| TLS | None yet | Required |

## The server is shared

It also runs the BPJS simulator and four other PostgreSQL databases. The
website is kept separate and touches none of them:

| Resource | Used by this project |
| --- | --- |
| Database | `clik_web`, owned by the `clik` role |
| Application port | 3000, bound to localhost |
| Nginx site | `clik-staging`, listening on 8080 |
| Mail capture | Mailpit, localhost 1025 (SMTP) and 8025 (web) |

Ports 80 and 443, the `bpjs-sim` and `default` nginx sites, and the
`bpjs_db`, `bpjstk_mock` and `clu_db` databases are untouched.

## Services

| Service | Does |
| --- | --- |
| `clik-web.service` | Runs the built Next.js application on port 3000 |
| `mailpit.service` | Captures outgoing mail |

```bash
systemctl status clik-web
systemctl restart clik-web
journalctl -u clik-web -f     # live logs
```

## Releasing to staging

```bash
cd /home/dnugroho/clikwebsite
git pull
npm ci                  # exact versions from the lockfile
npm run migrate         # apply any new database migrations
npm run build
sudo systemctl restart clik-web
```

Run as the `dnugroho` user, which owns the files and runs the service.

## Configuration

All configuration is environment variables in `.env`, which is never committed.
`.env.example` lists every variable with the values blanked.

Moving from staging to production is a change of values, not of code:

| Variable | Staging | Production |
| --- | --- | --- |
| `DATABASE_URI` | local `clik_web` | production database |
| `NEXT_PUBLIC_SERVER_URL` | `http://202.150.74.187:8080` | `https://www.cbclik.com` |
| `SMTP_HOST` / `SMTP_PORT` | `127.0.0.1` / `1025` | corporate SMTP |
| `CONTACT_FORM_RECIPIENT` | a test address | `sales@cbclik.com` |

## Database migrations

Payload owns the schema. After changing a collection:

```bash
npm run generate:types
npm run migrate:create <name>
npm run migrate
```

Migrations are committed. They run before the build on every release, never by
hand against production.

## Known gaps

These are deliberate, and recorded rather than forgotten:

- **No TLS.** Staging is served over plain HTTP, so the basic-auth password
  travels in clear text. Acceptable while the site holds only placeholder
  content; it must change before real content or real submissions.
- **No automated tests, no penetration test, no load testing.** Deferred by the
  product owner.
- **No backup of `clik_web` yet.** Added in Phase 6 with the rest of the
  operations work.
