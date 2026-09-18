import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { Prose } from '@/components/ui/Prose'
import { getDictionary } from '@/i18n'
import { href, type RouteKey } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { policyPages } from '@/content/policies'
import { t } from '@/lib/content'
import styles from './StaticContentPage.module.css'

/**
 * The four long-form pages. Their text lives in src/content/policies.ts.
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
  const dict = await getDictionary(locale)
  const page = policyPages.find((p) => p.key === pageKey)
  if (!page) notFound()

  const underProducts = routeKey === 'howToGetReport' || routeKey === 'complaintResolution'
  const title = t(page.title, locale)

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbLabel={dict.common.breadcrumb}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          ...(underProducts
            ? [{ label: dict.dropdown.products, href: href('products', locale) }]
            : [{ label: dict.nav.about }]),
          { label: title },
        ]}
      />
      <Container>
        <article className={styles.article}>
          <Prose body={page.body} locale={locale} />
        </article>
      </Container>
    </>
  )
}
