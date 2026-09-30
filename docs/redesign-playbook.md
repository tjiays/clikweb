# Redesign playbook

How to change, remove and add pages, features and CMS modules without
breaking links, the CMS or the checks. The decisions come first, in
`intent/05-redesign.md`; this is how to carry them out.

Work on the `redesign` branch, which starts from the tag
`baseline-pre-redesign`. Staging keeps running the baseline until the branch
is ready to test.

## Where a page is wired in

| What | Where |
| --- | --- |
| Its Indonesian and English address | `src/i18n/routes.ts`. **The sitemap is generated from this table.** |
| Which layout an address shows | `src/app/(frontend)/[locale]/[[...slug]]/page.tsx` |
| The layout itself | `src/components/pages/<Name>Page.tsx` + `.module.css` |
| Sections it is built from | `src/components/sections/` |
| Its wording, both languages | `src/content/<page>.ts` |
| Its imagery | `public/images/<page>/` |
| Menu and footer links | `src/components/layout/Header.tsx`, `Footer.tsx` — by route name, e.g. `href('about')` |

Pages are linked **by route name**, never by typed address. Removing a name
from `routes.ts` makes `npx tsc --noEmit` list every place that still links to
it — use that as the checklist rather than searching by hand.

## Changing a page

1. Build the new layout against its Figma frame in the page component and its
   sections. Keep the route name and addresses unless `05` says otherwise.
2. Update its wording in `src/content/`, **both halves of every pair**.
3. Check it in both languages and at phone width (`docs/responsive.md`).

## Removing a page

1. Record it in `intent/05-redesign.md` with the address it redirects to.
2. **Add a permanent redirect** in `next.config.ts` (`redirects()`), for both
   the Indonesian and the English address. A public address never starts
   returning 404 without a decision.
3. Delete its entry from `src/i18n/routes.ts`, then run
   `npx tsc --noEmit` and remove every reference it lists — menu, footer,
   closing-block cross links, the page map in `page.tsx`.
4. Delete the page component, its sections if nothing else uses them, its
   file in `src/content/`, and its folder in `public/images/`.
5. Confirm: the old address answers 301 to the new one, it is gone from
   `/sitemap.xml`, and the menu has no dead link.

## Removing a feature

Same as a page for anything visible. If the feature has CMS fields, removing
the fields is a **database change**: see the next section.

## Removing a CMS module or field

Never a design-only change.

1. Decide what happens to the existing content — export it, move it into
   another module, or discard it — and write the decision in `05`.
2. Back up: `sudo ./deploy/backup.sh`.
3. Remove the collection or field from `src/collections/`, and the module from
   the sidebar (`src/components/admin/Nav.tsx`) and the access rules.
4. Write the migration **by hand**: the generator's schema snapshot is stale
   (`docs/operations.md`), and generated migrations here have dropped columns
   before copying their data. Pattern: copy, count, then drop — and refuse to
   drop if the count is wrong.
5. Regenerate types and the import map: `npm run generate:types`,
   `npm run generate:importmap`.

## Adding a page

1. Add its route name and both addresses to `src/i18n/routes.ts`.
2. Map it to a new page component in `page.tsx`.
3. Put its wording in a new `src/content/` file as `{ id, en }` pairs.
4. Link it from the menu or footer by route name.

## Before calling the redesign done

Run the checks (`scripts/checks/README.md`) and compare with the baseline:
everything that passed at `baseline-pre-redesign` must still pass, except
checks for features `05` deliberately removed.
