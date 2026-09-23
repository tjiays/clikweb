import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { JobRow, BriefcaseIcon } from '@/components/sections/JobRow'
import { JobShare } from '@/components/sections/JobShare'
import { Marquee } from '@/components/sections/Marquee'
import { RichText } from '@/components/ui/RichText'
import { Button } from '@/components/ui/Button'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { careers, jobCategories, jobDetail } from '@/content/careers'
import { site } from '@/content/site'
import { getOpenJobs, getJobBySlug, t } from '@/lib/content'
import styles from './CareersPage.module.css'

/**
 * Builds the mailto link for a job. Subject follows the note on the detail
 * page, "Source Vacancy – Position Applied" (e.g. "Website – Sales Operations");
 * a CMS subject that already names the position is used as it is.
 */
function applyMailto(job: any, fallbackEmail: string) {
  const email = job?.applyEmail || fallbackEmail
  const format = String(job?.emailSubjectFormat ?? '').trim()
  const title = String(job?.title ?? '')
  const subject = format && title && format.includes(title) ? format : `${format || 'Website'} – ${title}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`
}

/** Photo band (Figma Component 10): one set of six photos is 3161px wide
 *  (sizes + 48px gaps). Figma moves a set every 10s (~316px/s), which the
 *  owner found too fast to look at, so it runs at 25s (~126px/s) instead. */
const STRIP_GAP = 48
const STRIP_SECONDS = 25

