import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { SolutionCard } from '@/components/sections/Cards'
import { Prose } from '@/components/ui/Prose'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { productCategories, productsPage } from '@/content/products'
import { ctaBlocks } from '@/content/cta'
import { t } from '@/lib/content'
import styles from './ProductsPage.module.css'

/** Layanan dan Produk — Figma 427:2795. Follows intent/02 §2.7. */
export async function ProductsPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale)
  const cta = ctaBlocks.find((b) => b.page === 'products')
  const find = (key: string) => productsPage.sections.find((s) => s.key === key)
  const dataList = find('data-list')
  const creditScore = find('apa-itu-skor-kredit')

  const routes = [
    {
      key: 'howToGetReport' as const,
      title: locale === 'id' ? 'Cek Laporan Kredit Anda' : 'Check Your Credit Report',
    },
    {
      key: 'complaintResolution' as const,
      title: locale === 'id' ? 'Penyelesaian Pengaduan' : 'Complaint Resolution',
    },
  ]

  return (
    <>
      <PageHeader
        title={t(productsPage.title, locale)}
        lead={t(productsPage.lead, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        {productsPage.heroImage && (
          <Image
            src={productsPage.heroImage}
            alt=""
            width={1300}
            height={600}
            className={styles.hero}
            priority
          />
        )}

        {/* Layanan Kami */}
        {productCategories.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">
              {locale === 'id' ? 'Layanan Kami' : 'Our Services'}
            </SectionTitle>
            <div className={styles.grid}>
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
            </div>
          </section>
        )}

        {/* The two-column data list */}
        {dataList && (
          <section className={styles.section}>
            <SectionTitle as="h2">{t(dataList.title, locale)}</SectionTitle>
            <div className={styles.dataList}>
              <Prose body={dataList.body} locale={locale} />
            </div>
          </section>
        )}

        {/* Apa itu skor kredit? */}
        {creditScore && (
          <section className={styles.section}>
            <div className={styles.split}>
              {productsPage.heroImage && (
                <Image
                  src="/images/products/credit-scoring.png"
                  alt=""
                  width={620}
                  height={420}
                  className={styles.splitImage}
                />
              )}
              <div>
                <SectionTitle as="h2">{t(creditScore.title, locale)}</SectionTitle>
                <Prose body={creditScore.body} locale={locale} />
                <Link href={href('creditScoring', locale)} className={`t-body-strong ${styles.inlineLink}`}>
                  {dict.common.learnMore} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Two route cards: how to check, and how to complain */}
        <section className={styles.section}>
          <SectionTitle as="h2">
            {locale === 'id'
              ? 'Ingin Mengecek atau Melaporkan Data Kredit Anda?'
              : 'Want to Check or Report Your Credit Data?'}
          </SectionTitle>
          <div className={styles.routeCards}>
            {routes.map((route) => (
              <Link key={route.key} href={href(route.key, locale)} className={styles.routeCard}>
                <span className="t-h3">{route.title}</span>
                <span className={styles.routeCta}>
                  {locale === 'id' ? 'Pelajari Caranya' : 'Learn How'} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Container>

      <CTASection block={cta} locale={locale} />
    </>
  )
}
