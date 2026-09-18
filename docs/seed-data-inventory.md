# Seed data inventory

What is real, what is placeholder, and what must be replaced before launch.

The site ships with content so it looks like the design on first run
(intent/03-cms.md §7). Everything imported from the design is flagged
**`isSample`** in the CMS, so it can be found with one filter.

## How to find it

In any collection list, filter on **Sample content = true**. Those are the
items to replace.

## What was seeded

| Collection | Count | Real or placeholder |
| --- | --- | --- |
| Hero slides | 3 | Text is from the design; **images are placeholders** |
| Stats | 3 | Figures from the design (37 / 10.500+ / 1jt+) |
| Testimonials | 4 | **Lorem ipsum with dummy partner names** — WebbyFrames, Zoomerr, SHELLS, ArtVenue |
| Partner logos | 5 | Real organisation names, **placeholder logo images** |
| Milestones | 7 | 2019–2025, text from the design |
| Product categories | 5 | Real: Credit Scoring, Analytics, Decisioning, Business Intelligence, Consulting |
| Product items | 29 | Real product names and statuses, from Figma text node `1331:4307` |
| Page content | 4 | Summary copy written from the design; **not legally reviewed** |
| CTA blocks | 5 | Headlines from the design |
| Static pages | 4 | **Placeholder only — see below** |
| Articles | 7 | **Sample news written for the build** — replace with real releases |
| Authors | 2 | Includes the design's placeholder author "gvezenzcha" |
| Media outlets | 4 | Real outlet names, **placeholder logos** |
| Media coverage | 5 | **Sample items linking to outlet home pages**, not real articles |
| Reports | 4 | Real titles; **bodies carry a TODO, not real figures** |
| Job openings | 3 | **Sample vacancies** — not real positions |
| Job categories | 3 | Real category names |
| Career page | 1 | Values, benefits and steps from the design |
| Media | 32 | **All placeholders**, generated at build time |
| Homepage settings | 1 | Section headings and intro copy from the design |
| Site settings | 1 | Real address, phone and emails from the design |

## The policy pages carry no real text

Kebijakan Keamanan Informasi, Kebijakan Privasi, Cara mendapat laporan kredit
and Penyelesaian Pengaduan contain a visible TODO rather than content.

This is deliberate. Rule 1 of `intent/00-README.md` forbids inventing legal
text, and for a company OJK supervises, invented procedural text is a real
compliance risk, not a placeholder. **These four pages must not go live until
the team supplies reviewed copy.**

## Images

All 21 images are generated placeholders — brand-coloured panels with a label —
produced by `scripts/make-placeholders.ts`. They exist so layouts can be judged
at the right proportions. Every one is flagged as sample.

## Before launch

- [ ] **Remove the three sample job vacancies** before the site is public — they are not real positions
- [ ] **Replace the five media coverage items** — they link to outlet home pages, not real articles about CLIK
- [ ] Replace the seven sample articles with real press releases
- [ ] Supply real report bodies, including the financial statement tables
- [ ] Replace the four lorem ipsum testimonials with approved client quotes
- [ ] Replace all placeholder images with real photography and logos
- [ ] Supply reviewed text for the four policy and how-to pages
- [ ] Confirm the OJK licence number, currently blank in site settings
- [ ] Verify every URL in [external links](./external-links.md)
- [ ] Decide whether the homepage stat reads 10.500+ or 2.688 — the design uses both

## Re-running the seed

```bash
npx tsx scripts/make-placeholders.ts     # regenerate the images
npx tsx --env-file=.env scripts/seed-content.ts
```

The seed is idempotent: a collection that already holds documents is skipped,
so running it twice changes nothing and never duplicates content.
