# 02 — Website Pages

All pages: header (light, except Home) → breadcrumb → page content → footer. Every text below is **seed content from Figma** (Indonesian); English versions are AI-translated. "CMS:" marks content that must come from the CMS (models in `03-cms.md`).

## 1. Sitemap and routes

Indonesian is the default language (no prefix); English uses the `/en` prefix. English slugs below are a proposal (open item O6).

| Page | Figma | ID route | EN route |
|---|---|---|---|
| Home | `156:1049` | `/` | `/en` |
| Tentang CLIK (About Us) | `333:2672` | `/tentang-kami` | `/en/about-us` |
| Laporan (list) | `724:3551` | `/laporan` | `/en/reports` |
| Laporan detail | `709:3673`, `716:3800` | `/laporan/[slug]` | `/en/reports/[slug]` |
| Kebijakan Keamanan Informasi | `743:3483` | `/kebijakan-keamanan-informasi` | `/en/information-security-policy` |
| Kebijakan Privasi | `955:5948` | `/kebijakan-privasi` | `/en/privacy-policy` |
| Layanan dan Produk | `427:2795` | `/layanan-dan-produk` | `/en/products-and-services` |
| Business Solution | `859:4457` | `/layanan-dan-produk/business-solution` | `/en/products-and-services/business-solution` |
| Credit Scoring | `859:4489` | `/layanan-dan-produk/credit-scoring` | `/en/products-and-services/credit-scoring` |
| Cara mendapat laporan kredit | `418:2433` | `/layanan-dan-produk/cara-mendapat-laporan-kredit` | `/en/products-and-services/how-to-get-your-credit-report` |
| Penyelesaian Pengaduan | `418:2844` | `/layanan-dan-produk/penyelesaian-pengaduan` | `/en/products-and-services/complaint-resolution` |
| Newsroom (paginated) | `305:1082` (p1), `1661:8648` (p2) | `/newsroom?page=n` | `/en/newsroom?page=n` |
| Detail Berita | `556:2721` | `/newsroom/[slug]` | `/en/newsroom/[slug]` |
| Liputan Media (per outlet) | `827:5603` | `/newsroom/media/[outlet]` | `/en/newsroom/media/[outlet]` |
| Hubungi Kami | `284:1397` | `/hubungi-kami` | `/en/contact-us` |
| Karir | `415:2692` | `/karir` | `/en/careers` |
| Detail Lowongan | `571:3858` | `/karir/[slug]` | `/en/careers/[slug]` |

Also required: 404 page and a success/thank-you state for the contact form (not designed — follow the design system).

**Out of scope:** Kebijakan Pengguna `1015:4098`, Frame 2425 `1612:8739`, `html.to.design` sections.

### Navigation map (from the prototype)

- Header: Home → `/`; Newsroom → `/newsroom`; Hubungi Kami → `/hubungi-kami`; Karir → `/karir`.
- Layanan dan Produk ▾ → Layanan dan Produk / Business Solution / Credit Scoring.
- Tentang Kami ▾ → Tentang CLIK / Laporan / Kebijakan Keamanan Informasi / Kebijakan Privasi.
- Home: "Pelajari selengkapnya" (About snippet) → About Us; "LIHAT SELENGKAPNYA" (news) → Newsroom; "Hubungi Kami" (CTA) → Contact; solution cards "Lihat Selengkapnya" → matching product page/section.
- About Us: milestone "Pelajari selengkapnya" → Laporan Perkembangan Usaha detail.
- Layanan dan Produk: "Lihat Selengkapnya"/"Pelajari selengkapnya" → Credit Scoring (and other solution pages/sections); "Cek Laporan Kredit Anda → Pelajari Caranya" → Cara mendapat laporan kredit; "Penyelesaian Pengaduan → Pelajari Caranya" → Penyelesaian Pengaduan.
- Business Solution: Credit Scoring "Pelajari selengkapnya" → Credit Scoring page; "Hubungi Kami" → Contact.
- Credit Scoring: "Hubungi Kami" → Contact; cross-link card → Business Solution.
- Newsroom: article "Read More" → Detail Berita; media logo → Liputan Media for that outlet.
- Laporan: "Read More" → report detail.
- Karir: "Lihat Detail" → Detail Lowongan; "Lamar" → email (see `04`).

