import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/config'

/**
 * Reads the content that is still in the CMS: articles, reports, job
 * vacancies and product items.
 *
 * Page copy, imagery and the structural lists now live in src/content/ and
 * are imported directly by the pages. See src/content/index.ts.
 */

const client = async () => getPayload({ config })

/** Picks the right language out of a bilingual pair from src/content. */
export const t = <T extends { id: string; en: string }>(value: T | undefined, locale: Locale) =>
  value ? value[locale] : ''

export type Paged<T> = {
  docs: T[]
  page: number
  totalPages: number
  totalDocs: number
}

async function listPublished<T>(
  collection: string,
  options: { locale: Locale; limit?: number; sort?: string; where?: Record<string, unknown> },
): Promise<T[]> {
  const payload = await client()
  const { docs } = await payload.find({
    collection: collection as never,
    locale: options.locale,
    limit: options.limit ?? 200,
    sort: options.sort ?? 'sortOrder',
    depth: 2,
    where: { _status: { equals: 'published' }, ...(options.where ?? {}) } as never,
  })
  return docs as T[]
}

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
    where: { [field]: { equals: value }, _status: { equals: 'published' } } as never,
  })
  return (docs[0] as T) ?? null
}

/* ---- Newsroom ---- */
export const getLatestArticles = (locale: Locale, limit = 3) =>
  listPublished<any>('articles', { locale, limit, sort: '-publishDate' })

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

export const getRelatedArticles = async (locale: Locale, excludeId: string | number, limit = 3) => {
  const articles = await listPublished<any>('articles', { locale, limit: limit + 1, sort: '-publishDate' })
  return articles.filter((a) => a.id !== excludeId).slice(0, limit)
}

/* ---- Report ---- */
export const getReportsPage = (locale: Locale, page = 1) =>
  listPaged<any>('reports', locale, page, 6, 'sortOrder')

export const getReportBySlug = (locale: Locale, slug: string) =>
  findOne<any>('reports', 'slug', slug, locale)

/* ---- Karir ---- */
export const getOpenJobs = (locale: Locale) =>
  listPublished<any>('job-openings', { locale, where: { isOpen: { equals: true } } })

export const getJobBySlug = (locale: Locale, slug: string) =>
  findOne<any>('job-openings', 'slug', slug, locale)

/* ---- Product ---- */
export const getProductItems = async (locale: Locale, categorySlug?: string) => {
  const docs = await listPublished<any>('product-items', { locale })
  return categorySlug ? docs.filter((item) => item.category === categorySlug) : docs
}

/* ---- Media helpers, for the images that are still uploaded ---- */
export const imageUrl = (value: unknown): string | null => {
  if (typeof value === 'string') return value
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
