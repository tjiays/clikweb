import type { Locale } from './config'

/**
 * Every page, with its slug in each language.
 *
 * Per open item O6 the English routes use English wording rather than
 * reusing the Indonesian slugs, which reads better and indexes better.
 * Source: intent/02-website-pages.md section 1.
 */
export const routes = {
  home: { id: '/', en: '/' },
  about: { id: '/tentang-kami', en: '/about-us' },
  reports: { id: '/laporan', en: '/reports' },
  infoSecurityPolicy: {
    id: '/kebijakan-keamanan-informasi',
    en: '/information-security-policy',
  },
  privacyPolicy: { id: '/kebijakan-privasi', en: '/privacy-policy' },
  products: { id: '/layanan-dan-produk', en: '/products-and-services' },
  businessSolution: {
    id: '/layanan-dan-produk/business-solution',
    en: '/products-and-services/business-solution',
  },
  creditScoring: {
    id: '/layanan-dan-produk/credit-scoring',
    en: '/products-and-services/credit-scoring',
  },
  howToGetReport: {
    id: '/layanan-dan-produk/cara-mendapat-laporan-kredit',
    en: '/products-and-services/how-to-get-your-credit-report',
  },
  complaintResolution: {
    id: '/layanan-dan-produk/penyelesaian-pengaduan',
    en: '/products-and-services/complaint-resolution',
  },
  newsroom: { id: '/newsroom', en: '/newsroom' },
  contact: { id: '/hubungi-kami', en: '/contact-us' },
  careers: { id: '/karir', en: '/careers' },
} as const

export type RouteKey = keyof typeof routes

/** Build a URL for a page in the given language, adding the /en prefix when needed. */
export function href(key: RouteKey, locale: Locale): string {
  const path = routes[key][locale]
  if (locale === 'id') return path
  return path === '/' ? '/en' : `/en${path}`
}

/** Given a path in one language, find the same page in the other. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  const match = (Object.keys(routes) as RouteKey[]).find(
    (key) => routes[key].id === stripped || routes[key].en === stripped,
  )
  if (!match) return target === 'en' ? '/en' : '/'
  return href(match, target)
}

/** Finds the page whose slug in this language matches the given path. */
export function matchRoute(pathname: string, locale: Locale): RouteKey | null {
  const normalised = pathname === '' ? '/' : pathname
  const keys = Object.keys(routes) as RouteKey[]
  return keys.find((key) => routes[key][locale] === normalised) ?? null
}

/** A page that takes a slug, such as an article or a job. */
export type DynamicMatch =
  | { kind: 'article'; slug: string }
  | { kind: 'mediaOutlet'; slug: string }
  | { kind: 'report'; slug: string }
  | { kind: 'job'; slug: string }

/**
 * Matches the detail pages that sit under a section, for example
 * `/newsroom/<slug>` or `/karir/<slug>`. Returns null when the path is not one.
 */
export function matchDynamicRoute(pathname: string, locale: Locale): DynamicMatch | null {
  const section = (key: RouteKey) => routes[key][locale]

  const under = (key: RouteKey): string[] | null => {
    const base = section(key)
    if (pathname === base || !pathname.startsWith(`${base}/`)) return null
    return pathname.slice(base.length + 1).split('/').filter(Boolean)
  }

  const news = under('newsroom')
  if (news) {
    // /newsroom/media/<outlet> is the per-outlet coverage page.
    if (news[0] === 'media' && news[1] && news.length === 2) {
      return { kind: 'mediaOutlet', slug: news[1] }
    }
    if (news.length === 1) return { kind: 'article', slug: news[0] }
    return null
  }

  const reports = under('reports')
  if (reports?.length === 1) return { kind: 'report', slug: reports[0] }

  const careers = under('careers')
  if (careers?.length === 1) return { kind: 'job', slug: careers[0] }

  return null
}

/** URL for a detail page. */
export const detailHref = (
  key: Extract<RouteKey, 'newsroom' | 'reports' | 'careers'>,
  slug: string,
  locale: Locale,
) => `${href(key, locale)}/${slug}`

export const mediaOutletHref = (slug: string, locale: Locale) =>
  `${href('newsroom', locale)}/media/${slug}`
