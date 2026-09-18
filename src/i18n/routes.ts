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
