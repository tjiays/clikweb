import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import type { Locale } from '@/i18n/config'
import { publicWhere, startOfTomorrowInJakarta } from './schedule'

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

// The publish-date rule lives in ./schedule so the collections' access rules
// can share it; see the note there.
export { publicWhere } from './schedule'

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
      : publicWhere(collection, options.where ?? {})) as never,
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
    where: ((await isPreview()) ? where : publicWhere(collection, where)) as never,
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
      : publicWhere(collection, { [field]: { equals: value } })) as never,
  })
  return (docs[0] as T) ?? null
}

/* ---- Newsroom ---- */

/** Articles marked "hide from list" keep their page but stay off the cards. */
const forLocale = <T extends Record<string, any>>(doc: T | null, locale: Locale): T | null => {
  if (!doc) return null
  const L = locale === 'en' ? 'En' : 'Id'
  const out: Record<string, any> = { ...doc }
  let paired = false

  /*
   * Every field kept as a visible pair in the CMS — titleId beside titleEn —
   * is flattened to the language being served, so the pages read doc.title
   * and never have to know. A pair is only a pair when both halves exist,
   * which keeps an ordinary field ending in "Id" from being mistaken for one.
   *
   * Indonesian is the fallback: better a page in the wrong language than an
   * empty one, in the window before something is translated. Approval refuses
   * a half-translated item, so anything published has both.
   */
  for (const key of Object.keys(doc)) {
    if (!key.endsWith('Id')) continue
    const base = key.slice(0, -2)
    if (!base || !(`${base}En` in doc)) continue
    paired = true
    out[base] = doc[`${base}${L}`] ?? doc[`${base}Id`] ?? null
  }

  if (!paired) return doc

  if ('seoTitle' in out || 'seoDescription' in out) {
    out.seo = { title: out.seoTitle ?? '', description: out.seoDescription ?? '' }
  }

  // Related articles arrive as whole documents and need the same treatment.
  if (Array.isArray(doc.relatedArticles)) {
    out.relatedArticles = doc.relatedArticles.map((a: any) => forLocale(a, locale))
  }

  return out as T
}


/*
 * Every published article is listed. There used to be a hideFromList flag
 * keeping some off the cards while they sat in Featured News; that is no
 * longer a choice anyone makes, so the filter goes with it.
 */

/** Same day: the later time comes first, so the order is always the same. */
const NEWEST_FIRST = ['-publishDate', '-id']

export const getLatestArticles = async (locale: Locale, limit = 3) =>
  (await listPublished<any>('articles', { locale, limit, sort: NEWEST_FIRST }))
    .map((doc) => forLocale(doc, locale))

export const getArticlesPage = async (locale: Locale, page = 1) => {
  const result = await listPaged<any>('articles', locale, page, 6, NEWEST_FIRST)
  return { ...result, docs: result.docs.map((doc) => forLocale(doc, locale)) }
}

/**
 * Featured News: simply the newest articles.
 *
 * It used to be a hand-ordered list — a checkbox to promote an article and a
 * number to place it. Nobody has to remember either now: whatever was
 * published last is at the top here and at the top of the Newsroom cards,
 * which is what an editor expects after pressing save.
 */
export const getFeaturedArticles = async (locale: Locale, limit = 8) =>
  (await listPublished<any>('articles', { locale, limit, sort: NEWEST_FIRST })).map((a) =>
    forLocale(a, locale),
  )

export const getArticleBySlug = async (locale: Locale, slug: string) =>
  forLocale(await findOne<any>('articles', 'slug', slug, locale), locale)

export const getArticlesBySlugs = async (locale: Locale, slugs: string[]) => {
  if (slugs.length === 0) return []
  const docs = await listPublished<any>('articles', {
    locale,
    limit: slugs.length,
    where: { slug: { in: slugs } },
    sort: NEWEST_FIRST,
  })
  return slugs
    .map((slug) => docs.find((d) => d.slug === slug))
    .filter(Boolean)
    .map((doc) => forLocale(doc, locale))
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
  // These arrive whole from the relationship rather than through a query, so
  // they miss publicWhere and have to be held to the same rule by hand.
  const live = startOfTomorrowInJakarta()
  const picked = (Array.isArray(article.relatedArticles) ? article.relatedArticles : []).filter(
    (a): a is { id: number; _status?: string; publishDate?: string } => {
      if (!a || typeof a !== 'object') return false
      const doc = a as { _status?: string; publishDate?: string }
      if (doc._status !== 'published') return false
      return !doc.publishDate || doc.publishDate < live
    },
  )
  if (picked.length > 0) return picked.slice(0, limit).map((a) => forLocale(a, locale))
  const articles = await listPublished<any>('articles', {
    locale,
    limit: limit + 1,
    sort: NEWEST_FIRST,
  })
  return articles
    .filter((a) => a.id !== article.id)
    .slice(0, limit)
    .map((a) => forLocale(a, locale))
}

/* ---- Report ---- */
/*
 * Reports keep both languages side by side in the CMS rather than behind the
 * locale switcher, so an editor can see that one of them is empty. That means
 * titleId/titleEn rather than one localised title, and the pages should not
 * have to care: this flattens the pair down to the language being served, so
 * ReportsPage still reads report.title, report.excerpt and report.body.
 */


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
  listPublished<any>('job-openings', { locale, where: { isOpen: { equals: true } } }).then((docs) =>
    docs.map((doc) => forLocale(doc, locale)),
  )

export const getJobBySlug = (locale: Locale, slug: string) =>
  findOne<any>('job-openings', 'slug', slug, locale).then((doc) => forLocale(doc, locale))

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
