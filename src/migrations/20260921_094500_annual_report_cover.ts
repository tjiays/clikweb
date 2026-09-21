import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const ALT = { id: 'Sampul Laporan Tahunan', en: 'Annual Report cover' }
const FILE = 'annual-report.jpg'

/** The annual-report detail hero, from ReportsPage. */
const HERO_WIDTH = 1300

/*
 * The three annual reports carried a 360x215 seed placeholder as their cover.
 * That is smaller than both the 406px card and the 1300px hero, so the page
 * quietly used public/images/reports/annual-report.jpg instead and the
 * picture a reader saw was not in the CMS at all — changing the cover in the
 * admin did nothing.
 *
 * This puts the real 2000x1333 photo in the Media library and attaches it, so
 * the annual reports show their own CMS image everywhere.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: ALT.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })

  let mediaId = existing.docs[0]?.id as number | undefined

  if (!mediaId) {
    const created = await payload.create({
      collection: 'media',
      data: { alt: ALT.id },
      filePath: path.resolve(dirname, '../../public/images/reports', FILE),
      locale: 'id',
      overrideAccess: true,
      req,
    })
    await payload.update({
      collection: 'media',
      id: created.id,
      data: { alt: ALT.en },
      locale: 'en',
      overrideAccess: true,
      req,
    })
    mediaId = created.id as number
    payload.logger.info(`Uploaded ${FILE} as media ${mediaId}`)
  }

  const reports = await payload.find({
    collection: 'reports',
    where: { type: { equals: 'annual_report' } },
    limit: 200,
    depth: 1,
    overrideAccess: true,
    pagination: false,
    req,
  })

  for (const report of reports.docs) {
    const cover = report.cover as { id?: number; width?: number } | null | undefined
    // Leave alone any cover already big enough for the hero.
    if (cover && typeof cover.width === 'number' && cover.width >= HERO_WIDTH) continue
    await payload.update({
      collection: 'reports',
      id: report.id,
      data: { cover: mediaId },
      overrideAccess: true,
      req,
    })
    payload.logger.info(`Report ${report.id} cover -> media ${mediaId}`)
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // The uploaded file stays in the library; only the links are undone.
  const media = await payload.find({
    collection: 'media',
    where: { alt: { equals: ALT.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const id = media.docs[0]?.id
  if (!id) return
  const reports = await payload.find({
    collection: 'reports',
    where: { cover: { equals: id } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
    pagination: false,
    req,
  })
  for (const report of reports.docs) {
    await payload.update({
      collection: 'reports',
      id: report.id,
      data: { cover: null },
      overrideAccess: true,
      req,
    })
  }
}
