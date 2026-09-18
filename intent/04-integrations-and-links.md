# 04 — Integrations, Contact Form, Translation and Links

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
6. If the email fails, the submission is still saved; log the error and retry.

### Rate limits

| Rule | Limit | Key |
|---|---|---|
| Same contact | **3 submissions per 24 hours** | same email **or** same phone number |
| Same device/network | **5 submissions per hour** | IP address (+ device fingerprint/cookie if available) |

- No CAPTCHA.
- Limit message (ID): "Anda sudah mengirim pesan. Tim kami akan segera menghubungi Anda." — EN: "You have already sent us a message. Our team will contact you soon."
- Store counters server-side (not only in the browser).

## 2. Career applications

- "Lamar" button (Karir list and Detail Lowongan) opens `mailto:talent@cbclik.com` with the subject pre-filled from the job's `email_subject_format` and job title.
- No application form or file upload on the website.
- The "Tidak menemukan posisi yang sesuai?" note links to `mailto:talent@cbclik.com`.

## 3. Share buttons

- Detail Berita: X, Facebook, WhatsApp, LinkedIn — use each platform's standard share URL with the current page URL and title.
- Article/report cards and Detail Lowongan ("bagikan"): use the Web Share API where available, otherwise copy link.

## 4. Translation

- Indonesian is the source language. English is produced by **AI translation** and reviewed manually by the team afterwards.
- Website UI strings: keep in locale files (`id`, `en`); generate `en` by AI translation.
- CMS content: "Auto-translate" action per item (see `03`).
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

None of these are set in the Figma prototype. The AI coder finds the official URLs, stores them in CMS (Site Settings / Partner Logos), opens them in a new tab, and marks each one **TO VERIFY** until the team confirms.

| Where | Link | Value | Status |
|---|---|---|---|
| Footer | Website | https://www.cbclik.com | TO VERIFY |
| Footer, Contact | Email | mailto:info@cbclik.com | Confirmed (from design) |
| Footer, Contact | Phone | tel:+622180604228 | Confirmed (from design) |
| Contact | Map | Google Maps — Menara Dea Tower 2, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950 | TO VERIFY |
| Footer | Social icons (3 shown in design — identify platforms) | CLIK official accounts | TO VERIFY |
| Footer, Home trust bar | OJK logo | Official OJK website | TO VERIFY |
| Footer | AFPI logo | Official AFPI website | TO VERIFY |
| Footer | BIIA logo | Official BIIA website | TO VERIFY |
| Footer | Fintech Indonesia (AFTECH) logo | Official AFTECH website | TO VERIFY |
| Footer | APPI logo | Official APPI website | TO VERIFY |
| Home trust bar, About Us "Tentang CRIF → Pelajari selengkapnya" | CRIF Global | Official CRIF website | TO VERIFY |
| Newsroom, Liputan Media | Media outlet logos / coverage cards | Per item, set in CMS | Sample data |
| About Us | "Kenali CLIK Lebih Dekat" video | Video URL, set in CMS | TODO |
| Cara mendapat laporan kredit | "Formulir Permintaan Data" | File upload in CMS | TODO |
| Karir, Detail Lowongan | Lamar | mailto:talent@cbclik.com | Confirmed |
| Contact form | Recipient | sales@cbclik.com | Confirmed |

Keep a single `external-links` checklist (e.g. in the README of the code repo or an admin page) listing every link and its status.
