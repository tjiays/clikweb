# CLIK Website & CMS — Intent Files

These files describe **what to build** for the new CLIK (PT CRIF Lembaga Informasi Keuangan) website and its standalone CMS. They are written for an AI coding assistant. Read all files before writing code.

| File | Content |
|---|---|
| `00-README.md` | This index, confirmed decisions, rules for the AI coder, open items |
| `01-design-system.md` | Fonts, colors, type scale, layout, shared components, interactions |
| `02-website-pages.md` | Sitemap, routes, and a section-by-section spec of every page |
| `03-cms.md` | Roles, permissions, approval workflow, content models, admin modules |
| `04-integrations-and-links.md` | Contact form, email, rate limiting, translation, external links |

## Source of truth

- Figma file: `https://www.figma.com/design/UT66twvHGcFmA837Pklu73/IT-Intern-CRIF` (single page `Page 1`)
- Prototype start frame: **Main Landing Page** `156:1049`
- Node IDs like `156:1049` refer to frames in that file. To open one: append `?node-id=156-1049` to the URL.
- If this document and the Figma design disagree on **layout or visuals**, follow Figma. If they disagree on **fonts, colors, behaviour or CMS rules**, follow this document (decisions below were confirmed by the product owner and override the file).

## Confirmed decisions

**Website**
1. Font: **Nunito Sans** everywhere (replace any Roboto, Inter, Open Sans, Plus Jakarta Sans found in Figma).
2. Brand colors: orange **`#FF7D00`**, navy **`#003A79`**. Near-duplicate shades in Figma are merged into these.
3. Designs are desktop only (1440px). **Responsive behaviour is left to the AI coder's judgement.**
4. Bilingual: **Indonesian (default) and English**. English text is AI-translated, including CMS content; the team will fix wording manually afterwards.
5. Newsroom is **one paginated page** (Figma shows page 1 `305:1082` and page 2 `1661:8648`; article lists come from the CMS).
6. Report cards ("Read More") open a **detail page**.
7. The closing block used on most pages (cross-link card + "Siap…" call-to-action banner) is **one reusable component, editable per page in the CMS**.
8. Placeholder content in Figma (dummy logos, lorem ipsum, author "gvezenzcha", etc.) is **kept as sample/seed data** and will be replaced later.
9. "Lamar" (apply) opens an email to **talent@cbclik.com**.
10. External links are **found by the AI coder** and must be marked for verification (see `04`).
11. **Out of scope for now:** Kebijakan Pengguna page (`1015:4098`), Frame 2425 (`1612:8739`, a duplicate of the Credit Scoring bottom section), all `html.to.design` capture sections (old-site reference), loose images/assets on the canvas.

**CMS**
12. Standalone CMS with roles: **Super Admin, HR Admin, Marketing Admin, News Admin, Sales Admin, Approver**.
13. HR / Marketing / News Admin are **editors**. **One Approver** covers all modules.
14. Every content change, except by Super Admin, goes through **Draft → Submit → Approve or Reject**. Approver can only approve or reject; **rejection requires a reason**.
15. Laporan (reports) is managed by **News Admin**.
16. Homepage hero slider and stats are editable by **Marketing Admin**.

**Contact form**
17. Each submission is **stored in the CMS database** and **emailed to sales@cbclik.com**.
18. Rate limits: **3 per 24 hours per email or phone**, **5 per hour per device/network**. No CAPTCHA.
19. Submissions are viewed by **Sales Admin** (and Super Admin) and **kept permanently**.

## Rules for the AI coder

- Do not invent product facts, prices, legal text, or URLs. Use Figma text as seed content; mark unknowns `TODO`.
- Every external URL you add must be listed in `04` with status `TO VERIFY`.
- Build every repeated piece of content (news, jobs, products, logos, testimonials, milestones, CTAs, stats, hero slides) from the CMS, never hard-coded.
- All UI strings and CMS text fields need both `id` and `en` values.
- Fix the known design errors listed in `01` / `02` instead of copying them.

## Open items (ask the product owner before building these parts)

| # | Question | Blocks |
|---|---|---|
| O1 | **Tech stack** for website and CMS (framework, database, hosting, email provider) has not been decided. Ask before scaffolding. | Everything |
| O2 | Sales Admin: proposed permissions are *view, export CSV, mark as "followed up"*. Confirm. | CMS |
| O3 | Should editors / Approver get **email notifications** when content is submitted, approved or rejected (in-app notification is assumed)? | CMS |
| O4 | The darker navy shades `#0B2F5C` and `#123A7A` are mapped to `#003A79` per decision 2. Confirm no separate dark navy is wanted (e.g. for the footer or hover). | Design |
| O5 | Header behaviour on scroll (sticky or not) is not shown in Figma. | Design |
| O6 | Whether `/en` URLs should use English slugs or the same slugs as Indonesian. | Routing |
| O7 | Who edits the **policy and how-to pages** (Kebijakan Keamanan Informasi, Kebijakan Privasi, Cara mendapat laporan kredit, Penyelesaian Pengaduan)? Assumed Super Admin only until confirmed. | CMS |
