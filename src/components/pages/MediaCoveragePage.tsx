import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArticleCard } from '@/components/sections/Cards'
import { NewsroomSidebar } from '@/components/sections/NewsroomSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { getDictionary } from '@/i18n'
import { href, detailHref, mediaOutletHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { mediaOutlets, mediaCoverage, mediaListButtons } from '@/content/newsroom'
import { getArticlesBySlugs, getFeaturedArticles, imageUrl, imageAlt } from '@/lib/content'
import { formatNewsDate } from '@/lib/format'
import styles from './MediaCoveragePage.module.css'

const PER_PAGE = 6
const FEATURED_LIMIT = 8

/**
 * Liputan Media — Figma 827:5603. The Newsroom sidebar on the left; on the
 * right "Liputan Media" + the outlet name (orange, with the dash-bar-dash
 * ornament) and the outlet's coverage as the same 406x660 article cards,
 * two per row. Pagination always shows, even with one page.
 *
 * The coverage cards are Newsroom articles (Figma shows two of them here),
 * listed per outlet in src/content/newsroom.ts.
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
    getFeaturedArticles(locale, FEATURED_LIMIT),
  ])
  const outlet = mediaOutlets.find((o) => o.slug === slug)
  if (!outlet) notFound()

  // Coverage is a fixed list in src/content/newsroom.ts, so it is paged here
  // rather than by the database.
  const all = await getArticlesBySlugs(
    locale,
    mediaCoverage.filter((c) => c.outlet === slug).map((c) => c.article),
  )
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE))
  const current = Math.min(Math.max(1, page), totalPages)
  const docs = all.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const shareName = dict.newsroom.share.replace(/:$/, '')

  return (
    <>
      <PageHeader
        title={dict.nav.newsroom}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.newsroom, href: href('newsroom', locale) },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <div className={styles.layout} data-flush-footer>
          <NewsroomSidebar
            locale={locale}
            featured={featured}
            buttons={mediaListButtons}
            featuredLabel={dict.newsroom.featured}
            outletsLabel={dict.newsroom.mediaList}
          />

          <div className={styles.content}>
            <h2 className={styles.head}>
              <span className={styles.label}>{dict.newsroom.coverage}</span>{' '}
              <span className={styles.outlet}>{outlet.name}</span>
            </h2>

            {docs.length === 0 ? (
              <p className={styles.empty}>{dict.newsroom.empty}</p>
            ) : (
              <div className={styles.cards}>
                {docs.map((item) => (
                  <ArticleCard
                    key={item.id}
                    title={item.title}
                    excerpt={item.excerpt}
                    href={detailHref('newsroom', item.slug, locale)}
                    author={item.author}
                    date={formatNewsDate(item.publishDate)}
                    imageUrl={imageUrl(item.cover)}
                    imageAlt={imageAlt(item.cover)}
                    readMoreLabel={dict.common.readMore}
                    shareLabel={shareName}
                  />
                ))}
              </div>
            )}
          </div>

          <Pagination
            page={current}
            totalPages={totalPages}
            basePath={mediaOutletHref(slug, locale)}
            label={dict.newsroom.pagination}
            className={styles.pagination}
          />
        </div>
      </Container>
    </>
  )
}
