# Repository conventions

## One repository

Payload runs inside the Next.js application, so the website and the CMS are a
single codebase. There is no separate CMS repository.

## Branches

| Branch | Holds |
| --- | --- |
| `main` | What is running in production |
| `staging` | What is running on the staging server |
| `feature/*` | One branch per piece of work |

Work happens on a `feature/*` branch and reaches `staging` through a pull
request. `staging` merges into `main` at a release.

Nothing is committed directly to `main`.

## Commits

Written in the imperative, explaining why rather than what:

```
Add bilingual routing shell

Indonesian is unprefixed and English uses /en, so the middleware
rewrites unprefixed paths to the internal /id segment.
```

## Tags

Each phase delivery is tagged `phase-1`, `phase-2`, and so on, so any phase can
be checked out and run exactly as it was delivered.

## What is committed

- Application code and Payload collection definitions
- Database migration files
- Generated types (`src/payload-types.ts`) and the admin import map
- All documentation, including the specification in `intent/` and `prereq/`
- `.env.example`, with every value blanked

## What is never committed

- **`.env` and any file holding real credentials.** A secret committed once
  stays in the history permanently and is genuinely hard to remove. If one is
  committed by accident, treat it as compromised and rotate it.
- `node_modules/` and build output
- Uploaded media. Images and PDFs live on disk and are backed up separately;
  committing them bloats the repository irreversibly.

`.gitignore` enforces all of the above. Verify with `git check-ignore -v .env`.