/** Karir — Figma 415:2692, per intent/02 §2.16. */
export async function CareersPage({ locale }: { locale: Locale }) {
  const [dict, jobs] = await Promise.all([getDictionary(locale), getOpenJobs(locale)])
  const careersEmail = site.careersEmail || 'talent@cbclik.com'
  const categoryName = (slug: string) => {
    const found = jobCategories.find((c) => c.slug === slug)
    return found ? t(found.name, locale) : slug
  }
  const [firstSteps, lastSteps] = [
    careers.recruitmentSteps.slice(0, 3),
    careers.recruitmentSteps.slice(3),
  ]

  const step = (item: (typeof careers.recruitmentSteps)[number], index: number) => (
    <li key={index} className={styles.step} style={{ width: item.width }}>
      <Image
        src={item.image}
        alt=""
        width={item.imageWidth}
        height={item.imageHeight}
        className={styles.stepImage}
        style={{ marginBottom: item.gap }}
      />
      <div className={styles.stepHead}>
        <span className={styles.stepNumber} aria-hidden="true">
          {index + 1}
        </span>
        <h3 className={styles.stepTitle}>
          <span className="sr-only">{index + 1}. </span>
          {t(item.title, locale)}
        </h3>
      </div>
      <p className={styles.stepBody}>{t(item.description, locale)}</p>
    </li>
  )

  return (
    <>
      {/* Hero: navy title + subtitle, then the navy wave band with the photo marquee */}
      <section className={styles.hero}>
        <Container>
          <h1 className={styles.heroTitle}>
            {careers.heroTitle[locale].map((line, index) => (
              <span key={index} className={styles.heroLine}>
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.heroSubtitle}>{t(careers.heroSubtitle, locale)}</p>
        </Container>

        <div className={styles.band}>
          <span className={styles.bandOverlay} aria-hidden="true" />
          <svg className={styles.waveTop} viewBox="0 0 1441 63" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0H1441V53C1330 40 1205 19 1105 10.5C1080 8.5 1060 8.5 1040 9.5L205 51C125 53.5 60 56 0 63Z" />
          </svg>
          <Marquee
            duration={STRIP_SECONDS}
            gap={STRIP_GAP}
            label={dict.nav.careers}
            className={styles.strip}
          >
            {careers.heroPhotos.map((photo, index) => (
              <Image
                key={index}
                src={photo.src}
                alt=""
                width={photo.width}
                height={photo.height}
                sizes={`${photo.width}px`}
                className={styles.stripPhoto}
                style={{ '--w': photo.width, '--h': photo.height } as CSSProperties}
                priority={index < 3}
              />
            ))}
          </Marquee>
          <svg className={styles.waveBottom} viewBox="0 0 1441 63" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 9C125 25 250 44 330 52C360 55 390 55 420 53L1300 10.5C1370 7.5 1410 4 1441 0V63H0Z" />
          </svg>
        </div>
      </section>

      <Container>
        {/* Nilai-Nilai Kami: 2x2 centred text */}
        {careers.values.length > 0 && (
          <section className={styles.values}>
            <SectionTitle as="h2" align="center" size="md" ruleGap={5} className={styles.valuesTitle}>
              {t(careers.titles.values, locale)}
            </SectionTitle>
            <div className={styles.valueGrid}>
              {careers.values.map((value, index) => (
                <article key={index} className={styles.value}>
                  <h3 className={styles.valueTitle}>{t(value.title, locale)}</h3>
                  <p className={styles.valueSubtitle}>{t(value.subtitle, locale)}</p>
                  <p className={styles.valueBody} style={{ maxWidth: value.width }}>
                    {t(value.description, locale)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Lowongan Pekerjaan: title + CV note left, 2-column card grid right */}
        <section className={styles.openings} id="lowongan">
          <div className={styles.openingsSide}>
            <SectionTitle as="h2" size="md" ruleGap={5} className={styles.openingsTitle}>
              {t(careers.titles.openings, locale)}
            </SectionTitle>
            <p className={styles.cvNote}>
              <strong>{t(careers.cvNote.lead, locale)}</strong> {t(careers.cvNote.before, locale)}{' '}
              <a href={`mailto:${careersEmail}`}>{careersEmail}</a> {t(careers.cvNote.after, locale)}
            </p>
          </div>
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
                  shareLabel={t(careers.share, locale)}
                  copiedLabel={t(careers.linkCopied, locale)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Benefits */}
        {careers.benefits.length > 0 && (
          <section className={styles.benefits}>
            <SectionTitle as="h2" align="center" ruleGap={5} className={styles.benefitsTitle}>
              {t(careers.titles.benefits, locale)}
            </SectionTitle>
            <div className={styles.benefitGrid}>
              {careers.benefits.map((benefit, index) => (
                <article key={index} className={styles.benefit}>
                  <Image
                    src={benefit.icon}
                    alt=""
                    width={benefit.iconWidth}
                    height={benefit.iconHeight}
                    className={styles.benefitIcon}
                    style={{ top: benefit.iconTop }}
                  />
                  <h3 className={styles.benefitTitle}>{t(benefit.title, locale)}</h3>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Proses Rekrutmen: 3 + 2 steps with illustrations */}
        {careers.recruitmentSteps.length > 0 && (
          <section className={styles.process}>
            <SectionTitle as="h2" align="center" ruleGap={5} className={styles.processTitle}>
              {t(careers.titles.process, locale)}
            </SectionTitle>
            <div className={styles.steps}>
              <ol className={styles.stepRowFirst}>{firstSteps.map((item, i) => step(item, i))}</ol>
              {lastSteps.length > 0 && (
                <ol className={styles.stepRowSecond} start={4}>
                  {lastSteps.map((item, i) => step(item, i + 3))}
                </ol>
              )}
            </div>
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
        title={t(jobDetail.title, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.careers, href: href('careers', locale) },
          { label: t(jobDetail.crumb, locale) },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
        className={styles.detailHeader}
      />

      <Container>
        <article className={styles.detail}>
          <header className={styles.detailHead}>
            <h2 className={styles.detailTitle}>{job.title}</h2>
            {category && (
              <p className={styles.detailCategory}>
                <BriefcaseIcon className={styles.detailBriefcase} />
                {t(category.name, locale)}
              </p>
            )}
            <div className={styles.detailActions}>
              <Button href={applyMailto(job, careersEmail)} external size="sm" className={styles.detailApply}>
                {dict.careers.apply}
              </Button>
              <JobShare
                url={detailHref('careers', job.slug, locale)}
                title={job.title}
                label={t(careers.share, locale)}
                copiedLabel={t(careers.linkCopied, locale)}
                showLabel
              />
            </div>
          </header>

          {[
            { title: t(jobDetail.responsibilities, locale), body: job.responsibilities },
            { title: t(jobDetail.qualifications, locale), body: job.minimumQualifications },
            { title: t(jobDetail.education, locale), body: job.education },
          ]
            .filter((block) => block.body)
            .map((block) => (
              <section key={block.title} className={styles.detailSection}>
                <h3 className={`${styles.detailSectionTitle} section-rule`}>{block.title}</h3>
                <RichText data={block.body} className={styles.detailBody} />
              </section>
            ))}

          <footer className={styles.detailFooter}>
            <p>
              {t(jobDetail.emailTo, locale)} <a href={`mailto:${careersEmail}`}>{careersEmail}</a>
              <br />
              {t(jobDetail.subjectNote, locale)}
              <br />
              {t(jobDetail.example, locale)}
            </p>
          </footer>
        </article>
      </Container>
    </>
  )
}
