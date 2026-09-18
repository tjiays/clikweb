import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { Prose } from '@/components/ui/Prose'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { productCategories, businessSolutionPage } from '@/content/products'
import { ctaBlocks } from '@/content/cta'
import { getProductItems, t } from '@/lib/content'
import styles from './BusinessSolutionPage.module.css'

/**
 * Business Solution — Figma 859:4457, per intent/02 §2.8.
 *
 * One section per solution category. Credit Scoring links out to its own
 * page; the others list their advantages and products in place.
 */
export async function BusinessSolutionPage({ locale }: { locale: Locale }) {
  const [dict, items] = await Promise.all([getDictionary(locale), getProductItems(locale)])
  const cta = ctaBlocks.find((b) => b.page === 'business-solution')
  const itemsFor = (slug: string) => items.filter((item: any) => item.category === slug)

  return (
    <>
      <PageHeader
        title={t(businessSolutionPage.title, locale)}
        lead={t(businessSolutionPage.lead, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products, href: href('products', locale) },
          { label: dict.dropdown.businessSolution },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        {businessSolutionPage.heroImage && (
          <Image
            src={businessSolutionPage.heroImage}
            alt=""
            width={1300}
            height={600}
            className={styles.hero}
            priority
          />
        )}

        {productCategories.map((category) => {
          const products = itemsFor(category.slug)
          const isCreditScoring = category.slug === 'credit-scoring'

          return (
            <section key={category.slug} id={category.slug} className={styles.solution}>
              <div className={styles.solutionHead}>
                {category.image && (
                  <Image
                    src={category.image}
                    alt=""
                    width={560}
                    height={380}
                    className={styles.solutionImage}
                  />
                )}
                <div>
                  <SectionTitle as="h2" subtitle={t(category.lead, locale)}>
                    {t(category.name, locale)}
                  </SectionTitle>
                  <Prose body={category.description} locale={locale} />
                  {isCreditScoring && (
                    <Button href={href('creditScoring', locale)}>
                      {dict.common.learnMore}
                    </Button>
                  )}
                </div>
              </div>

              {/* Keunggulan Utama */}
              {!isCreditScoring && category.advantages.length > 0 && (
                <div className={styles.advantages}>
                  <h3 className="t-h3-soft">
                    {locale === 'id' ? 'Keunggulan Utama:' : 'Key Advantages:'}
                  </h3>
                  <div className={styles.advantageGrid}>
                    {category.advantages.map((advantage, index) => (
                      <article key={index} className={styles.advantage}>
                        <h4 className="t-h4">{t(advantage.title, locale)}</h4>
                        <p>{t(advantage.description, locale)}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Product cards with their status badges */}
              {!isCreditScoring && products.length > 0 && (
                <div className={styles.productGrid}>
                  {products.map((product: any) => (
                    <article key={product.id} className={styles.product}>
                      <div className={styles.productBadges}>
                        <StatusBadge status={product.productStatus} />
                        {product.isNew && <StatusBadge status="new" />}
                      </div>
                      <h4 className="t-h5">{product.name}</h4>
                      {product.shortDescription && (
                        <p className={styles.productText}>{product.shortDescription}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </Container>

      <CTASection block={cta} locale={locale} />
    </>
  )
}
