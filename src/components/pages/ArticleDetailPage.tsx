import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/layout/Container'
import { RichText } from '@/components/ui/RichText'
import { ShareBar } from '@/components/ui/ShareBar'
import { ArticleCard } from '@/components/sections/Cards'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { site } from '@/content/site'
import { getArticleBySlug, getRelatedArticles, imageUrl, imageAlt } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './ArticleDetailPage.module.css'

/**
 * Detail Berita — Figma 556:2721.
 *
 * A #F1FAFF band (404px) behind the breadcrumb and the top of the 1300x372
 * cover; a #F1FAFF title panel (1180x142, radius 20) overlapping the cover's
 * bottom 71px; then a centred 992px column: date + "Share:" row, a 50% black
 * rule and the body. "Anda mungkin juga tertarik dengan" sits on a #E0F1FC
 * band that runs into the footer.
 */
export async function ArticleDetailPage({
  locale,
  slug,
}: {
  locale: Locale
  slug: string
}) {
  const [dict, article] = await Promise.all([
    getDictionary(locale),
    getArticleBySlug(locale, slug),
  ])
  if (!article) notFound()

  const related = await getRelatedArticles(locale, article.id, 3)
  const base = site.websiteUrl.replace(/\/$/, '')
  const shareUrl = `${base}${detailHref('newsroom', article.slug, locale)}`
  const cover = imageUrl(article.cover)
  const shareName = dict.newsroom.share.replace(/:$/, '')

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.band} aria-hidden="true" />
        <Container>
          <div className={styles.crumbs}>
            <Breadcrumb
              label={dict.common.breadcrumb}
              items={[
                { label: dict.nav.home, href: href('home', locale) },
                { label: dict.nav.newsroom, href: href('newsroom', locale) },
                { label: article.title },
              ]}
            />
          </div>

          {cover ? (
            <Image
              src={cover}
              alt={imageAlt(article.cover)}
              width={1300}
              height={372}
              sizes="(max-width: 1340px) 100vw, 1300px"
              className={styles.cover}
              priority
            />
          ) : (
            <div className={`${styles.cover} ${styles.coverEmpty}`} />
          )}

          <div className={styles.panel}>
            <h1 className={styles.title}>{article.title}</h1>
          </div>
        </Container>
      </div>

      <Container>
        <article className={styles.article}>
          <div className={styles.meta}>
            {article.publishDate ? (
              <time dateTime={article.publishDate} className={styles.date}>
                {formatDate(article.publishDate, locale)}
              </time>
            ) : (
              <span />
            )}
            <ShareBar url={shareUrl} title={article.title} label={dict.newsroom.share} />
          </div>

          <hr className={styles.divider} />

          <RichText data={article.body} />
        </article>
      </Container>

      {related.length > 0 ? (
        <section className={styles.related} data-flush-footer>
          <Container>
            <div className={styles.relatedHead}>
              <h2 className={styles.relatedTitle}>{dict.newsroom.related}</h2>
              <span className={styles.relatedLine} aria-hidden="true" />
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <ArticleCard
                  key={item.id}
                  variant="related"
                  title={item.title}
                  excerpt={item.excerpt}
                  href={detailHref('newsroom', item.slug, locale)}
                  date={formatDate(item.publishDate, locale)}
                  author={item.author}
                  imageUrl={imageUrl(item.cover)}
                  imageAlt={imageAlt(item.cover)}
                  readMoreLabel={dict.common.readMore}
                  shareLabel={shareName}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
