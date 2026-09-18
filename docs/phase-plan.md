# Phase plan

Six phases replacing the existing cbclik.com. Each ships something reviewable.

The living version of this plan, with fuller reasoning, is kept alongside the
project documentation; this file is the copy that travels with the code.

## Scope decision

The intent files and the Figma design are the specification. The BRD in
`prereq/` and its 56-item gap analysis are **set aside by the product owner**,
so every conflict resolves in favour of the intent files:

| Conflict | What gets built |
| --- | --- |
| Products menu | Business Solution / Credit Scoring |
| Product categories | 5, including Consulting |
| Careers apply | Email to talent@cbclik.com, no Jobstreet |
| CMS roles | 6, including Sales Admin and Approver |
| Approval workflow | Always on |
| Homepage and About Us | Editable by Marketing Admin |
| Spam protection | Rate limits only, no CAPTCHA |
| Homepage news cards | 3 |

Placeholder text from Figma is kept as seed content, flagged as sample.

## The phases

### Phase 1 — Foundation and design system ✅

Git repository, server setup, PostgreSQL, Next.js and Payload skeleton, design
tokens, shared components (headers, footers, breadcrumb, buttons, back to top),
bilingual routing shell, staging deployment.

**Documentation:** architecture, design system, deployment, repository
conventions.

### Phase 2 — CMS core ✅

Every content model as a Payload collection, six roles and their permission
matrix, the Draft → In Review → Published workflow with rejection reasons, the
review queue with an Indonesian/English diff, revision history, audit log,
media library, auto-translate.

**Documentation:** data model, role matrix, approval workflow guide, a CMS user
manual in plain Indonesian, auto-translate and glossary guide.

### Phase 3 — Core public pages ✅

Home, Tentang CLIK, Layanan dan Produk, Business Solution, Credit Scoring, and
the four policy and how-to pages. Seed data imported. External URLs
implemented and registered. The eight known design errors fixed.

**Documentation:** page implementation notes, external links register, seed
data inventory.

### Phase 4 — Content modules ✅

Newsroom, Laporan and Karir, each wired to the CMS and handed to the team that
owns it.

**Documentation:** an editor guide per module.

### Phase 5 — Forms, English and responsive

Contact form with rate limiting, 404 and success states, share buttons, the
English translation pass, and the responsive implementation.

**Documentation:** contact form and email configuration, rate limiting policy,
translation process, responsive behaviour reference.

### Phase 6 — Migration and cutover

Old-site URL inventory, 301 redirect map, sitemap and robots, production
deployment, DNS switch, rollback plan, handover.

**Documentation:** migration and redirect map, deployment guide, backup and
restore, rollback plan, operations handbook, deferred items register.

## Deferred

By instruction: automated testing, penetration testing, load and scalability
work, performance and uptime targets.

With the BRD: the CIKA chatbot, Jobstreet integration, FAQ module, member
directory, management team section, news filters, complaint form, auto-reply
email, scheduled publishing, preview, rollback UI, brochures, PIC routing,
GA4 / Search Console / GEO analytics, CAPTCHA, hreflang tags.

Owned by CLIK: replacing placeholder content, legal review of the policy pages,
and verifying the external URLs.

Two worth revisiting early: **hreflang tags**, a small job that materially helps
a bilingual site rank, and **basic analytics**, without which there is no way to
tell whether the new site performs better than the one it replaced.
