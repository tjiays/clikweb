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
import { careers, jobCategories } from '@/content/careers'
import { site } from '@/content/site'
import { getOpenJobs, getJobBySlug, t } from '@/lib/content'
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
  const [dict, jobs] = await Promise.all([getDictionary(locale), getOpenJobs(locale)])
  const careersEmail = site.careersEmail || 'talent@cbclik.com'
  const heroImages = careers.heroImages
  const categoryName = (slug: string) => {
    const found = jobCategories.find((c) => c.slug === slug)
    return found ? t(found.name, locale) : slug
  }

  return (
    <>
      {/* Hero with its auto-sliding image carousel */}
      <section className={styles.hero}>
        <Container>
          <h1 className="t-h1">{t(careers.heroTitle, locale)}</h1>
          <p className={`t-lead ${styles.heroSubtitle}`}>{t(careers.heroSubtitle, locale)}</p>
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
        {careers.values.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">{dict.careers.values}</SectionTitle>
            <div className={styles.valueGrid}>
              {careers.values.map((value, index) => (
                <article key={index} className={styles.value}>
                  <h3 className="t-h4">{t(value.title, locale)}</h3>
                  <p className={styles.valueSubtitle}>{t(value.subtitle, locale)}</p>
                  <p>{t(value.description, locale)}</p>
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
                  category={job.category ? categoryName(job.category) : undefined}
                  detailHref={detailHref('careers', job.slug, locale)}
                  applyMailto={applyMailto(job, careersEmail)}
                  applyLabel={dict.careers.apply}
                  detailLabel={dict.careers.viewDetail}
                />
              ))}
            </div>
          )}

          {careers.cvNote && (
            <p className={styles.cvNote}>
              {t(careers.cvNote, locale)}{' '}
              <a href={`mailto:${careersEmail}`}>{careersEmail}</a>
            </p>
          )}
        </section>

        {/* Benefits */}
        {careers.benefits.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">{dict.careers.benefits}</SectionTitle>
            <div className={styles.benefitGrid}>
              {careers.benefits.map((benefit, index) => (
                <article key={index} className={styles.benefit}>
                  {benefit.icon && (
                    <Image src={benefit.icon} alt="" width={56} height={56} />
                  )}
                  <h3 className="t-h5">{t(benefit.title, locale)}</h3>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Proses Rekrutmen */}
        {careers.recruitmentSteps.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">{dict.careers.process}</SectionTitle>
            <ol className={styles.steps}>
              {careers.recruitmentSteps.map((step, index) => (
                <li key={index} className={styles.step}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <div>
                    <h3 className="t-h5">{t(step.title, locale)}</h3>
                    <p>{t(step.description, locale)}</p>
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
  const [dict, job] = await Promise.all([getDictionary(locale), getJobBySlug(locale, slug)])
  if (!job) notFound()

  const careersEmail = job.applyEmail || site.careersEmail || 'talent@cbclik.com'
  const category = jobCategories.find((c) => c.slug === job.category)

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
              {category && <p className={styles.detailCategory}>{t(category.name, locale)}</p>}
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
