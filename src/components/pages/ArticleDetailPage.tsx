import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { RichText } from '@/components/ui/RichText'
import { ShareBar } from '@/components/ui/ShareBar'
import { ArticleCard } from '@/components/sections/Cards'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import {
  getArticleBySlug,
  getRelatedArticles,
  getSiteSettings,
  imageUrl,
  imageAlt,
} from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './ArticleDetailPage.module.css'

/** Detail Berita — Figma 556:2721, per intent/02 §2.13. */
export async function ArticleDetailPage({
  locale,
  slug,
}: {
  locale: Locale
  slug: string
}) {
  const [dict, article, site] = await Promise.all([
    getDictionary(locale),
    getArticleBySlug(locale, slug),
    getSiteSettings(locale),
  ])
  if (!article) notFound()

  const related = await getRelatedArticles(locale, article.id, 3)
  const base = (site as any)?.websiteUrl?.replace(/\/$/, '') ?? ''
  const shareUrl = `${base}${detailHref('newsroom', article.slug, locale)}`

  return (
    <>
      <PageHeader
        title={article.title}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.newsroom, href: href('newsroom', locale) },
          { label: article.title },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <article className={styles.article}>
          {imageUrl(article.cover) && (
            <Image
              src={imageUrl(article.cover) as string}
              alt={imageAlt(article.cover)}
              width={1200}
              height={640}
              className={styles.cover}
              priority
            />
          )}

          <div className={styles.meta}>
            {article.publishDate && <time>{formatDate(article.publishDate, locale)}</time>}
            {typeof article.author === 'object' && article.author?.name && (
              <span>{article.author.name}</span>
            )}
          </div>

          <ShareBar url={shareUrl} title={article.title} label={dict.newsroom.share} />

          <hr className={styles.divider} />

          <RichText data={article.body} />
        </article>

        {related.length > 0 && (
          <section className={styles.related}>
            <SectionTitle as="h2">{dict.newsroom.related}</SectionTitle>
            <div className={styles.relatedGrid}>
              {related.map((item: any) => (
                <ArticleCard
                  key={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  href={detailHref('newsroom', item.slug, locale)}
                  date={formatDate(item.publishDate, locale)}
                  author={typeof item.author === 'object' ? item.author?.name : null}
                  imageUrl={imageUrl(item.cover)}
                  imageAlt={imageAlt(item.cover)}
                  readMoreLabel={dict.common.readMore}
                />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  )
}
