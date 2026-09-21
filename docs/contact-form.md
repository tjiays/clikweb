# Contact form, email and rate limiting

The Hubungi Kami form (Figma `284:1397`), what happens when someone submits it,
and how abuse is kept out without a CAPTCHA.

## What happens on submit

1. The browser validates and shows errors beside each field.
2. The server validates again, because the browser can be bypassed.
3. The rate limits are checked. If one is hit, **nothing is stored and nothing
   is sent** — the visitor sees a polite message.
4. The submission is saved. This is the permanent record.
5. An email goes to the sales address with **Reply-To set to the sender**, so
   replying reaches the person who wrote in.
6. **If the email fails, the submission is still saved** and the error logged.
   Losing a sales enquiry because a mail server hiccuped would be worse than a
   missing notification.

## Fields

Required: first name, last name, business email, telephone, company name,
"Interested in", "How did you hear about us?" and the message. The design
marks "How did you hear about us?" as required; the database column stays
optional so older submissions remain valid.

Optional: marketing preference (two checkboxes that exclude each other, stored
as opt_in / opt_out) and marketing channels (four checkboxes in one row;
ticking a channel also ticks opt-in).

**The consent checkbox is mandatory.** The form will not submit without it, and
the server refuses a submission that claims otherwise.

Stored alongside each submission: the language it was sent in, the page URL,
the IP address, the browser's user agent, and the version of the consent text
that was shown. That last one matters — it records what the person actually
agreed to, not what the wording says today.

## Rate limits

| Rule | Limit | Counted by |
| --- | --- | --- |
| Same contact | 3 per 24 hours | email address **or** phone number |
| Same network | 5 per hour | IP address |

There is no CAPTCHA (confirmed decision 18).

Counts are taken from the submissions already stored, so clearing cookies or
using a private window does not reset them.

Phone numbers are normalised before comparison, so `0812…`, `+62812…` and
`62812…` all count as the same number.

Both limits are verified end to end: three submissions from one email address
succeed and the fourth is refused; the same holds for a repeated phone number;
and a sixth submission from one network within the hour is refused.

## Email

| | Staging | Production |
| --- | --- | --- |
| Where mail goes | Mailpit, on this server | Corporate SMTP |
| Who can read it | Anyone with staging access, at `/mailpit/` | The sales inbox |
| Reaches real people | **No** | Yes |

Staging deliberately captures mail rather than sending it, so testing the form
never disturbs a real inbox.

Moving to production is a change of environment variables, not of code:

```
SMTP_HOST=<corporate server>
SMTP_PORT=587
SMTP_USER=<username>
SMTP_PASS=<password>        # set on the server, never committed
SMTP_SECURE=true
CONTACT_FORM_RECIPIENT=sales@cbclik.com
```

## Who sees submissions

**Sales Admin** and **Super Admin**, under Pengaturan → Data Masuk.

Sales Admin can read submissions and tick "Sudah ditindaklanjuti". They cannot
edit the content of a submission and cannot delete one — nobody can, including
Super Admin. These are permanent records (confirmed decision 19), which is
verified: an attempt to edit the message leaves it unchanged, and a delete
returns 403.

## Still to decide

The map embed URL is a site setting and is currently blank, so the Contact page
shows a marked TODO instead of a broken frame. Set it under Pengaturan →
Pengaturan Umum.
