# CMS collections

Seven collections, plus the store that holds uploaded images. Everything else
on the website lives in `src/content/` — see [editing content](./editing-content.md).

| Menu (ID / EN) | Collection | Who edits it |
| --- | --- | --- |
| Berita / News | `articles` | News Admin |
| Laporan / Reports | `reports` | News Admin |
| Produk / Products | `product-items` | Marketing Admin |
| Karir / Careers | `job-openings` | HR Admin |
| Data Masuk / Enquiries | `contact-submissions` | Sales Admin (follow-up status only) |
| Log Audit / Audit Log | `audit-log` | Nobody — written by the system, read by Super Admin |
| Pengguna / Users | `users` | Super Admin |
| — (no menu) | `media` | Through the image fields on news and reports |

The four content collections share one pattern: **both languages side by side
on a single page** (`titleId` beside `titleEn`, and so on), the approval
workflow in the sidebar, and a slug made from the Indonesian title that is
hidden from the form. Every visible field below is shown in the order it
appears.

## Berita (`articles`)

| Field | Notes |
| --- | --- |
| Gambar sampul | Card image. Recommended 1140×650px (7:4). Refused under 832px wide or outside ratio 1.2–3. |
| Gambar banner (halaman detail) | Optional. Recommended 1300×372px (3.5:1). Refused under 1300px wide or outside ratio 2.8–4.2. Falls back to the cover. |
| Judul / Title | Required in both languages |
| Ringkasan / Summary | Shown on cards, not on the article page |
| Isi artikel / Article body | Rich text. Optional, but if one language has it the other must too before approval. |
| Anda mungkin juga tertarik dengan | Up to 3 related articles, in order; empty = the newest |
| SEO title and description | Both languages |
| Penulis *(sidebar)* | Filled with the editor's name; editable |
| Tanggal publikasi *(sidebar)* | Required, filled with today, date only. Sets the order, newest first. A future date keeps the article off the site until 00:00 WIB that day. |
| Auto-translate, language status *(sidebar)* | See [auto-translate](./auto-translate-and-glossary.md) |

Every image field refuses files over **5 MB**, and states its recommended size on the form. Images already attached before a rule existed are not re-checked.

**Accepted file types: JPEG, PNG, WebP, GIF, AVIF and PDF.** SVG is refused:
it is a document that can carry script, and opened directly from the site's
own address it would run as the site. Every uploaded file is also served with
`Content-Security-Policy: … sandbox` and `nosniff` (`next.config.ts`, and the
`/media/` block in the production nginx config), so a file that ever got past
the upload check still could not run anything when opened directly. Pages
showing the image as `<img>` are unaffected.

**Only a Super Admin can replace the file behind an existing image.** Images sit outside the approval workflow, so a replaced file went straight onto every live page showing it. Editors upload a new image and choose it in their item — which is reviewed like any edit — and can still correct alt text.

Still in the schema but hidden and unread: `isFeatured`, `featuredPositions`,
`hideFromList`. They hold the old hand-ordering of Featured News, kept so the
change can be walked back. Featured News is now simply the newest eight.

## Laporan (`reports`)

| Field | Notes |
| --- | --- |
| Gambar sampul | Annual report: recommended 2000×1333px (3:2), refused under 1300px wide. Business development report: recommended 1200×800px (3:2), refused under 832px wide. |
| Judul / Title | Required in both languages |
| Ringkasan / Summary | One or two sentences on the report card |
| Isi laporan / Report body | Rich text with tables. Required in both languages. |
| Jenis laporan *(sidebar)* | Laporan Tahunan or Laporan Perkembangan Usaha |
| Penulis *(sidebar)* | Filled with the editor's name |
| Tanggal publikasi *(sidebar)* | Optional, date only. Same future-date rule as news. |
| Urutan *(sidebar)* | 0 = automatic, newest first; a lower number pins it higher |

`financialTables` is still in the schema, hidden. The figures it held were
moved into the report body's tables and checked against the originals.

## Produk (`product-items`)

| Field | Notes |
| --- | --- |
| Nama produk / Product name | Required in both languages |
| Deskripsi singkat / Short description | The line under the name in What We Offer |
| Status | Any of **Live**, **Ready to Sell**, **NEW** — at most two, or none. More than two is refused with "Maksimal pilih 2". |
| Deskripsi / Description | Rich text, shown when the row is expanded |
| Fitur utama / Key features | Repeating list |
| Cocok untuk / Suitable for | Repeating list |
| Kegunaan / Use cases | Repeating list |
| Kategori *(sidebar)* | One of the five fixed categories |
| Urutan *(sidebar)* | As above |

The five categories live in `src/content/products.ts`. Adding a category is a
code change; adding a product is not. Products have **no auto-translate**.

