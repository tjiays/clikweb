# Moving this project to another server

Written to be handed to whoever provisions the new machine. It assumes they
know Linux and have never seen this project.

The short version: the website is a Node application, a PostgreSQL database, a
folder of uploaded images, and one file of secrets. Everything else can be
rebuilt from the git repository. The two things that cannot be rebuilt — and
that people forget — are **the uploaded images** and **`PAYLOAD_SECRET`**.

---

## 1. What this system is made of

| Piece | Where it lives now | Moves how |
|---|---|---|
| Website + CMS | `/home/dnugroho/clikwebsite`, user `dnugroho` | `git clone` |
| Source of truth | `git@github.com:tjiays/clikweb.git`, branch `main` | — |
| Content database | PostgreSQL `clik_web`, ~18 MB | `pg_dump` / restore |
| Uploaded images | `public/media` — 42 files, ~12 MB | **copy by hand; not in git** |
| Secrets | `.env` in the project root | **copy by hand; not in git** |
| Analytics app | `/opt/umami/src` (Umami v3.4.0) | reinstall, see §6 |
| Analytics database | PostgreSQL `umami`, ~10 MB | `pg_dump` / restore |
| Web server | nginx, `/etc/nginx/sites-available/clik-staging` | copy and edit |
| Outgoing mail | Mailpit, a local catcher — **not real mail** | replace, see §5 |

Services, both `systemd`, both enabled at boot:

- `clik-web` — the website, `next start` on port **3000**
- `umami` — analytics, on port **3100**

nginx listens on **8080** and sends `/` to 3000, `/analytics` to 3100 and
`/mailpit/` to 8025.

---

## 2. What to ask for on the new server

Give this list to the hosting provider.

- **Ubuntu** (or any modern Linux) with root access
- **Node.js 22.x** — Next.js 16 will not run on older versions
- **PostgreSQL 16 or newer** — built on 18.6
- **nginx**
- **2 GB RAM minimum**, 4 GB comfortable. The databases together are under
  30 MB; the memory is for building the site.
- **10 GB disk** is plenty
- **Timezone set to `Asia/Jakarta`**. Publishing dates and the CMS clock
  assume it.
- **Ports 80 and 443 open**, and a TLS certificate. The site currently runs on
  plain HTTP on port 8080 because it is only reachable from the office network
  and Tailscale. A public server must have HTTPS.
- **Outbound SMTP allowed**, or credentials for a mail relay (see §5)

---

## 3. The move, step by step

### Before you touch the new server

On the **old** server, take a copy of everything that cannot be rebuilt:

```
pg_dump "$DATABASE_URI" > clik_web.sql
su - postgres -c "pg_dump umami" > umami.sql
tar czf media.tar.gz -C /home/dnugroho/clikwebsite public/media
cp /home/dnugroho/clikwebsite/.env  env-backup
cp /opt/umami/ADMIN-CREDENTIALS.txt /opt/umami/API-KEY.txt  .
```

Keep these off email and chat. `.env` and the Umami files contain live
passwords.

### On the new server

1. **Install** Node 22, PostgreSQL, nginx.
2. **Create the database and its user**, then restore:
   ```
   createdb clik_web ; psql clik_web < clik_web.sql
   createdb umami    ; psql umami    < umami.sql
   ```
3. **Clone the project** and check out `main`.
4. **Put `.env` back** in the project root, then change these four values —
   and only these:
   - `DATABASE_URI` — new host, user and password
   - `SITE_URL` and `NEXT_PUBLIC_SERVER_URL` — `https://cbclik.com`
   - `SMTP_*` — the real relay, not Mailpit (§5)

   **Do not change `PAYLOAD_SECRET`.** See §4.
5. **Restore the images**: unpack `media.tar.gz` into the project so that
   `public/media` exists again. Without this every image on the site 404s
   while the CMS still lists them, which looks like a database problem and is
   not.
6. **Build**:
   ```
   npm ci
   npm run build
   ```
   The database must be reachable at this point — the build reads the Payload
   config.
7. **Copy the two `systemd` units** from the old server
   (`/etc/systemd/system/clik-web.service` and `umami.service`), fix the paths
   and the user, then `systemctl daemon-reload && systemctl enable --now`.
8. **Copy the nginx config**, change `listen 8080` to the real ports, add the
   certificate, and set `server_name cbclik.com www.cbclik.com`.
9. **Point DNS** at the new server only once §7 passes.

### A fresh database instead of a restore

If you are starting with empty content rather than moving the existing site,
skip the restore and run `npm run migrate` after step 4. That builds the
schema from scratch. You will then have no users — create the first Super
Admin through the CMS at `/admin`.

---

## 4. The things that will bite you

Each of these has already cost time once.

