import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'node:path'
import fs from 'node:fs'
import {
  rich,
  heroSlides,
  stats,
  homeSettings,
  testimonials,
  partnerLogos,
  milestones,
  productCategories,
  productItems,
  pageContent,
  ctaBlocks,
  staticPages,
  TODO_LEGAL,
  authors,
  mediaOutlets,
  articles,
  mediaCoverage,
  reports,
  jobCategories,
  jobOpenings,
  careerPage,
} from './seed-data'

/**
 * Imports the Figma text as published seed content so the site looks like the
 * design on first run (intent/03-cms.md §7).
 *
 * Idempotent: a collection that already holds documents is left alone, so
 * running this twice does not duplicate anything.
 */

type Bilingual = { id: string; en: string }

const run = async () => {
  const payload = await getPayload({ config })
  const log = (message: string) => payload.logger.info(message)

  /**
   * Resolves every { id, en } pair in a value to one language, however deeply
   * it is nested. Arrays of rows (advantages, use cases) carry required
   * localised fields, so both locales must receive the whole array.
   */
  const pick = (value: unknown, lang: 'id' | 'en'): unknown => {
    if (Array.isArray(value)) return value.map((item) => pick(item, lang))
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>
      const keys = Object.keys(record)
      // A bilingual pair is exactly { id, en }. Values may be plain strings or
      // rich text objects, but never anything else at this position.
      const isBilingual =
        keys.length === 2 && keys.includes('id') && keys.includes('en')
      if (isBilingual) return record[lang]
      const next: Record<string, unknown> = {}
      for (const [key, child] of Object.entries(record)) next[key] = pick(child, lang)
      return next
    }
    return value
  }

  /**
   * Copies the row ids Payload assigned on create into the matching rows of
   * the English payload, by position, so the update edits those rows instead
   * of replacing the array.
   */
  const attachRowIds = (next: unknown, created: unknown): unknown => {
    if (Array.isArray(next) && Array.isArray(created)) {
      return next.map((row, index) => {
        const source = created[index]
        if (row && typeof row === 'object' && source && typeof source === 'object') {
          const id = (source as { id?: unknown }).id
          const merged = attachRowIds(row, source) as Record<string, unknown>
          return id === undefined ? merged : { ...merged, id }
        }
        return row
      })
    }
    if (next && typeof next === 'object' && created && typeof created === 'object') {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(next as Record<string, unknown>)) {
        result[key] = attachRowIds(value, (created as Record<string, unknown>)[key])
      }
      return result
    }
    return next
  }

  /** Creates a document in both locales. Indonesian first, then English. */
  const createBilingual = async (
    collection: string,
    data: Record<string, unknown>,
    bilingualKeys: string[],
  ) => {
    const idData = pick(data, 'id') as Record<string, unknown>
    const created = await payload.create({
      collection: collection as never,
      locale: 'id',
      data: { ...idData, approvalStatus: 'approved' } as never,
      overrideAccess: true,
    })

    // The English write must carry every required localised field, including
    // those inside repeated rows, so the whole document is sent again. Rows
    // must keep the ids Payload assigned, or the array is replaced and the
    // Indonesian text inside it is lost.
    const enData = attachRowIds(
      pick(data, 'en') as Record<string, unknown>,
      created as Record<string, unknown>,
    ) as Record<string, unknown>
    delete enData.approvalStatus
    await payload.update({
      collection: collection as never,
      id: (created as { id: string | number }).id,
      locale: 'en',
      data: enData as never,
      overrideAccess: true,
    })
    return created
  }

  /**
   * Uploads the generated placeholder images once and returns a map from file
   * name to media id. Every one is flagged as sample so it is easy to find.
   */
  const seedMedia = async (): Promise<Record<string, string | number>> => {
    const dir = path.resolve(process.cwd(), '.placeholders')
    const map: Record<string, string | number> = {}
    if (!fs.existsSync(dir)) {
      log('No .placeholders directory — run scripts/make-placeholders.ts first.')
      return map
    }

    const existing = await payload.find({ collection: 'media', limit: 200, locale: 'id' })
    for (const doc of existing.docs as { id: string | number; filename?: string }[]) {
      if (doc.filename) map[doc.filename] = doc.id
    }

    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.png'))) {
      if (map[file]) continue
      const label = file.replace(/\.png$/, '').replace(/-/g, ' ')
      const created = await payload.create({
        collection: 'media',
        locale: 'id',
        data: { alt: `Placeholder: ${label}`, isSample: true } as never,
        filePath: path.join(dir, file),
        overrideAccess: true,
      })
      const doc = created as { id: string | number; filename?: string }
      map[doc.filename ?? file] = doc.id
      await payload.update({
        collection: 'media',
        id: doc.id,
        locale: 'en',
        data: { alt: `Placeholder: ${label}` } as never,
        overrideAccess: true,
      })
    }
    log(`Media library holds ${Object.keys(map).length} images`)
    return map
  }

  const media = await seedMedia()

  const isEmpty = async (collection: string) => {
    const { totalDocs } = await payload.count({ collection: collection as never })
    return totalDocs === 0
  }

  // --- Homepage hero ---
  if (await isEmpty('hero-slides')) {
    for (const [index, slide] of heroSlides.entries()) {
      await createBilingual(
        'hero-slides',
        { ...slide, image: media[`hero-${index + 1}.png`] },
        ['title', 'subtitle', 'buttonLabel'],
      )
    }
    log(`Seeded ${heroSlides.length} hero slides`)
  }

  // --- Stats ---
  if (await isEmpty('stats')) {
    for (const stat of stats) await createBilingual('stats', stat, ['label'])
    log(`Seeded ${stats.length} stats`)
  }

  // --- Testimonials (lorem ipsum, flagged as sample) ---
  if (await isEmpty('testimonials')) {
    for (const t of testimonials) await createBilingual('testimonials', t, ['quote'])
    log(`Seeded ${testimonials.length} testimonials (sample)`)
  }

  // --- Partner logos ---
  if (await isEmpty('partner-logos')) {
    for (const { file, ...logo } of partnerLogos) {
      await payload.create({
        collection: 'partner-logos',
        locale: 'id',
        data: { ...logo, logo: media[file], isSample: true } as never,
        overrideAccess: true,
      })
    }
    log(`Seeded ${partnerLogos.length} partner logos`)
  }

  // --- Milestones ---
  if (await isEmpty('milestones')) {
    for (const milestone of milestones) {
      // Written through createBilingual so both locales are set in one pass.
      // Updating an array field per locale replaces its rows and would wipe
      // the other language.
      await createBilingual('milestones', milestone as never, [])
    }
    log(`Seeded ${milestones.length} milestones`)
  }

  // --- Product categories, then the items that belong to them ---
  const categoryIds: Record<string, string | number> = {}
  if (await isEmpty('product-categories')) {
    for (const category of productCategories) {
      const created = await createBilingual(
        'product-categories',
        {
          ...category,
          icon: media[`icon-${category.slug}.png`],
          image: media['products.png'],
        },
        ['name', 'shortDescription', 'lead'],
      )
      categoryIds[category.slug] = (created as { id: string | number }).id
    }
    log(`Seeded ${productCategories.length} product categories`)
  } else {
    const { docs } = await payload.find({
      collection: 'product-categories',
      limit: 100,
      locale: 'id',
    })
    for (const doc of docs as { id: string | number; slug?: string }[]) {
      if (doc.slug) categoryIds[doc.slug] = doc.id
    }
  }

  if (await isEmpty('product-items')) {
    let order = 0
    for (const item of productItems) {
      const categoryId = categoryIds[item.category]
      if (!categoryId) continue
      const created = await payload.create({
        collection: 'product-items',
        locale: 'id',
        data: {
          name: item.name,
          category: categoryId,
          productStatus: item.status,
          isNew: item.isNew ?? false,
          sortOrder: order++,
          approvalStatus: 'approved',
        } as never,
        overrideAccess: true,
      })
      // Product names are never translated (intent/04 §4).
      await payload.update({
        collection: 'product-items',
        id: (created as { id: string | number }).id,
        locale: 'en',
        data: { name: item.name } as never,
        overrideAccess: true,
      })
    }
    log(`Seeded ${productItems.length} product items`)
  }

  // --- Page content for the prose-heavy pages ---
  if (await isEmpty('page-content')) {
    for (const page of pageContent) {
      await createBilingual(
        'page-content',
        {
          page: page.page,
          title: page.title,
          lead: page.lead,
          heroImage: media[page.heroFile],
          isSample: true,
          sections: page.sections.map((s: any) => ({
            key: s.key,
            title: s.title,
            image: s.imageFile ? media[s.imageFile] : undefined,
            body: {
              id: rich(s.body.id),
              en: rich(s.body.en),
            },
          })),
        },
        [],
      )
    }
    log(`Seeded ${pageContent.length} page-content documents`)
  }

  // --- Closing CTA blocks ---
  if (await isEmpty('cta-blocks')) {
    for (const block of ctaBlocks) {
      const cross = (block as any).crossLink
      await createBilingual(
        'cta-blocks',
        {
          page: block.page,
          isActive: true,
          isSample: true,
          crossLink: cross
            ? {
                label: cross.label,
                title: cross.title,
                targetUrl: cross.targetUrl,
                image: media[cross.imageFile],
              }
            : undefined,
          banner: {
            title: block.banner.title,
            buttonLabel: block.banner.buttonLabel,
            buttonLink: block.banner.buttonLink,
            backgroundImage: media['cta-banner.png'],
          },
        },
        [],
      )
    }
    log(`Seeded ${ctaBlocks.length} CTA blocks`)
  }

  // --- Policy and how-to pages (placeholder text; see TODO_LEGAL) ---
  if (await isEmpty('static-pages')) {
    for (const page of staticPages) {
      await createBilingual(
        'static-pages',
        {
          key: page.key,
          title: page.title,
          isSample: true,
          body: { id: rich(TODO_LEGAL(page.name)), en: rich(TODO_LEGAL(page.name)) },
        },
        [],
      )
    }
    log(`Seeded ${staticPages.length} static pages (placeholder text)`)
  }

  // --- Newsroom: authors, outlets, articles, coverage ---
  const authorIds: (string | number)[] = []
  if (await isEmpty('authors')) {
    for (const author of authors) {
      const created = await payload.create({
        collection: 'authors',
        locale: 'id',
        data: author as never,
        overrideAccess: true,
      })
      authorIds.push((created as { id: string | number }).id)
    }
    log(`Seeded ${authors.length} authors`)
  } else {
    const { docs } = await payload.find({ collection: 'authors', limit: 50, locale: 'id' })
    authorIds.push(...docs.map((d: any) => d.id))
  }

  const outletIds: Record<string, string | number> = {}
  if (await isEmpty('media-outlets')) {
    for (const { file, ...outlet } of mediaOutlets) {
      const created = await payload.create({
        collection: 'media-outlets',
        locale: 'id',
        data: { ...outlet, logo: media[file], isSample: true } as never,
        overrideAccess: true,
      })
      outletIds[outlet.slug] = (created as { id: string | number }).id
    }
    log(`Seeded ${mediaOutlets.length} media outlets`)
  } else {
    const { docs } = await payload.find({ collection: 'media-outlets', limit: 50, locale: 'id' })
    for (const doc of docs as any[]) outletIds[doc.slug] = doc.id
  }

  if (await isEmpty('articles')) {
    const covers = ['article-1.png', 'article-2.png', 'article-3.png']
    for (const [index, article] of articles.entries()) {
      await createBilingual(
        'articles',
        {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          body: { id: rich(article.body.id), en: rich(article.body.en) },
          cover: media[covers[index % covers.length]],
          author: authorIds[index % authorIds.length],
          publishDate: `${article.publishDate}T00:00:00.000Z`,
          isFeatured: article.isFeatured,
          isSample: true,
        },
        [],
      )
    }
    log(`Seeded ${articles.length} articles`)
  }

  if (await isEmpty('media-coverage')) {
    for (const item of mediaCoverage) {
      const outletId = outletIds[item.outlet]
      if (!outletId) continue
      await createBilingual(
        'media-coverage',
        {
          title: item.title,
          outlet: outletId,
          externalUrl: item.url,
          image: media['article-1.png'],
          publishDate: `${item.publishDate}T00:00:00.000Z`,
          isSample: true,
        },
        [],
      )
    }
    log(`Seeded ${mediaCoverage.length} media coverage items`)
  }

  // --- Laporan ---
  if (await isEmpty('reports')) {
    for (const report of reports) {
      const isAnnual = report.type === 'annual_report'
      await createBilingual(
        'reports',
        {
          type: report.type,
          title: report.title,
          slug: report.slug,
          year: report.year,
          sortOrder: report.sortOrder,
          // The business-development variant has no cover image in the design.
          cover: isAnnual ? media['report.png'] : undefined,
          body: {
            id: rich(TODO_LEGAL(`isi ${report.title.id}`)),
            en: rich(TODO_LEGAL(`the contents of ${report.title.en}`)),
          },
          isSample: true,
        },
        [],
      )
    }
    log(`Seeded ${reports.length} reports (placeholder body)`)
  }

  // --- Karir ---
  const categoryRefs: (string | number)[] = []
  if (await isEmpty('job-categories')) {
    for (const category of jobCategories) {
      const created = await createBilingual('job-categories', category as never, [])
      categoryRefs.push((created as { id: string | number }).id)
    }
    log(`Seeded ${jobCategories.length} job categories`)
  } else {
    const { docs } = await payload.find({ collection: 'job-categories', limit: 50, locale: 'id' })
    categoryRefs.push(...docs.map((d: any) => d.id))
  }

  if (await isEmpty('job-openings')) {
    for (const job of jobOpenings) {
      await createBilingual(
        'job-openings',
        {
          title: job.title,
          slug: job.slug,
          category: categoryRefs[job.category],
          responsibilities: { id: rich(job.responsibilities.id), en: rich(job.responsibilities.en) },
          minimumQualifications: {
            id: rich(job.minimumQualifications.id),
            en: rich(job.minimumQualifications.en),
          },
          education: { id: rich(job.education.id), en: rich(job.education.en) },
          applyEmail: 'talent@cbclik.com',
          emailSubjectFormat: {
            id: `Lamaran - ${job.title.id}`,
            en: `Application - ${job.title.en}`,
          },
          isOpen: true,
          postedDate: '2026-09-01T00:00:00.000Z',
          isSample: true,
        },
        [],
      )
    }
    log(`Seeded ${jobOpenings.length} job openings`)
  }

  // --- Career page (global) ---
  {
    const careerData: Record<string, unknown> = {
      ...careerPage,
      heroImages: ['career-1.png', 'career-2.png', 'career-3.png'].map((file) => ({
        image: media[file],
      })),
    }
    const idCareer = pick(careerData, 'id') as Record<string, unknown>
    await payload.updateGlobal({
      slug: 'career-page',
      locale: 'id',
      data: { ...idCareer, approvalStatus: 'approved' } as never,
      overrideAccess: true,
    })
    const saved = await payload.findGlobal({ slug: 'career-page', locale: 'id', depth: 0 })
    const enCareer = attachRowIds(
      pick(careerData, 'en'),
      saved as unknown as Record<string, unknown>,
    ) as Record<string, unknown>
    delete enCareer.approvalStatus
    await payload.updateGlobal({
      slug: 'career-page',
      locale: 'en',
      data: enCareer as never,
      overrideAccess: true,
    })
    log('Seeded career page content')
  }

  // --- Homepage settings (global) ---
  const idGlobal: Record<string, unknown> = {}
  const enGlobal: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(homeSettings)) {
    idGlobal[key] = (value as Bilingual).id
    enGlobal[key] = (value as Bilingual).en
  }
  await payload.updateGlobal({
    slug: 'home-settings',
    locale: 'id',
    data: { ...idGlobal, approvalStatus: 'approved' } as never,
    overrideAccess: true,
  })
  await payload.updateGlobal({
    slug: 'home-settings',
    locale: 'en',
    data: enGlobal as never,
    overrideAccess: true,
  })
  log('Seeded homepage settings')

  // --- Site settings (global) ---
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'id',
    data: {
      companyName: 'PT CRIF Lembaga Informasi Keuangan',
      address:
        'Menara Dea Tower 2, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
      phone: '(+62) 21 8060 4228',
      generalEmail: 'info@cbclik.com',
      salesEmail: 'sales@cbclik.com',
      careersEmail: 'talent@cbclik.com',
      websiteUrl: 'https://www.cbclik.com',
      crifUrl: 'https://www.crif.com',
      // The three icons in the footer design are WhatsApp, Instagram and
      // LinkedIn — confirmed by exporting them from the Figma file.
      socialLinks: [
        { platform: 'whatsapp', url: 'https://wa.me/622180604228' },
        { platform: 'instagram', url: 'https://www.instagram.com/clik.indonesia/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/company/clik-indonesia/' },
      ],
    } as never,
    overrideAccess: true,
  })
  log('Seeded site settings')

  log('Seeding complete.')
  process.exit(0)
}

run().catch((error) => {
  const detail = (error as { data?: { errors?: unknown[] } })?.data?.errors
  if (detail) {
    console.error('Validation errors:', JSON.stringify(detail, null, 2))
  }
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
