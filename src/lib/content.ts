import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/config'

/**
 * Reads published content for the public website.
 *
 * Everything the pages render comes from here, never hard-coded, so the CMS
 * stays the single source of truth (rule 3 in intent/00-README.md).
 */

const client = async () => getPayload({ config })

/** Published documents only, newest or lowest sortOrder first. */
type ListOptions = {
  locale: Locale
  limit?: number
  sort?: string
  where?: Record<string, unknown>
}

async function listPublished<T>(collection: string, options: ListOptions): Promise<T[]> {
  const payload = await client()
  const { docs } = await payload.find({
    collection: collection as never,
    locale: options.locale,
    limit: options.limit ?? 100,
    sort: options.sort ?? 'sortOrder',
    depth: 2,
    where: {
      _status: { equals: 'published' },
      ...(options.where ?? {}),
    } as never,
  })
  return docs as T[]
}

export const getHeroSlides = (locale: Locale) =>
  listPublished<any>('hero-slides', { locale })

export const getStats = (locale: Locale) => listPublished<any>('stats', { locale })

export const getTestimonials = (locale: Locale) =>
  listPublished<any>('testimonials', { locale })

export const getMilestones = (locale: Locale) =>
  listPublished<any>('milestones', { locale, sort: 'year' })

export const getProductCategories = (locale: Locale) =>
  listPublished<any>('product-categories', { locale })

export const getPartnerLogos = (locale: Locale, group?: string) =>
  listPublished<any>('partner-logos', {
    locale,
    where: group ? { group: { equals: group } } : undefined,
  })

export const getLatestArticles = (locale: Locale, limit = 3) =>
  listPublished<any>('articles', { locale, limit, sort: '-publishDate' })

export const getProductItems = async (locale: Locale, categorySlug?: string) => {
  const payload = await client()
  const { docs } = await payload.find({
    collection: 'product-items',
    locale,
    limit: 200,
    sort: 'sortOrder',
    depth: 2,
    where: { _status: { equals: 'published' } } as never,
  })
  if (!categorySlug) return docs as any[]
  return (docs as any[]).filter((item) => {
    const category = item.category
    return category && typeof category === 'object' && category.slug === categorySlug
  })
}

/** A single document matched on one field, or null when it does not exist yet. */
async function findOne<T>(
  collection: string,
  field: string,
  value: string,
  locale: Locale,
): Promise<T | null> {
  const payload = await client()
  const { docs } = await payload.find({
    collection: collection as never,
    locale,
    limit: 1,
    depth: 2,
    where: {
      [field]: { equals: value },
      _status: { equals: 'published' },
    } as never,
  })
  return (docs[0] as T) ?? null
}

export const getPageContent = (locale: Locale, page: string) =>
  findOne<any>('page-content', 'page', page, locale)

export const getStaticPage = (locale: Locale, key: string) =>
  findOne<any>('static-pages', 'key', key, locale)

export const getCTABlock = async (locale: Locale, page: string) => {
  const block = await findOne<any>('cta-blocks', 'page', page, locale)
  return block?.isActive === false ? null : block
}

export const getHomeSettings = async (locale: Locale) => {
  const payload = await client()
  try {
    return await payload.findGlobal({ slug: 'home-settings', locale, depth: 2 })
  } catch {
    return null
  }
}

export const getSiteSettings = async (locale: Locale) => {
  const payload = await client()
  try {
    return await payload.findGlobal({ slug: 'site-settings', locale, depth: 2 })
  } catch {
    return null
  }
}

/** Pulls one named section out of a page-content document. */
export const section = (page: any, key: string) =>
  (page?.sections ?? []).find((s: any) => s?.key === key) ?? null

/** Media documents come back as objects at depth >= 1; this narrows safely. */
export const imageUrl = (value: unknown): string | null => {
  if (value && typeof value === 'object' && 'url' in (value as Record<string, unknown>)) {
    const url = (value as { url?: unknown }).url
    return typeof url === 'string' ? url : null
  }
  return null
}

export const imageAlt = (value: unknown, fallback = ''): string => {
  if (value && typeof value === 'object' && 'alt' in (value as Record<string, unknown>)) {
    const alt = (value as { alt?: unknown }).alt
    if (typeof alt === 'string') return alt
  }
  return fallback
}

/* ---------------------------------------------------------------------------
 * Phase 4: Newsroom, Laporan and Karir
 * ------------------------------------------------------------------------- */

export type Paged<T> = {
  docs: T[]
  page: number
  totalPages: number
  totalDocs: number
}

/** A page of published documents, for the paginated lists. */
async function listPaged<T>(
  collection: string,
  locale: Locale,
  page: number,
  limit: number,
  sort: string,
  where: Record<string, unknown> = {},
): Promise<Paged<T>> {
  const payload = await client()
  const result = await payload.find({
    collection: collection as never,
    locale,
    page: Math.max(1, page),
    limit,
    sort,
    depth: 2,
    where: { _status: { equals: 'published' }, ...where } as never,
  })
  return {
    docs: result.docs as T[],
    page: result.page ?? 1,
    totalPages: result.totalPages ?? 1,
    totalDocs: result.totalDocs ?? 0,
  }
}

/** Newsroom shows six articles per page (intent/02 §2.12). */
export const getArticlesPage = (locale: Locale, page = 1) =>
  listPaged<any>('articles', locale, page, 6, '-publishDate')

export const getFeaturedArticles = (locale: Locale, limit = 5) =>
  listPublished<any>('articles', {
    locale,
    limit,
    sort: '-publishDate',
    where: { isFeatured: { equals: true } },
  })

export const getArticleBySlug = (locale: Locale, slug: string) =>
  findOne<any>('articles', 'slug', slug, locale)

/** "Anda mungkin juga tertarik dengan" — latest articles, excluding this one. */
export const getRelatedArticles = async (
  locale: Locale,
  excludeId: string | number,
  limit = 3,
) => {
  const articles = await listPublished<any>('articles', {
    locale,
    limit: limit + 1,
    sort: '-publishDate',
  })
  return articles.filter((article) => article.id !== excludeId).slice(0, limit)
}

export const getMediaOutlets = (locale: Locale) =>
  listPublished<any>('media-outlets', { locale })

export const getOutletBySlug = (locale: Locale, slug: string) =>
  findOne<any>('media-outlets', 'slug', slug, locale)

export const getCoverageForOutlet = (
  locale: Locale,
  outletId: string | number,
  page = 1,
) =>
  listPaged<any>('media-coverage', locale, page, 6, '-publishDate', {
    outlet: { equals: outletId },
  })

export const getReportsPage = (locale: Locale, page = 1) =>
  listPaged<any>('reports', locale, page, 6, 'sortOrder')

export const getReportBySlug = (locale: Locale, slug: string) =>
  findOne<any>('reports', 'slug', slug, locale)

/** Only open positions appear on the website (intent/02 §2.16). */
export const getOpenJobs = (locale: Locale) =>
  listPublished<any>('job-openings', {
    locale,
    where: { isOpen: { equals: true } },
  })

export const getJobBySlug = (locale: Locale, slug: string) =>
  findOne<any>('job-openings', 'slug', slug, locale)

export const getCareerPage = async (locale: Locale) => {
  const payload = await client()
  try {
    return await payload.findGlobal({ slug: 'career-page', locale, depth: 2 })
  } catch {
    return null
  }
}
