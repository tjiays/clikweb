import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Everything the dashboard shows, gathered in one place.
 *
 * Every query is wrapped: a dashboard that cannot load one figure should show
 * the rest, not fall over.
 */

export type MonthPoint = { label: string; month: string; count: number }
export type CategoryPoint = { label: string; slug: string; count: number }
export type ActivityRow = { action: string; title: string; user: string; at: string }

export type DashboardData = {
  counts: Record<string, number>
  inReview: Record<string, number>
  published: MonthPoint[]
  byCategory: CategoryPoint[]
  activity: ActivityRow[]
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const CATEGORY_LABEL: Record<string, string> = {
  'credit-scoring': 'Credit Scoring',
  analytics: 'Analytics',
  decisioning: 'Decisioning',
  'business-intelligence': 'Business Intelligence',
  consulting: 'Consulting',
}

const safe = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export async function getDashboardData(slugs: string[]): Promise<DashboardData> {
  const payload = await getPayload({ config })

  const counts: Record<string, number> = {}
  const inReview: Record<string, number> = {}

  for (const slug of slugs) {
    counts[slug] = await safe(
      async () => (await payload.count({ collection: slug as never })).totalDocs,
      0,
    )
  }

  for (const slug of ['articles', 'reports', 'product-items', 'job-openings']) {
    if (!slugs.includes(slug)) continue
    const n = await safe(
      async () =>
        (
          await payload.count({
            collection: slug as never,
            where: { approvalStatus: { equals: 'in_review' } } as never,
          })
        ).totalDocs,
      0,
    )
    if (n > 0) inReview[slug] = n
  }

  // --- Articles published per month, last 12 months ---
  const now = new Date()
  const buckets: MonthPoint[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      label: MONTHS_ID[d.getMonth()],
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      count: 0,
    })
  }

  const articles = await safe(
    async () =>
      (
        await payload.find({
          collection: 'articles',
          limit: 500,
          depth: 0,
          sort: '-publishDate',
        })
      ).docs as { publishDate?: string }[],
    [],
  )

  for (const article of articles) {
    if (!article.publishDate) continue
    const key = String(article.publishDate).slice(0, 7)
    const bucket = buckets.find((b) => b.month === key)
    if (bucket) bucket.count += 1
  }

  // --- Products per category ---
  const products = await safe(
    async () =>
      (await payload.find({ collection: 'product-items', limit: 500, depth: 0 }))
        .docs as { category?: string }[],
    [],
  )

  const tally: Record<string, number> = {}
  for (const product of products) {
    if (!product.category) continue
    tally[product.category] = (tally[product.category] ?? 0) + 1
  }

  const byCategory: CategoryPoint[] = Object.keys(CATEGORY_LABEL)
    .map((slug) => ({ slug, label: CATEGORY_LABEL[slug], count: tally[slug] ?? 0 }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)

  // --- Recent activity, from the audit log ---
  const ACTION_ID: Record<string, string> = {
    create: 'Dibuat',
    update: 'Diubah',
    submit: 'Dikirim untuk review',
    approve: 'Disetujui',
    reject: 'Ditolak',
    delete: 'Dihapus',
  }

  const activity = await safe(
    async () =>
      (
        await payload.find({
          collection: 'audit-log',
          limit: 8,
          sort: '-createdAt',
          depth: 0,
        })
      ).docs.map((row) => {
        const r = row as {
          action?: string
          documentTitle?: string
          userEmail?: string
          createdAt?: string
        }
        return {
          action: ACTION_ID[r.action ?? ''] ?? r.action ?? '',
          title: r.documentTitle || '—',
          user: (r.userEmail ?? '').split('@')[0] || '—',
          at: r.createdAt ?? '',
        }
      }) as ActivityRow[],
    [],
  )

  return { counts, inReview, published: buckets, byCategory, activity }
}
