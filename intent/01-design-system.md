# 01 — Design System

Derived from the Figma page frames. The local styles/variables in the Figma file (prefixed `cbclik.com/…` and `wp/…`) were auto-imported from the old WordPress site by html.to.design — **do not use them as tokens**. Use the tokens below.

## 1. Typography

- **Family:** `"Nunito Sans", system-ui, sans-serif` (Google Fonts). Weights used: **400, 600, 700, 800, 900**.
- Replace every other font found in Figma (Roboto, Inter, Open Sans, Plus Jakarta Sans) with Nunito Sans at the same size/weight.
- Icons: use an SVG icon set (e.g. the social icons X, Facebook, WhatsApp, LinkedIn, Instagram). Do not load Font Awesome as a text font.

### Type scale (desktop, from the page frames)

| Token | Size / weight | Used for |
|---|---|---|
| `display` | 60px / 700 | Home hero title |
| `display-sub` | 38px / 800 | Home hero subtitle |
| `h1` | 38px / 800 | Page title under the breadcrumb ("Newsroom", "Hubungi Kami") and main section titles ("Tentang Kami", "Apa Kata Mitra Kami") |
| `h1-alt` | 38px / 700 | Section titles on About/Business Solution ("Tentang CRIF", "Credit Scoring", "Featured News") |
| `cta-title` | 38px / 900 | Closing CTA banner title |
| `h2` | 30px / 800 | Featured article title on Home news cards |
| `card-title` | 26px / 800 | Article / report card titles |
| `h3` | 24px / 700–800 | Sub-section titles ("Visi", "Misi", "Cara Kerja", product names) |
| `h3-soft` | 24px / 600 | Lead sentences and feature card titles ("Keunggulan Utama:", "Menurunkan Rasio NPL/NPF") |
| `lead` | 24px / 400 | Intro paragraphs under section titles (Figma: 23.75px — round to 24) |
| `h4` | 20px / 700 | Small headings ("Individual", "Badan Usaha", service list items) |
| `h5` | 18px / 600–700 | Step titles, "Visit Us:", product carousel text |
| `body` | 16px / 400, line-height ~1.8 (Figma: 30px) | Default paragraph text |
| `body-strong` | 16px / 700 | Nav items, list links, dates |
| `small` | 14px / 400 | Card descriptions, footer copyright |
| `button` | 14px / 700 | Buttons ("Hubungi Kami", "Pelajari selengkapnya") |
| `link-caps` | 14px / 800, uppercase | "READ MORE" |
| `caption` | 12px / 400 | Job category, logo sub-labels |
| `micro` | 10px / 400 | Footer license text |

Headings on Home are centered; page titles on inner pages are left-aligned.

## 2. Colors

| Token | Hex | Use | Figma shades merged into it |
|---|---|---|---|
| `primary` (orange) | `#FF7D00` | Buttons, accents, small divider bars above section titles, active pagination/language, icons | `#EE7D11`, `#FF7D23`, `#FF7400`, `#ED7B11` |
| `primary-light` | `#FFBB7B` | Hover/tint on orange elements, "NEW" badge background | — |
| `secondary` (navy) | `#003A79` | Headings, links, "Live" badge, pagination active, icons | `#003B79`, `#123A7A`, `#0B2F5C` (see open item O4) |
| `text-heading` | `#000000` | Page titles | `#252525`, `#21272A` |
| `text-body` | `#5B6B81` | Paragraphs | — |
| `text-muted` | `#697077` | Dates, author, meta, footer text | `#64748B`, `#4D5358` |
| `bg-page` | `#FAFAFA` | Inner-page background | — |
| `bg-surface` | `#FFFFFF` | Cards, header on inner pages | — |
| `bg-tint` | `#F1FAFF` | Light blue sections, footer background, info cards | `#F2F4F8` |
| `border` | `#DBE4F0` | Card borders, dividers | `#D9D9D9`, `#DDE1E6` |
| `disabled` | `#C1C7CD` | Disabled pagination arrow, placeholders | `#ACB8C3` |
| `overlay` | `rgba(0,0,0,0.5)` | Image overlays behind white text (hero, CTA banner, Karir hero) | — |

Status badges (products):
- **Live** — navy background, white text
- **Ready to Sell** — white background, orange border, orange text
- **NEW** — light orange background, orange text

## 3. Layout

- Design width: **1440px**. Content container ≈ **1300px** max, centered (≈70px side gutters at 1440).
- Inner page top area (from designer annotations): header → breadcrumb gap **60px**; breadcrumb → content gap **54px**; breadcrumb → page title ≈ **42px**.
- Section spacing on inner pages: a short orange bar (≈40×3px) sits above each section title.
- Cards: white, rounded corners, soft shadow, `border` color outline.
- Responsive: AI coder's judgement. Minimum expectations — stack multi-column grids to one column on mobile, turn the nav into a hamburger menu with the same dropdown structure, keep carousels swipeable, keep tables horizontally scrollable.

## 4. Shared components

