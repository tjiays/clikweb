import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { ProductCarousel } from '@/components/sections/ProductCarousel'
import { Button } from '@/components/ui/Button'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { productCategories, productsPage, productUi } from '@/content/products'
import { t } from '@/lib/content'
import { RouteIcon } from './ProductsPageIcons'
import styles from './ProductsPage.module.css'

/**
 * Layanan dan Produk — Figma 427:2795.
 *
 * Two-column intro, the Layanan Kami carousel (Component 17), the data list
 * as a 4x2 icon grid on a white band, "Apa itu skor kredit?" with the CB Score
 * card, and the two route cards. Figma has no closing CTA on this page.
 */
export async function ProductsPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale)
  const { creditScore, routes } = productsPage

  return (
    <>
      <PageHeader
        title={t(productsPage.title, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
        className={styles.header}
      />

      <Container>
        {/* Intro: rule, navy lead and paragraph left; 601x370 photo right */}
        <section className={styles.intro}>
          <div className={styles.introText}>
            <p className={`section-rule ${styles.lead}`}>{t(productsPage.lead, locale)}</p>
            <p className={styles.introBody}>{t(productsPage.intro, locale)}</p>
          </div>
          {productsPage.heroImage && (
            <Image
              src={productsPage.heroImage}
              alt=""
              width={601}
              height={370}
              sizes="(max-width: 900px) 100vw, 601px"
              className={styles.introImage}
              priority
            />
          )}
        </section>

        {/* Layanan Kami — Component 17 */}
        <section className={styles.services}>
          <SectionTitle as="h2" align="center" size="md" ruleGap={20} className={styles.servicesTitle}>
            {t(productsPage.servicesTitle, locale)}
          </SectionTitle>
          <ProductCarousel
            variant="services"
            className={styles.servicesCarousel}
            label={t(productsPage.servicesTitle, locale)}
            previousLabel={t(productUi.carousel.previous, locale)}
            nextLabel={t(productUi.carousel.next, locale)}
            goToLabel={t(productUi.carousel.goTo, locale)}
          >
            {productCategories.map((category) => (
              <article key={category.slug} className={styles.serviceCard}>
                <div className={styles.serviceArt}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.illustration}
                    alt=""
                    width={category.illustrationWidth}
                    height={160}
                  />
                </div>
                <h3 className={styles.serviceTitle}>{t(category.name, locale)}</h3>
                <p className={styles.serviceText}>{t(category.shortDescription, locale)}</p>
                <Button
                  href={
                    category.slug === 'credit-scoring'
                      ? href('creditScoring', locale)
                      : `${href('businessSolution', locale)}#${category.slug}`
                  }
                  width={191}
                  className={styles.serviceButton}
                >
                  {t(category.cardButton, locale)}
                </Button>
              </article>
            ))}
          </ProductCarousel>
        </section>
      </Container>

      {/* The data we hold: 4x2 icon grid on a white full-width band */}
      <section className={styles.dataBand} aria-label={t(productsPage.servicesTitle, locale)}>
        <Container>
          <ul className={styles.dataGrid}>
            {productsPage.dataItems.map((item) => (
              <li key={item.icon} className={styles.dataItem}>
                <span className={styles.dataIcon}>
                  <Image src={item.icon} alt="" width={item.size} height={item.size} />
                </span>
                <span className={`${styles.dataLabel} ${locale === 'id' ? styles.dataLabelBreaks : ''}`}>
                  {t(item.label, locale)}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        {/* Apa itu skor kredit? — text left, navy CB Score card right */}
        <section className={styles.score}>
          <div className={styles.scoreText}>
            <SectionTitle as="h2" size="md" weight={700} ruleGap={5} className={styles.scoreTitle}>
              {t(creditScore.title, locale)}
            </SectionTitle>
            {creditScore.body.map((paragraph, i) => (
              <p key={i} className={styles.scoreBody}>
                {t(paragraph, locale)}
              </p>
            ))}
            <Button href={href('creditScoring', locale)} width={191} className={styles.scoreButton}>
              {dict.common.learnMore}
            </Button>
          </div>
          <div className={styles.scoreCard}>
            <Image
              src={creditScore.gauge}
              alt={t(creditScore.gaugeAlt, locale)}
              width={528}
              height={384}
              className={styles.scoreGauge}
            />
          </div>
        </section>

        {/* Ingin Mengecek atau Melaporkan Data Kredit Anda? */}
        <section className={styles.routes}>
          <SectionTitle
            as="h2"
            align="center"
            size="md"
            weight={700}
            ruleGap={19}
            subtitle={t(routes.subtitle, locale)}
            subtitleVariant="body"
            className={styles.routesTitle}
          >
            {t(routes.title, locale)}
          </SectionTitle>
          <div className={styles.routeCards}>
            {routes.cards.map((card) => (
              <Link key={card.route} href={href(card.route, locale)} className={styles.routeCard}>
                <RouteIcon name={card.icon} className={styles.routeIcon} />
                <span className={styles.routeTitle}>{t(card.title, locale)}</span>
                <span className={styles.routeText}>{t(card.text, locale)}</span>
                <span className={styles.routeLink}>{t(routes.link, locale)}</span>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  )
}
