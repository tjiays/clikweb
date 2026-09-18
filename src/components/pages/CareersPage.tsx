import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { JobRow } from '@/components/sections/JobRow'
import { Carousel } from '@/components/sections/Carousel'
import { RichText } from '@/components/ui/RichText'
import { Button } from '@/components/ui/Button'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import {
  getCareerPage,
  getOpenJobs,
  getJobBySlug,
  getSiteSettings,
  imageUrl,
  imageAlt,
} from '@/lib/content'
import styles from './CareersPage.module.css'

/** Builds the mailto link for a job, with the subject pre-filled. */
function applyMailto(job: any, fallbackEmail: string) {
  const email = job?.applyEmail || fallbackEmail
  const subject = job?.emailSubjectFormat
    ? `${job.emailSubjectFormat} - ${job.title}`
    : job?.title
  return `mailto:${email}?subject=${encodeURIComponent(subject ?? '')}`
}

/** Karir — Figma 415:2692, per intent/02 §2.16. */
export async function CareersPage({ locale }: { locale: Locale }) {
  const [dict, page, jobs, site] = await Promise.all([
    getDictionary(locale),
    getCareerPage(locale),
    getOpenJobs(locale),
    getSiteSettings(locale),
  ])

  const content = page as any
  const careersEmail = (site as any)?.careersEmail ?? 'talent@cbclik.com'
  const heroImages = (content?.heroImages ?? [])
    .map((row: any) => imageUrl(row.image))
    .filter(Boolean) as string[]

  return (
    <>
      {/* Hero with its auto-sliding image carousel */}
      <section className={styles.hero}>
        <Container>
          <h1 className="t-h1">{content?.heroTitle ?? dict.nav.careers}</h1>
          {content?.heroSubtitle && (
            <p className={`t-lead ${styles.heroSubtitle}`}>{content.heroSubtitle}</p>
          )}
        </Container>
        {heroImages.length > 0 && (
          <div className={styles.heroStrip}>
            <Carousel label={dict.nav.careers} perView={3} autoAdvance showArrows={false}>
              {heroImages.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt=""
                  width={480}
                  height={320}
                  className={styles.heroImage}
                />
              ))}
            </Carousel>
          </div>
        )}
      </section>

      <Container>
        {/* Nilai-nilai kami */}
        {content?.values?.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">{dict.careers.values}</SectionTitle>
            <div className={styles.valueGrid}>
              {content.values.map((value: any, index: number) => (
                <article key={index} className={styles.value}>
                  <h3 className="t-h4">{value.title}</h3>
                  {value.subtitle && <p className={styles.valueSubtitle}>{value.subtitle}</p>}
                  {value.description && <p>{value.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Lowongan Pekerjaan — only open positions */}
        <section className={styles.section} id="lowongan">
          <SectionTitle as="h2">{dict.careers.openings}</SectionTitle>
          {jobs.length === 0 ? (
            <p className={styles.empty}>{dict.careers.empty}</p>
          ) : (
            <div className={styles.jobs}>
              {jobs.map((job: any) => (
                <JobRow
                  key={job.id}
                  title={job.title}
                  category={
                    typeof job.category === 'object' ? job.category?.name : undefined
                  }
                  detailHref={detailHref('careers', job.slug, locale)}
                  applyMailto={applyMailto(job, careersEmail)}
                  applyLabel={dict.careers.apply}
                  detailLabel={dict.careers.viewDetail}
                />
              ))}
            </div>
          )}

          {content?.cvNote && (
            <p className={styles.cvNote}>
              {content.cvNote}{' '}
              <a href={`mailto:${careersEmail}`}>{careersEmail}</a>
            </p>
          )}
        </section>

        {/* Benefits */}
        {content?.benefits?.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">{dict.careers.benefits}</SectionTitle>
            <div className={styles.benefitGrid}>
              {content.benefits.map((benefit: any, index: number) => (
                <article key={index} className={styles.benefit}>
                  {imageUrl(benefit.icon) && (
                    <Image
                      src={imageUrl(benefit.icon) as string}
                      alt={imageAlt(benefit.icon)}
                      width={56}
                      height={56}
                    />
                  )}
                  <h3 className="t-h5">{benefit.title}</h3>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Proses Rekrutmen */}
        {content?.recruitmentSteps?.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">{dict.careers.process}</SectionTitle>
            <ol className={styles.steps}>
              {content.recruitmentSteps.map((step: any, index: number) => (
                <li key={index} className={styles.step}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <div>
                    <h3 className="t-h5">{step.title}</h3>
                    {step.description && <p>{step.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </Container>
    </>
  )
}

/** Detail Lowongan — Figma 571:3858, per intent/02 §2.17. */
export async function JobDetailPage({ locale, slug }: { locale: Locale; slug: string }) {
  const [dict, job, site] = await Promise.all([
    getDictionary(locale),
    getJobBySlug(locale, slug),
    getSiteSettings(locale),
  ])
  if (!job) notFound()

  const careersEmail = job.applyEmail || (site as any)?.careersEmail || 'talent@cbclik.com'

  return (
    <>
      <PageHeader
        title={dict.careers.detailTitle}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.careers, href: href('careers', locale) },
          { label: dict.careers.detailTitle },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <article className={styles.detail}>
          <header className={styles.detailHead}>
            <div>
              <h2 className="t-h2">{job.title}</h2>
              {typeof job.category === 'object' && job.category?.name && (
                <p className={styles.detailCategory}>{job.category.name}</p>
              )}
            </div>
            <Button href={applyMailto(job, careersEmail)} external size="lg">
              {dict.careers.apply}
            </Button>
          </header>

          {[
            { title: dict.careers.responsibilities, body: job.responsibilities },
            { title: dict.careers.qualifications, body: job.minimumQualifications },
            { title: dict.careers.education, body: job.education },
          ]
            .filter((block) => block.body)
            .map((block) => (
              <section key={block.title} className={styles.detailSection}>
                <h3 className="t-h4 section-rule">{block.title}</h3>
                <RichText data={block.body} />
              </section>
            ))}

          <footer className={styles.detailFooter}>
            <p>
              {dict.careers.emailTo} <a href={`mailto:${careersEmail}`}>{careersEmail}</a>
            </p>
            {job.emailSubjectFormat && (
              <p>
                {dict.careers.subjectNote} <strong>{job.emailSubjectFormat}</strong>
              </p>
            )}
          </footer>
        </article>
      </Container>
    </>
  )
}
