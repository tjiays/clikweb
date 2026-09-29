# External links register

Every outbound URL the site uses, with its status.

**TO VERIFY** means the AI coder found the URL and implemented it, but nobody at
CLIK has confirmed it is the official destination. These must all be checked
before go-live.

All of these live **in code**, not in the CMS: `src/content/site.ts`,
`src/content/partners.ts`, `src/content/about.ts`, and the careers page. A
change is a developer edit and a deploy.

| Where | Link | Value | Status |
| --- | --- | --- | --- |
| Footer | Website | https://www.cbclik.com | TO VERIFY |
| Footer, Contact | Email | mailto:info@cbclik.com | Confirmed (from design) |
| Footer, Contact | Phone | tel:+622180604228 | Confirmed (from design) |
| Footer | WhatsApp | https://wa.me/622180604228 | TO VERIFY |
| Footer | Instagram | https://www.instagram.com/clik.indonesia/ | TO VERIFY |
| Footer | LinkedIn | https://www.linkedin.com/company/clik-indonesia/ | TO VERIFY |
| Footer | OJK licence text | NO. KEP-179/D.03/2019 | TO VERIFY |
| Footer, Home trust bar | OJK, AFPI, BIIA, AFTECH, APPI logos | Empty `url` in `partners.ts` — logos are not links | Not yet set |
| Home, About Us | CRIF Global | https://www.crif.com | TO VERIFY |
| Contact | Map | Keyless Google Maps embed of Menara Dea Tower 2, Mega Kuningan | TO VERIFY |
| Karir, Detail Lowongan | Lamar | https://id.jobstreet.com/id/companies/crif-lembaga-informasi-keuangan-168557222859016/jobs | Checked live on 23 Sep (listing CLIK's current roles) |
| Karir | CV note, job detail footer | mailto:talent@cbclik.com | Confirmed |
| Contact form | Recipient | sales@cbclik.com | Confirmed |

## Still unknown

| Item | Needed from |
| --- | --- |
| Partner and regulator website links | CLIK — deliberately left blank rather than guessed |
| "Kenali CLIK Lebih Dekat" video URL | Marketing — `ABOUT_VIDEO_URL` in `src/content/about.ts` is empty |
| "Formulir Permintaan Data" downloadable form | Operations — marked TODO in `src/content/policies.ts` |

Partner and regulator links are left blank on purpose: an incorrect link to a
regulator from a supervised company's website is worse than no link at all.

The three social platforms were **confirmed** by exporting the icons from the
Figma file: WhatsApp, Instagram and LinkedIn. An earlier guess of Facebook was
wrong. The URLs themselves are the accounts that match CLIK's naming pattern.
They are implemented so the footer is complete, but a person must confirm each
one before launch — an incorrect social link on a regulated company's website
is a real reputational risk, not a cosmetic bug.

The JobStreet link is the company page rather than a link per vacancy, because
the roles listed on JobStreet are not the ones seeded on the site. A vacancy
can carry its own link in the CMS (**Tautan lamaran**).

## Rule

Any new external URL added to the site is added to this table in the same
change, with a status. Nothing ships pointing at an unrecorded destination.
