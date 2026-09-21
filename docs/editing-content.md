# Editing page content

Most of the site's wording and imagery lives in **code**, not the CMS. This is
how you change it.

## Where things live

| What | Where | Who changes it |
| --- | --- | --- |
| Articles, reports, vacancies, product items | The CMS | Your team, any time |
| Everything else — page copy, headings, imagery | `src/content/` and `public/images/` | A developer, then a deploy |

That split is deliberate. The CMS keeps the things a non-technical person
publishes on their own schedule. The rest changes rarely and is easier to read
and review as code.

**The trade-off:** anything in `src/content/` needs a developer and a deploy to
change. If something starts changing weekly, tell us and we move it back.

## Changing wording

Every content file holds bilingual pairs. Edit the text, keep the shape:

```ts
title: { id: 'Tentang CLIK', en: 'About CLIK' },
```

| File | Covers |
| --- | --- |
| `src/content/home.ts` | Hero slides, stats, all homepage section headings |
| `src/content/about.ts` | Tentang CLIK, Visi, Misi, Tentang CRIF, the timeline |
| `src/content/products.ts` | The five categories, and the copy for Layanan dan Produk, Business Solution and Credit Scoring |
| `src/content/careers.ts` | Karir hero, values, benefits, recruitment steps, job categories |
| `src/content/newsroom.ts` | Media outlets and their coverage |
| `src/content/policies.ts` | The four policy and how-to pages |
| `src/content/testimonials.ts` | Partner quotes |
| `src/content/partners.ts` | Member and regulator logos |
| `src/content/cta.ts` | The closing block on each page |
| `src/content/site.ts` | Address, phone, emails, social links, OJK licence |

## Changing an image

Images are grouped by page:

```
public/images/
  shared/     logos, social icons, stat and benefit icons
  home/       hero-1..3.jpeg, stat and shield icons, solution-*.png, partners/ (testimonial logos)
  about/      growing-in-asia.png  visi-team.png  misi-target.png  lpip-photo.jpg
              crif-world.jpg  crif-stats.jpg  crif-countries.jpg  members/ (member logos)
  products/   category photos and icons, data/ icons, services/ carousel art,
              credit-scoring/ illustrations, cb-score-gauge.webp, crif-bird.webp
  careers/    strip-1..6.jpg (moving photo band), step-1..5.png (recruitment steps)
  newsroom/   logo-*.png/svg (media outlets), logos/ (moving logo strip), coverage/
  reports/    fallback report covers
  policies/   how-to illustrations
  cta/        closing banner photos, one per page
```

**To replace one:** drop a file in with the same name. Nothing else to change.

**To use a different name:** put the file in the folder, then update the path
in the matching content file.

Keep images under about 1920px wide — larger ones slow the page down for no
visible gain.

## Deploying a change

```bash
cd /home/dnugroho/clikwebsite
git pull
./deploy/release.sh
```

`release.sh` backs up first, builds, and stops if the build fails, so a typo
cannot take the site down.

## One thing to watch

`next.config.ts` lists which paths the image optimiser will serve:

```ts
localPatterns: [
  { pathname: '/api/media/file/**' },
  { pathname: '/images/**' },
]
```

An image outside those paths returns **400 and renders as nothing**, with no
error in the build. If a picture silently fails to appear, check this first —
it has caused exactly that twice.
