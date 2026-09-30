# Checks

One command that proves the security, reliability and functionality fixes
of September 2026 still hold. Run it after any sizeable change — above all
after each redesign step (`docs/redesign-playbook.md`) — and before a release.

```bash
cd /home/dnugroho/clikwebsite
node --env-file=.env --import tsx scripts/checks/run.mjs
```

It takes about a minute and prints one line per check: **PASS**, **FAIL** or
**SKIP**, then a total. The exit code is the number of failures, so `0` means
everything held.

## Where it may run

- **Staging only.** It creates five probe accounts (`zzchk.*@cbclik.com`),
  articles, a report, enquiries and an image, all named `ZZCHK`, and deletes
  them — with their audit entries and test emails — when it finishes, even
  when a check fails. Never run it against production.
- The site must be running. It talks to nginx on `BASE`
  (default `http://127.0.0.1:8080`), to the app directly on `APP`
  (default `http://127.0.0.1:3000`) for the forged-Host test, and to Mailpit on
  `MAILPIT` (default `http://127.0.0.1:8025/mailpit`). Without Mailpit the
  reset-email check is skipped, not failed.

## What it checks

| Group | Check | Guards against |
|---|---|---|
| Security | Publish-date embargo on REST, GraphQL and the page | An approved report dated next month being readable early |
| Security | No secret in admin pages; preview needs a session and module access; off-site preview paths refused | The login-signing key leaking; drafts shown to the wrong team |
| Security | Version history limited to the module's team | An HR Admin reading news drafts |
| Security | Auto-translate limited to news/reports and their editors | Personal data sent to the translation service |
| Security | Enquiries only through the contact form; 3 per contact even when sent simultaneously; the visitor's real address recorded | Spam bypassing the limit |
| Security | Last Super Admin cannot be demoted; approval needs both languages; rejection needs a reason | Locking everyone out; half-translated pages going live |
| Security | SVG uploads refused; uploaded files served sandboxed; pages send nosniff and frame protection | Script hidden in uploads; click-jacking |
| Security | Reset email link built from `SITE_URL`, not the request's Host | A forged link stealing a password reset |
| Reliability | 30 simultaneous saves finish while the home page still loads | The CMS freezing under load |
| Functionality | A live page stays online while its edit is reviewed; approval publishes the edit | Pages disappearing during review |
| Functionality | A duplicate title gets a `-2` address | Two items fighting over one address |
| Functionality | Only Super Admin replaces an image file | An editor silently changing an image used elsewhere |

## When a check fails

1. Read the note beside it — it says what was seen.
2. If it is the reliability check and it says "still pending", restart the
   site (`sudo systemctl restart clik-web`) and look for a hook that queries
   the database without passing `req`.
3. Otherwise find the commit that introduced the fix
   (`git log --oneline -- <file>`), and compare the change you just made with it.

If a check itself becomes wrong because the design deliberately changed (a
page or module removed on purpose), update or remove that check in the same
commit as the change, and say why in the commit message.

## Browser checks

Things only a browser shows — the admin buttons each role sees, the
dashboard, a page's layout — are not covered here. Check those by hand as
each role, using the list in `docs/roles-and-permissions.md`.
