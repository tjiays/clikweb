import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArticleCard } from '@/components/sections/Cards'
import { NewsroomSidebar, MediaLogoStrip } from '@/components/sections/NewsroomSidebar'
import { Pagination } from '@/components/ui/Pagination'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { mediaOutlets } from '@/content/newsroom'
import { getArticlesPage, getFeaturedArticles, imageUrl, imageAlt } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './NewsroomPage.module.css'

/** Newsroom — Figma 305:1082. One paginated page (confirmed decision 5). */
export async function NewsroomPage({ locale, page }: { locale: Locale; page: number }) {
  const [dict, articles, featured] = await Promise.all([
    getDictionary(locale),
    getArticlesPage(locale, page),
    getFeaturedArticles(locale),
  ])
  const outlets = mediaOutlets

  return (
    <>
      <PageHeader
        title={dict.nav.newsroom}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.newsroom },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <MediaLogoStrip outlets={outlets} label={dict.newsroom.mediaList} />

        <div className={styles.layout}>
          <NewsroomSidebar
            locale={locale}
            featured={featured}
            outlets={outlets}
            featuredLabel={dict.newsroom.featured}
            outletsLabel={dict.newsroom.mediaList}
          />

          <div>
            {articles.docs.length === 0 ? (
              <p className={styles.empty}>{dict.newsroom.empty}</p>
            ) : (
              <div className={styles.grid}>
                {articles.docs.map((article: any) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    href={detailHref('newsroom', article.slug, locale)}
                    date={formatDate(article.publishDate, locale)}
                    author={article.author}
                    imageUrl={imageUrl(article.cover)}
                    imageAlt={imageAlt(article.cover)}
                    readMoreLabel={dict.common.readMore}
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
