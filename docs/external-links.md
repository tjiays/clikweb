# External links register

Every outbound URL the site uses, with its status.

**TO VERIFY** means the AI coder found the URL and implemented it, but nobody at
CLIK has confirmed it is the official destination. These must all be checked
before go-live.

| Where | Link | Value | Status |
| --- | --- | --- | --- |
| Footer | Website | https://www.cbclik.com | TO VERIFY |
| Footer, Contact | Email | mailto:info@cbclik.com | Confirmed (from design) |
| Footer, Contact | Phone | tel:+622180604228 | Confirmed (from design) |
| Footer | LinkedIn | https://www.linkedin.com/company/clik-indonesia/ | TO VERIFY |
| Footer | Instagram | https://www.instagram.com/clik.indonesia/ | TO VERIFY |
| Footer | Facebook | https://www.facebook.com/clikindonesia/ | TO VERIFY |
| Footer | OJK | Set per logo in the CMS | Not yet set — add in Partner Logos |
| Footer | AFPI | Set per logo in the CMS | Not yet set — add in Partner Logos |
| Footer | BIIA | Set per logo in the CMS | Not yet set — add in Partner Logos |
| Footer | AFTECH | Set per logo in the CMS | Not yet set — add in Partner Logos |
| Footer | APPI | Set per logo in the CMS | Not yet set — add in Partner Logos |
| About Us | CRIF Global | https://www.crif.com | TO VERIFY — implemented in site settings |
| Contact | Map | Menara Dea Tower 2, Jakarta | Not yet implemented |
| Careers | Apply | mailto:talent@cbclik.com | Confirmed |
| Contact form | Recipient | sales@cbclik.com | Confirmed |

## Still unknown

| Item | Needed from |
| --- | --- |
| OJK licence number | CLIK — shown in the footer and on the homepage trust bar |
| Which three platforms the footer's social icons represent | The design team |
| "Kenali CLIK Lebih Dekat" video URL | Marketing |
| "Formulir Permintaan Data" downloadable form | Operations |

Partner and regulator links are now a `url` field on each Partner Logo record,
so the team sets them in the CMS rather than in code. They are deliberately
left blank rather than guessed: an incorrect link to a regulator from a
supervised company's website is worse than no link at all.

The three social URLs above are the accounts that match CLIK's naming pattern.
They are implemented so the footer is complete, but a person must confirm each
one before launch — an incorrect social link on a regulated company's website
is a real reputational risk, not a cosmetic bug.

## Rule

Any new external URL added to the site is added to this table in the same pull
request, with a status. Nothing ships pointing at an unrecorded destination.