## Karir (`job-openings`)

| Field | Notes |
| --- | --- |
| Nama posisi / Position | Required in both languages |
| Kategori | IT, Analytics, Sales / Business Development, Operations, Finance — from `src/content/careers.ts` |
| Tanggung jawab / Key Responsibilities | Rich text |
| Persyaratan / Minimum Qualifications | Rich text |
| Tautan lamaran (JobStreet) | Where Lamar goes. Empty = CLIK's JobStreet company page. |
| Lowongan masih dibuka *(sidebar)* | **Only open vacancies appear on the site** |
| Urutan *(sidebar)* | As above |

Removed on 23 September: Education, the apply email, the email subject format,
and the posted date. Karir has **no auto-translate**.

## Behaviour every content collection shares

- **Approval workflow** — In Review, Approved, Rejected. Saving submits.
  Details in [approval workflow](./approval-workflow.md).
- **Unique slugs.** A new item whose slug is taken gets `-2`, `-3`… automatically, and the database refuses a duplicate that slips past (unique indexes on `articles`, `reports`, `job_openings`, from migration `20260929_120000_unique_slugs`).
- **Back to the list after a save succeeds**, so the editor sees their item in context. A save that fails leaves them on the page with their work and the reason — it used to send them to the list regardless, losing unsaved text.
- **Preview and Live Preview** — see below.
- **Revision history** — up to 25 versions, restorable.
- **Audit logging** — every create, update, delete, submit, approval and rejection.
- **No document locking.** Payload's "someone else is editing this" notice is
  off for every collection. Its lock check runs a query outside the save's
  transaction, and twenty saves at once used to freeze the whole site (see
  [operations](./operations.md#database-connections)). The approval workflow's
  own lock on items in review still applies.
- **No "Columns" chooser** on any list. Each collection's `defaultColumns` decides
  what a list shows; the chooser could only hide a column, and Payload
  remembered that per person, which read as a bug.

## Pengguna (`users`)

Name, email, password and role, all required at creation. Email verification
is on: a new account cannot log in until its owner clicks the link in the
verification email. While mail is caught by Mailpit, Super Admin sees the link
on the user's page (`src/components/admin/VerificationLink.tsx`). Accounts that
existed before verification was switched on were marked verified by the
migration, so nobody was locked out.

Super Admin deletes a user from the list (a two-step **Hapus** button on each
row) or from the user's page. Deleting your own account, or the last Super
Admin, is refused. References to a deleted user are set to empty rather than
deleted with it, and the audit log keeps their email as text.

## Dashboard

The CMS opens on website analytics, not content counts. See
[analytics](./analytics.md) for where the numbers come from, including why time
on page and bounce are computed here rather than taken from Umami.

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

**Not in the sidebar, for any role including Super Admin.** The collection is
untouched — it is still where every image is stored, and every cover and
banner is a pointer into it — but it has no menu of its own.

Images are managed where they are used. The upload field on news and reports
can upload a new file, browse and search the whole library through "Pilih dari
yang sudah ada", swap an image, and open the file to edit its alt text in both
languages. A menu listing the same files was a second place to look after
without a second thing to do.

The one job the field cannot do is delete a file. That is deliberate and
rarely wanted: unlinking an image from an article leaves the file in place,
and version history keeps referring to it — of the 15 files held today, every
single one is still referenced by a draft or an old version, so nothing is
safe to delete on the grounds of looking unused.

When a file genuinely has to go, the collection still answers at
`/admin/collections/media`. Nothing about access changed: upload is any editor,
delete is Super Admin.

Removing the menu meant four places, all of them display: the `Media` group and
the approver allow-list in `src/components/admin/Nav.tsx`, the `OWNERS` entry
beside them, and the dashboard card in `src/components/admin/Dashboard.tsx`.

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

Preview is restricted by the signed-in session, not by anything in the link.
The route (`src/app/(frontend)/preview/route.ts`) turns on draft mode only for
someone allowed to read unapproved work in that collection: the module's own
editors, the Approver and Super Admin. Anyone else gets a 403, and paths that
would lead off the site (`//…`) are refused.

The link used to carry `PAYLOAD_SECRET`, the key that signs every login, which
put it in every editor's page source, browser history and the server's access
log. It was removed and the secret rotated on 29 September.

Verified, not assumed: an approved report dated a month ahead returns 404 on
the site and 0 results from REST and GraphQL, while its own editor sees it in
full under preview; HR and Sales Admin are refused preview of reports.

## Publish date and the API

The publish-date rule lives in one place, `src/lib/schedule.ts`, and is used by
both the website's queries and the collections' public read rule. So REST and
GraphQL obey the same embargo as the website. Before 29 September the API
checked only "published", and an embargoed report could be read in full at
`/api/reports` while the website hid it.
