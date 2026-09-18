import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { NewsroomSidebar } from '@/components/sections/NewsroomSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { getDictionary } from '@/i18n'
import { href, mediaOutletHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import {
  getOutletBySlug,
  getCoverageForOutlet,
  getFeaturedArticles,
  getMediaOutlets,
  imageUrl,
  imageAlt,
} from '@/lib/content'
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
  const [dict, outlet, featured, outlets] = await Promise.all([
    getDictionary(locale),
    getOutletBySlug(locale, slug),
    getFeaturedArticles(locale),
    getMediaOutlets(locale),
  ])
  if (!outlet) notFound()

  const coverage = await getCoverageForOutlet(locale, outlet.id, page)

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
                {coverage.docs.map((item: any) => (
                  <li key={item.id}>
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.card}
                    >
                      {imageUrl(item.image) && (
                        <Image
                          src={imageUrl(item.image) as string}
                          alt={imageAlt(item.image)}
                          width={320}
                          height={220}
                          className={styles.cardImage}
                        />
                      )}
                      <span className={styles.cardBody}>
                        {item.publishDate && (
                          <span className={styles.cardDate}>
                            {formatDate(item.publishDate, locale)}
                          </span>
                        )}
                        <span className="t-card-title">{item.title}</span>
                        {item.excerpt && <span className={styles.cardExcerpt}>{item.excerpt}</span>}
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
