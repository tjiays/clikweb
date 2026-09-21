import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { HeroSlider } from '@/components/sections/HeroSlider'
import { Carousel } from '@/components/sections/Carousel'
import { SectionTitle, SectionRule } from '@/components/sections/SectionTitle'
import { StatCard, SolutionCard, TestimonialCard, ArticleCard } from '@/components/sections/Cards'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { homeHero, stats, home, homeSolutions } from '@/content/home'
import { testimonials } from '@/content/testimonials'
import { partnerLogos } from '@/content/partners'
import { productCategories } from '@/content/products'
import { ctaBlocks } from '@/content/cta'
import { getLatestArticles, imageUrl, imageAlt, t } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './HomePage.module.css'

/** Home — Figma 156:1049 (1440 wide). Section order follows intent/02 §2.1. */
export async function HomePage({ locale }: { locale: Locale }) {
  const [dict, articles] = await Promise.all([
    getDictionary(locale),
    getLatestArticles(locale, 3),
  ])

  const ojk = partnerLogos.find((p) => p.group === 'regulator')
  const cta = ctaBlocks.find((b) => b.page === 'home')

  return (
    <>
      {/* 1. Hero (177:390): sliding images, static centred copy, wave edge */}
      <HeroSlider
        images={homeHero.images}
        title={t(homeHero.title, locale)}
        subtitle={t(homeHero.subtitle, locale)}
      />

      {/* 2. "- — -" divider (269:680), then the Tentang Kami card (266:577) */}
      <SectionRule align="center" className={styles.divider} />
      <div className={styles.wide}>
        <section className={styles.about}>
          <SectionTitle rule={false} className={styles.aboutHead}>
            {t(home.aboutTitle, locale)}
          </SectionTitle>
          <p className={styles.aboutText}>{t(home.aboutText, locale)}</p>
          <Button href={href('about', locale)} width={191} className={styles.aboutButton}>
            {t(home.aboutButton, locale)}
          </Button>
        </section>

        {/* 3. Trust bar (266:584); hover / focus swaps in the description (266:497) */}
        <div className={styles.trust} tabIndex={0}>
          <div className={styles.trustFront}>
            <Image
              src="/images/home/icon-shield.svg"
              alt=""
              width={50}
              height={50}
              className={styles.trustShield}
            />
            <span className={styles.trustText}>{t(home.trust.registered, locale)}</span>
            <span className={styles.trustDot} aria-hidden="true" />
            <span className={`${styles.trustText} ${styles.trustNetwork}`}>
              {t(home.trust.network, locale)}
            </span>
            {ojk && (
              <Image
                src={ojk.logo}
                alt={ojk.name}
                width={169}
                height={67}
                className={styles.trustLogo}
              />
            )}
            <span className={styles.trustLicense}>
              {t(home.trust.licenseLabel, locale)}
              <br />
              {home.trust.licenseNumber}
            </span>
          </div>
          <p className={styles.trustBack}>{t(home.trust.description, locale)}</p>
        </div>

        {/* 4. Stats (266:465 / 473 / 482); hover swaps in the description */}
        <section className={styles.stats}>
          {stats.map((stat) => (
            <StatCard
              key={stat.icon}
              value={t(stat.value, locale)}
              label={t(stat.label, locale)}
              description={t(stat.description, locale)}
              iconUrl={stat.icon}
              iconAlt=""
              iconWidth={stat.iconWidth}
              iconHeight={stat.iconHeight}
            />
          ))}
        </section>
      </div>

      {/* 5. Solutions carousel (219:224, Component 28) */}
      {productCategories.length > 0 && (
        <Container>
          <section className={styles.solutions}>
            <SectionTitle
              align="center"
              rule={false}
              subtitle={t(home.solutionsSubtitle, locale)}
              className={styles.solutionsHead}
            >
              {t(home.solutionsTitle, locale)}
            </SectionTitle>
            <Carousel
              variant="solutions"
              label={t(home.solutionsTitle, locale)}
              previousLabel={t(home.previousLabel, locale)}
              nextLabel={t(home.nextLabel, locale)}
            >
              {productCategories.map((category) => {
                const card = homeSolutions[category.slug]
                return (
                  <div key={category.slug} className={styles.solutionCell} data-slug={category.slug}>
                    <SolutionCard
                      title={t(category.name, locale)}
                      text={card ? t(card.text, locale) : t(category.shortDescription, locale)}
                      href={
                        category.slug === 'credit-scoring'
                          ? href('creditScoring', locale)
                          : href('businessSolution', locale)
                      }
                      linkLabel={t(home.solutionsButton, locale)}
                      iconUrl={card?.icon ?? category.icon}
                      iconAlt=""
                    />
                  </div>
                )
              })}
            </Carousel>
          </section>
        </Container>
      )}

      {/* 6. Testimonials (279:689 / 279:691, Component 4 627:5394) */}
      {testimonials.length > 0 && (
        <section className={styles.testimonials}>
          <Container>
            <SectionTitle
              align="center"
              rule={false}
              subtitle={t(home.testimonialsSubtitle, locale)}
              className={styles.testimonialsHead}
            >
              {t(home.testimonialsTitle, locale)}
            </SectionTitle>
          </Container>
          <div className={styles.testimonialsTrack}>
            <Carousel
              variant="testimonials"
              label={t(home.testimonialsTitle, locale)}
              previousLabel={t(home.previousLabel, locale)}
              nextLabel={t(home.nextLabel, locale)}
            >
              {testimonials.map((item, index) => (
                <div
                  key={`${item.partnerName}-${index}`}
                  className={styles.testimonialCell}
                  style={
                    item.logo
                      ? ({
                          '--logo-x': `${item.logo.x}px`,
                          '--logo-y': `${item.logo.y}px`,
                          '--logo-w': `${item.logo.width}px`,
                          '--logo-h': `${item.logo.height}px`,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  <TestimonialCard
                    partnerName={item.partnerName}
                    logoUrl={item.logo?.src}
                    quote={t(item.quote, locale)}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* 7. Latest news (156:1075) — three cards, per confirmed decision */}
      {articles.length > 0 && (
        <section className={styles.news}>
          <Container>
            <SectionTitle
              align="center"
              rule={false}
              subtitle={t(home.newsSubtitle, locale)}
              className={styles.newsHead}
            >
              {t(home.newsTitle, locale)}
            </SectionTitle>
          </Container>
          <div className={styles.newsGrid}>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                variant="home"
                title={article.title}
                excerpt={article.excerpt}
                href={`${href('newsroom', locale)}/${article.slug}`}
                date={formatDate(article.publishDate, locale)}
                imageUrl={imageUrl(article.cover)}
                imageAlt={imageAlt(article.cover)}
                readMoreLabel={dict.common.readMore}
                shareLabel={locale === 'en' ? 'Share' : 'Bagikan'}
              />
            ))}
          </div>
          <div className={styles.newsAction}>
            <Button href={href('newsroom', locale)} size="xl">
              {t(home.newsButton, locale)}
            </Button>
          </div>
        </section>
      )}

      <CTASection block={cta} locale={locale} />
    </>
  )
}
