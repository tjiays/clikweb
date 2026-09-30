# 04 — Integrations, Contact Form, Translation and Links

**Revised 28 September 2026.** Changed since the original: careers apply goes to JobStreet (§2), share buttons are removed (§3), translation works on side-by-side fields (§4), external links live in code (§5), and website analytics is new (§6). See the decision log in `00-README.md`.

## 1. Contact form (Hubungi Kami, `284:1397`)

### Fields (from Figma; all required unless noted)

| Field | Type | Notes |
|---|---|---|
| First name | text | |
| Last name | text | |
| Business Email | email | validated |
| Telephone | tel | validated; normalise to E.164 (+62…) for rate limiting |
| Company Name | text | |
| Interested in | select | Business Information · Business Analytics · Business Solutions · Market Research · CRIF PLUS Membership Programme · Credit Bureau · General Enquiries |
| How did you hear about us? | select | Conference/Exhibition · Flyer/Leaflet · Google Search · Magazine · Referral · Social Media · Webinar · Other |
| Tell us about your business needs (Message) | textarea | |
| Consent to respond to your contact request | checkbox (**mandatory**) | Text from "PERSETUJUAN UNTUK MERESPONS PERMINTAAN KONTAK ANDA (WAJIB)" |
| Marketing channels | checkboxes (optional) | Pesan teks (SMS/WhatsApp) · Panggilan telepon · Email · Buletin (Newsletter) |
| Marketing preference | choice (optional) | "Saya ingin menerima informasi…" / "Saya tidak ingin menerima informasi pemasaran apa pun" |

Also store: submitted language, page URL, timestamp, IP address, user agent, consent text version.

### On submit

1. Validate on client and server; show field errors inline.
2. Check rate limits (below). If exceeded, do not store or send; show the limit message.
3. **Save** the submission in the database (visible in CMS → Data Masuk; kept permanently).
4. **Send an email** to **sales@cbclik.com** containing all fields. Reply-To = the submitter's email.
5. Show a success message on the page.
6. If the email fails, the submission is still saved; log the error.

In the CMS each submission has a follow-up status, **Baru** (new) or **Ditindaklanjuti** (followed up), set by Sales Admin. Setting Ditindaklanjuti records who did it and when.

**Mail on staging** is captured by Mailpit (`/mailpit/`) and never delivered. Real SMTP credentials are needed before launch (open item O8).

### Rate limits

| Rule | Limit | Key |
|---|---|---|
| Same contact | **3 submissions per 24 hours** | same email **or** same phone number |
| Same device/network | **5 submissions per hour** | IP address (+ device fingerprint/cookie if available) |

- No CAPTCHA.
- Limit message (ID): "Anda sudah mengirim pesan. Tim kami akan segera menghubungi Anda." — EN: "You have already sent us a message. Our team will contact you soon."
- Store counters server-side (not only in the browser).

## 2. Career applications

- **Revised:** "Lamar" (Karir list and Detail Lowongan) opens **CLIK's JobStreet company page** in a new tab: `https://id.jobstreet.com/id/companies/crif-lembaga-informasi-keuangan-168557222859016/jobs`. Each vacancy may carry its own link; left empty, it uses the company page. The company page was chosen over per-role links because the roles listed on JobStreet are not the ones on the site.
- No application form or file upload on the website.
- The "Tidak menemukan posisi yang sesuai?" note links to `mailto:talent@cbclik.com`.
- This is a link only. Synchronising vacancies with JobStreet (BRD FR-038 – FR-040) is not built.

## 3. Share buttons

**Removed.** The site has no share buttons — not on articles, cards or vacancies. (Originally: X, Facebook, WhatsApp and LinkedIn on Detail Berita, and the Web Share API elsewhere.)

## 4. Translation

- Indonesian is the source language. English is produced by **AI translation** and reviewed manually by the team afterwards.
- Website UI strings: keep in locale files (`id`, `en`); generate `en` by AI translation.
- CMS content: each item is written in both languages side by side. The **Auto-translate** button (news and reports only) drafts empty English fields from the Indonesian, using Claude through `ANTHROPIC_API_KEY`. The glossary and do-not-translate list below are built into it. See `03` §4.
- Glossary (keep consistent):

| Indonesian | English |
|---|---|
| biro kredit | credit bureau |
| lembaga keuangan | financial institution |
| lembaga non-keuangan | non-financial institution |
| laporan kredit | credit report |
| skor kredit | credit score |
| penyelesaian pengaduan | complaint resolution |
| Layanan dan Produk | Products & Services |
| Tentang Kami | About Us |
| Karir | Careers |
| Hubungi Kami | Contact Us |
| Laporan Tahunan | Annual Report |
| Terdaftar & Diawasi oleh OJK | Registered & Supervised by OJK |

- Never translate: CLIK, CRIF, OJK, AFPI, AFTECH, APPI, BIIA, product names (Full Report, CLIK SKAI Score, …), company legal name.
- Legal pages (Kebijakan Privasi, Kebijakan Keamanan Informasi, Penyelesaian Pengaduan) must be flagged "needs legal review" after translation.

## 5. External links

**Revised:** none of these are set in the Figma prototype. The AI coder found the official URLs and stored them **in code** (`src/content/site.ts`, `src/content/partners.ts`), not in the CMS. Each is marked **TO VERIFY** until the team confirms it. The live register is `docs/external-links.md`.

| Where | Link | Value | Status |
|---|---|---|---|
| Footer | Website | https://www.cbclik.com | TO VERIFY |
| Footer, Contact | Email | mailto:info@cbclik.com | Confirmed (from design) |
| Footer, Contact | Phone | tel:+622180604228 | Confirmed (from design) |
| Contact | Map | Google Maps embed — Menara Dea Tower 2, Mega Kuningan | Implemented, TO VERIFY |
| Footer | Social icons | WhatsApp, Instagram, LinkedIn (platforms confirmed from the Figma icons) | URLs TO VERIFY |
| Footer | OJK licence | NO. KEP-179/D.03/2019 | TO VERIFY |
| Footer, Home trust bar | OJK, AFPI, BIIA, AFTECH, APPI logos | Left blank on purpose until confirmed | TODO |
| Home trust bar, About Us "Tentang CRIF" | CRIF Global | https://www.crif.com | TO VERIFY |
| Newsroom, Liputan Media | Media outlets and coverage | In code, `src/content/newsroom.ts` | Sample data |
| About Us | "Kenali CLIK Lebih Dekat" video | Not supplied | TODO |
| Cara mendapat laporan kredit | "Formulir Permintaan Data" | File not supplied | TODO |
| Karir, Detail Lowongan | Lamar | JobStreet company page (§2) | Checked live 23 Sep |
| Karir | CV note | mailto:talent@cbclik.com | Confirmed |
| Contact form | Recipient | sales@cbclik.com | Confirmed |

## 6. Website analytics

**New.** Measured with **Umami**, self-hosted on the same server, so visitor data never leaves CLIK's infrastructure. Chosen over Google Analytics because it is free, keeps data at home (which matters for a credit bureau), sets no cookies, and needs no consent banner.

- The tracking script loads on the **public site only**, never on the CMS or on previews.
- It records page views, visitors, referrers and real-user page speed (LCP, INP, CLS, FCP, TTFB).
- The CMS dashboard reads it server-side (see `03` §7). Umami's own screens are at `/analytics`.
- **Known limitations:** time on page is the time until the visitor opens their next page, so a tab left open counts as reading. (Stored times were 7 hours early because PostgreSQL runs on Jakarta time; fixed 29 September, history corrected.) Staging and production would share one analytics site unless split (open item O9).

Details: `docs/analytics.md`.
