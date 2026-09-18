import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { SolutionCard } from '@/components/sections/Cards'
import { RichText } from '@/components/ui/RichText'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import {
  getPageContent,
  getProductCategories,
  getCTABlock,
  section,
  imageUrl,
  imageAlt,
} from '@/lib/content'
import styles from './ProductsPage.module.css'

/** Layanan dan Produk — Figma 427:2795. Follows intent/02 §2.7. */
export async function ProductsPage({ locale }: { locale: Locale }) {
  const [dict, page, categories, cta] = await Promise.all([
    getDictionary(locale),
    getPageContent(locale, 'products'),
    getProductCategories(locale),
    getCTABlock(locale, 'products'),
  ])

  const dataList = section(page, 'data-list')
  const creditScore = section(page, 'apa-itu-skor-kredit')

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
        title={page?.title ?? dict.dropdown.products}
        lead={page?.lead}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.dropdown.products },
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

        {/* Layanan Kami */}
        {categories.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">
              {locale === 'id' ? 'Layanan Kami' : 'Our Services'}
            </SectionTitle>
            <div className={styles.grid}>
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
            </div>
          </section>
        )}

        {/* The two-column data list */}
        {dataList && (
          <section className={styles.section}>
            <SectionTitle as="h2">{dataList.title}</SectionTitle>
            <div className={styles.dataList}>
              <RichText data={dataList.body} />
            </div>
          </section>
        )}

        {/* Apa itu skor kredit? */}
        {creditScore && (
          <section className={styles.section}>
            <div className={styles.split}>
              {imageUrl(creditScore.image) && (
                <Image
                  src={imageUrl(creditScore.image) as string}
                  alt={imageAlt(creditScore.image)}
                  width={620}
                  height={420}
                  className={styles.splitImage}
                />
              )}
              <div>
                <SectionTitle as="h2">{creditScore.title}</SectionTitle>
                <RichText data={creditScore.body} />
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

      <CTASection block={cta} />
    </>
  )
}
