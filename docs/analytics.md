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
| Read-only DB role | `umami_reader`, `SELECT` on `website_event` only; in the site's `.env` as `UMAMI_DATABASE_URL` |

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

### Per-page columns, and why two of them bypass the API

The "Halaman teratas" table shows views, visitors, average time on page,
bounce rate and load time for each page.

Views, visitors and load time (LCP p75, from `performance/metrics`) come from
the API. **Time on page and bounce do not**, because the API's versions measure
something else under those names:

- `breakdown` per-page `totaltime` is the gap between the first and last view
  of the *same page* inside one visit. A page opened once reads zero.
- `breakdown` per-page `bounces` counts "viewed once in this visit", not
  "left the site from here".

So `readPages()` in `umami.ts` works them out from `website_event` with the
usual definitions — time until the visitor opened their next page (the last
page of a visit is excluded, gaps capped at 30 minutes), and bounce as a visit
that started on the page and opened nothing else. It reads through a Postgres
role, `umami_reader`, that may `SELECT` `website_event` and nothing else, in
read-only transactions. Its connection string is `UMAMI_DATABASE_URL`.

If that connection fails the table still renders from the API, with the two
columns shown as "—" rather than filled with the misleading API figures.
Tested by revoking the role's login.

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

## Known issues

**Stored times were 7 hours early — fixed 29 September.** This server's
PostgreSQL runs on `Asia/Jakarta`, and Umami sends event times without a
timezone, so PostgreSQL read UTC times as Jakarta times. Durations and counts
were right; hourly and daily charts were not.

The `umami` role now runs in UTC (`ALTER ROLE umami SET timezone TO 'UTC'`),
and the times already stored were moved forward 7 hours with Umami stopped and
a backup taken first. One column was left alone: `user.created_at`, which
Umami's installer wrote with the database clock and was already right — every
other column holding data was checked and was 7 hours early. A new visit is
now stored within seconds of the real time. The first recorded visit reads
17:12 on 25 September, matching the real time.

**Time on page counts idle tabs.** It is the time until the visitor opens their
next page, so a tab left open reads as reading time. One such view dominated a
page's average on staging (15.8 minutes, the same article reopened). Measuring
only the time a tab is visible, as Google Analytics does, would need a small
addition to the tracker; not built.

**Staging and production share one website ID** unless split before launch.

## Not covered

- **Speed before launch.** Real-user vitals need real users. Catching a slow
  page before shipping wants Lighthouse CI, which is also free.
- **Server-side monitoring.** This measures what the visitor's browser
  experiences, not slow queries or backend errors.
