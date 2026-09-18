# 03 — CMS

A **standalone CMS** (separate admin application) that feeds the public website. Designer reference for the admin UI: **Admin View** `704:3356` (left sidebar grouped by module, logged-in user shown at the bottom). Use the same fonts and colors as the website.

## 1. Roles

| Role | Type | Scope |
|---|---|---|
| **Super Admin** | Full access | Everything: all modules, users & roles, site settings, contact submissions. Changes publish **directly** (no approval). |
| **HR Admin** | Editor | Karir module |
| **News Admin** | Editor | Newsroom module and Laporan module |
| **Marketing Admin** | Editor | Homepage (hero slides, stats), Produk & Layanan, Testimoni, Timeline, Partner logos, CTA blocks, About/Layanan page content |
| **Sales Admin** | Viewer | Contact Us submissions (proposed: view, export CSV, mark "followed up" — open item O2) |
| **Approver** | Reviewer (one person/role for all modules) | Sees every submitted change; can **only approve or reject**; cannot edit content. Rejection **requires a reason**. |

A user has one role. Only Super Admin manages users.

## 2. Permission matrix

| Module | Super Admin | HR Admin | News Admin | Marketing Admin | Sales Admin | Approver |
|---|---|---|---|---|---|---|
| Karir (jobs, categories, page content) | Full | Edit + submit | — | — | — | Approve/Reject |
| Newsroom (articles, authors, media outlets, coverage) | Full | — | Edit + submit | — | — | Approve/Reject |
| Laporan (reports) | Full | — | Edit + submit | — | — | Approve/Reject |
| Homepage (hero, stats) | Full | — | — | Edit + submit | — | Approve/Reject |
| Produk & Layanan (categories, items) | Full | — | — | Edit + submit | — | Approve/Reject |
| Testimoni, Timeline, Partner logos | Full | — | — | Edit + submit | — | Approve/Reject |
| CTA blocks, About/Layanan page content | Full | — | — | Edit + submit | — | Approve/Reject |
| Policy & how-to pages | Full | — | — | — | — | — (see O7) |
| Media Library | Full | Upload/use | Upload/use | Upload/use | — | View |
| Contact submissions | Full | — | — | — | View / export / mark followed-up (O2) | — |
| Site settings (contact info, social links, emails) | Full | — | — | — | — | — |
| Users & roles, audit log | Full | — | — | — | — | — |

"Edit + submit" includes create, edit, unpublish and delete requests — all go through approval.

## 3. Approval workflow

Applies to every content change by HR, News and Marketing Admin (create, edit, unpublish, delete). Super Admin changes skip it.

```
Draft ──submit──▶ In Review ──approve──▶ Published
  ▲                   │
  └──── Rejected ◀────┘ (reason required)
```

Rules:
- Editing an already-published item creates a **new draft revision**; the live version stays online until the revision is approved.
- Delete/unpublish by an editor is a request; the item stays live until approved.
- Rejected items return to the editor with the Approver's reason visible; the editor can edit and resubmit.
- Approver sees a **review queue** (all modules) with a side-by-side diff of old vs new values for both languages.
- Items locked while In Review (editor cannot change them until approved/rejected).
- Keep **revision history** per item (who, when, what changed, decision, reason).
- Keep an **audit log** of logins, approvals, rejections, publishes, deletions, and user/role changes.
- Notifications: in-app badge/list for the Approver (new submissions) and editors (decisions). Email notifications: open item O3.

## 4. Bilingual content

- Every text field below exists in two versions: `*_id` (required) and `*_en`.
- On save, if `*_en` is empty, the CMS offers an **"Auto-translate"** action (AI translation); the editor can edit the result before submitting. Translation output is a draft like any other change.
- Slugs: per language (see O6).

## 5. Content models

Common fields on every model: `id`, `status` (draft / in_review / published / rejected / unpublished), `created_by`, `updated_by`, `published_at`, `sort_order` (where listed), timestamps. `[i18n]` = has `_id` and `_en` versions. `(img)` = media library reference with alt text `[i18n]`.

### Newsroom (News Admin)
- **Article**: title [i18n], slug [i18n], excerpt [i18n], body [i18n] (rich text: headings, lists, images, tables, embeds), cover (img), author → Author, publish_date, is_featured (shows in "Featured News"), SEO title/description [i18n].
- **Author**: name, photo (img, optional).
- **MediaOutlet** (Daftar Media / logo strip): name, slug, logo (img), website URL, sort_order.
- **MediaCoverage** (Liputan Media): title [i18n], outlet → MediaOutlet, excerpt [i18n], image (img), external_url, publish_date.

