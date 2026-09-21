import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/*
 * Reports with no cover silently fell back to a file on disk
 * (public/images/reports/*.jpg), so the picture on the page could not be
 * changed from the CMS. Laporan Perkembangan Usaha was showing one.
 *
 * This brings those files into the Media library and attaches the right one
 * to any report still missing a cover, so every report's picture is an
 * ordinary CMS upload an editor can replace. The code fallback stays as a
 * safety net, but nothing should reach it any more.
 */
const FALLBACKS: Record<string, { file: string; alt: { id: string; en: string } }> = {
  annual_report: {
    file: 'annual-report.jpg',
    alt: { id: 'Sampul Laporan Tahunan', en: 'Annual Report cover' },
  },
  business_development: {
    file: 'business-development.jpg',
    alt: {
      id: 'Sampul Laporan Perkembangan Usaha',
      en: 'Business Development Report cover',
    },
  },
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const reports = await payload.find({
    collection: 'reports',
    limit: 200,
    depth: 0,
    overrideAccess: true,
    pagination: false,
    req,
  })

  const uploaded: Record<string, number> = {}

  for (const report of reports.docs) {
    if (report.cover) continue
    const fallback = FALLBACKS[String(report.type)]
    if (!fallback) continue

    if (!uploaded[fallback.file]) {
      // Matched on alt text, not filename: a previous import reused an
      // unrelated record on a filename collision and left placeholders behind.
      const existing = await payload.find({
        collection: 'media',
        where: { alt: { equals: fallback.alt.id } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })

      if (existing.docs[0]) {
        uploaded[fallback.file] = existing.docs[0].id as number
      } else {
        const created = await payload.create({
          collection: 'media',
          data: { alt: fallback.alt.id },
          filePath: path.resolve(dirname, '../../public/images/reports', fallback.file),
          locale: 'id',
          overrideAccess: true,
          req,
        })
        await payload.update({
          collection: 'media',
          id: created.id,
          data: { alt: fallback.alt.en },
          locale: 'en',
          overrideAccess: true,
          req,
        })
        uploaded[fallback.file] = created.id as number
        payload.logger.info(`Uploaded ${fallback.file} as media ${created.id}`)
      }
    }

    await payload.update({
      collection: 'reports',
      id: report.id,
      data: { cover: uploaded[fallback.file] },
      overrideAccess: true,
      req,
    })
    payload.logger.info(`Report ${report.id} cover set to media ${uploaded[fallback.file]}`)
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Detach the covers this added; the uploaded files stay in the library
  // rather than being deleted, in case an editor has since used them.
  for (const alt of Object.values(FALLBACKS).map((f) => f.alt.id)) {
    const media = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const id = media.docs[0]?.id
    if (!id) continue
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
}
