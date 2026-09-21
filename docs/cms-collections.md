# CMS collections

Seven collections. Everything else moved into `src/content/` — see
[editing content](./editing-content.md).

| Menu group | Collection | Who edits it |
| --- | --- | --- |
| Newsroom | Artikel | News Admin |
| Newsroom | Media Library | Any editor |
| Report | Laporan | News Admin |
| Product | Item Produk | Marketing Admin |
| Karir | Lowongan Pekerjaan | HR Admin |
| Data | Data Masuk | Sales Admin (read-only) |
| Data | Audit Trail | Super Admin (read-only) |
| Pengaturan | Users | Super Admin |

## Artikel

| Field | Notes |
| --- | --- |
| Judul | Bilingual, required |
| Slug | Bilingual; fills itself from the title |
| Ringkasan | Bilingual. Shown on cards, not on the article itself. |
| Isi artikel | Bilingual rich text — headings, lists, links, images, tables |
| Gambar sampul | From the media library |
| Penulis | Plain text byline |
| Tanggal publikasi | Required. Sets the order; newest first. |
| Featured News | Puts it in the Newsroom sidebar |
| SEO | Bilingual title and description |

## Laporan

| Field | Notes |
| --- | --- |
| Type | Laporan Tahunan or Laporan Perkembangan Usaha |
| Judul, Slug, Ringkasan | Bilingual |
| Tahun | Required |
| Gambar sampul | Annual reports use one; the business report has none in the design |
| Isi laporan | Bilingual rich text, including financial tables |
| Tanggal publikasi, Urutan | Optional |

## Item Produk

| Field | Notes |
| --- | --- |
| Nama produk | Bilingual |
| Kategori | One of the five fixed categories |
| Deskripsi singkat | Bilingual. The line under the name in What We Offer. |
| Deskripsi | Bilingual rich text. Shown when the row is expanded. |
| Status | Live or Ready to Sell |
| NEW badge | Checkbox |
| Use cases | Repeating rows: segment and how it is used |
| Urutan | Lower numbers first |

The five categories live in `src/content/products.ts`. Adding a category is a
code change; adding a product is not.

## Lowongan Pekerjaan

| Field | Notes |
| --- | --- |
| Nama posisi, Slug | Bilingual title |
| Kategori | One of three fixed categories |
| Responsibilities, Qualifications, Education | Bilingual rich text |
| Apply email | Defaults to talent@cbclik.com |
| Format subjek email | Shown under "Please mention on Subject E-mail" |
| Lowongan masih dibuka | **Only checked vacancies appear on the site** |

## Shared behaviour

Every content collection carries:

- **Bilingual fields** — Indonesian and English, with an Auto-translate button
- **Approval workflow** — Draft → In Review → Approved, rejection needs a reason
- **Preview** — see the item as it will look, before approving
- **Revision history** — 25 versions, restorable
- **Audit logging** — every submit, approve, reject and delete

## Data Masuk and Audit Trail

Both read-only. Contact submissions can never be edited or deleted by anyone;
only the "followed up" flag changes. The audit trail is written by hooks.

## Preview

Every item with a public page has a **Preview** button in the admin: articles,
reports and vacancies. It opens the item on the real site, styled exactly as a
visitor will see it, **before it is approved**.

Product items have no page of their own — they appear inside Credit Scoring —
so their preview opens that page.

Preview is restricted: the link carries a secret, and the route also checks
the reader is a signed-in CMS user. An anonymous visitor following a preview
URL gets a 403, and a draft never appears in a public list, on its own URL, or
in sitemap.xml.

This is verified, not assumed: an unapproved draft returns 404 publicly and
renders in full under preview.
