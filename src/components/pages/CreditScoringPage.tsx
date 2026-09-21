import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ProductAccordion } from '@/components/sections/ProductAccordion'
import { accordionLabels, toAccordionRows } from '@/components/sections/productAccordionRows'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { productCategories, creditScoringPage, productUi } from '@/content/products'
import { ctaBlocks } from '@/content/cta'
import { getProductItems, t } from '@/lib/content'
import { FeatureIcon } from './CreditScoringIcons'
import styles from './CreditScoringPage.module.css'

/**
 * Credit Scoring — Figma 859:4489 (expanded product card 1391:5420).
 *
 * Hero, "Apa Itu" card on a white band, the seven-card Fitur Utama &
 * Keunggulan grid, Cara Kerja steps, Manfaat cards on a #E0F1FC band, and the
 * What We Offer product accordion. The cross-link and banner come from
 * CTASection.
 */
export async function CreditScoringPage({ locale }: { locale: Locale }) {
  const [dict, products] = await Promise.all([
    getDictionary(locale),
    getProductItems(locale, 'credit-scoring'),
  ])

  const cta = ctaBlocks.find((b) => b.page === 'credit-scoring')
  const category = productCategories.find((c) => c.slug === 'credit-scoring')
  const page = creditScoringPage
  const { ojk, model, small, side } = page.features

  // Figma: the report rows expand in 0.15s, the score rows in 0.3s.
  const duration = (product: any) =>
    /report|variable/i.test(String(product.name ?? '')) ? 0.15 : 0.3

  return (
    <>
      <PageHeader
        title={t(page.title, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products, href: href('products', locale) },
          { label: dict.dropdown.creditScoring },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
        className={styles.header}
      />

      <Container>
        {/* Hero: rule, navy heading, Hubungi Kami; 594x397 photo right */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h2 className={`section-rule ${styles.heroHeading}`}>{t(page.lead, locale)}</h2>
            <Button href={href('contact', locale)} width={135} className={styles.heroButton}>
              {dict.common.contactUs}
            </Button>
          </div>
          <Image
            src={page.heroImage}
            alt=""
            width={594}
            height={397}
            sizes="(max-width: 1100px) 100vw, 594px"
            className={styles.heroImage}
            priority
          />
        </section>
      </Container>

      {/* Apa Itu CLIK Credit Scoring? — tinted card on a white band */}
      <section className={styles.whatBand}>
        <Container>
          <div className={styles.what}>
            <div className={styles.whatCard}>
              <h2 className={styles.whatTitle}>{t(page.what.title, locale)}</h2>
              {page.what.body.map((paragraph, i) => (
                <p key={i} className={styles.whatText}>
                  {t(paragraph, locale)}
                </p>
              ))}
            </div>
            <Image
              src={page.what.illustration}
              alt=""
              width={580}
              height={327}
              sizes="(max-width: 1100px) 100vw, 580px"
              className={styles.whatArt}
            />
          </div>
        </Container>
      </section>

      <Container>
        {/* Fitur Utama & Keunggulan — seven-card grid */}
        <section className={styles.features}>
          <h2 className={styles.centerTitle}>{t(page.featuresTitle, locale)}</h2>
          <div className={styles.bento}>
            <article className={`${styles.fCard} ${styles.ojk}`}>
              <Image src={ojk.logo} alt="OJK" width={192} height={79} className={styles.ojkLogo} />
              <h3 className={styles.ojkTitle}>{t(ojk.title, locale)}</h3>
              <p className={styles.ojkText}>{t(ojk.text, locale)}</p>
            </article>

            <article className={`${styles.fCard} ${styles.model}`}>
              <h3 className={styles.modelTitle}>{t(model.title, locale)}</h3>
              <p className={styles.modelText}>{t(model.text, locale)}</p>
              <div className={styles.gauge}>
                <div className={styles.gaugeNumbers}>
                  <span>
                    <span className={styles.gaugeLabel}>{t(model.scoreLabel, locale)}</span>
                    <span className={styles.gaugeValue}>525</span>
                  </span>
                  <span>
                    <span className={styles.gaugeLabel}>{t(model.gradeLabel, locale)}</span>
                    <span className={styles.gaugeValue}>E</span>
                  </span>
                </div>
                <Image
                  src={model.scale}
                  alt={t(model.scaleAlt, locale)}
                  width={275}
                  height={110}
                  className={styles.gaugeScale}
                />
              </div>
              <div className={styles.legend}>
                <span className={styles.legendItem}>
                  <span className={styles.dotHigh} aria-hidden="true" />
                  {t(model.high, locale)}
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.dotLow} aria-hidden="true" />
                  {t(model.low, locale)}
                </span>
              </div>
            </article>

            {small.map((card) => (
              <article key={card.key} className={`${styles.fCard} ${styles.small} ${styles[card.key]}`}>
                <span className={styles.tile} style={{ background: card.tile }}>
                  <FeatureIcon name={card.icon} />
                </span>
                <div>
                  <h3 className={styles.smallTitle}>{t(card.title, locale)}</h3>
                  <p className={styles.smallText}>{t(card.text, locale)}</p>
                </div>
              </article>
            ))}

            <div className={styles.sideStack}>
              {side.map((card) => (
                <article key={card.key} className={`${styles.fCard} ${styles.side}`}>
                  <span className={styles.tile} style={{ background: card.tile }}>
                    <FeatureIcon name={card.icon} />
                  </span>
                  <div>
                    <h3 className={styles.sideTitle}>{t(card.title, locale)}</h3>
                    <p className={styles.sideText}>{t(card.text, locale)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Cara Kerja — four illustrated steps */}
        <section className={styles.steps}>
          <h2 className={styles.stepsTitle}>{t(page.stepsTitle, locale)}</h2>
          <ol className={styles.stepList}>
            {page.steps.map((step, index) => (
              <li key={index} className={styles.step}>
                <span className={styles.stepArt}>
                  <Image src={step.image} alt="" width={step.width} height={step.height} />
                </span>
                <span className={styles.stepHead}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span className={styles.stepTitle}>{t(step.title, locale)}</span>
                </span>
                <span className={styles.stepText}>{t(step.text, locale)}</span>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      {/* Manfaat untuk Lembaga Keuangan — #E0F1FC band */}
      <section className={styles.benefitsBand}>
        <Container>
          <h2 className={styles.centerTitle}>{t(page.benefitsTitle, locale)}</h2>
          <div className={styles.benefitGrid}>
            {page.benefits.map((benefit, index) => (
              <article key={index} className={styles.benefit}>
                <Image src={benefit.image} alt="" width={169} height={162} className={styles.benefitArt} />
                <h3 className={styles.benefitTitle}>{t(benefit.title, locale)}</h3>
                <p className={styles.benefitText}>{t(benefit.text, locale)}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* What We Offer — the expanding product list */}
      {products.length > 0 && (
        <Container>
          <section className={styles.offer}>
            <h2 className={styles.centerTitle}>{t(productUi.whatWeOffer, locale)}</h2>
            {category?.offerSubtitle && (
              <p className={styles.offerSubtitle}>{t(category.offerSubtitle, locale)}</p>
            )}
            <ProductAccordion
              rows={toAccordionRows(products, duration)}
              labels={accordionLabels(locale)}
              gap={15}
            />
          </section>
        </Container>
      )}

      <CTASection block={cta} locale={locale} />
    </>
  )
}
