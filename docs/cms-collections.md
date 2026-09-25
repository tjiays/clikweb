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
- **Audit logging** — every create, update, submit, approve, reject and delete

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

## Live Preview

Articles and reports show the real public page in a pane beside the editing
form, at desktop, tablet and phone widths. It is wired in `contentCollection()`
from the same `preview` option that drives the old open-in-a-tab button, so a
collection gets both or neither (`src/lib/preview.ts`).

Two details are deliberate:

- **The URL is relative.** Staging answers on more than one address (LAN and
  Tailscale). An absolute URL from an environment variable would point the
  iframe at whichever host was configured rather than the one the editor is
  on — a different origin, so the draft-mode cookie would not be sent and the
  pane would show the published version instead of the draft.
- **The pane refreshes on save, not on every keystroke.** The pages are
  server-rendered from the database, so there is no client-side state to patch
  field by field. `src/components/ui/RefreshOnSave.tsx` asks Next to refetch
  the route, which shows exactly what a reader would get. It loads only when
  draft mode is on, so the public site never downloads it.

`url` returns `null` until the document has a slug, so a brand-new empty
document does not try to preview a page that has no address yet.

## Media Library

Its own menu group, not filed under Newsroom. Articles, reports, products and
job openings all draw from the same library, so filing it under one of them
suggested it belonged to that one. Changing where it appears means changing
both `admin.group` in `src/collections/Media.ts` and the group in
`src/components/admin/Nav.tsx`, which owns the sidebar markup.

## Data Masuk and Audit Trail

Both read-only. Contact submissions can never be edited or deleted by anyone;
only the follow-up status changes, between **Baru** and **Ditindaklanjuti**.
The audit trail is written by hooks.

### What the audit trail covers

Every collection a person can change, for every create, update and delete:
news, reports, jobs, products, enquiries, media and user accounts. Only
Payload's own bookkeeping tables are excluded — preferences, document locks,
migrations and the key/value store — along with the audit log itself, which
nothing may write to twice.

Three things shape an entry:

- **The action** is `create`, `update` or `delete`, except where the approval
  workflow gives it a better name: `submit`, `approve` or `reject`.
- **The detail** names the fields that moved, and spells out a status change in
  full (`followUpStatus: new -> follow_up`). It never prints a value, so a
  password or a verification token cannot reach the log. A rejection shows its
  reason instead, and a submission from the public contact form says so, since
  it has no signed-in user to name.
- **A save that changed nothing is not recorded.** Payload rewrites login
  counters and timestamps on its own; logging those would bury the real
  entries under one row per sign-in.

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
