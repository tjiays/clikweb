import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArticleCard } from '@/components/sections/Cards'
import { NewsroomSidebar, MediaLogoStrip } from '@/components/sections/NewsroomSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import {
  mediaLogoStrip,
  mediaLogoStripGap,
  mediaLogoStripSeconds,
  mediaListButtons,
} from '@/content/newsroom'
import { getArticlesPage, getFeaturedArticles, imageUrl, imageAlt } from '@/lib/content'
import { formatNewsDate } from '@/lib/format'
import styles from './NewsroomPage.module.css'

/** Featured News shows 8 titles in Figma (1783:10696). */
const FEATURED_LIMIT = 8

/** Newsroom — Figma 305:1082 (page 1) and 1661:8648 (page 2). */
export async function NewsroomPage({ locale, page }: { locale: Locale; page: number }) {
  const [dict, articles, featured] = await Promise.all([
    getDictionary(locale),
    getArticlesPage(locale, page),
    getFeaturedArticles(locale, FEATURED_LIMIT),
  ])

  return (
    <>
      <PageHeader
        title={dict.nav.newsroom}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.newsroom },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
        className={styles.header}
      />

      <MediaLogoStrip
        logos={mediaLogoStrip}
        label={dict.newsroom.mediaList}
        seconds={mediaLogoStripSeconds}
        gap={mediaLogoStripGap}
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
            {articles.docs.length === 0 ? (
              <p className={styles.empty}>{dict.newsroom.empty}</p>
            ) : (
              <div className={styles.grid}>
                {articles.docs.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    href={detailHref('newsroom', article.slug, locale)}
                    date={formatNewsDate(article.publishDate)}
                    author={article.author}
                    imageUrl={imageUrl(article.cover)}
                    imageAlt={imageAlt(article.cover)}
                    readMoreLabel={dict.common.readMore}
                    shareLabel={dict.newsroom.share.replace(/:$/, '')}
                  />
                ))}
              </div>
            )}

            <Pagination
              page={articles.page}
              totalPages={articles.totalPages}
              basePath={href('newsroom', locale)}
              label={dict.newsroom.pagination}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
