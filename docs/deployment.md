# Environments and deployment

## Environments

| | Staging | Production |
| --- | --- | --- |
| Where | This server, port 8080 (see below) | cbclik.com (Phase 6) |
| Protected by | HTTP basic auth | Public |
| Indexed by search engines | No | Yes |
| Email | Captured by Mailpit | Corporate SMTP |
| TLS | None yet | Required |

## How to reach staging

The server sits **behind NAT**. It holds `192.168.50.21` on the LAN and
`100.77.127.4` on the Tailscale network; `202.150.74.187` is the gateway's
address, not this machine's. Port 8080 is therefore not reachable from the
public internet, which is the safer default for a staging site.

| From | URL |
| --- | --- |
| The office network | http://192.168.50.21:8080/ |
| Anywhere, over Tailscale | http://100.77.127.4:8080/ |

Both ask for the staging username and password.

Captured email is at `/mailpit/` on the same host and port.

To show the site to someone outside the company, either add them to the
Tailscale network, or ask whoever manages the gateway to forward a port. A
public hostname and a TLS certificate would then be worth adding together.

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
| `NEXT_PUBLIC_SERVER_URL` | `http://100.77.127.4:8080` | `https://www.cbclik.com` |
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
