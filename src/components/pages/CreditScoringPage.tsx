import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { RichText } from '@/components/ui/RichText'
import { Button } from '@/components/ui/Button'
import { ProductAccordion } from '@/components/sections/ProductAccordion'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { productCategories, creditScoringPage } from '@/content/products'
import { ctaBlocks } from '@/content/cta'
import { getProductItems, t } from '@/lib/content'
import { Prose } from '@/components/ui/Prose'
import styles from './CreditScoringPage.module.css'

/** Credit Scoring — Figma 859:4489, per intent/02 §2.9. */
export async function CreditScoringPage({ locale }: { locale: Locale }) {
  const [dict, products] = await Promise.all([
    getDictionary(locale),
    getProductItems(locale, 'credit-scoring'),
  ])

  const cta = ctaBlocks.find((b) => b.page === 'credit-scoring')
  const category = productCategories.find((c) => c.slug === 'credit-scoring')
  const find = (key: string) => creditScoringPage.sections.find((s) => s.key === key)
  const what = find('apa-itu')
  const howItWorks = find('cara-kerja')
  const features = category?.advantages ?? []

  const steps = [
    { id: 'Integrasi API', en: 'API Integration' },
    { id: 'Pengiriman Data Permohonan', en: 'Application Data Submission' },
    { id: 'Pemrosesan & Analisis', en: 'Processing & Analysis' },
    { id: 'Penerimaan Skor Kredit', en: 'Receiving the Credit Score' },
  ]

  const benefits = [
    { id: 'Menurunkan Rasio NPL/NPF', en: 'Lower NPL/NPF Ratios' },
    { id: 'Mempercepat Proses Underwriting', en: 'Faster Underwriting' },
    { id: 'Memperluas Jangkauan Segmen', en: 'Reach More Segments' },
    { id: 'Efisiensi Operasional', en: 'Operational Efficiency' },
  ]

  return (
    <>
      <PageHeader
        title={t(creditScoringPage.title, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products, href: href('products', locale) },
          { label: dict.dropdown.creditScoring },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        {/* Hero: heading, button, image */}
        <section className={styles.hero}>
          <div>
            <h2 className="t-h1">
              {t(creditScoringPage.lead, locale)}
            </h2>
            <div className={styles.heroAction}>
              <Button href={href('contact', locale)} size="lg">
                {dict.common.contactUs}
              </Button>
            </div>
          </div>
          {creditScoringPage.heroImage && (
            <Image
              src={creditScoringPage.heroImage}
              alt=""
              width={620}
              height={420}
              className={styles.heroImage}
              priority
            />
          )}
        </section>

        {/* Apa Itu CLIK Credit Scoring? */}
        {what && (
          <section className={styles.section}>
            <SectionTitle as="h2">{t(what.title, locale)}</SectionTitle>
            <Prose body={what.body} locale={locale} />
          </section>
        )}

        {/* Fitur Utama & Keunggulan */}
        {features.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">
              {locale === 'id' ? 'Fitur Utama & Keunggulan' : 'Key Features & Advantages'}
            </SectionTitle>
            <div className={styles.featureGrid}>
              {features.map((feature, index) => (
                <article key={index} className={styles.feature}>
                  <h3 className="t-h3-soft">{t(feature.title, locale)}</h3>
                  <p>{t(feature.description, locale)}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Cara Kerja — four numbered steps */}
        <section className={styles.section}>
          <SectionTitle as="h2">
            {howItWorks ? t(howItWorks.title, locale) : locale === 'id' ? 'Cara Kerja' : 'How It Works'}
          </SectionTitle>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.id} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <span className="t-h5">{step[locale]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Manfaat untuk Lembaga Keuangan */}
        <section className={styles.section}>
          <SectionTitle as="h2">
            {locale === 'id'
              ? 'Manfaat untuk Lembaga Keuangan'
              : 'Benefits for Financial Institutions'}
          </SectionTitle>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit) => (
              <article key={benefit.id} className={styles.benefit}>
                <h3 className="t-h3-soft">{benefit[locale]}</h3>
              </article>
            ))}
          </div>
        </section>

        {/* What We Offer — the expanding product list */}
        {products.length > 0 && (
          <section className={styles.section}>
            <SectionTitle
              as="h2"
              subtitle={
                locale === 'id'
                  ? 'Satu skor, satu laporan, satu keputusan.'
                  : 'One score, one report, one decision.'
              }
            >
              What We Offer
            </SectionTitle>
            <ProductAccordion
              rows={products.map((product: any) => ({
                id: product.id,
                name: product.name,
                shortDescription: product.shortDescription,
                description: product.description ? (
                  <RichText data={product.description} />
                ) : null,
                status: product.productStatus,
                isNew: product.isNew,
                useCases: product.useCases,
              }))}
            />
          </section>
        )}
      </Container>

      <CTASection block={cta} locale={locale} />
    </>
  )
}
