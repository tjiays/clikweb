import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { seedReportsFromFigma } from '../src/migrations/seeds/reportsFromFigma'

/**
 * Re-applies the Figma sample content to the Laporan sample reports (titles,
 * excerpts, byline, date, body and financial tables). The migration
 * 20260921_050902_reports_author_financial_tables runs the same seed; use this
 * on a database where that migration had already run before the seed existed.
 * Only reports flagged "Sample content" are touched.
 *
 *   npx tsx scripts/seed-reports-figma.ts   (reads DATABASE_URI from .env)
 */
const run = async () => {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  await seedReportsFromFigma(payload, req)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
