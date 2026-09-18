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
import {
  getPageContent,
  getProductCategories,
  getProductItems,
  getCTABlock,
  section,
  imageUrl,
  imageAlt,
} from '@/lib/content'
import styles from './CreditScoringPage.module.css'

/** Credit Scoring — Figma 859:4489, per intent/02 §2.9. */
export async function CreditScoringPage({ locale }: { locale: Locale }) {
  const [dict, page, categories, products, cta] = await Promise.all([
    getDictionary(locale),
    getPageContent(locale, 'credit-scoring'),
    getProductCategories(locale),
    getProductItems(locale, 'credit-scoring'),
    getCTABlock(locale, 'credit-scoring'),
  ])

  const category = categories.find((c: any) => c.slug === 'credit-scoring')
  const what = section(page, 'apa-itu')
  const howItWorks = section(page, 'cara-kerja')
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
        title={page?.title ?? dict.dropdown.creditScoring}
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
              {page?.lead ??
                (locale === 'id'
                  ? 'Keputusan Kredit yang Lebih Cerdas, Lebih Cepat, Lebih Terpercaya.'
                  : 'Smarter, Faster, More Trusted Credit Decisions.')}
            </h2>
            <div className={styles.heroAction}>
              <Button href={href('contact', locale)} size="lg">
                {dict.common.contactUs}
              </Button>
            </div>
          </div>
          {imageUrl(page?.heroImage) && (
            <Image
              src={imageUrl(page.heroImage) as string}
              alt={imageAlt(page.heroImage)}
              width={620}
              height={420}
              className={styles.heroImage}
              priority
            />
          )}
        </section>

        {/* Apa Itu CLIK Credit Scoring? */}
        {(what || category) && (
          <section className={styles.section}>
            <SectionTitle as="h2">
              {what?.title ??
                (locale === 'id' ? 'Apa Itu CLIK Credit Scoring?' : 'What Is CLIK Credit Scoring?')}
            </SectionTitle>
            <RichText data={what?.body ?? category?.description} />
          </section>
        )}

        {/* Fitur Utama & Keunggulan */}
        {features.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">
              {locale === 'id' ? 'Fitur Utama & Keunggulan' : 'Key Features & Advantages'}
            </SectionTitle>
            <div className={styles.featureGrid}>
              {features.map((feature: any, index: number) => (
                <article key={index} className={styles.feature}>
                  <h3 className="t-h3-soft">{feature.title}</h3>
                  {feature.description && <p>{feature.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Cara Kerja — four numbered steps */}
        <section className={styles.section}>
          <SectionTitle as="h2">
            {howItWorks?.title ?? (locale === 'id' ? 'Cara Kerja' : 'How It Works')}
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

      <CTASection block={cta} />
    </>
  )
}
