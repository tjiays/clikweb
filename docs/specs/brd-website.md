# Business Requirements Document — CLIK Public Website

| | |
|---|---|
| Document | BRD — CLIK public website (cbclik.com) |
| Version | 1.0 |
| Date | 2026-09-30 |
| Status | Draft for review |
| Owner | To be confirmed |
| Approved by | Not yet approved (see §8, OI-01) |
| Related documents | `docs/specs/tsd-website.md` (technical counterpart) · `docs/specs/brd-cms.md` / `docs/specs/tsd-cms.md` (content management system) · `intent/00-README.md` … `intent/05-redesign.md` · `docs/contact-form.md` · `docs/analytics.md` · `docs/external-links.md` · `docs/migration-redirect-map.md` · `docs/cutover-runbook.md` · `docs/deferred-items.md` |

**How to read this document.** It describes *what the public website must do for the business*, in plain language. Every statement is taken from the project's intent files, its documentation or the working system. Where something has not been decided, it is listed as an open item in §8 rather than guessed. Where the intent files and the running system disagree, `intent/00-README.md` says the running system is right; such differences are listed in §8.2.

**About priorities.** The source material does not assign Must/Should/Could. The priorities below are *proposed* by applying one rule — a confirmed product-owner decision or a legal/security need is **Must**; designed behaviour whose detail was left to judgement is **Should**; nice-to-have is **Could** — and need business confirmation (OI-02).

---

## 1. Purpose and background