---

## 2. Page specs

### 2.1 Home — `156:1049`

1. **Hero slider** (full-width, ~860px tall, dark header overlaid). CMS: hero slides. Seed title "Leading Indonesia's Intelligence Credit Bureau", subtitle "Data, Insights, and Recommendation". Curved bottom edge. Auto-advancing, 3 slides.
2. **Tentang Kami snippet** — title "Tentang Kami", paragraph "PT CLIK (CRIF Indonesia) adalah biro kredit swasta berizin OJK…", orange button "Pelajari selengkapnya" → About Us. Light blue card.
3. **Trust bar** — shield icon "TERDAFTAR & DIAWASI OLEH OJK • Bagian dari jaringan CRIF Global", OJK logo + license number.
4. **Stats** — 3 cards: "37 Negara jaringan CRIF", "10.500+ Lembaga keuangan", "1jt+ Konsumen tercakup". CMS: homepage stats (Marketing Admin).
5. **Solusi Lengkap untuk Setiap Kebutuhan Bisnis Anda** — intro text; carousel of solution cards (Credit Scoring, Analytics, Decisioning, …) with icon, short text, "Lihat Selengkapnya". CMS: product categories.
6. **Apa Kata Mitra Kami** — subtitle "Kepercayaan lebih dari 2.688 lembaga…"; testimonial carousel. CMS: testimonials.
7. **Berita Terbaru Kami** — subtitle; 3 latest articles; orange button "LIHAT SELENGKAPNYA" → Newsroom. CMS: articles.
8. **Closing CTA banner** — "Siap Mengoptimalkan Keputusan Kredit Bisnis Anda?", button "Hubungi Kami" → Contact. CMS: CTA block.
9. Footer.

### 2.2 Tentang CLIK (About Us) — `333:2672`

Breadcrumb: Home > Tentang Kami.
1. Title "Tentang CLIK", image, intro paragraph "PT CRIF Lembaga Informasi Keuangan (CLIK) adalah Biro Kredit Swasta…".
2. Highlight: "2,688 Financing and non financing institutions", lead "Mendorong Keputusan Kredit yang Lebih Cerdas…", paragraph.
3. **Visi** (image + text) and **Misi** (image + text).
4. **Kenali CLIK Lebih Dekat** — video placeholder (600px tall). CMS: video URL (embed) or file.
5. **Pencapaian Perusahaan Kami** — horizontal timeline 2019–2025 with items per year. CMS: milestones.
6. Report teaser (2022 business development text) with "Pelajari selengkapnya" → Laporan Perkembangan Usaha detail.
7. **Member CLIK** logo strip. CMS: partner logos.
8. **Tentang CRIF** — image + long text + "Pelajari selengkapnya" (external CRIF link, see `04`).
9. Closing CTA: "Siap Membangun Ekosistem Kredit yang Lebih Kuat Bersama Kami?" + "Hubungi Kami".
10. Footer.

### 2.3 Laporan (list) — `724:3551`

Breadcrumb: Home > Laporan. Title "Laporan". Grid of report cards (3 per row on desktop): Laporan Tahunan 2025 / 2024 / 2023, Laporan Perkembangan Usaha PT CLIK. Pagination. CMS: reports.

### 2.4 Laporan detail — `709:3673` (annual), `716:3800` (business development)

Breadcrumb: Home > Laporan > [title]. Cover image with title, long rich-text body including images and financial statement tables (e.g. "LAPORAN LABA RUGI 31 Desember 2025 (Rp)"). The business-development variant has no cover image and two text sections ("Progres Pengembangan Usaha…", "Laporan Manajemen"). CMS: report body (rich text with images and tables).

### 2.5 Kebijakan Keamanan Informasi — `743:3483`

Breadcrumb + title. Sections separated by orange bars: Tujuan, Ruang Lingkup, Komitmen Manajemen Puncak, Kebijakan Prinsip. Long-form text (see open item O7 for who edits it).

### 2.6 Kebijakan Privasi — `955:5948`

Breadcrumb (fix label) + title "Kebijakan Privasi". Long legal text "Pemberitahuan Privasi — Terakhir Diperbarui: 14/08/2026 …". Show "last updated" date from CMS. See O7.

