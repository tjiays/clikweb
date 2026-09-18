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
| [Phase plan](./docs/phase-plan.md) | The six delivery phases |

## Project specification

- [`intent/`](./intent) — what to build, agreed with the product owner
- [`prereq/`](./prereq) — the original BRD and its gap analysis

Where the intent files and the BRD disagree, **the intent files win** — a
decision recorded in the phase plan.
