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

/**
 * Card cover when the CMS item has none (Figma 724:3551 gives every card a
 * photo). Real uploads always win.
 */
const COVER_FALLBACK: Record<string, string> = {
  annual_report: '/images/reports/annual-report.jpg',
  business_development: '/images/reports/business-development.jpg',
}

const coverOf = (report: { cover?: unknown; type?: string }) =>
  imageUrl(report.cover) ?? (report.type ? COVER_FALLBACK[report.type] ?? null : null)

type ReportCard = {
  id: number | string
  slug: string
  title: string
  type?: string
  excerpt?: string | null
  author?: string | null
  publishDate?: string | null
  cover?: unknown
}

/** Laporan list — Figma 724:3551. */
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
              {(reports.docs as ReportCard[]).map((report) => (
                <ArticleCard
                  key={report.id}
                  variant="report"
                  title={report.title}
                  excerpt={report.excerpt}
                  href={detailHref('reports', report.slug, locale)}
                  author={report.author}
                  date={formatDate(report.publishDate, locale)}
                  imageUrl={coverOf(report)}
                  imageAlt={imageAlt(report.cover)}
                  readMoreLabel={dict.common.readMore}
                  shareLabel={locale === 'id' ? 'Bagikan' : 'Share'}
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

type FinancialTable = {
  id?: string
  intro?: string | null
  title?: string | null
  caption?: string | null
  rows?: {
    id?: string
    label?: string | null
    value?: string | null
    emphasis?: 'none' | 'label' | 'row' | null
    gapBefore?: boolean | null
  }[] | null
}

/**
 * Laporan detail.
 * - Annual report (709:3673): #F1FAFF band behind the breadcrumb and the top
 *   of a 1300x372 cover; a 1180x141 tinted card carrying the title overlaps
 *   the cover; body column 1008px at x216; financial tables after the body.
 * - Business development report (716:3800): plain page title, body across
 *   the full 1300px column, section headings with the orange ornament.
 * Neither shows a publish date.
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

  const crumbs = [
    { label: dict.nav.home, href: href('home', locale) },
    { label: dict.dropdown.reports, href: href('reports', locale) },
    { label: report.title },
  ]
  const cover = imageUrl(report.cover)
  const tables = (report.financialTables ?? []) as FinancialTable[]

  if (report.type === 'annual_report') {
    return (
      <>
        <div className={styles.band}>
          <PageHeader
            title={report.title}
            hideTitle
            crumbs={crumbs}
            breadcrumbLabel={dict.common.breadcrumb}
            className={styles.annualHeader}
          />
        </div>
        <Container>
          <div className={styles.hero}>
            {cover ? (
              <Image
                src={cover}
                alt={imageAlt(report.cover)}
                width={2600}
                height={744}
                sizes="(max-width: 1340px) 100vw, 1300px"
                className={styles.cover}
                priority
              />
            ) : (
              <div className={`${styles.cover} ${styles.coverEmpty}`} />
            )}
            <div className={styles.titleCard}>
              <p className={styles.titleCardText} aria-hidden="true">
                {report.title}
              </p>
            </div>
          </div>
          <article className={styles.annualBody}>
            <RichText data={report.body} className={styles.annualProse} />
            {tables.length > 0 && <FinancialTables tables={tables} />}
          </article>
        </Container>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={report.title}
        crumbs={crumbs}
        breadcrumbLabel={dict.common.breadcrumb}
        className={styles.plainHeader}
      />
      <Container>
        <article className={styles.plainBody}>
          <RichText data={report.body} className={styles.ruledProse} />
          {tables.length > 0 && <FinancialTables tables={tables} />}
        </article>
      </Container>
    </>
  )
}

/** Financial statements (Figma images 91/92) as real tables. */
function FinancialTables({ tables }: { tables: FinancialTable[] }) {
  return (
    <div className={styles.tables}>
      {tables.map((table, index) => {
        // A row marked "gap before" starts a new block, as "Jumlah Ekuitas" does.
        const segments: NonNullable<FinancialTable['rows']>[] = []
        for (const row of table.rows ?? []) {
          if (segments.length === 0 || row.gapBefore) segments.push([])
          segments[segments.length - 1].push(row)
        }
        return (
          <section key={table.id ?? index} className={styles.table}>
            {table.intro && <p className={styles.tableIntro}>{table.intro}</p>}
            {table.title && <h3 className={styles.tableTitle}>{table.title}</h3>}
            {table.caption && <p className={styles.tableCaption}>{table.caption}</p>}
            {segments.map((rows, s) => (
              <table
                key={s}
                className={`${styles.figures} ${table.title ? styles.figuresWideLabel : ''}`}
              >
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={row.id ?? r} className={row.emphasis === 'row' ? styles.bold : undefined}>
                      <th scope="row" className={row.emphasis === 'label' ? styles.bold : undefined}>
                        {row.label}
                      </th>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </section>
        )
      })}
    </div>
  )
}