PT CRIF Lembaga Informasi Keuangan (CLIK) is a private credit bureau licensed and supervised by OJK (Otoritas Jasa Keuangan, Indonesia's financial services authority), and part of the CRIF group. Its current website at cbclik.com (WordPress) is being replaced by a new site built from a Figma design (`intent/00-README.md`, "Source of truth").

The new website:

- presents CLIK, its products and services, its reports, news and vacancies in **Indonesian (default) and English**;
- collects business enquiries through a contact form that is **stored permanently and emailed to the sales team**;
- lets CLIK staff publish news, reports, product items and job vacancies themselves through a CMS (content management system) that runs inside the same application; all other page wording lives in code and is changed by a developer (`intent/00-README.md`, decision 16);
- replaces the old site without losing its search-engine standing, by permanently redirecting every old address (`docs/migration-redirect-map.md`).

This document covers the public website only. The CMS is specified in `docs/specs/brd-cms.md`; it appears here only where the website depends on it.

## 2. Business objectives

| # | Objective | Where it comes from |
|---|---|---|
| OBJ-1 | Present CLIK as a trusted, OJK-supervised credit bureau, in both national and business languages | `intent/02` §2.1 (trust bar), decision 4 |
| OBJ-2 | Turn visitors into sales enquiries, and never lose an enquiry | `intent/04` §1; `docs/contact-form.md` ("Losing a sales enquiry … would be worse") |
| OBJ-3 | Let CLIK teams publish news, reports, products and vacancies on their own schedule, without a developer | decision 16 |
| OBJ-4 | Keep the old site's search ranking and bookmarks working after the switch | `docs/migration-redirect-map.md`, `intent/05` "Rules for what is removed" |
| OBJ-5 | Measure how the site is used without sending visitor data to third parties | `intent/04` §6, `docs/analytics.md` |
| OBJ-6 | Give individuals clear routes to check their credit report and to complain | `intent/02` §2.7, §2.10, §2.11 |

No numeric business targets (e.g. enquiries per month, traffic) have been set — see OI-03.

## 3. Scope

### 3.1 In scope

- The 17 page types listed in the Appendix, in both languages, plus a "page not found" page and the contact form's success state (`intent/02` §1).
- Shared site elements: header with menus and language switch, breadcrumb, footer, closing call-to-action block, back-to-top button (`intent/01` §4).
- Contact form with validation, consent capture, rate limiting, permanent storage and email notification (`intent/04` §1).
- Links out to JobStreet for job applications (`intent/04` §2).
- Self-hosted website analytics (Umami) on the public pages (`intent/04` §6).
- Search-engine support: sitemap, robots rules, language alternates (`docs/deferred-items.md`: hreflang built in Phase 6).
- Permanent redirects from all 161 old-site addresses (`docs/migration-redirect-map.md`).
- Responsive behaviour for tablet and phone, designed in the absence of mobile designs (`docs/responsive.md`).

### 3.2 Out of scope

| Item | Source |
|---|---|
| Kebijakan Pengguna (User Policy) page, Figma frame 2425, `html.to.design` captures | `intent/02` §1; decision 11 |
| Share buttons of any kind | decision 20; `intent/04` §3 |
| Online job application form or CV upload; syncing vacancies with JobStreet | `intent/04` §2 |
| CAPTCHA on forms | decision 18 |
| CIKA AI chatbot; FAQ module; member directory; management team section; news category/year filters; complaint form; auto-reply email to the enquirer; brochure downloads; per-solution routing of enquiries; GA4 / Search Console / GEO dashboards | `docs/deferred-items.md` ("Deferred with the BRD") |
| Automated testing, penetration testing, load testing, performance targets, uptime monitoring | `docs/deferred-items.md` ("Deferred by the product owner") |
| The CMS itself (roles, approval, editing screens) | `docs/specs/brd-cms.md` |

## 4. Stakeholders and users

### 4.1 Website visitors

| Visitor type | What they come for | Main pages |
|---|---|---|
| Financial institutions and businesses (banks, multifinance, fintech — the segments named on product use cases) | Understand CLIK's solutions and get in touch | Home, Layanan dan Produk, Business Solution, Credit Scoring, Hubungi Kami |
| Individuals (debtors) | Learn how to get their credit report or resolve a complaint | Cara mendapat laporan kredit, Penyelesaian Pengaduan |
| Job seekers | See vacancies and apply | Karir, job detail (→ JobStreet) |
| Media, partners, the public | News, coverage, company information | Newsroom, Tentang CLIK |
| Regulators, auditors, investors | Reports, policies, supervision details | Laporan, policy pages, footer |

(Visitor types are inferred from the page purposes in `intent/02`; no formal persona research exists — OI-04.)

### 4.2 Internal stakeholders

| Stakeholder | Interest in the website | Source |
|---|---|---|
| Product owner | Owns intent decisions and deferrals | `intent/00-README.md`, `docs/deferred-items.md` |
| Sales (Sales Admin) | Receives enquiries by email; follows them up in the CMS ("Data Masuk") | decisions 17, 19 |
| Marketing (Marketing Admin) | Product items | `docs/editor-guide-marketing.md` |
| News Admin | News and reports | decision 15 |
| HR (HR Admin) | Job vacancies | `intent/02` §2.16 |
| Approver | Approves all publishable content before it appears | decision 13 |
| Legal / Compliance | Review of policy and procedure pages and translations | `intent/04` §4; `docs/translation-process.md` |
| IT / operations | Hosting, releases, backups, email, DNS | `docs/operations.md`, `docs/cutover-runbook.md` |

Named individuals for each role are not recorded in the sources (OI-01).

---

## 5. Business requirements

Each requirement has an id, the requirement, why it matters, a proposed priority and how to check it.

### 5.1 Site-wide

| ID | Requirement | Rationale | Pri. | Acceptance criteria |
|---|---|---|---|---|
| BR-WEB-01 | The site is available in Indonesian and English. Indonesian is the default and has no language prefix in the address; English pages start with `/en` and use English page names (e.g. `/tentang-kami` ↔ `/en/about-us`). | Decisions 4 and O6; better reading and search indexing | Must | Every page in the Appendix opens at both addresses; no page shows `/id` in the address bar. |
| BR-WEB-02 | A language switch (`ID \| EN`, active language in orange) in the header takes the visitor to the *same page* in the other language. | `intent/01` §4 | Must | On each fixed page, switching lands on its counterpart address from the Appendix. |
| BR-WEB-03 | All interface wording (buttons, labels, errors, menus) exists in both languages, with no Indonesian left in English. | `intent/00` rules; `docs/translation-process.md` | Must | Both wording files have the same entries (87 each, checked 28 Sep and re-checked for this document). |
| BR-WEB-04 | Header navigation: Home · Layanan dan Produk ▾ (Layanan dan Produk, Business Solution, Credit Scoring) · Tentang Kami ▾ (Tentang CLIK, Laporan, Kebijakan Keamanan Informasi, Kebijakan Privasi) · Newsroom · Hubungi Kami · Karir · language switch. Transparent over the hero on Home, white on inner pages. Menus open on hover and on keyboard focus. "Tentang Kami" only opens its menu. | `intent/02` §1 navigation map; `intent/01` §4, §6 | Must | Every menu item reaches its page in both languages; menus open with mouse and keyboard. |
| BR-WEB-05 | Below 1100px wide the navigation becomes a hamburger menu with the same structure. | `docs/responsive.md` | Should | At phone and tablet widths every menu item is reachable. |
| BR-WEB-06 | Inner pages show a breadcrumb `Home > Section > Page`; the current page is not a link. | `intent/01` §4; `docs/design-system.md` | Must | Breadcrumbs correct on every inner page, including "Kebijakan Privasi" (design error fixed). |
| BR-WEB-07 | Footer on every page: company address, phone, email, website, social links (WhatsApp, Instagram, LinkedIn), "ANGGOTA DARI" member logos, "TERDAFTAR & DIAWASI OLEH OJK" with OJK logo and licence number, and a copyright line whose year is generated automatically. | `intent/01` §4, §6 | Must | Footer present on all pages, both languages; copyright shows the current year. |
| BR-WEB-08 | A closing block (cross-link card and/or "Siap…" call-to-action banner leading to Hubungi Kami) appears on the pages the design shows it on, with wording set per page. | Decision 7 | Should | Block present on Home, About, Business Solution, Credit Scoring as designed. |
| BR-WEB-09 | A floating back-to-top button is available on every page. | `intent/01` §4 | Could | Button appears after scrolling down and returns to top. |
| BR-WEB-10 | Visual identity follows the confirmed design system: Nunito Sans everywhere; orange `#FF7D00` and navy `#003A79`; known design errors corrected (e.g. "Bureu" → "Bureau"). | Decisions 1, 2; `intent/01` §6 | Must | Visual review against `intent/01`; no fonts other than Nunito Sans. |
| BR-WEB-11 | Accessibility: visible focus ring, skip-to-content link, keyboard-operable menus, touch targets at least 44px, reduced motion honoured for visitors who ask for it, landmarks and "current page" markers. | `docs/design-system.md` "Accessibility" | Should | Manual keyboard walk-through of each page type; no formal WCAG audit has been done (OI-12). |
| BR-WEB-12 | Responsive: one column on phones, two-column grids on tablets, swipeable carousels, tables that scroll sideways inside their own box, smaller type below 768px. | Decision 3; `docs/responsive.md` | Must | Each page type checked at desktop, tablet and phone widths. Real-device testing has not been done (OI-13). |
| BR-WEB-13 | A friendly "page not found" page, in the site's design, with a link back to Home. | `intent/02` §1 | Must | An unknown address returns the not-found page (currently always in Indonesian — see §8.2). |
| BR-WEB-14 | Search engines may index **only the production site**. Staging and any non-production copy must tell search engines not to index. | `docs/deployment.md`; `docs/operations.md` (`SITE_ENV`) | Must | On production `robots.txt` allows `/`; on staging it disallows `/`. |
| BR-WEB-15 | The site publishes a sitemap of all public pages in both languages, including published news, reports and vacancies, and tells search engines which pages are language versions of each other. | `docs/deferred-items.md` (hreflang); OBJ-4 | Must | `/sitemap.xml` lists production addresses (not staging) and includes a newly published article without a rebuild. |
| BR-WEB-16 | Pages load fast for anonymous visitors under load. A published change may take up to about one minute to reach anonymous visitors; editors see changes immediately. | `docs/operations.md` "Page cache" | Should | Measured on staging: see §6. The one-minute delay is accepted by the business (OI-05 to confirm). |
| BR-WEB-17 | The site has **no share buttons** anywhere. | Decision 20 | Must | No share controls on articles, cards or vacancies. |

### 5.2 Pages and page families

Addresses are those in `src/i18n/routes.ts`; the full table is in the Appendix. Content marked "CMS" is published by CLIK staff; everything else is fixed wording changed by a developer (decision 16).

| ID | Requirement | Rationale | Pri. | Acceptance criteria |
|---|---|---|---|---|
| BR-WEB-18 | **Home** (`/`, `/en`): auto-advancing 3-slide hero; About snippet; OJK trust bar; three stat cards; solutions carousel; partner testimonials; the **3 newest news articles** (CMS) with a link to Newsroom; closing call-to-action. | `intent/02` §2.1 | Must | Newest published article appears in the news block once live. |
| BR-WEB-19 | **Tentang CLIK** (`/tentang-kami`, `/en/about-us`): company intro, highlight, Vision and Mission, company video section, 2019–2025 milestone timeline, report teaser, member logos, "Tentang CRIF" with link to CRIF Global, closing block. | `intent/02` §2.2 | Must | All sections present; video plays once a video address is supplied (OI-09). |
| BR-WEB-20 | **Layanan dan Produk** (`/layanan-dan-produk`, `/en/products-and-services`): intro, service cards, data categories list, "What is a credit score?", and two cards leading to the credit-report and complaint pages. | `intent/02` §2.7 | Must | Both "Pelajari Caranya" cards reach their pages. |
| BR-WEB-21 | **Business Solution** (`…/business-solution`): one section per category in the order Credit Scoring, Analytics, Decisioning, Business Intelligence, Consulting; key advantages; **product items with status badges** (Live / Ready to Sell / New) from the CMS; closing block. | `intent/02` §2.8; decision log 23 Sep | Must | An approved product item appears under its category with its badges. |
| BR-WEB-22 | **Credit Scoring** (`…/credit-scoring`): hero with contact button, explanation, features, 4-step "how it works", benefits, "What We Offer" expandable product list (CMS items in category Credit Scoring), cross-link to Business Solution, closing banner. | `intent/02` §2.9 | Must | Product rows expand and collapse; only Credit Scoring items listed. |
| BR-WEB-23 | **Cara mendapat laporan kredit** (`…/cara-mendapat-laporan-kredit`, `…/how-to-get-your-credit-report`): how individuals and businesses obtain their credit report, with a link to the "Formulir Permintaan Data" request form. | `intent/02` §2.10; OBJ-6 | Must | Page shows both columns; form link works once the file is supplied (OI-10). |
| BR-WEB-24 | **Penyelesaian Pengaduan** (`…/penyelesaian-pengaduan`, `…/complaint-resolution`): how debtors submit complaints. Information only — there is no complaint form. | `intent/02` §2.11; `docs/deferred-items.md` FR-034 | Must | Page shows reviewed text (OI-07). |
| BR-WEB-25 | **Kebijakan Keamanan Informasi** and **Kebijakan Privasi**: long-form policy text; the privacy page shows its "last updated" date (currently 14/08/2026). | `intent/02` §2.5, §2.6 | Must | Date shown under the first heading; text legally reviewed (OI-07). |
| BR-WEB-26 | **Laporan** list (`/laporan`, `/en/reports`): report cards, 6 per page, with pagination; each opens a **report detail** page with rich text including images and financial tables. | Decision 6; `intent/02` §2.3–2.4 | Must | Tables scroll sideways on phones; pagination works. |
| BR-WEB-27 | **Newsroom** (`/newsroom`, `/en/newsroom`): media-logo strip; sidebar with **Featured News = the 8 newest articles** and a "Daftar Media" grid of outlets; article cards, **6 per page, newest first**, with pagination. | Decision 5; `intent/02` §2.12 | Must | Newest article is first in both lists; page 2 reachable. |
| BR-WEB-28 | **News article detail** (`/newsroom/<slug>`): cover, title, date, body, and "Anda mungkin juga tertarik dengan" — 3 related articles chosen by the editor, otherwise the newest. | `intent/02` §2.13 | Must | Related block shows up to 3 published articles; when the editor picked none, the newest articles other than the current one are shown. |
| BR-WEB-29 | **Liputan Media per outlet** (`/newsroom/media/<outlet>`): the outlet's coverage with the Newsroom sidebar and pagination. | `intent/02` §2.14 | Should | Opening an outlet from "Daftar Media" lists its coverage. (Coverage behaviour differs from the intent — see §8.2.) |
| BR-WEB-30 | **Karir** (`/karir`, `/en/careers`): hero carousel, company values, **only open vacancies** (CMS), CV note linking to talent@cbclik.com, benefits, 5-step recruitment process. | `intent/02` §2.16 | Must | A vacancy marked closed disappears from the list. |
| BR-WEB-31 | **Job detail** (`/karir/<slug>`): title, department, responsibilities, minimum qualifications, and a **"Lamar" button that opens JobStreet in a new tab** — the vacancy's own link if set, otherwise CLIK's JobStreet company page. | Decision 9; `intent/04` §2 | Must | Lamar opens the correct JobStreet page in a new tab. |
| BR-WEB-32 | **Hubungi Kami** (`/hubungi-kami`, `/en/contact-us`): intro, contact form (§5.3), address, email (info@cbclik.com), phone ((+62) 21 8060 4228), company name, and an embedded map of Menara Dea Tower 2. | `intent/02` §2.15 | Must | Map shows the office; details match the footer. |

### 5.3 Contact form and lead handling

| ID | Requirement | Rationale | Pri. | Acceptance criteria |
|---|---|---|---|---|
| BR-WEB-33 | The form collects: first name, last name, business email, telephone, company name, "Interested in" (7 options), "How did you hear about us?" (8 options), message — **all required**; plus optional marketing channels (Newsletter, Email, SMS/WhatsApp, Telephone) and an opt-in / opt-out marketing preference. | `intent/04` §1; `docs/contact-form.md` | Must | Submitting with any required field empty shows an error beside that field. |
| BR-WEB-34 | Email and telephone are checked for a valid format, both in the browser and again on the server. | `intent/04` §1 step 1 | Must | Invalid email/phone refused even when the browser checks are bypassed. |
| BR-WEB-35 | **Consent to be contacted is mandatory.** The version of the consent wording shown is recorded with each submission. | `docs/contact-form.md`; OBJ-2 | Must | Form cannot be sent without the tick; server refuses a submission without it. |
| BR-WEB-36 | Each accepted submission is **saved permanently** and visible to Sales Admin and Super Admin in the CMS ("Data Masuk"), with follow-up status Baru / Ditindaklanjuti. Also stored: language, page address, IP address, browser, consent version. Nobody can edit the content of, or delete, a submission. | Decisions 17, 19; `docs/contact-form.md` | Must | A test submission appears in the CMS and cannot be deleted. (CMS details: `docs/specs/brd-cms.md`.) |
| BR-WEB-37 | Each accepted submission is **emailed to sales@cbclik.com** with all fields; replying to the email reaches the sender. **If the email fails, the submission is still saved.** | Decision 17; `intent/04` §1 | Must | In production, a test enquiry arrives in the sales inbox (blocked until SMTP is set up — OI-06). |
| BR-WEB-38 | Rate limits, with no CAPTCHA: at most **3 submissions per 24 hours per email address or phone number**, and **5 per hour per network (IP address)**. Phone numbers written differently (0812…, +62812…, 62812…) count as the same. When a limit is hit, nothing is stored or sent and the visitor sees: "Anda sudah mengirim pesan. Tim kami akan segera menghubungi Anda." / "You have already sent us a message. Our team will contact you soon." | Decision 18; `intent/04` §1 | Must | 4th submission from one email in 24 h is refused; 6th from one network in an hour is refused; simultaneous submissions cannot exceed the limit. |
| BR-WEB-39 | After a successful submission the visitor sees a success message on the page; on a server problem they see an error message. | `intent/02` §1 | Must | Success and error states shown in the page's language. |
| BR-WEB-40 | Submissions can only be made through the website form, not by writing directly to the CMS's data interfaces. | `docs/contact-form.md` (29 Sep hardening) | Must | Direct posting to the CMS interface is refused. |

### 5.4 Analytics

| ID | Requirement | Rationale | Pri. | Acceptance criteria |
|---|---|---|---|---|
| BR-WEB-41 | Visits are measured with **self-hosted Umami**: page views, visitors, referrers and real-user page speed (LCP, INP, CLS, FCP, TTFB). No cookies, no consent banner, no data leaving CLIK's server. | `intent/04` §6; decision 24 | Must | Visiting a public page records a page view in Umami. |
| BR-WEB-42 | Only public visits are counted: the CMS and editors' previews are never tracked. | `docs/analytics.md` | Must | Opening a preview adds no page view. |
| BR-WEB-43 | Staging and production analytics are kept separate. | `intent/00` O9 | Should | **Not met today** — both would count into one Umami site (OI-08). |

### 5.5 Publishing behaviour the website depends on (CMS)

| ID | Requirement | Rationale | Pri. | Acceptance criteria |
|---|---|---|---|---|
| BR-WEB-44 | Only **approved** content appears on the website. When approved content is being edited, the approved version stays online until the edit is approved. | Decisions 14, 22 | Must | An edit under review does not change the public page. |
| BR-WEB-45 | News and reports with a **future publish date stay hidden until 00:00 WIB** (Jakarta time) on that date — on the pages, in the sitemap and through the CMS's data interfaces. | Decision 21 | Must | An approved article dated tomorrow is not visible today, anywhere. |
| BR-WEB-46 | Editors can **preview** unapproved work on the real page layout, and only for the modules they may read. | `intent/05` §3; `docs/approval-workflow.md` | Must | A signed-in editor sees the draft; a signed-out visitor using the same link is refused. |
| BR-WEB-47 | Content published in the CMS is complete in both languages before it can appear (approval refuses half-translated items). | Decision 4 | Must | See `docs/specs/brd-cms.md`. |

### 5.6 Legal and compliance

| ID | Requirement | Rationale | Pri. | Acceptance criteria |
|---|---|---|---|---|
| BR-WEB-48 | The site states that CLIK is registered and supervised by OJK ("TERDAFTAR & DIAWASI OLEH OJK" / "REGISTERED & SUPERVISED BY OJK") with the licence number (currently "NO. KEP-179/D.03/2019") in the footer and trust bar. | `intent/02` §2.1; `intent/01` §4 | Must | Text and licence visible on every page; licence number verified by CLIK (OI-11). |
| BR-WEB-49 | The privacy policy, information security policy, credit-report procedure and complaint procedure are **legally reviewed in both languages before launch**. English translations of these pages are flagged "needs legal review". | `intent/04` §4; `docs/translation-process.md` | Must | Written legal sign-off recorded (none yet — OI-07). |
| BR-WEB-50 | The contact form's consent and marketing texts are shown as designed and the consent version recorded (BR-WEB-35). The marketing consent is optional. | `intent/04` §1 | Must | Consent text reviewed by Legal (the current text names "CRIF Pte. Ltd." — OI-07). |
| BR-WEB-51 | Every external link is recorded in the external-links register and **verified by CLIK before launch**. Links to regulators and partner associations stay blank until confirmed. | `intent/00` rule 10; `docs/external-links.md` | Must | No link in the register still marked "TO VERIFY" at go-live (OI-11). |
| BR-WEB-52 | Personal data from the contact form is protected: backups containing it are readable by the system administrator only; visitor analytics stay on CLIK's server. | `docs/operations.md` "Backups"; `docs/analytics.md` | Must | See §6. |

### 5.7 Migration from the old site

| ID | Requirement | Rationale | Pri. | Acceptance criteria |
|---|---|---|---|---|
| BR-WEB-53 | Every address on the old cbclik.com (161 addresses from its sitemap) **permanently redirects (301)** to its nearest new page. The language scheme is reversed — old English at the root goes to `/en/…`, old `/id/…` goes to the unprefixed Indonesian page. | OBJ-4; `docs/migration-redirect-map.md` | Must | Spot-check of ten old addresses returns 301 to the right language, none 404 (`docs/cutover-runbook.md`). |
| BR-WEB-54 | Old articles and reports are recreated in the CMS **with their old slugs**, so their redirects land on the specific article rather than on the Newsroom index. | `docs/cutover-runbook.md` "Content migration" | Must | 38 articles and 3 reports migrated (checklist in the runbook). |
| BR-WEB-55 | Pages with no new equivalent (management profiles, CEO letter, old category and recruitment pages) redirect to the closest section page. | `docs/migration-redirect-map.md` | Must | Decision on management profiles / CEO letter still open (OI-14). |
| BR-WEB-56 | `www.cbclik.com` and plain `http://` addresses redirect to `https://cbclik.com`. | `deploy/nginx-production.conf` | Must | `https://www.cbclik.com/` redirects to the apex; home answers 200. |
| BR-WEB-57 | A page removed later (for example in the redesign) gets a 301 to its nearest replacement; nothing that was public returns 404 without a decision. | `intent/05` "Rules for what is removed" | Must | Applied per redesign step. |

## 6. Non-functional business requirements

| Area | Requirement | Current evidence / status |
|---|---|---|
| Availability | The site should keep serving pages during a release and through brief application failures. | Release process keeps the old version live until the new one is ready; 443 of 443 requests answered during a test install and build, 8 failed during the few seconds of restart (`docs/operations.md`). The page cache serves the last copy if the application errors. **No availability target and no uptime monitoring exist** (OI-15). |
| Speed | Pages should stay fast under load. | Measured on staging with 50 simultaneous visitors: Home 17 → 970 pages/s (median 2.7 s → 50 ms); Newsroom 10 → 962 pages/s; Laporan 31 → 1084 pages/s (`docs/operations.md`). **No formal performance target is set** (deferred). |
| Freshness | Approved changes reach visitors within about one minute (measured 51 s). | `docs/operations.md` |
| Security | HTTPS only in production; browsers told to insist on HTTPS; protection against the site being framed by others; uploaded files cannot run scripts. | Production web-server configuration (see TSD §9). Staging has **no HTTPS** (`docs/deployment.md`). **No penetration test** (deferred). |
| Privacy | Visitor analytics and enquiry data stay on CLIK's own server; no third-party tracking; no tracking cookies. | `docs/analytics.md`; fonts are self-hosted (`docs/design-system.md`). |
| Data retention | Enquiries are kept permanently; backups are kept 30 days. | Decision 19; `docs/operations.md` "Backups". A formal retention policy for personal data has not been documented (OI-16). |
| Recoverability | Nightly backups of the site database, analytics database and uploaded files; tested restore. | `docs/operations.md` "Backups", "Restoring". |

## 7. Assumptions, constraints and dependencies

**Assumptions**
- A1. Darker navy shades in Figma are merged into `#003A79` (open item O4 — assumed, not confirmed).
- A2. The header is sticky on inner pages and overlays the hero on Home (O5 — assumed, not confirmed).
- A3. Figma placeholder content (logos, testimonials, sample articles, sample vacancies and media coverage) is seed data to be replaced before launch (decision 8).
- A4. Home stat "10.500+ Lembaga keuangan" and "2.688" elsewhere are both kept as seed data until CLIK confirms the figures (`intent/01` §6).

**Constraints**
- C1. Designs exist for desktop (1440px) only; small-screen behaviour is designed by the developer (`docs/responsive.md`).
- C2. The site is self-hosted as one application (website and CMS together) on CLIK-managed infrastructure (decision 12, O1).
- C3. Page wording outside news, reports, product items and vacancies can only be changed by a developer and a release (decision 16).
- C4. Staging runs on a shared server behind NAT, reachable only from the office network and Tailscale (`docs/deployment.md`).
- C5. Rate limiting relies on the site running as a single application process (`docs/contact-form.md`).

**Dependencies**
- D1. Corporate SMTP credentials for sending enquiry emails (O8).
- D2. DNS access and TLS certificates for cbclik.com and www.cbclik.com (`docs/cutover-runbook.md`).
- D3. CLIK verification of external links, partner logos and OJK licence text (`docs/external-links.md`).
- D4. Legal review of the four policy/procedure pages and consent text.
- D5. Content: company video, "Formulir Permintaan Data" file, real partner logos and testimonials, migrated articles and reports.
- D6. The CMS (`docs/specs/brd-cms.md`) for news, reports, product items, vacancies and enquiries.

## 8. Open items and decisions pending

### 8.1 Open items

| # | Item | Needed from | Source |
|---|---|---|---|
| OI-01 | Business owner of this document and sign-off of this BRD | CLIK management | — (not recorded) |
| OI-02 | Confirm the proposed Must/Should/Could priorities | Product owner | this document |
| OI-03 | Business targets (enquiries, traffic, conversion) — none set | Product owner / Marketing | — |
| OI-04 | Visitor personas / research — none exists | Marketing | — |
| OI-05 | Accept up to ~1 minute delay before approved changes reach visitors | Product owner | `docs/operations.md` |
| OI-06 | **Corporate SMTP credentials** (O8). Until provided, no enquiry email reaches the sales inbox; enquiries are still saved. Agreed shape: relay everything except cbclik.com. | IT | `intent/00` O8; `docs/operations.md` |
| OI-07 | **Legal review** of Kebijakan Privasi, Kebijakan Keamanan Informasi, Cara mendapat laporan kredit, Penyelesaian Pengaduan (both languages) and the contact consent text | Legal | `docs/translation-process.md`; `docs/deferred-items.md` |
| OI-08 | Separate analytics for staging and production (O9) | IT | `intent/00` O9 |
| OI-09 | "Kenali CLIK Lebih Dekat" video address | Marketing | `docs/external-links.md` |
| OI-10 | "Formulir Permintaan Data" downloadable file | Operations | `docs/external-links.md` |
| OI-11 | Verify every "TO VERIFY" link (website, WhatsApp, Instagram, LinkedIn, OJK licence text, CRIF Global, map) and supply partner/regulator logos and links | CLIK | `docs/external-links.md` |
| OI-12 | Formal accessibility audit (none performed) | Product owner | — |
| OI-13 | Testing on real phones and tablets (none performed) | Product owner | `docs/responsive.md` |
| OI-14 | Fate of the 10 management profiles and the CEO letter from the old site | CLIK | `docs/deferred-items.md` |
| OI-15 | Availability target and uptime monitoring (none) | Product owner / IT | `docs/deferred-items.md` |
| OI-16 | Retention policy for enquiry personal data (kept permanently today) | Legal | decision 19 |
| OI-17 | **Production go-live date** — cutover is prepared but not scheduled | Product owner | `docs/phase-plan.md` Phase 6 |
| OI-18 | Job detail footer still asks candidates to email talent@cbclik.com while "Lamar" goes to JobStreet — keep or remove? | HR | `intent/02` §2.17 |
| OI-19 | Confirm Home stats (10.500+ vs 2.688 institutions) | CLIK | `intent/01` §6 |
| OI-20 | Header behaviour (O5) and footer/hover navy (O4) — assumed, not confirmed | Product owner | `intent/00` |
| OI-21 | **Redesign.** `intent/05-redesign.md` (opened 29 Sep 2026, baseline tag `baseline-pre-redesign`, commit `03f6285`) is *waiting for the new design*: no Figma link, frames or approver are recorded, and every page, shared element, feature and CMS module is still to be marked Keep / Change / Remove. This BRD describes the pre-redesign baseline and will need revision once `intent/05` is filled in. | Product owner / designer | `intent/05-redesign.md` |
| OI-22 | Replace sample content (vacancies, media coverage, placeholder logos, testimonials) before launch | CLIK | `docs/cutover-runbook.md` |

### 8.2 Differences found between the intent/documentation and the working site

| # | Difference | Detail |
|---|---|---|
| D-1 | Media coverage cards | `intent/02` §2.14 says each coverage card opens the external article in a new tab; the site instead lists internal Newsroom articles per outlet from a fixed list in code (`src/content/newsroom.ts`). |
| D-2 | Staging password | `docs/deployment.md` says staging asks for a username and password; the staging web-server configuration has no password (it relies on the server being behind NAT). |
| D-3 | Backups | `docs/deployment.md` says there is no backup of the site database yet; `docs/operations.md` documents nightly backups. |
| D-4 | Deferred list out of date | `docs/deferred-items.md` lists "Scheduled publishing and content preview" as not built and "Basic analytics" as to revisit; both now exist. |
| D-5 | Closed vacancies | Closed vacancies leave the Karir list, but an approved closed vacancy's own page still opens by direct address and is listed in the sitemap. |
| D-6 | Not-found page language | The not-found page is always in Indonesian, also under `/en`. |
| D-7 | Production address | `docs/deployment.md` gives the production address as `https://www.cbclik.com`; the cutover runbook and web-server configuration use `https://cbclik.com` (www redirects to it). |
| D-8 | Missing checklist | The cutover runbook refers to `docs/seed-data-inventory.md`, which does not exist. |

## 9. Glossary

| Term | Meaning |
|---|---|
| CLIK | PT CRIF Lembaga Informasi Keuangan, a private credit bureau |
| CRIF | The international group CLIK belongs to |
| OJK | Otoritas Jasa Keuangan — Indonesia's financial services authority, which supervises CLIK |
| CMS | Content management system — the staff area at `/admin` where news, reports, products and vacancies are published |
| Approver | The CMS role that approves content before it goes live |
| Data Masuk | "Incoming data" — the CMS list of contact-form enquiries |
| Slug | The last part of a page address, e.g. `laporan-tahunan-2023` |
| Redirect (301) | An instruction that a page has moved permanently; browsers and search engines follow it |
| Sitemap | A file listing all pages, used by search engines |
| hreflang | A tag telling search engines which pages are language versions of each other |
| Umami | Free, self-hosted website analytics tool |
| Core Web Vitals (LCP, INP, CLS, FCP, TTFB) | Standard measures of how fast and stable a page feels to real visitors |
| WIB | Western Indonesia Time (UTC+7, Jakarta) |
| Staging | The test copy of the site, not public |
| SMTP | The protocol/server used to send email |
| Mailpit | Tool on staging that captures outgoing email instead of delivering it |
| JobStreet | External job portal where applications are made |
| Rate limit | A cap on how often the same person or network can submit the form |

## Appendix — Page inventory

Addresses from `src/i18n/routes.ts`; Figma frames from `intent/02` §1.

| # | Page | Indonesian address | English address | Figma | Content source |
|---|---|---|---|---|---|
| 1 | Home | `/` | `/en` | `156:1049` | Code + CMS (latest news) |
| 2 | Tentang CLIK | `/tentang-kami` | `/en/about-us` | `333:2672` | Code |
| 3 | Laporan (list) | `/laporan` | `/en/reports` | `724:3551` | CMS (reports) |
| 4 | Laporan (detail) | `/laporan/<slug>` | `/en/reports/<slug>` | `709:3673`, `716:3800` | CMS (reports) |
| 5 | Kebijakan Keamanan Informasi | `/kebijakan-keamanan-informasi` | `/en/information-security-policy` | `743:3483` | Code |
| 6 | Kebijakan Privasi | `/kebijakan-privasi` | `/en/privacy-policy` | `955:5948` | Code |
| 7 | Layanan dan Produk | `/layanan-dan-produk` | `/en/products-and-services` | `427:2795` | Code |
| 8 | Business Solution | `/layanan-dan-produk/business-solution` | `/en/products-and-services/business-solution` | `859:4457` | Code + CMS (product items) |
| 9 | Credit Scoring | `/layanan-dan-produk/credit-scoring` | `/en/products-and-services/credit-scoring` | `859:4489` | Code + CMS (product items) |
| 10 | Cara mendapat laporan kredit | `/layanan-dan-produk/cara-mendapat-laporan-kredit` | `/en/products-and-services/how-to-get-your-credit-report` | `418:2433` | Code |
| 11 | Penyelesaian Pengaduan | `/layanan-dan-produk/penyelesaian-pengaduan` | `/en/products-and-services/complaint-resolution` | `418:2844` | Code |
| 12 | Newsroom (list, `?page=n`) | `/newsroom` | `/en/newsroom` | `305:1082`, `1661:8648` | Code (media strip) + CMS (news) |
| 13 | Berita (detail) | `/newsroom/<slug>` | `/en/newsroom/<slug>` | `556:2721` | CMS (news) |
| 14 | Liputan Media per outlet | `/newsroom/media/<outlet>` | `/en/newsroom/media/<outlet>` | `827:5603` | Code (outlets, coverage list) + CMS (news) |
| 15 | Hubungi Kami | `/hubungi-kami` | `/en/contact-us` | `284:1397` | Code; submissions → CMS |
| 16 | Karir | `/karir` | `/en/careers` | `415:2692` | Code + CMS (vacancies) |
| 17 | Lowongan (detail) | `/karir/<slug>` | `/en/careers/<slug>` | `571:3858` | CMS (vacancies) + code (footer note) |
| — | Page not found | any unknown address | — | not designed | Code |
| — | Contact success state | on Hubungi Kami | on Contact Us | not designed | Code |

News, report and vacancy slugs are the same in both languages, made from the Indonesian title (`docs/translation-process.md`).