### Laporan (News Admin)
- **Report**: type (annual_report / business_development), title [i18n], slug [i18n], year, excerpt [i18n], cover (img, optional), body [i18n] (rich text with images and tables), publish_date, sort_order.

### Karir (HR Admin)
- **JobCategory**: name [i18n] (e.g. Information Technology, Analysis & Reporting).
- **JobOpening**: title [i18n], slug, category → JobCategory, responsibilities [i18n] (rich text), minimum_qualifications [i18n], education [i18n], apply_email (default `talent@cbclik.com`), email_subject_format [i18n] (text shown under "Please mention on Subject E-mail"), is_open, posted_date, sort_order.
- **CareerPage** (single): hero_title [i18n], hero_subtitle [i18n], hero_images (img list, carousel); values (list: title [i18n], subtitle [i18n], description [i18n]); benefits (list: icon (img), title [i18n]); recruitment_steps (list: title [i18n], description [i18n]); cv_note [i18n].

### Homepage & marketing content (Marketing Admin)
- **HeroSlide**: image (img), title [i18n], subtitle [i18n], optional button label [i18n] + link, sort_order.
- **Stat**: icon (img), value (text, e.g. "10.500+"), label [i18n], sort_order.
- **HomeSettings** (single): about snippet title/text [i18n], trust bar text [i18n], section titles and subtitles for Solutions, Testimonials, News [i18n].
- **Testimonial**: partner name, logo (img), quote [i18n], sort_order.
- **Milestone**: year, items [i18n] (list of lines), sort_order.
- **PartnerLogo**: name, logo (img), url, group (`member` — AFPI/BIIA/AFTECH/APPI, `regulator` — OJK, `clik_member` — About Us strip), sort_order.
- **ProductCategory**: name [i18n] (Credit Scoring, Analytics, Decisioning, Business Intelligence, Consulting), slug, icon (img), image (img), short_description [i18n], lead [i18n], description [i18n], advantages (list: title [i18n], description [i18n]), link target (own page or section), sort_order.
- **ProductItem**: name [i18n], category → ProductCategory, short_description [i18n], description [i18n], status (`live` / `ready_to_sell`), is_new, use_cases (list: segment [i18n], use [i18n]), sort_order.
- **CTABlock**: page (select from website pages), cross_link (optional: label [i18n], title [i18n], image, target page), banner (optional: background image, title [i18n], text [i18n], button label [i18n], button link), is_active.
- **PageContent** (About Us, Layanan dan Produk, Credit Scoring, Business Solution): per-section text fields [i18n] and images matching the page specs in `02`, plus About Us video URL.

### Static pages (see O7)
- **StaticPage**: key (information_security_policy / privacy_policy / how_to_get_credit_report / complaint_resolution), title [i18n], body [i18n], last_updated_date, attachments (e.g. "Formulir Permintaan Data").

### Settings (Super Admin)
- **SiteSettings** (single): company name, address [i18n], phone, emails (`info@cbclik.com` general, `sales@cbclik.com` form recipient, `talent@cbclik.com` careers), website URL, map embed URL, OJK license number, social links (list: platform, URL), CRIF link, default SEO.

### Contact (Sales Admin)
- **ContactSubmission**: see `04` for fields. Read-only record; extra field `followed_up` (bool) + `followed_up_by` + `followed_up_at` (O2). Never deleted.

## 6. Admin navigation (from `704:3356`)

- **Modul: Karir** — Lowongan Pekerjaan, Konten Halaman Karir (Hero & Banner, Nilai-Nilai Kami, Benefits, Proses Rekrutmen, CTA / Settings), Kategori Lowongan
- **Newsroom** — Artikel, Author, Partner Logo (media outlets), Liputan Media
- **Modul: Laporan** — Daftar Laporan
- **Modul: Produk & Layanan** — Kategori Produk, Item Produk
- **Konten Website** — Homepage (Hero, Stats), Testimoni Mitra, Timeline Pencapaian, Partner Logo, CTA Blocks, Page Content
- **Review** — Approval queue (Approver, Super Admin)
- **Pengaturan** — Pengaturan Umum, Data Masuk (Hubungi Kami), Users & Roles, Audit Log
- **Shared** — Media Library

Show each user only the menu items their role can access.

## 7. Seed data

Import all Figma text (articles, jobs, products, reports, milestones, testimonials, logos, stats, policy text) as **published** seed content so the site looks like the design on first run. Placeholder items (WebbyFrames, Zoomerr, SHELLS, ArtVenue, kontrastr, SmartFinder, WAVESMARATHON, lorem ipsum testimonials, author "gvezenzcha") are included and flagged `is_sample = true` so they are easy to find and replace.
