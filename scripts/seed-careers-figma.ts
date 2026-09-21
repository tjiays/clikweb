import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Figma-parity sample content for Karir / Detail Lowongan (Figma 415:2692,
 * 571:3858).
 *
 *  1. Adds the design's sample vacancy "Sales Ops Intern" (Analysis &
 *     Reporting) with the Key Responsibilities / Minimum Qualifications /
 *     Education text from Figma 571:3858, so the list shows a 2x2 grid of
 *     cards as drawn and the detail page shows the bullet lists.
 *  2. Turns the single-sentence Key Responsibilities / Minimum Qualifications
 *     of the existing sample vacancies into bullet lists (Figma shows every
 *     line as "• …").
 *
 * Everything written here is marked `isSample`. Safe to run repeatedly:
 * vacancies are matched by slug and updated in place.
 *
 *   npx payload run scripts/seed-careers-figma.ts
 */

const text = (t: string) => ({ type: 'text', text: t, mode: 'normal', style: '', detail: 0, format: 0, version: 1 })

const paragraph = (t: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  children: [text(t)],
})

const bullets = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: items.map((t, i) => ({
    type: 'listitem',
    value: i + 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [text(t)],
  })),
})

const root = (children: unknown[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
})

/** Plain text of a rich-text value (to rebuild existing single-paragraph fields as lists). */
const plain = (value: any): string[] =>
  (value?.root?.children ?? [])
    .map((node: any) => (node.children ?? []).map((c: any) => c.text ?? '').join(''))
    .map((s: string) => s.trim())
    .filter(Boolean)

const isList = (value: any) => (value?.root?.children ?? []).some((n: any) => n.type === 'list')

/* Figma 571:3858 (the frame is English; both locales get the same text). */
const salesOpsIntern = {
  slug: 'sales-ops-intern',
  category: 'analysis-reporting',
  title: 'Sales Ops Intern',
  emailSubjectFormat: 'Website',
  responsibilities: [
    'Assist in managing and organizing documents (both physical and digital), including filing and archiving',
    'Input and update data in systems or spreadsheets',
    'Support the preparation of simple reports and minutes of meeting (daily/weekly)',
    'Assist with internal coordination for document signing and vendor payment',
    'Assist in administrative processes such as preparing letters, forms, and surveys, or any other documents',
    'Assist in handling company social media',
    'Handle basic communications (emails, messaging, and responding company email)',
    'Provide general administrative support to the team as needed',
    'Familiarity with tools such as CRM Tools and Canva or other administrative & design graphic platforms',
    'Basic data analysis or reporting skills',
  ],
  qualifications: [
    'Currently enrolled student in the final year or recent graduate (preferably in Administration, Management, or related fields)',
    'Detail-oriented, organized, and able to manage multiple tasks',
    'Proficient in Microsoft Office (especially Ms. Excel, Ms. Word, and Ms. Power Point)',
    'Good communication skills',
    'Proactive with a willingness to learn',
    'Able to work independently and in a team',
  ],
  education: 'Final year or recent graduate (preferably in Administration, Management, or related fields)',
}

const run = async () => {
  const payload = await getPayload({ config })

  // 1. Sales Ops Intern
  const existing = await payload.find({
    collection: 'job-openings',
    where: { slug: { equals: salesOpsIntern.slug } },
    locale: 'id',
    limit: 1,
    depth: 0,
    draft: true,
  })
  const data = {
    title: salesOpsIntern.title,
    slug: salesOpsIntern.slug,
    category: salesOpsIntern.category,
    responsibilities: root([bullets(salesOpsIntern.responsibilities)]),
    minimumQualifications: root([bullets(salesOpsIntern.qualifications)]),
    education: root([paragraph(salesOpsIntern.education)]),
    applyEmail: 'talent@cbclik.com',
    emailSubjectFormat: salesOpsIntern.emailSubjectFormat,
    isOpen: true,
    isSample: true,
    approvalStatus: 'approved',
    _status: 'published',
  }
  const id = existing.docs[0]?.id
  const doc = id
    ? await payload.update({ collection: 'job-openings', id, locale: 'id', data: data as never, overrideAccess: true })
    : await payload.create({ collection: 'job-openings', locale: 'id', data: data as never, overrideAccess: true })
  await payload.update({ collection: 'job-openings', id: doc.id, locale: 'en', data: data as never, overrideAccess: true })
  payload.logger.info(`${id ? 'Updated' : 'Created'} ${salesOpsIntern.slug}`)

  // 2. Existing sample vacancies: paragraphs -> bullet lists
  const samples = await payload.find({
    collection: 'job-openings',
    where: { isSample: { equals: true }, slug: { not_equals: salesOpsIntern.slug } },
    limit: 100,
    depth: 0,
  })
  for (const job of samples.docs as any[]) {
    for (const locale of ['id', 'en'] as const) {
      const localized: any = await payload.findByID({ collection: 'job-openings', id: job.id, locale, depth: 0 })
      // Send the category too: the stored draft version may predate the field.
      const patch: Record<string, unknown> = {}
      for (const field of ['responsibilities', 'minimumQualifications'] as const) {
        const value = localized[field]
        if (value && !isList(value)) patch[field] = root([bullets(plain(value))])
      }
      if (Object.keys(patch).length) {
        patch.category = localized.category
        await payload.update({ collection: 'job-openings', id: job.id, locale, data: patch as never, overrideAccess: true })
        payload.logger.info(`Bullets for ${localized.slug} (${locale})`)
      }
    }
  }

  process.exit(0)
}

// Top-level await: `payload run` exits as soon as the import settles.
await run().catch((error) => {
  console.error(error)
  process.exit(1)
})
