# 05 — Redesign: what stays, changes or goes

**Status: waiting for the new design.** Opened 29 September 2026 against the
baseline tag `baseline-pre-redesign` (commit `03f6285`).

This file is filled in **before any code changes**. Mark every row below
**Keep**, **Change** or **Remove**, add the new Figma frame for anything that
changes, and list anything new at the end. Decisions made here are also added
to the decision log in `00-README.md`, as for any other change of intent.

## New design source

| | |
|---|---|
| Figma file | _(link)_ |
| Frames covered | _(list)_ |
| Agreed by | _(product owner, date)_ |

## 1. Pages

Each page is one layout serving both languages (see `docs/editing-content.md`).

| Page | Indonesian address | English address | Keep / Change / Remove | New frame / notes |
|---|---|---|---|---|
| Home | `/` | `/en` | | |
| Tentang Kami | `/tentang-kami` | `/en/about-us` | | |
| Layanan dan Produk | `/layanan-dan-produk` | `/en/products-and-services` | | |
| Business Solution | `/layanan-dan-produk/business-solution` | `/en/products-and-services/business-solution` | | |
| Credit Scoring | `/layanan-dan-produk/credit-scoring` | `/en/products-and-services/credit-scoring` | | |
| Cara mendapat laporan kredit | `/layanan-dan-produk/cara-mendapat-laporan-kredit` | `/en/products-and-services/how-to-get-your-credit-report` | | |
| Penyelesaian Pengaduan | `/layanan-dan-produk/penyelesaian-pengaduan` | `/en/products-and-services/complaint-resolution` | | |
| Laporan (list) | `/laporan` | `/en/reports` | | |
| Laporan (detail) | `/laporan/<slug>` | `/en/reports/<slug>` | | |
| Newsroom (list) | `/newsroom` | `/en/newsroom` | | |
| Berita (detail) | `/newsroom/<slug>` | `/en/newsroom/<slug>` | | |
| Liputan Media per outlet | `/newsroom/media/<outlet>` | `/en/newsroom/media/<outlet>` | | |
| Karir (list) | `/karir` | `/en/careers` | | |
| Lowongan (detail) | `/karir/<slug>` | `/en/careers/<slug>` | | |
| Hubungi Kami | `/hubungi-kami` | `/en/contact-us` | | |
| Kebijakan Keamanan Informasi | `/kebijakan-keamanan-informasi` | `/en/information-security-policy` | | |
| Kebijakan Privasi | `/kebijakan-privasi` | `/en/privacy-policy` | | |

## 2. Shared elements

| Element | Where | Keep / Change / Remove | Notes |
|---|---|---|---|
| Header (transparent on Home, white elsewhere, sticky) | every page | | |
| Menu dropdowns | header | | |
| `ID \| EN` language switch | header | | |
| Breadcrumb | inner pages | | |
| Footer (address, member logos, OJK, social) | every page | | |
| Closing block (cross-link card + CTA banner) | most pages | | |
| Moving logo / photo strips | Home, Newsroom, Karir | | |
| Back-to-top button | every page | | |

## 3. Features

| Feature | Where | Keep / Change / Remove | Notes |
|---|---|---|---|
| Contact form, rate limits, email to sales | Hubungi Kami | | |
| Newsroom pagination (6 per page) | Newsroom | | |
| Featured News (newest eight) | Newsroom | | |
| "Anda mungkin juga tertarik dengan" (related) | Berita detail | | |
| Media coverage by outlet | Newsroom | | |
| Financial tables in reports | Laporan detail | | |
| Product accordion with status badges | Credit Scoring, Business Solution | | |
| Lamar → JobStreet; CV email note | Karir | | |
| Scheduled publishing by date | News, reports | | |
| Preview and Live Preview | CMS | | |
| Website analytics (Umami) and CMS dashboard | site + CMS | | |

## 4. CMS modules

Removing a CMS module means a database migration and a decision about its
existing content (export, move or discard). It is not a design-only change.

| Module | Content today | Keep / Change / Remove | Notes |
|---|---|---|---|
| Berita (news) | 11 items | | |
| Laporan (reports) | 7 items | | |
| Produk (product items) | 30 items | | |
| Karir (job vacancies) | 6 items | | |
| Data Masuk (enquiries) | contact form submissions | | |
| Log Audit, Pengguna, Dashboard | — | | |

## 5. New in the redesign

| Page / feature | Figma frame | Needs the CMS? | Notes |
|---|---|---|---|
| | | | |

## Rules for what is removed

- **An address that disappears gets a 301 redirect** to its nearest
  replacement, so bookmarks, old links and search results still land
  somewhere. Nothing that was public returns a 404 without a decision.
- A removed page also leaves the menu, the footer, the sitemap and the
  address table in `src/i18n/routes.ts`; its wording leaves `src/content/`.
- A removed feature takes its CMS fields with it only through a written
  migration, after its content has been dealt with.
- `docs/redesign-playbook.md` has the step-by-step for each case.
