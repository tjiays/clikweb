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
| Isi artikel | Bilingual rich text — headings, lists, links, images, tables. Optional. |
| Gambar sampul | From the media library |
| Gambar banner | Optional 1300x372 image on the article page; falls back to the cover |
| Penulis | Plain text byline |
| Tanggal publikasi | Required. Sets the order; newest first, then the later time. |
| Featured News | Puts it in the Newsroom sidebar |
| Posisi di Featured News | Numbers, one per place in the sidebar list; an article may hold several |
| Sembunyikan dari daftar | Keeps it off the Newsroom cards, Home and the related list; the page stays |
| Anda mungkin juga tertarik dengan | Up to 3 related articles, in order; empty = newest |
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

## The rich text editor

One editor config serves every long-form field — articles, reports, product
descriptions and job specs. It lives in `src/fields/editor.ts` and is set as
the project-wide default in `src/payload.config.ts`, so a `richText` field
picks it up without asking.

Two choices are deliberate:

- **The toolbar is fixed, not floating.** Payload's default only appears once
  text is selected, which leaves an editor looking at an empty box with no
  visible controls.
- **Tables are switched on explicitly.** `EXPERIMENTAL_TableFeature` is not in
  the default feature set. The annual reports need it for their financial
  statements.

Payload's stock JSX converters drop three things this toolbar can produce, so
`src/components/ui/richTextConverters.tsx` replaces them:

| Converter | Why it is overridden |
| --- | --- |
| `paragraph`, `heading` | The stock ones ignore `node.format`, so alignment and indent never reached the page. |
| `table`, `tablecell`, `tablerow` | The stock cell hardcodes an inline `border: 1px solid #ccc`; an inline style beats the stylesheet, so CLIK tables rendered grey. These emit no inline borders and let `RichText.module.css` own the look. |
| `upload` | Renders `<figure>` + `<figcaption>` so the **Keterangan gambar** field on an inserted image has somewhere to go, and turns a non-image upload into a download link. |

Inserted images use a plain `<img>`, not `next/image`: they land at arbitrary
points in the flow with no layout to size against, and the Payload media URL
would otherwise need its own `localPatterns` entry in `next.config.ts` (see
`docs/editing-content.md`).

**Changing the feature list requires `npx payload generate:importmap`.** The
admin loads each feature's client component through
`src/app/(payload)/admin/importMap.js`; a feature missing from that map is
silently absent from the toolbar at runtime, even though the build succeeds.

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
