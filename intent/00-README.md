# CLIK Website & CMS — Intent Files

These files describe **what to build** for the new CLIK (PT CRIF Lembaga Informasi Keuangan) website and its CMS. They were first written for an AI coding assistant before the build started, and are kept up to date as the product owner changes decisions.

**Revised 28 September 2026.** Many decisions changed during the build, most of them in the CMS. Each changed decision is marked **Revised** below, and the [decision log](#decision-log) records what it replaced and why. Where a file and the running system disagree, the running system is right and the file is out of date — please report it.

| File | Content |
|---|---|
| `00-README.md` | This index, confirmed decisions, decision log, open items |
| `01-design-system.md` | Fonts, colors, type scale, layout, shared components, interactions |
| `02-website-pages.md` | Sitemap, routes, and a section-by-section spec of every page |
| `03-cms.md` | Roles, permissions, approval workflow, content models, admin modules, dashboard |
| `04-integrations-and-links.md` | Contact form, email, rate limiting, careers, translation, analytics, external links |
| `05-redesign.md` | What stays, changes or goes in the redesign — filled in before any code changes |

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
4. Bilingual: **Indonesian (default) and English**. **Revised:** in the CMS, each item is written in both languages on one page, as side-by-side Indonesian and English fields, and both are required before approval. An **Auto-translate** button drafts the English from the Indonesian on news and reports only. The team still reviews English wording by hand.
5. Newsroom is **one paginated page** (Figma shows page 1 `305:1082` and page 2 `1661:8648`; article lists come from the CMS). **Revised:** articles are always newest first, and **Featured News is the newest eight** — there is no manual featuring or hiding.
6. Report cards ("Read More") open a **detail page**.
7. The closing block used on most pages (cross-link card + "Siap…" call-to-action banner) is **one reusable component**. **Revised:** it is edited per page **in code** (`src/content/cta.ts`), not in the CMS.
8. Placeholder content in Figma (dummy logos, lorem ipsum, author "gvezenzcha", etc.) is **kept as sample/seed data** and will be replaced later. It carries a hidden sample flag so it can be found.
9. **Revised:** "Lamar" (apply) opens **CLIK's JobStreet company page**, not an email. Each vacancy can carry its own link; left empty, it falls back to the company page. The "Tidak menemukan posisi yang sesuai?" note still points to **talent@cbclik.com**.
10. External links are **found by the AI coder** and must be marked for verification (see `04`).
11. **Out of scope for now:** Kebijakan Pengguna page (`1015:4098`), Frame 2425 (`1612:8739`, a duplicate of the Credit Scoring bottom section), all `html.to.design` capture sections (old-site reference), loose images/assets on the canvas.
20. **New:** **No share buttons** anywhere on the site.
21. **New:** A **future publish date holds an item back**: news and reports appear from 00:00 WIB on their publish day, not on approval.

**CMS**
12. Roles: **Super Admin, HR Admin, Marketing Admin, News Admin, Sales Admin, Approver**. The CMS runs inside the website application (one codebase, one deployment), not as a separate product.
13. HR / Marketing / News Admin are **editors**. **One Approver** covers all modules.
14. **Revised:** there is **no Draft**. Three statuses only: **In Review, Approved, Rejected**. Saving is submitting — an editor's save always lands on In Review. The Approver can only approve or reject, and **rejection requires a reason**. Super Admin may approve in the same save.
15. Laporan (reports) is managed by **News Admin**.
16. **Revised:** homepage hero, stats and all other page copy live **in code** (`src/content/`), changed by a developer. The CMS holds only what the team publishes on its own schedule: **news, reports, product items and job vacancies**, plus contact enquiries and users.
22. **New, revised 29 Sep:** **Editing approved or rejected work sends it back to In Review**, whoever edits it — and **the approved version stays on the website** until the edit is approved, then is replaced at once.
23. **New:** A new CMS account is **inactive until its owner clicks the verification link** sent to their email. Only Super Admin creates, and deletes, accounts.
24. **New:** The CMS **opens on website analytics** — visitors, page views, time on page and page speed — from a self-hosted Umami, not Google Analytics.
25. **New:** **Every create, update and delete is written to the audit log**, naming the item and the person.
26. **New:** Images are managed **inside the image fields** of news and reports. There is **no Media menu**, for any role. Only Super Admin can replace the file behind an existing image; editors upload new ones and fix alt text.
27. **New:** Every news, report and vacancy address (slug) is **unique**; a clash gets `-2`, `-3`… automatically.

**Contact form**
17. Each submission is **stored in the CMS database** and **emailed to sales@cbclik.com**.
18. Rate limits: **3 per 24 hours per email or phone**, **5 per hour per device/network**. No CAPTCHA.
19. Submissions are viewed by **Sales Admin** (and Super Admin) and **kept permanently**. **Revised:** each carries a follow-up status, **Baru** or **Ditindaklanjuti**, which Sales Admin sets.

## Rules for the AI coder

- Do not invent product facts, prices, legal text, or URLs. Use Figma text as seed content; mark unknowns `TODO`.
- Every external URL you add must be listed in `04` with status `TO VERIFY`.
- **Revised:** build the four publishing modules — news, reports, product items, job vacancies — from the CMS. Everything else that repeats (logos, testimonials, milestones, CTAs, stats, hero slides, page copy) lives in `src/content/` as bilingual pairs, never scattered through components.
- All UI strings and CMS text fields need both `id` and `en` values.
- Fix the known design errors listed in `01` / `02` instead of copying them.
- When a decision here changes, update this file and add a row to the decision log in the same change.

## Decision log

Changes to the original intent, in the order they were made. Each links to the commit that made it; the commit message holds the full reasoning.

| Date | Decision | Replaces | Commit |
|---|---|---|---|
| 18 Sep | Stack: Next.js 16 + Payload 3 + PostgreSQL, self-hosted, one application | Open item O1 | Phase 1 commit |
| 18 Sep | CMS slimmed from 21 collections to 7; page copy and imagery move to `src/content/` and `public/images/` | Rule "everything repeated from the CMS"; decisions 7, 16 | `3f27057` |
| 21 Sep | One rich-text editor for all long text, with tables and inline images; report figures live inside it | Separate financial-table fields | `d0daf81`, `25f7201` |
| 21 Sep | Saving submits for review; status box hidden from editors | "Editor submits" as a separate act | `09a2b7e` |
| 21 Sep | Three statuses — In Review, Approved, Rejected; Draft removed | Decision 14 | `27e6c9b` |
| 22 Sep | Both languages on one page as paired fields (reports, then news; products and Karir on 23 Sep) | Locale switcher per item | `1a6d14d`, `3c707ed`, `f8bd2f4`, `85de77b` |
| 22 Sep | Image upload limit 5 MB; ratio and minimum size rules taken from the design | 20 MB, no dimension rules | `9108419`, `fb81c52` |
| 22 Sep | News newest first; Featured News is the newest eight; Artikel renamed News | Manual Featured / hide flags; decision 5 detail | `2a1b83d` |
| 22 Sep | Admin interface in Indonesian and English | Indonesian labels only | `c5c0164` |
| 22 Sep | Share buttons removed | `04` §3 | `bae7305` |
| 22 Sep | Future publish date holds an item until 00:00 WIB that day | Approval alone publishes | `a63babb` |
| 23 Sep | Products: four paired inputs, status up to two of Live / Ready to Sell / New, no auto-translate | Single status + NEW checkbox | `f8bd2f4`, `f2f55e1` |
| 23 Sep | Karir: Lamar goes to JobStreet; Education, apply email and subject format removed; five departments | Decision 9; `03` JobOpening model | `bac3e1e`, `9683a76` |
| 23 Sep | Editing approved or rejected work returns it to In Review | `03` §3 "live version stays online until the revision is approved" | `714ecd8` |
| 23 Sep | New accounts verify their email before they can log in | Accounts active on creation | `c45ced6` |
| 25 Sep | Super Admin deletes users from the list; Columns chooser removed on every list | — | `b1f10aa`, `3459067` |
| 25 Sep | Enquiry follow-up status: Baru / Ditindaklanjuti | "followed up" checkbox; open item O2 | `b31781c` |
| 25 Sep | Audit log records every create, update and delete, with item and person | Submissions, decisions and deletions only | `58fa33d`, `8142a36` |
| 25 Sep | Media menu hidden for every role; images managed in their fields | Shared Media Library menu | `fa5fe1f` |
| 25 Sep | CMS dashboard replaced by website analytics from self-hosted Umami | Content counts and charts | `880956d` |
| 28 Sep | Top pages show time on page, bounce and load time; speed metrics in plain words | — | `5444769`, `c75fb89` |
| 29 Sep | Security, reliability and scalability hardening (four phases) | — | `2457fa6` … `bc65763` |
| 29 Sep | Editing live work keeps the live version online until approved | 23 Sep: editing took the page down | this change |
| 29 Sep | Only Super Admin replaces an image file; slugs unique; reset email link absolute | — | this change |

## Open items

| # | Question | Status |
|---|---|---|
| O1 | Tech stack | **Decided** — Next.js 16, Payload CMS 3, PostgreSQL 18, nginx, self-hosted. Email via SMTP, not yet configured (staging captures mail in Mailpit). |
| O2 | Sales Admin permissions | **Decided** — view submissions and set the follow-up status. **CSV export was not built.** |
| O3 | Email notifications for submissions and decisions | **Open.** Nothing is sent; the Approver finds work by filtering lists for In Review. |
| O4 | Separate darker navy for footer or hover | **Assumed, not confirmed** — darker shades merged into `#003A79`. |
| O5 | Header behaviour on scroll | **Assumed, not confirmed** — sticky on inner pages; the Home header overlays the hero. |
| O6 | English slugs | **Decided** — pages have English slugs (`/en/about-us`). News, reports and vacancies share one slug in both languages, made from the Indonesian title. |
| O7 | Who edits the policy and how-to pages | **Decided** — they live in code (`src/content/policies.ts`) and are changed by a developer. |
| O8 | Real SMTP credentials | **Open** — needed before launch; without them account verification and enquiry emails never arrive. |
| O9 | Separate analytics for staging and production | **Open** — both would currently count into one Umami site. |
