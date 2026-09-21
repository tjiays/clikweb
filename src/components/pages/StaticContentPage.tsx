import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { Prose, type ProseBlock } from '@/components/ui/Prose'
import { getDictionary } from '@/i18n'
import { href, type RouteKey } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { lastUpdatedLabel, policyPages, type PolicyPage } from '@/content/policies'
import { t } from '@/lib/content'
import styles from './StaticContentPage.module.css'

/**
 * The four long-form pages (Figma 743:3483, 955:5948, 418:2433, 418:2844).
 * Their text lives in src/content/policies.ts — seed copy from Figma that
 * still needs legal review (see `needsLegalReview` there).
 *
 * Breadcrumbs follow Figma: the two policy pages are `Home > Page`; the two
 * how-to pages sit under `Home > Layanan dan Produk`. The Kebijakan Privasi
 * crumb in Figma shows the wrong page name; it is built from the actual page
 * here rather than copied (intent/01 §6).
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
          ...(underProducts ? [{ label: dict.dropdown.products, href: href('products', locale) }] : []),
          { label: page.crumb ? t(page.crumb, locale) : title },
        ]}
      />
      <Container>
        <article className={`${styles.article} ${styles[page.layout]}`}>
          {page.layout === 'howTo' && page.howTo ? (
            <HowTo content={page.howTo} locale={locale} />
          ) : (
            <Prose
              body={withLastUpdated(page, locale)}
              locale={locale}
              variant={page.layout === 'relaxed' ? 'relaxed' : 'dense'}
            />
          )}
        </article>
      </Container>
    </>
  )
}

/** "Terakhir Diperbarui: 14/08/2026", placed right after the first heading (Figma 1015:4171). */
function withLastUpdated(page: PolicyPage, locale: Locale): ProseBlock[] {
  if (!page.lastUpdated) return page.body
  const [y, m, d] = page.lastUpdated.split('-')
  const line = `${lastUpdatedLabel[locale]}: ${d}/${m}/${y}`
  const updated: ProseBlock = { type: 'p', text: { id: line, en: line } }
  const [first, ...rest] = page.body
  return first ? [first, updated, ...rest] : [updated]
}

/** Cara mendapat laporan kredit: intro, Individual / Badan Usaha columns, closing note (Figma 418:2434). */
function HowTo({ content, locale }: { content: NonNullable<PolicyPage['howTo']>; locale: Locale }) {
  return (
    <>
      <p className={styles.howIntro}>
        {content.intro.lead[locale]}
        <strong>{content.intro.company[locale]}</strong>
        <br />
        <em>{content.intro.address[locale]}</em>
      </p>
      <div className={styles.howColumns}>
        {content.columns.map((column) => (
          <section key={column.heading.id} className={styles.howColumn}>
            <div className={styles.howHead}>
              <Image src={column.image} alt="" width={100} height={100} className={styles.howImage} />
              <h2 className={styles.howHeading}>{column.heading[locale]}</h2>
            </div>
            <ol className={styles.howList}>
              {column.items.map((item) => (
                <li key={item.text.id}>
                  {item.href ? (
                    <a href={item.href} download className={styles.howLink}>
                      {item.text[locale]}
                    </a>
                  ) : (
                    item.text[locale]
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <p className={styles.howNote}>{content.note[locale]}</p>
    </>
  )
}
