import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { RichText } from '@/components/ui/RichText'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import {
  getPageContent,
  getProductCategories,
  getProductItems,
  getCTABlock,
  imageUrl,
  imageAlt,
} from '@/lib/content'
import styles from './BusinessSolutionPage.module.css'

/**
 * Business Solution — Figma 859:4457, per intent/02 §2.8.
 *
 * One section per solution category. Credit Scoring links out to its own
 * page; the others list their advantages and products in place.
 */
export async function BusinessSolutionPage({ locale }: { locale: Locale }) {
  const [dict, page, categories, items, cta] = await Promise.all([
    getDictionary(locale),
    getPageContent(locale, 'business-solution'),
    getProductCategories(locale),
    getProductItems(locale),
    getCTABlock(locale, 'business-solution'),
  ])

  const itemsFor = (categoryId: string | number) =>
    items.filter((item: any) => {
      const category = item.category
      const id = typeof category === 'object' ? category?.id : category
      return id === categoryId
    })

  return (
    <>
      <PageHeader
        title={page?.title ?? dict.dropdown.businessSolution}
        lead={page?.lead}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products, href: href('products', locale) },
          { label: dict.dropdown.businessSolution },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        {imageUrl(page?.heroImage) && (
          <Image
            src={imageUrl(page.heroImage) as string}
            alt={imageAlt(page.heroImage)}
            width={1300}
            height={600}
            className={styles.hero}
            priority
          />
        )}

        {categories.map((category: any) => {
          const products = itemsFor(category.id)
          const isCreditScoring = category.slug === 'credit-scoring'

          return (
            <section key={category.id} id={category.slug} className={styles.solution}>
              <div className={styles.solutionHead}>
                {imageUrl(category.image) && (
                  <Image
                    src={imageUrl(category.image) as string}
                    alt={imageAlt(category.image)}
                    width={560}
                    height={380}
                    className={styles.solutionImage}
                  />
                )}
                <div>
                  <SectionTitle as="h2" subtitle={category.lead}>
                    {category.name}
                  </SectionTitle>
                  <RichText data={category.description} />
                  {isCreditScoring && (
                    <Button href={href('creditScoring', locale)}>
                      {dict.common.learnMore}
                    </Button>
                  )}
                </div>
              </div>

              {/* Keunggulan Utama */}
              {!isCreditScoring && category.advantages?.length > 0 && (
                <div className={styles.advantages}>
                  <h3 className="t-h3-soft">
                    {locale === 'id' ? 'Keunggulan Utama:' : 'Key Advantages:'}
                  </h3>
                  <div className={styles.advantageGrid}>
                    {category.advantages.map((advantage: any, index: number) => (
                      <article key={index} className={styles.advantage}>
                        <h4 className="t-h4">{advantage.title}</h4>
                        {advantage.description && <p>{advantage.description}</p>}
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

      <CTASection block={cta} />
    </>
  )
}
