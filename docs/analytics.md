# Analytics

Umami, self-hosted on this server. Free, open source, and the visitor data
never leaves the machine — which matters more here than for most sites,
because CLIK's business is handling Indonesians' credit data and "we send our
visitors to Google" is a sentence nobody wants to defend to a client or to OJK.

## Where it lives

| Piece | Where |
|---|---|
| Application | `/opt/umami/src`, pinned to tag `v3.4.0` |
| Service | `systemd` unit `umami`, listening on `127.0.0.1:3100` |
| Database | PostgreSQL database `umami`, role `umami` (separate from `clik_web`) |
| Public route | `/analytics` on port 8080, proxied by nginx |
| Admin login | `/opt/umami/ADMIN-CREDENTIALS.txt` (chmod 600) |
| API key | `/opt/umami/API-KEY.txt` (chmod 600), also in the site's `.env` |

Umami runs with `BASE_PATH=/analytics`, so it owns that prefix and nginx
rewrites nothing on the way through.

The default `admin` / `umami` login was changed on install and the old
password checked to make sure it no longer works. Anyone on the office network
or the tailnet can reach port 8080, so leaving it would have been an open door.

## What is measured

The tracking script loads on the **public site only**. The CMS is deliberately
left out: editor traffic would drown out real visitors, and what staff do all
day is already in the audit log. Previews are excluded too — an editor
checking their own draft is not a visitor.

`data-performance="true"` on the script turns on real-user Core Web Vitals:
LCP, INP, CLS, FCP and TTFB. No extra code in the pages.

## The CMS dashboard

`/admin` shows the numbers instead of Payload's default. It is drawn in the
CLIK palette by `src/components/admin/Dashboard.tsx`, not framed from Umami,
so it matches the rest of the admin and nobody needs a second account.

`src/components/admin/umami.ts` fetches over the loopback address with the API
key, which stays on the server. It never throws: analytics being unreachable
shows a line of explanation and zeroes, and the CMS carries on. That path is
tested by stopping the service and loading `/admin`.

Endpoints used, all `GET` under `/api/websites/{id}`:

| Endpoint | Gives |
|---|---|
| `stats` | pageviews, visitors, visits, bounces, plus the previous period |
| `performance/stats` | p50/p75/p95 for each Core Web Vital |
| `breakdown?fields=["path"]` | top pages |
| `breakdown?fields=["referrer"]` | where visitors came from |

Authentication is `Authorization: Bearer <api key>`. The `x-umami-api-key`
header does **not** work on the analytics routes — it authenticates but does
not populate the user the permission check looks for, and every call comes
back 401.

Core Web Vitals are judged on the 75th percentile against Google's published
boundaries. Each rating carries its own word as well as a colour, so it
survives a colourblind reader.

## Operating it

```
systemctl status umami          # is it running
journalctl -u umami -n 50       # why it is not
systemctl restart umami
```

Upgrading: `git -C /opt/umami/src fetch --tags`, check out the new tag, then
`pnpm install --frozen-lockfile && pnpm run build`, then restart. Use
`/opt/umami/bin/pnpm` — the system `pnpm` is a corepack shim that cannot start
pnpm 12.3.4, because it looks for `bin/pnpm.cjs` where that version ships
`bin/pnpm.mjs`.

## Not covered

- **Speed before launch.** Real-user vitals need real users. Catching a slow
  page before shipping wants Lighthouse CI, which is also free.
- **Server-side monitoring.** This measures what the visitor's browser
  experiences, not slow queries or backend errors.
