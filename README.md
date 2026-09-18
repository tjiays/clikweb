# CLIK Website & CMS

The public website and standalone CMS for **PT CRIF Lembaga Informasi Keuangan (CLIK)**,
replacing the existing cbclik.com.

## What this is

A single Next.js application containing both the public website and the Payload
CMS admin panel. Built to the specification in [`intent/`](./intent) and the
Figma design referenced there.

## Stack

| Layer | Choice |
| --- | --- |
| Language | TypeScript |
| Runtime | Node.js 22 LTS |
| Website | Next.js 16.3.3 (App Router) |
| CMS | Payload CMS 3.89 |
| Database | PostgreSQL 18 |
| Images | sharp |
| Web server | Nginx (reverse proxy) |

## Getting started

```bash
cp .env.example .env    # then fill in the values
npm install
npm run dev             # http://localhost:3000
```

The admin panel is at `/admin`. The first account is created on first visit.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `npm run generate:importmap` | Regenerate the admin import map |
| `npm run migrate` | Apply database migrations |
| `npm run migrate:create` | Create a new migration |

## Languages

Indonesian is the default and has no URL prefix. English is served under `/en`.
Routing is handled by `src/middleware.ts`; the slug for each page in each
language lives in `src/i18n/routes.ts`.

## Documentation

| Document | Contents |
| --- | --- |
| [Architecture](./docs/architecture.md) | How the pieces fit together |
| [Design system](./docs/design-system.md) | Tokens, type scale, components |
| [Deployment](./docs/deployment.md) | Environments, staging, releases |
| [Repository conventions](./docs/repository-conventions.md) | Branches, commits, what is committed |
| [External links](./docs/external-links.md) | Every outbound URL and whether it is verified |
| [CMS data model](./docs/cms-data-model.md) | Collections, globals and shared fields |
| [Roles and permissions](./docs/roles-and-permissions.md) | Who can reach what, and how it is enforced |
| [Approval workflow](./docs/approval-workflow.md) | Draft to published, and the rules behind it |
| [CMS user manual](./docs/cms-user-manual.md) | Panduan untuk tim pengisi konten (Bahasa Indonesia) |
| [Auto-translate](./docs/auto-translate-and-glossary.md) | How English is drafted, and the glossary |
| [Page implementation notes](./docs/page-implementation-notes.md) | How each page maps to Figma and the CMS |
| [Seed data inventory](./docs/seed-data-inventory.md) | What is real, what is placeholder |
| [Editor guide: Newsroom](./docs/editor-guide-newsroom.md) | Panduan News Admin (Bahasa Indonesia) |
| [Editor guide: Karir](./docs/editor-guide-careers.md) | Panduan HR Admin (Bahasa Indonesia) |
| [Editor guide: Marketing](./docs/editor-guide-marketing.md) | Panduan Marketing Admin (Bahasa Indonesia) |
| [Contact form](./docs/contact-form.md) | Submission flow, email, rate limits |
| [Responsive behaviour](./docs/responsive.md) | Small-screen specification |
| [Translation process](./docs/translation-process.md) | How English is produced and checked |
| [Cutover runbook](./docs/cutover-runbook.md) | Step by step for replacing the live site |
| [Migration redirect map](./docs/migration-redirect-map.md) | All 161 old URLs and where they go |
| [Operations handbook](./docs/operations.md) | Releasing, backups, environment variables |
| [Deferred items](./docs/deferred-items.md) | What was set aside, and why |
| [Phase plan](./docs/phase-plan.md) | The six delivery phases |

## Project specification

- [`intent/`](./intent) — what to build, agreed with the product owner
- [`prereq/`](./prereq) — the original BRD and its gap analysis

Where the intent files and the BRD disagree, **the intent files win** — a
decision recorded in the phase plan.
