import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { routes, type RouteKey } from '@/i18n/routes'
import { locales } from '@/i18n/config'
import { mediaOutlets } from '@/content/newsroom'

/**
 * sitemap.xml covering both languages.
 *
 * Every page appears once per language, and each entry declares its
 * counterpart through `alternates`, which is what produces the hreflang
 * annotations search engines use to serve the right language.
 */
/**
 * Evaluated per request. Prerendering would freeze the sitemap at build time,
 * so articles published afterwards would never appear in it.
 */
export const dynamic = 'force-dynamic'

const base = () =>
  (process.env.SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'https://cbclik.com').replace(
    /\/$/,
    '',
  )

const absolute = (path: string) => `${base()}${path === '/' ? '' : path}` || base()

/** Both language versions of one page, for the alternates block. */
const languagesFor = (id: string, en: string) => ({
  id: absolute(id),
  en: absolute(en),
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages, from the route map.
  for (const key of Object.keys(routes) as RouteKey[]) {
    const idPath = routes[key].id
    const enPath = routes[key].en === '/' ? '/en' : `/en${routes[key].en}`
    const languages = languagesFor(idPath, enPath)

    for (const locale of locales) {
      entries.push({
        url: locale === 'id' ? absolute(idPath) : absolute(enPath),
        changeFrequency: key === 'home' || key === 'newsroom' ? 'weekly' : 'monthly',
        priority: key === 'home' ? 1 : 0.7,
        alternates: { languages },
      })
    }
  }

  // Content that lives in the CMS.
  try {
    const payload = await getPayload({ config })

    const collections: { slug: string; idBase: string; enBase: string }[] = [
      { slug: 'articles', idBase: '/newsroom', enBase: '/en/newsroom' },
      { slug: 'reports', idBase: '/laporan', enBase: '/en/reports' },
      { slug: 'job-openings', idBase: '/karir', enBase: '/en/careers' },
    ]

    for (const collection of collections) {
      for (const locale of locales) {
        const { docs } = await payload.find({
          collection: collection.slug as never,
          locale,
          limit: 1000,
          depth: 0,
          where: { _status: { equals: 'published' } } as never,
        })

        for (const doc of docs as { slug?: string; updatedAt?: string }[]) {
          if (!doc.slug) continue
          const path =
            locale === 'id'
              ? `${collection.idBase}/${doc.slug}`
              : `${collection.enBase}/${doc.slug}`
          entries.push({
            url: absolute(path),
            lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        }
      }
    }

    // Media outlet pages share one slug across both languages. The outlet
    // list lives in src/content/newsroom.ts, not the CMS.
    for (const outlet of mediaOutlets) {
      entries.push({
        url: absolute(`/newsroom/media/${outlet.slug}`),
        changeFrequency: 'monthly',
        priority: 0.5,
        alternates: {
          languages: languagesFor(
            `/newsroom/media/${outlet.slug}`,
            `/en/newsroom/media/${outlet.slug}`,
          ),
        },
      })
    }
  } catch {
    // A database that is briefly unavailable should still yield a sitemap of
    // the static pages rather than an error.
  }

  return entries
}
