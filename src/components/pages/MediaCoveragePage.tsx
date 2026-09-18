import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { NewsroomSidebar } from '@/components/sections/NewsroomSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { getDictionary } from '@/i18n'
import { href, mediaOutletHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { mediaOutlets, mediaCoverage } from '@/content/newsroom'
import { getFeaturedArticles, t } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './MediaCoveragePage.module.css'

/**
 * Liputan Media — Figma 827:5603. Coverage for one outlet; each card opens
 * the external article in a new tab (intent/02 §2.14).
 */
export async function MediaCoveragePage({
  locale,
  slug,
  page,
}: {
  locale: Locale
  slug: string
  page: number
}) {
  const [dict, featured] = await Promise.all([
    getDictionary(locale),
    getFeaturedArticles(locale),
  ])
  const outlet = mediaOutlets.find((o) => o.slug === slug)
  if (!outlet) notFound()

  const outlets = mediaOutlets
  // Coverage is a fixed list in src/content/newsroom.ts, so it is paged here
  // rather than by the database.
  const all = mediaCoverage.filter((c) => c.outlet === slug)
  const perPage = 6
  const totalPages = Math.max(1, Math.ceil(all.length / perPage))
  const current = Math.min(Math.max(1, page), totalPages)
  const coverage = {
    docs: all.slice((current - 1) * perPage, current * perPage),
    page: current,
    totalPages,
  }

  return (
    <>
      <PageHeader
        title={dict.nav.newsroom}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.newsroom, href: href('newsroom', locale) },
          { label: outlet.name },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <div className={styles.layout}>
          <NewsroomSidebar
            locale={locale}
            featured={featured}
            outlets={outlets}
            featuredLabel={dict.newsroom.featured}
            outletsLabel={dict.newsroom.mediaList}
          />

          <div>
            <header className={styles.outletHead}>
              <h2 className="t-h2">{outlet.name}</h2>
              <p className={`t-h3-soft ${styles.coverageLabel}`}>{dict.newsroom.coverage}</p>
            </header>

            {coverage.docs.length === 0 ? (
              <p className={styles.empty}>{dict.newsroom.empty}</p>
            ) : (
              <ul className={styles.list}>
                {coverage.docs.map((item) => (
                  <li key={item.externalUrl + item.title.id}>
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.card}
                    >
                      <Image
                        src={outlet.logo}
                        alt={outlet.name}
                        width={320}
                        height={220}
                        className={styles.cardImage}
                      />
                      <span className={styles.cardBody}>
                        {item.publishDate && (
                          <span className={styles.cardDate}>
                            {formatDate(item.publishDate, locale)}
                          </span>
                        )}
                        <span className="t-card-title">{t(item.title, locale)}</span>
                        <span className={`t-link-caps ${styles.cardLink}`}>
                          {dict.newsroom.openArticle} →
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <Pagination
              page={coverage.page}
              totalPages={coverage.totalPages}
              basePath={mediaOutletHref(slug, locale)}
              label={dict.newsroom.pagination}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
