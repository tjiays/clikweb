# Page implementation notes

How each page in Phase 3 maps to the design and to the CMS.

## Routing

Indonesian and English use different slugs (open item O6), so **one catch-all
route serves every page** rather than two mirrored folder trees.

`src/app/(frontend)/[locale]/[[...slug]]/page.tsx` matches the requested path
against `src/i18n/routes.ts` and renders the matching component. A path that
matches nothing returns 404.

This means a URL is never written by hand in a component: `href('about', locale)`
returns `/tentang-kami` or `/en/about-us` as appropriate.

## The pages

| Page | Figma | Route (ID) | Component |
| --- | --- | --- | --- |
| Home | `156:1049` | `/` | `HomePage` |
| Tentang CLIK | `333:2672` | `/tentang-kami` | `AboutPage` |
| Layanan dan Produk | `427:2795` | `/layanan-dan-produk` | `ProductsPage` |
| Business Solution | `859:4457` | `/layanan-dan-produk/business-solution` | `BusinessSolutionPage` |
| Credit Scoring | `859:4489` | `/layanan-dan-produk/credit-scoring` | `CreditScoringPage` |
| Kebijakan Keamanan Informasi | `743:3483` | `/kebijakan-keamanan-informasi` | `StaticContentPage` |
| Kebijakan Privasi | `955:5948` | `/kebijakan-privasi` | `StaticContentPage` |
| Cara mendapat laporan kredit | `418:2433` | `/layanan-dan-produk/cara-mendapat-laporan-kredit` | `StaticContentPage` |
| Penyelesaian Pengaduan | `418:2844` | `/layanan-dan-produk/penyelesaian-pengaduan` | `StaticContentPage` |

## Where content comes from

Nothing on these pages is hard-coded. Each section reads from the CMS through
`src/lib/content.ts`:

| Section | Source |
| --- | --- |
| Hero slides | `hero-slides` |
| Stats, section headings, about snippet | `stats`, `home-settings` |
| Solution cards | `product-categories` |
| Testimonials | `testimonials` |
| Latest news | `articles`, newest three |
| Milestones | `milestones` |
| Member and regulator logos | `partner-logos`, filtered by group |
| Page prose | `page-content`, looked up by section key |
| Policy pages | `static-pages`, looked up by key |
| Closing blocks | `cta-blocks`, one per page |

`page-content` holds an ordered list of named sections. The page template asks
for a section by key (`visi`, `misi`, `tentang-crif`, `apa-itu`, `cara-kerja`,
`data-list`, `apa-itu-skor-kredit`), so an editor can reorder or reword a
section without touching code — but renaming a key hides that section.

## Interactions

Taken from the prototype (intent/01 §5):

- **Hero slider** — three slides, auto-advancing every 6 seconds, looping, and
  pausing while the pointer is over it. Dots jump to a slide.
- **Solution carousel** — arrow button plus dots, scrolls natively so it stays
  swipeable on a touch screen.
- **Testimonial carousel** — auto-advancing, dots only, no arrow.
- **Product accordion** on Credit Scoring — "+" expands a row to show its
  description and use cases (Figma "Expanded card" `1391:5420`).
- **Stat cards, solution cards, buttons** — hover states throughout.

Everything interactive is a client component; the pages themselves render on
the server.

## Design errors fixed, not copied

From intent/01 §6:

| Error in Figma | What was built |
| --- | --- |
| Hero title "Bureu" | "Bureau" |
| Milestone "Full CB Rerport" | "Full CB Report" |
| Kebijakan Privasi breadcrumb showing the wrong page | Built from the actual page |
| Nav layer named "karis" | "Karir" |
| Dark header "Business Solution" pointing at Credit Scoring | Points at Business Solution |
| "Tentang Kami" with no destination | Opens the dropdown only; it is a button, not a link |
| Copyright hard-coded to 2024 | Generated from the current year |
| Stat "10.500+" conflicting with "2.688" | Both kept as seed data, both from the CMS |

## What is deliberately missing

Images are placeholders, generated at build time and flagged as sample. The
policy pages carry a marked TODO instead of legal text, because inventing legal
text is forbidden by rule 1 in `intent/00-README.md`. Newsroom, Laporan, Karir
and the contact form arrive in Phases 4 and 5.
