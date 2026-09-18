import type { MetadataRoute } from 'next'

/**
 * Evaluated per request, not at build time. Prerendering would bake in
 * whatever SITE_ENV was set when the build ran, so a production deploy built
 * on a staging machine would ship "Disallow: /" and quietly de-index the site.
 */
export const dynamic = 'force-dynamic'

/**
 * robots.txt.
 *
 * Staging must never be indexed. Indexing is allowed only when the site is
 * explicitly marked as production, so a staging deployment that is missing a
 * variable stays closed rather than opening by accident.
 */
export default function robots(): MetadataRoute.Robots {
  // Read at runtime: NEXT_PUBLIC_* is inlined at build time, so a production
  // deploy built on another machine would advertise the wrong domain.
  const base = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL || '').replace(
    /\/$/,
    '',
  )
  const isProduction = process.env.SITE_ENV === 'production'

  if (!isProduction) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${base || 'https://cbclik.com'}/sitemap.xml`,
  }
}
