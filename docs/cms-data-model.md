# CMS data model

Twenty collections and three globals, from `intent/03-cms.md`. Every text field
marked **[i18n]** holds an Indonesian and an English value.

## Shared behaviour

Every content collection carries, without each one declaring it:

| Field | Purpose |
| --- | --- |
| `approvalStatus` | draft / in_review / approved / rejected |
| `rejectionReason` | Required when rejecting; visible to the editor |
| `submittedBy`, `submittedAt` | Who sent it for review, and when |
| `reviewedBy`, `reviewedAt` | Who decided, and when |
| `publishedAt` | When it went live |
| `_status` | Payload's own draft/published state, kept in step with the above |

Plus revision history (25 versions), audit logging, and role-based access.
Reference data that needs no review — authors, media outlets, job categories,
partner logos — skips the approval fields.

## Newsroom (News Admin)

| Collection | Key fields |
| --- | --- |
| `articles` | title [i18n], slug [i18n], excerpt [i18n], body [i18n] rich text, cover, author, publishDate, isFeatured, seo [i18n] |
| `authors` | name, photo |
| `media-outlets` | name, slug, logo, websiteUrl, sortOrder |
| `media-coverage` | title [i18n], outlet, excerpt [i18n], image, externalUrl, publishDate |

## Laporan (News Admin)

| Collection | Key fields |
| --- | --- |
| `reports` | type (annual / business development), title [i18n], slug [i18n], year, excerpt [i18n], cover, body [i18n] rich text, publishDate, sortOrder |

## Karir (HR Admin)

| Collection | Key fields |
| --- | --- |
| `job-openings` | title [i18n], slug, category, responsibilities [i18n], minimumQualifications [i18n], education [i18n], applyEmail, emailSubjectFormat [i18n], isOpen, postedDate |
| `job-categories` | name [i18n] |
| `career-page` (global) | hero title and subtitle [i18n], hero images, values, benefits, recruitment steps, CV note |

## Produk & Layanan (Marketing Admin)

| Collection | Key fields |
| --- | --- |
| `product-categories` | name [i18n], slug, icon, image, shortDescription [i18n], lead [i18n], description [i18n], advantages, sortOrder |
| `product-items` | name [i18n], category, shortDescription [i18n], description [i18n], **productStatus** (live / ready to sell), isNew, useCases, sortOrder |

`productStatus` is deliberately not called `status`: Payload reserves
`enum_<table>_status` for its own draft/published state and the two would
collide in PostgreSQL.

## Konten Website (Marketing Admin)

| Collection | Key fields |
| --- | --- |
| `hero-slides` | image, title [i18n], subtitle [i18n], button label [i18n] and link, sortOrder |
| `stats` | icon, value, label [i18n], sortOrder |
| `testimonials` | partnerName, logo, quote [i18n], sortOrder |
| `milestones` | year, items [i18n], sortOrder |
| `partner-logos` | name, logo, url, group (member / regulator / clik_member), sortOrder |
| `cta-blocks` | page, crossLink group, banner group, isActive |
| `page-content` | page, title [i18n], heroImage, lead [i18n], sections (key, title, lead, body, image), videoUrl |
| `static-pages` | key, title [i18n], body [i18n], lastUpdatedDate, attachments |
| `home-settings` (global) | about snippet, trust bar text, section headings [i18n] |

## Pengaturan

| Collection | Key fields |
| --- | --- |
| `contact-submissions` | Every contact form field, plus locale, page URL, IP address, user agent and consent version. Read-only; only `followedUp` may change. Never deleted. |
| `users` | name, email, role |
| `audit-log` | action, collection, document, user, reason. Written by hooks; nobody can edit or delete it. |
| `site-settings` (global) | company name, address [i18n], phone, the three email addresses, website, map embed, OJK licence, social links, CRIF link, default SEO |

## Changing the model

```bash
npm run generate:types          # refresh TypeScript types
npm run migrate:create <name>   # write the migration
npm run migrate                 # apply it
```

Migrations are committed. They run before the build on every release.

One thing to know for the future: the baseline migration had no localised
fields, so Payload never created the shared `_locales` enum. It is created
explicitly at the top of the Phase 2 migration. A migration generated against a
database missing that type will fail with `type "_locales" does not exist`.
