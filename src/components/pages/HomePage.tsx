import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { HeroSlider } from '@/components/sections/HeroSlider'
import { Carousel } from '@/components/sections/Carousel'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { StatCard, SolutionCard, TestimonialCard, ArticleCard } from '@/components/sections/Cards'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { heroSlides, stats, home } from '@/content/home'
import { testimonials } from '@/content/testimonials'
import { partnerLogos } from '@/content/partners'
import { productCategories } from '@/content/products'
import { ctaBlocks } from '@/content/cta'
import { getLatestArticles, imageUrl, imageAlt, t } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './HomePage.module.css'

/** Home — Figma 156:1049. Section order follows intent/02 §2.1. */
export async function HomePage({ locale }: { locale: Locale }) {
  const [dict, articles] = await Promise.all([
    getDictionary(locale),
    getLatestArticles(locale, 3),
  ])

  const ojk = partnerLogos.find((p) => p.group === 'regulator')
  const cta = ctaBlocks.find((b) => b.page === 'home')

  return (
    <>
      <HeroSlider
        slides={heroSlides.map((slide, index) => ({
          id: index,
          title: t(slide.title, locale),
          subtitle: t(slide.subtitle, locale),
          buttonLabel: t(slide.buttonLabel, locale),
          buttonLink: slide.buttonLink,
          imageUrl: slide.image,
          imageAlt: '',
        }))}
      />

      {/* 2. Tentang Kami snippet */}
      {home.aboutText && (
        <Container>
          <section className={styles.about}>
            <SectionTitle align="center">
              {t(home.aboutTitle, locale)}
            </SectionTitle>
            <p className={`t-lead ${styles.aboutText}`}>{t(home.aboutText, locale)}</p>
            <Button href={href('about', locale)}>{dict.common.learnMore}</Button>
          </section>
        </Container>
      )}

      {/* 3. Trust bar */}
      {home.trustBarText && (
        <Container>
          <div className={styles.trustBar}>
            <span>{t(home.trustBarText, locale)}</span>
            {ojk && (
              <Image
                src={ojk.logo}
                alt={ojk.name}
                width={90}
                height={38}
                className={styles.trustLogo}
              />
            )}
          </div>
        </Container>
      )}

      {/* 4. Stats */}
      {stats.length > 0 && (
        <Container>
          <section className={styles.stats}>
            {stats.map((stat) => (
              <StatCard
                key={stat.value}
                value={stat.value}
                label={t(stat.label, locale)}
                iconUrl={stat.icon}
                iconAlt=""
              />
            ))}
          </section>
        </Container>
      )}

      {/* 5. Solutions carousel */}
      {productCategories.length > 0 && (
        <Container>
          <section className={styles.section}>
            <SectionTitle align="center" subtitle={t(home.solutionsSubtitle, locale)}>
              {t(home.solutionsTitle, locale)}
            </SectionTitle>
            <Carousel label={t(home.solutionsTitle, locale)} perView={3}>
              {productCategories.map((category) => (
                <SolutionCard
                  key={category.slug}
                  title={t(category.name, locale)}
                  text={t(category.shortDescription, locale)}
                  href={
                    category.slug === 'credit-scoring'
                      ? href('creditScoring', locale)
                      : href('businessSolution', locale)
                  }
                  linkLabel={dict.common.seeMore}
                  iconUrl={category.icon}
                  iconAlt=""
                />
              ))}
            </Carousel>
          </section>
        </Container>
      )}

      {/* 6. Testimonials */}
      {testimonials.length > 0 && (
        <section className={styles.testimonialBand}>
          <Container>
            <SectionTitle align="center" subtitle={t(home.testimonialsSubtitle, locale)}>
              {t(home.testimonialsTitle, locale)}
            </SectionTitle>
            <Carousel
              label={t(home.testimonialsTitle, locale)}
              perView={3}
              autoAdvance
              showArrows={false}
            >
              {testimonials.map((item) => (
                <TestimonialCard
                  key={item.partnerName}
                  partnerName={item.partnerName}
                  quote={t(item.quote, locale)}
                />
              ))}
            </Carousel>
          </Container>
        </section>
      )}

      {/* 7. Latest news — three cards, per confirmed decision (not four) */}
      {articles.length > 0 && (
        <Container>
          <section className={styles.section}>
            <SectionTitle align="center" subtitle={t(home.newsSubtitle, locale)}>
              {t(home.newsTitle, locale)}
            </SectionTitle>
            <div className={styles.newsGrid}>
              {articles.map((article: any) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  href={`${href('newsroom', locale)}/${article.slug}`}
                  date={formatDate(article.publishDate, locale)}
                  author={article.author}
                  imageUrl={imageUrl(article.cover)}
                  imageAlt={imageAlt(article.cover)}
                  readMoreLabel={dict.common.readMore}
                />
              ))}
            </div>
            <div className={styles.newsAction}>
              <Button href={href('newsroom', locale)}>{dict.common.seeMore}</Button>
            </div>
          </section>
        </Container>
      )}

      <CTASection block={cta} locale={locale} />
    </>
  )
}