| Component | Figma reference | Notes |
|---|---|---|
| **Header — dark / transparent** | `989:4062` "dark header navbar id" | Home only, overlays the hero. White text. |
| **Header — light** | `1002:4221` "Menu Header ID" | All inner pages. White background. |
| Nav items | Home · Layanan dan Produk ▾ · Tentang Kami ▾ · Newsroom · Hubungi Kami · Karir · language switch ID/EN | Logo links to Home. |
| Dropdown "Layanan dan Produk" | `951:5644` (light), `951:5633` (dark) | Items: Layanan dan Produk · Business Solution · Credit Scoring. Opens on hover. |
| Dropdown "Tentang Kami" | `953:5693` (light), `953:5680` (dark) | Items: Tentang CLIK · Laporan · Kebijakan Keamanan Informasi · Kebijakan Privasi. Opens on hover. |
| Language switch | `231:2160` | "ID \| EN"; active language in orange. Switches to the same page in the other language. |
| **Breadcrumb** | on every inner page | `Home > Section > Page`, 16px regular, `>` chevron. |
| **Footer** | `113:551` (ID), `113:552` (EN) | Light blue background. Left: logo, address, phone, email, website, social icons. Middle: "ANGGOTA DARI" member logos (AFPI, BIIA, Fintech Indonesia/AFTECH, APPI). Right: "TERDAFTAR & DIAWASI OLEH OJK" + OJK logo + license no. Bottom: copyright. All logos/links from CMS. |
| **Closing block** (cross-link card + CTA banner) | bottom of Credit Scoring `859:4489`, Business Solution `859:4457`, Home `156:1049`, About Us | Cross-link card: small label with breadcrumb-style prefix, title, image, links to another page. CTA banner: full-width image with dark overlay, title, text, orange button. Both editable per page in CMS. Either part is optional per page. |
| Article card | Newsroom, Home, Detail Berita | Image, author, date, title, excerpt (truncated), "READ MORE" link, share icon button. |
| Report card | Laporan `724:3551` | Same layout as article card. |
| Job row | Karir `415:2692` "Group 2324" | Job title, category, "Lamar" button (orange) and "Lihat Detail" button (outline). |
| Product accordion row | Credit Scoring "What We Offer" | Status badge(s), product name, short description, "+" button expands the row to show details (Figma "Expanded card" `1391:5420`). |
| Product detail card | Business Solution product sections | Product name, status badge, description, "Deskripsi", use cases per segment (Bank, Multifinance, Fintech / Digital Lender…). |
| Solution carousel card | Home "Solusi Lengkap…" | Icon, title, short text, "Lihat Selengkapnya" button; right arrow; dots. |
| Stat card | Home (`266:466` etc.) | Icon, big number, label; hover state. |
| Testimonial card | Home `627:5330` | Partner logo, quote; auto-sliding carousel with dots. |
| Media logo strip | Newsroom `Component 6` | Scrolling row of media logos. |
| Media logo grid ("Daftar Media") | Newsroom sidebar | 2-column grid of outlined logo buttons; each opens that outlet's Liputan Media page. |
| Pagination | Newsroom | Prev arrow, page numbers, next arrow; active page highlighted. |
| Share bar | Detail Berita | "Share:" + X, Facebook, WhatsApp, LinkedIn icons. |
| Back-to-top button | `461:2572` "kembali ke atas" | Floating button. |
| Buttons | "Hubungi Kami" `407:2351`, "Pelajari selengkapnya" `269:667`, "Lihat Layanan Kami" `407:2355`, "Lihat selengkapnya" `498:2862`, "Lamar" `527:2766`, "Lihat detail" `527:2770`, "Submit" `300:1788` | Each has a hover variant (Variant2) in Figma — implement hover styles to match. |

## 5. Interactions (from the prototype)

- Hero slider on Home: 3 slides, **auto-advance** (after-timeout in Figma), loops.
- Testimonial carousel on Home and image carousel on Karir hero: auto-advance.
- Solution carousel on Home: arrow button + dots.
- Dropdown menus: open on **mouse enter**.
- Nav items, buttons, stat cards, "Read More" links: **hover states**.
- Product rows: click "+" to expand/collapse.
- Newsroom pagination: changes the article list (not a separate page design).

## 6. Known design errors to fix (do not copy)

- Hero title typo: "Leading Indonesia's Intelligence Credit **Bureu**" → "Bureau".
- About Us milestone text: "Full CB **Rerport**" → "Report".
- Kebijakan Privasi breadcrumb shows "Kebijakan Keamanan Informasi" → should show "Kebijakan Privasi".
- Nav item layer named "karis" is "Karir".
- In the dark header, "Business Solution" links to Credit Scoring → should link to Business Solution.
- "Tentang Kami" top-level item has no destination → it only opens the dropdown.
- Home stat "10.500+ Lembaga keuangan" conflicts with "2.688" elsewhere → both come from CMS; keep as seed data.
- Copyright "© Copyright 2024 - CLIK" → generate the current year automatically.
