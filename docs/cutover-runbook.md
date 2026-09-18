# Cutover runbook

Replacing the live cbclik.com with the new site. Follow it in order.

**Do the cutover early in the day, early in the week.** Not on a Friday
afternoon: if something needs fixing you want people available.

## Before the day

- [ ] Every item in [seed data inventory](./seed-data-inventory.md) → *Before launch* is done
- [ ] The four policy pages hold real, reviewed text — **not the TODO placeholder**
- [ ] Sample vacancies and sample media coverage removed
- [ ] Every URL in [external links](./external-links.md) verified
- [ ] Corporate SMTP configured and a test message received
- [ ] `SITE_ENV=production` and `SITE_URL=https://cbclik.com` set in the production `.env`
- [ ] A backup of the **old** WordPress site and its database, kept by whoever hosts it
- [ ] Access confirmed to the DNS records for cbclik.com
- [ ] TLS certificate obtained for cbclik.com and www.cbclik.com

## Content migration

The redirect map assumes the old articles and reports keep their slugs. Either
recreate them in the CMS with the same slugs, or accept that those URLs land on
the Newsroom index instead of the specific article.

- [ ] 38 articles migrated, slugs unchanged — see [redirect map](./migration-redirect-map.md)
- [ ] 3 reports migrated, slugs unchanged
- [ ] Decide what happens to the 10 management profiles and the CEO letter,
      which have **no equivalent page** on the new site

## Cutover

1. **Lower the DNS TTL to 300 seconds, at least 24 hours beforehand.** Without
   this, a rollback takes hours to propagate instead of minutes.
2. Put the old site into maintenance mode, or accept a few minutes of both
   being live.
3. Install the production nginx config and the redirect map:
   ```
   sudo cp deploy/nginx-production.conf /etc/nginx/sites-available/clik
   sudo mkdir -p /etc/nginx/clik && sudo cp deploy/redirects.map /etc/nginx/clik/
   sudo ln -sf /etc/nginx/sites-available/clik /etc/nginx/sites-enabled/clik
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. Point DNS at the new server.
5. Watch until the new site answers on the real domain.

## Immediately after

- [ ] `https://cbclik.com/` loads and is **not** behind the staging password
- [ ] `https://cbclik.com/robots.txt` says `Allow: /`, not `Disallow: /`
- [ ] `https://cbclik.com/sitemap.xml` lists cbclik.com URLs, not staging ones
- [ ] Spot-check ten old URLs from the redirect map — each should 301, not 404
- [ ] `https://www.cbclik.com/` redirects to the apex
- [ ] Submit the contact form once and confirm it reaches the sales inbox
- [ ] Submit sitemap.xml in Google Search Console

## Rollback

Keep the old site deployed but unpublished for **at least a week**.

To roll back: point DNS back at the old server. With a 300-second TTL this
takes minutes. Nothing else needs undoing — the new site is on separate
infrastructure and the old one was never modified.

The one thing that does not roll back is the redirects: search engines may
already have followed them. That is why the redirect map is checked before
cutover, not after.

## Afterwards

- [ ] Raise the DNS TTL back to its normal value once settled
- [ ] Turn on `Strict-Transport-Security` in the nginx config (it is commented
      out; enable it only once the certificate is confirmed working, as it is
      hard to undo)
- [ ] Schedule `deploy/backup.sh` in cron
- [ ] Watch Search Console for crawl errors for a fortnight