### 2.7 Layanan dan Produk — `427:2795`

Breadcrumb: Home > Layanan dan Produk.
1. Title, image, lead "CLIK menghadirkan ekosistem solusi berbasis data…", paragraph.
2. **Layanan Kami** — solution cards (Credit Scoring, Analytics, …) with "Lihat Selengkapnya". CMS: product categories.
3. **Data list** (two columns): Data Identifikasi dan Rincian Kontak, Obligasi, Data Perusahaan…, Surat Kredit, Rincian Pinjaman & Pembayaran Aktif, Data Jaminan, Rincian Kartu Kredit…, Informasi Penjamin.
4. **Apa itu skor kredit?** — image + two paragraphs + "Pelajari selengkapnya" → Credit Scoring.
5. **Ingin Mengecek atau Melaporkan Data Kredit Anda?** — two cards: "Cek Laporan Kredit Anda" → how-to page; "Penyelesaian Pengaduan" → complaint page; each with "Pelajari Caranya →".
6. Footer.

### 2.8 Business Solution — `859:4457`

Breadcrumb: Home > Layanan dan Produk > Business Solution.
1. Title, image, heading "Solusi Informasi Keuangan dan Analisis Risiko…", intro.
2. One section per solution category, in this order: **Credit Scoring, Analytics, Decisioning, Business Intelligence, Consulting**. Each section: image, title, lead sentence, description, link button ("Pelajari selengkapnya" for Credit Scoring → its page; "Lihat Semua Produk →" for others, expands/scrolls to its product list).
3. For Analytics, Decisioning, Business Intelligence, Consulting: **Keunggulan Utama** (advantage cards) + **product cards** with status badges (e.g. Scoremart — Live; Credit Policy / Simple Decision; Dashboard; POC / Trial & Retro Analysis — Ready to Sell).
4. Closing: "Wujudkan keputusan bisnis yang lebih presisi…" + "Hubungi Kami".
5. Footer.
CMS: product categories + product items. Full product list seed (from Figma text node `1331:4307`):
- Business Intelligence: Dashboard (Live), General Dashboard (Ready to Sell), Credit Card Static Report (Ready to Sell), Credit Card Interactive Report (Ready to Sell), Portfolio Alert (Live)
- Credit Scoring: Full Report, Slim Report, Soft Pull Report, Compliance Report, Unified Report (all Live), Aggregated Variable Calculation (AVC) (Ready to Sell), Fintech Bureau (FDC) (Ready to Sell, NEW), Generic CB Score (CBG) (Live), CLIK SKAI Score (Live, NEW), CLIK Spectrum Score (CSS) (Live, NEW), Fintech CB Score (Live), Application Score (Live), Score Factor (Live)
- Analytics: Scoremart (Live, NEW), Portfolio Risk Insight (PRI / InsightCollect) (Live), Custom Industry Reports (Live)
- Decisioning: Credit Policy / Simple Decision, Application Score Hosting, Data Connectivity & Orchestration (all Ready to Sell), Sandbox (Ready to Sell, NEW)
- Consulting: POC / Trial & Retro Analysis (NEW), Portfolio Management / Cross-Sell / Stress Test (NEW), Custom Score Development (NEW), Solutions in Partnership with CRIF (NEW) — all Ready to Sell

### 2.9 Credit Scoring — `859:4489`

Breadcrumb: Home > Layanan dan Produk > Credit Scoring.
1. Title; hero with heading "Keputusan Kredit yang Lebih Cerdas, Lebih Cepat, Lebih Terpercaya." + "Hubungi Kami" button + image.
2. **Apa Itu CLIK Credit Scoring?** — text + illustration.
3. **Fitur Utama & Keunggulan** — cards: Terdaftar & Diawasi oleh OJK; Model Skor Kredit Proprietary (score gauge A–J graphic); Keamanan Data Terjamin; Dukungan Profesional; Real-Time Processing; Cakupan Data yang Luas; Kepatuhan Regulasi.
4. **Cara Kerja** — 4 numbered steps with illustrations: Integrasi API → Pengiriman Data Permohonan → Pemrosesan & Analisis → Penerimaan Skor Kredit.
5. **Manfaat untuk Lembaga Keuangan** — 4 cards: Menurunkan Rasio NPL/NPF; Mempercepat Proses Underwriting; Memperluas Jangkauan Segmen; Efisiensi Operasional.
6. **What We Offer** — subtitle "Satu skor, satu laporan, satu keputusan…"; accordion list of Credit Scoring products with badges; expanded row shows description and use cases (Bank / Multifinance / Fintech…). CMS: product items in category Credit Scoring.
7. Closing block: text "Temukan solusi yang sesuai dengan kebutuhan bisnis Anda." + cross-link card → Business Solution; CTA banner "Siap Meningkatkan Akurasi dan Kecepatan Keputusan Kredit Anda?" + "Hubungi Kami".
8. Footer.

