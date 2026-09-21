import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ProductAccordion } from '@/components/sections/ProductAccordion'
import { ProductCarousel } from '@/components/sections/ProductCarousel'
import { accordionLabels, toAccordionRows } from '@/components/sections/productAccordionRows'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { productCategories, businessSolutionPage, productUi } from '@/content/products'
import { ctaBlocks } from '@/content/cta'
import { getProductItems, t } from '@/lib/content'
import styles from './BusinessSolutionPage.module.css'

/**
 * Business Solution — Figma 859:4457.
 *
 * Two-column intro, then Credit Scoring as a photo + navy card linking to its
 * own page, then Analytics, Decisioning, Business Intelligence and Consulting
 * with alternating photo sides, a Keunggulan Utama carousel (Components
 * 12/13/14/18) and a What We Offer product accordion each.
 */
export async function BusinessSolutionPage({ locale }: { locale: Locale }) {
  const [dict, items] = await Promise.all([getDictionary(locale), getProductItems(locale)])
  const cta = ctaBlocks.find((b) => b.page === 'business-solution')
  const itemsFor = (slug: string) => items.filter((item: any) => item.category === slug)
  const labels = accordionLabels(locale)
  const [creditScoring, ...solutions] = productCategories

  return (
    <>
      <PageHeader
        title={t(businessSolutionPage.title, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products, href: href('products', locale) },
          { label: dict.dropdown.businessSolution },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
        className={styles.header}
      />

      <Container>
        {/* Intro: navy 38/700 heading and paragraph left, 555x370 photo right */}
        <section className={styles.intro}>
          <div>
            <h2 className={styles.introHeading}>{t(businessSolutionPage.heading, locale)}</h2>
            <p className={styles.introBody}>{t(businessSolutionPage.intro, locale)}</p>
          </div>
          <Image
            src={businessSolutionPage.heroImage}
            alt=""
            width={555}
            height={370}
            sizes="(max-width: 1100px) 100vw, 555px"
            className={styles.introImage}
            priority
          />
        </section>

        {/* Credit Scoring: photo left, 660x370 navy card right */}
        {creditScoring && (
          <section id={creditScoring.slug} className={styles.creditScoring}>
            <Image
              src={creditScoring.image}
              alt=""
              width={555}
              height={370}
              sizes="(max-width: 1100px) 100vw, 555px"
              className={styles.csImage}
            />
            <div className={styles.csCard}>
              <h2 className={styles.csTitle}>{t(creditScoring.name, locale)}</h2>
              <p className={styles.csText}>{t(creditScoring.description, locale)}</p>
              <Button href={href('creditScoring', locale)} width={191} className={styles.csButton}>
                {dict.common.learnMore}
              </Button>
            </div>
          </section>
        )}

        {solutions.map((category) => {
          const products = itemsFor(category.slug)
          const sideClass = category.imageSide === 'left' ? styles.imageLeft : styles.imageRight

          return (
            <section key={category.slug} id={category.slug} className={`${styles.solution} ${sideClass}`}>
              <div className={styles.split}>
                <div className={styles.splitText}>
                  <h2 className={styles.solutionTitle}>{t(category.name, locale)}</h2>
                  {category.lead && <p className={styles.solutionLead}>{t(category.lead, locale)}</p>}
                  <p className={styles.solutionBody}>{t(category.description, locale)}</p>
                </div>
                <Image
                  src={category.image}
                  alt=""
                  width={532}
                  height={371}
                  sizes="(max-width: 1100px) 100vw, 532px"
                  className={styles.solutionImage}
                />
              </div>

              {/* Keunggulan Utama — 412x210 cards, three visible */}
              {category.advantages.length > 0 && (
                <div className={styles.advantages}>
                  <h3 className={styles.advantagesTitle}>{t(productUi.keyAdvantages, locale)}</h3>
                  <ProductCarousel
                    variant="advantages"
                    className={styles.advantagesCarousel}
                    label={`${t(productUi.keyAdvantages, locale)} ${t(category.name, locale)}`}
                    previousLabel={t(productUi.carousel.previous, locale)}
                    nextLabel={t(productUi.carousel.next, locale)}
                    goToLabel={t(productUi.carousel.goTo, locale)}
                  >
                    {category.advantages.map((advantage, index) => (
                      <article key={index} className={styles.advantage}>
                        <div className={styles.advantageHead}>
                          <span className={styles.advantageIcon}>
                            <Image src="/images/products/crif-bird.png" alt="" width={36} height={21} />
                          </span>
                          <h4 className={styles.advantageTitle}>{t(advantage.title, locale)}</h4>
                        </div>
                        <p className={styles.advantageText}>{t(advantage.description, locale)}</p>
                      </article>
                    ))}
                  </ProductCarousel>
                </div>
              )}

              {/* What We Offer — the product accordion, first row open */}
              {products.length > 0 && (
                <div className={styles.offer}>
                  <h3 className={styles.offerTitle}>{t(productUi.whatWeOffer, locale)}</h3>
                  {category.offerSubtitle && (
                    <p className={styles.offerSubtitle}>{t(category.offerSubtitle, locale)}</p>
                  )}
                  <ProductAccordion
                    rows={toAccordionRows(products)}
                    labels={labels}
                    gap={10}
                    openFirst
                    single
                  />
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
