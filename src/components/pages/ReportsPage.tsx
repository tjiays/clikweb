import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ArticleCard } from '@/components/sections/Cards'
import { Pagination } from '@/components/ui/Pagination'
import { RichText } from '@/components/ui/RichText'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { getReportsPage, getReportBySlug, imageUrl, imageAlt } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './ReportsPage.module.css'

/** Laporan list — Figma 724:3551, per intent/02 §2.3. */
export async function ReportsPage({ locale, page }: { locale: Locale; page: number }) {
  const [dict, reports] = await Promise.all([
    getDictionary(locale),
    getReportsPage(locale, page),
  ])

  return (
    <>
      <PageHeader
        title={dict.reports.title}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.reports },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <div className={styles.wrap}>
          {reports.docs.length === 0 ? (
            <p className={styles.empty}>{dict.reports.empty}</p>
          ) : (
            <div className={styles.grid}>
              {reports.docs.map((report: any) => (
                <ArticleCard
                  key={report.id}
                  title={report.title}
                  excerpt={report.excerpt}
                  href={detailHref('reports', report.slug, locale)}
                  date={report.year ? String(report.year) : null}
                  imageUrl={imageUrl(report.cover)}
                  imageAlt={imageAlt(report.cover)}
                  readMoreLabel={dict.common.readMore}
                />
              ))}
            </div>
          )}

          <Pagination
            page={reports.page}
            totalPages={reports.totalPages}
            basePath={href('reports', locale)}
            label={dict.newsroom.pagination}
          />
        </div>
      </Container>
    </>
  )
}

/**
 * Laporan detail — Figma 709:3673 (annual) and 716:3800 (business
 * development). The business-development variant has no cover image, which
 * falls out of the data rather than needing a separate template.
 */
export async function ReportDetailPage({
  locale,
  slug,
}: {
  locale: Locale
  slug: string
}) {
  const [dict, report] = await Promise.all([
    getDictionary(locale),
    getReportBySlug(locale, slug),
  ])
  if (!report) notFound()

  return (
    <>
      <PageHeader
        title={report.title}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.reports, href: href('reports', locale) },
          { label: report.title },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <article className={styles.article}>
          {imageUrl(report.cover) && (
            <Image
              src={imageUrl(report.cover) as string}
              alt={imageAlt(report.cover)}
              width={1200}
              height={640}
              className={styles.cover}
              priority
            />
          )}
          {report.publishDate && (
            <p className={styles.meta}>{formatDate(report.publishDate, locale)}</p>
          )}
          <RichText data={report.body} />
        </article>
      </Container>
    </>
  )
}
