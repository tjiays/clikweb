import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import type { Locale } from '@/i18n/config'

/**
 * Reads the content that is still in the CMS: articles, reports, job
 * vacancies and product items.
 *
 * Page copy, imagery and the structural lists now live in src/content/ and
 * are imported directly by the pages. See src/content/index.ts.
 */

const client = async () => getPayload({ config })

/**
 * True while an editor is previewing. Next turns this on from /preview, and
 * it makes the queries below return the unapproved revision instead of the
 * published one.
 */
const isPreview = async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // draftMode() is unavailable outside a request, e.g. in the sitemap.
    return false
  }
}

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
  options: {
    locale: Locale
    limit?: number
    sort?: string | string[]
    where?: Record<string, unknown>
  },
): Promise<T[]> {
  const payload = await client()
  const { docs } = await payload.find({
    collection: collection as never,
    locale: options.locale,
    limit: options.limit ?? 200,
    sort: options.sort ?? 'sortOrder',
    depth: 2,
    draft: await isPreview(),
    where: ((await isPreview())
      ? (options.where ?? {})
      : { _status: { equals: 'published' }, ...(options.where ?? {}) }) as never,
  })
  return docs as T[]
}

async function listPaged<T>(
  collection: string,
  locale: Locale,
  page: number,
  limit: number,
  sort: string | string[],
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
    draft: await isPreview(),
    where: ((await isPreview())
      ? where
      : { _status: { equals: 'published' }, ...where }) as never,
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
    draft: await isPreview(),
    where: ((await isPreview())
      ? { [field]: { equals: value } }
      : { [field]: { equals: value }, _status: { equals: 'published' } }) as never,
  })
  return (docs[0] as T) ?? null
}

/* ---- Newsroom ---- */

/** Articles marked "hide from list" keep their page but stay off the cards. */
const listedArticles = {
  or: [{ hideFromList: { equals: false } }, { hideFromList: { exists: false } }],
}

/** Same day: the later time comes first, so the order is always the same. */
const NEWEST_FIRST = ['-publishDate', '-id']

export const getLatestArticles = (locale: Locale, limit = 3) =>
  listPublished<any>('articles', { locale, limit, sort: NEWEST_FIRST, where: listedArticles })

export const getArticlesPage = (locale: Locale, page = 1) =>
  listPaged<any>('articles', locale, page, 6, NEWEST_FIRST, listedArticles)

/**
 * Featured News, in the order the editors numbered them. An article may hold
 * more than one place (Figma 1783:10696 lists one twice). Featured articles
 * without a number follow, newest first.
 */
export const getFeaturedArticles = async (locale: Locale, limit = 8) => {
  const articles = await listPublished<any>('articles', {
    locale,
    limit: 100,
    sort: NEWEST_FIRST,
    where: { isFeatured: { equals: true } },
  })
  const placed: { place: number; article: any }[] = []
  const rest: any[] = []
  for (const article of articles) {
    const places = (article.featuredPositions ?? []).filter((n: unknown) => typeof n === 'number')
    if (places.length === 0) rest.push(article)
    for (const place of places) placed.push({ place, article })
  }
  placed.sort((a, b) => a.place - b.place)
  return [...placed.map((p) => p.article), ...rest].slice(0, limit)
}

export const getArticleBySlug = (locale: Locale, slug: string) =>
  findOne<any>('articles', 'slug', slug, locale)

export const getArticlesBySlugs = async (locale: Locale, slugs: string[]) => {
  if (slugs.length === 0) return []
  const docs = await listPublished<any>('articles', {
    locale,
    limit: slugs.length,
    where: { slug: { in: slugs } },
    sort: NEWEST_FIRST,
  })
  return slugs.map((slug) => docs.find((d) => d.slug === slug)).filter(Boolean)
}

/**
 * "Anda mungkin juga tertarik dengan": the articles the editor picked, in
 * their order; otherwise the newest listed articles.
 */
export const getRelatedArticles = async (
  locale: Locale,
  article: { id: string | number; relatedArticles?: unknown },
  limit = 3,
) => {
  const picked = (Array.isArray(article.relatedArticles) ? article.relatedArticles : []).filter(
    (a): a is { id: number; _status?: string } =>
      Boolean(a) && typeof a === 'object' && (a as { _status?: string })._status === 'published',
  )
  if (picked.length > 0) return picked.slice(0, limit)
  const articles = await listPublished<any>('articles', {
    locale,
    limit: limit + 1,
    sort: NEWEST_FIRST,
    where: listedArticles,
  })
  return articles.filter((a) => a.id !== article.id).slice(0, limit)
}

/* ---- Report ---- */
/*
 * Reports keep both languages side by side in the CMS rather than behind the
 * locale switcher, so an editor can see that one of them is empty. That means
 * titleId/titleEn rather than one localised title, and the pages should not
 * have to care: this flattens the pair down to the language being served, so
 * ReportsPage still reads report.title, report.excerpt and report.body.
 */
const forLocale = <T extends Record<string, any>>(doc: T | null, locale: Locale) => {
  if (!doc) return doc
  const L = locale === 'en' ? 'En' : 'Id'
  return {
    ...doc,
    title: doc[`title${L}`] ?? doc.titleId ?? '',
    excerpt: doc[`excerpt${L}`] ?? doc.excerptId ?? '',
    // Fall back to Indonesian rather than render an empty page, in the window
    // before a report has been translated. Approval refuses a half-translated
    // report, so a published one always has both.
    body: doc[`body${L}`] ?? doc.bodyId ?? null,
  }
}

/*
 * Urutan first, then newest. Every report defaults to rank 0, so in practice
 * the list is newest-first on its own and a new report lands at the top
 * without anyone renumbering the ones already there. A lower rank pins a
 * report above that block.
 */
export const getReportsPage = async (locale: Locale, page = 1) => {
  const result = await listPaged<any>('reports', locale, page, 6, ['sortOrder', '-createdAt'])
  return { ...result, docs: result.docs.map((doc) => forLocale(doc, locale)) }
}

export const getReportBySlug = async (locale: Locale, slug: string) =>
  forLocale(await findOne<any>('reports', 'slug', slug, locale), locale)

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