### 2.10 Cara mendapat laporan kredit — `418:2433`

Breadcrumb: Home > Layanan dan Produk > [title]. Intro (visit the office), note on individual checks, two columns **Individual** (KTP / Passport, request form) and **Badan Usaha** (NPWP, legal documents, request form). "Formulir Permintaan Data" should link to a downloadable form (file from CMS or TODO).

### 2.11 Penyelesaian Pengaduan — `418:2844`

Breadcrumb + title. Long-form text on how debtors submit complaints. See O7.

### 2.12 Newsroom — `305:1082` / `1661:8648`

Breadcrumb: Home > Newsroom. Title "Newsroom".
1. **Media logo strip** (scrolling). CMS: media outlets.
2. Left sidebar: **Featured News** (list of article title links with orange bullets; CMS flag `featured`) and **Daftar Media** (grid of outlet logos → Liputan Media).
3. Right: article cards grid (2 columns on desktop, 6 per page), newest first.
4. Pagination.

### 2.13 Detail Berita — `556:2721`

Breadcrumb: Home > Newsroom > [title]. Cover image, title (38/800), date, "Share:" icons (X, Facebook, WhatsApp, LinkedIn — share current URL), divider, rich-text body, **Anda mungkin juga tertarik dengan** (3 related/latest articles).

### 2.14 Liputan Media — `827:5603`

Breadcrumb: Home > Newsroom. Title "Newsroom", then the outlet name (e.g. "Kumparan") and heading "Liputan Media". Same sidebar as Newsroom. Main area: coverage cards for that outlet; each card opens the **external article** in a new tab. Pagination.

### 2.15 Hubungi Kami — `284:1397`

Breadcrumb: Home > Hubungi Kami. Title.
1. Left: intro text; contact form (fields in `04`). Right: "Visit Us:" address, "E-mail Us: info@cbclik.com", "Call Us: (+62) 21 8060 4228", company name, embedded map (Menara Dea Tower 2, Jakarta).
2. **DATA PRIVACY** — consent text, mandatory consent checkbox, marketing preference checkboxes, "Submit" button.
3. Footer. Contact details come from CMS site settings.

### 2.16 Karir — `415:2692`

1. Hero: title "Bertumbuh Bersama CLIK Membangun Ekosistem Kredit Indonesia", subtitle, full-width auto-sliding image carousel with wave edges.
2. **Nilai-nilai kami** — 4 values (Supporting Trust & Passion; Thinking Outside the Box; Pursuing Excellence; Embracing Diversity), each with subtitle and text.
3. **Lowongan Pekerjaan** — job rows (title, category, "Lamar", "Lihat Detail"). Only open jobs. Text below: "Tidak menemukan posisi yang sesuai? Kirimkan kami CV Anda ke talent@cbclik.com".
4. **Benefits** — Asuransi Kesehatan, Pengembangan Skill, Jenjang Karir, Jam Kerja Fleksibel.
5. **Proses Rekrutmen** — 5 steps: Screening CV, Interview HR, Interview User, Pengecekan Credit Score, Penawaran.
6. Footer.
CMS: all sections (Karir page content + job openings), managed by HR Admin.

### 2.17 Detail Lowongan — `571:3858`

Breadcrumb: Home > Karir > Detail pekerjaan. Title "Detail pekerjaan". Job title, category, "Lamar" button, "bagikan" (share). Sections separated by orange bars: Key Responsibilities, Minimum Qualifications, Education. Footer note "Email to: talent@cbclik.com — Please mention on Subject E-mail: …" (subject format from CMS).
