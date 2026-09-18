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
import {
  getHeroSlides,
  getStats,
  getHomeSettings,
  getTestimonials,
  getProductCategories,
  getLatestArticles,
  getPartnerLogos,
  getCTABlock,
  imageUrl,
  imageAlt,
} from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './HomePage.module.css'

/** Home — Figma 156:1049. Section order follows intent/02 §2.1. */
export async function HomePage({ locale }: { locale: Locale }) {
  const [dict, slides, stats, home, testimonials, categories, articles, regulators, cta] =
    await Promise.all([
      getDictionary(locale),
      getHeroSlides(locale),
      getStats(locale),
      getHomeSettings(locale),
      getTestimonials(locale),
      getProductCategories(locale),
      getLatestArticles(locale, 3),
      getPartnerLogos(locale, 'regulator'),
      getCTABlock(locale, 'home'),
    ])

  const settings = home as any
  const ojk = regulators[0]

  return (
    <>
      <HeroSlider
        slides={slides.map((slide: any) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          buttonLabel: slide.buttonLabel,
          buttonLink: slide.buttonLink,
          imageUrl: imageUrl(slide.image),
          imageAlt: imageAlt(slide.image),
        }))}
      />

      {/* 2. Tentang Kami snippet */}
      {settings?.aboutText && (
        <Container>
          <section className={styles.about}>
            <SectionTitle align="center">
              {settings.aboutTitle ?? dict.nav.about}
            </SectionTitle>
            <p className={`t-lead ${styles.aboutText}`}>{settings.aboutText}</p>
            <Button href={href('about', locale)}>{dict.common.learnMore}</Button>
          </section>
        </Container>
      )}

      {/* 3. Trust bar */}
      {settings?.trustBarText && (
        <Container>
          <div className={styles.trustBar}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z"
                stroke="var(--color-primary)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <span>{settings.trustBarText}</span>
            {imageUrl(ojk?.logo) && (
              <Image
                src={imageUrl(ojk.logo) as string}
                alt={imageAlt(ojk.logo, 'OJK')}
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
            {stats.map((stat: any) => (
              <StatCard
                key={stat.id}
                value={stat.value}
                label={stat.label}
                iconUrl={imageUrl(stat.icon)}
                iconAlt={imageAlt(stat.icon)}
              />
            ))}
          </section>
        </Container>
      )}

      {/* 5. Solutions carousel */}
      {categories.length > 0 && (
        <Container>
          <section className={styles.section}>
            <SectionTitle align="center" subtitle={settings?.solutionsSubtitle}>
              {settings?.solutionsTitle ?? dict.dropdown.products}
            </SectionTitle>
            <Carousel label={settings?.solutionsTitle ?? 'Solutions'} perView={3}>
              {categories.map((category: any) => (
                <SolutionCard
                  key={category.id}
                  title={category.name}
                  text={category.shortDescription}
                  href={
                    category.slug === 'credit-scoring'
                      ? href('creditScoring', locale)
                      : href('businessSolution', locale)
                  }
                  linkLabel={dict.common.seeMore}
                  iconUrl={imageUrl(category.icon)}
                  iconAlt={imageAlt(category.icon)}
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
            <SectionTitle align="center" subtitle={settings?.testimonialsSubtitle}>
              {settings?.testimonialsTitle ?? dict.nav.about}
            </SectionTitle>
            <Carousel
              label={settings?.testimonialsTitle ?? 'Testimonials'}
              perView={3}
              autoAdvance
              showArrows={false}
            >
              {testimonials.map((item: any) => (
                <TestimonialCard
                  key={item.id}
                  partnerName={item.partnerName}
                  quote={item.quote}
                  logoUrl={imageUrl(item.logo)}
                  logoAlt={imageAlt(item.logo, item.partnerName)}
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
            <SectionTitle align="center" subtitle={settings?.newsSubtitle}>
              {settings?.newsTitle ?? dict.nav.newsroom}
            </SectionTitle>
            <div className={styles.newsGrid}>
              {articles.map((article: any) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  href={`${href('newsroom', locale)}/${article.slug}`}
                  date={formatDate(article.publishDate, locale)}
                  author={typeof article.author === 'object' ? article.author?.name : null}
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

      <CTASection block={cta} />
    </>
  )
}