**`PAYLOAD_SECRET` must be carried over unchanged.** It signs login sessions
and email-verification links. Change it and everyone is logged out and every
outstanding verification link is dead. There is no way to recover the old one
if it is lost — keep it with the database backup.

**`public/media` is not in git.** It is 12 MB of images that exist nowhere
else. Losing it is unrecoverable; every article and report cover disappears.

**nginx must pass `$http_host`, not `$host`.** With `$host` the port is
stripped, the CMS rejects every save with *"Invalid Server Actions request"*,
and nothing in the logs says why. Keep these lines:
```
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-Host $http_host;
```

**The new domain reaches `serverActions.allowedOrigins` on its own** — the
list in `next.config.ts` is built from `SITE_URL` and `NEXT_PUBLIC_SERVER_URL`,
so setting those correctly is enough and no code change is needed. But they
must be set *before* the app starts, because the config is read at startup.
Get this wrong and the CMS refuses every save on the new address, for the same
reason as the header above.

**`client_max_body_size 25M`** in nginx, and `bodySizeLimit` in
`next.config.ts`. Next's default is 1 MB, which silently breaks image upload.

**Set the server timezone to Asia/Jakarta.** Scheduled publishing decides
"has the publish date arrived" against Jakarta time.

**Check the database sequences after restoring.** A restore normally carries
them, but if saving a product or a job fails with a duplicate-key error, the
counters are behind the data. This bit us once.

---

## 5. Mail must be replaced, not moved

Right now outgoing mail goes to **Mailpit**, a local catcher that holds
messages so they can be read at `/mailpit/`. **Nothing reaches a real
inbox.** That is deliberate for staging.

Two things depend on real mail in production:

- **New CMS accounts** — a user is inactive until they click a link sent to
  their address. No mail means no new users can be activated. (A Super Admin
  can read the link from the user's record as a workaround.)
- **Contact form** — each enquiry emails `sales@cbclik.com`. The enquiry is
  always saved to the CMS even if the mail fails, so nothing is lost, but
  nobody is notified.

Get SMTP credentials from whoever runs CLIK's mail, put them in `SMTP_HOST`,
`SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, and send one test
enquiry to confirm.

---

## 6. Analytics

Umami is a separate application. Restore its database, then reinstall the app
by following `docs/analytics.md` — clone `v3.4.0`, `pnpm install`, `pnpm run
build`, copy the service file.

Because the database is restored, the **website ID stays the same**, so
`NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `UMAMI_API_KEY` in `.env` keep working
unchanged. `UMAMI_BASE_URL` stays `http://127.0.0.1:3100/analytics`.

Recreate the read-only role the dashboard uses for time on page, then update
`UMAMI_DATABASE_URL` with its new password:

```
CREATE ROLE umami_reader LOGIN PASSWORD '<new password>';
GRANT CONNECT ON DATABASE umami TO umami_reader;
GRANT USAGE ON SCHEMA public TO umami_reader;
GRANT SELECT ON public.website_event TO umami_reader;
ALTER ROLE umami_reader SET default_transaction_read_only = on;
```

Skip it and the dashboard still works; the time and bounce columns show "—".

**Set the Umami role to UTC before its first start** on the new server:

```
ALTER ROLE umami SET timezone TO 'UTC';
```

Umami sends event times without a timezone, so if PostgreSQL runs on Jakarta
time (as this server does) every stored time lands 7 hours early. If the
database you restore was written with that fault, correct it at the same time;
`docs/analytics.md` describes it.

Note that `pnpm` needs the shim at `/opt/umami/bin/pnpm`; the system one is a
broken corepack version. `docs/analytics.md` explains why.

**Decide before launch** whether staging and production analytics share one
bucket. They currently would. Two website entries in Umami, chosen by the
env var, keeps them apart.

---

## 7. Before you point DNS at it

Work through this on the new server, using its IP address, while the old one
is still live.

- [ ] The home page loads, in both Indonesian and English
- [ ] Images appear on a news article and on a report — proves §3 step 5
- [ ] `/admin` loads and an existing user can log in — proves `PAYLOAD_SECRET`
- [ ] Editing and saving a report works — proves the nginx headers
- [ ] Uploading an image works — proves the body-size limits
- [ ] A contact form submission arrives in **Enquiries** and the email lands
- [ ] `/analytics` loads and the CMS dashboard shows numbers
- [ ] `systemctl is-enabled clik-web umami` both say `enabled`
- [ ] Reboot the server and confirm everything comes back by itself

---

## 8. If it goes wrong

Nothing here is destructive to the old server: it keeps running throughout.
Until DNS is changed, the old machine is still the live site, so rolling back
is changing DNS back and waiting for it to propagate.

Keep the old server running for **at least a week** after the cutover. It is
cheap insurance, and it holds the only copy of anything that turns out to have
been missed.
