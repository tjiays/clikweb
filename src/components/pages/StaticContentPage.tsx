import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { RichText } from '@/components/ui/RichText'
import { getDictionary } from '@/i18n'
import { href, type RouteKey } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { getStaticPage, imageUrl } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './StaticContentPage.module.css'

/**
 * The four long-form pages: Kebijakan Keamanan Informasi, Kebijakan Privasi,
 * Cara mendapat laporan kredit and Penyelesaian Pengaduan.
 *
 * The Kebijakan Privasi breadcrumb in Figma shows the wrong page name; it is
 * built from the actual page here rather than copied (intent/01 §6).
 */
export async function StaticContentPage({
  locale,
  pageKey,
  routeKey,
}: {
  locale: Locale
  pageKey: string
  routeKey: RouteKey
}) {
  const [dict, page] = await Promise.all([getDictionary(locale), getStaticPage(locale, pageKey)])
  if (!page) notFound()

  const underProducts = routeKey === 'howToGetReport' || routeKey === 'complaintResolution'
  const crumbs = [
    { label: dict.nav.home, href: href('home', locale) },
    ...(underProducts
      ? [{ label: dict.dropdown.products, href: href('products', locale) }]
      : [{ label: dict.nav.about }]),
    { label: page.title },
  ]

  return (
    <>
      <PageHeader title={page.title} crumbs={crumbs} breadcrumbLabel={dict.common.breadcrumb} />
      <Container>
        <article className={styles.article}>
          {page.lastUpdatedDate && (
            <p className={styles.updated}>
              {formatDate(page.lastUpdatedDate, locale)}
            </p>
          )}
          <RichText data={page.body} />

          {page.attachments?.length > 0 && (
            <ul className={styles.attachments}>
              {page.attachments.map((attachment: any, index: number) => {
                const url = imageUrl(attachment.file)
                if (!url) return null
                return (
                  <li key={index}>
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                      {attachment.label ?? url.split('/').pop()}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </article>
      </Container>
    </>
  )
}
