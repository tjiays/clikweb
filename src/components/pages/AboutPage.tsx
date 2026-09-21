import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle, SectionRule } from '@/components/sections/SectionTitle'
import { Prose } from '@/components/ui/Prose'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href, detailHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { about, milestones, type Milestone } from '@/content/about'
import { clikMembers, type MemberLogo } from '@/content/partners'
import { site } from '@/content/site'
import { ctaBlocks } from '@/content/cta'
import { t } from '@/lib/content'
import styles from './AboutPage.module.css'

/**
 * Tentang CLIK — Figma 333:2672. Sections in Figma order:
 * intro (white band) → 2,688 highlight → Visi/Misi (white band) → video →
 * Pencapaian timeline → LPIP report teaser (photo) → Tentang CRIF →
 * CRIF infographic strip → Member CLIK (#E0F1FC band) → closing CTA.
 */
export async function AboutPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale)
  const cta = ctaBlocks.find((b) => b.page === 'about')
  const { intro, highlight, visi, misi, video, lpip, crif, members } = about

  return (
    <>
      {/* Intro — white band 1440x566 under the header */}
      <div className={styles.band}>
        <PageHeader
          title={t(about.title, locale)}
          crumbs={[
            { label: dict.nav.home, href: href('home', locale) },
            { label: dict.nav.about },
          ]}
          breadcrumbLabel={dict.common.breadcrumb}
          className={styles.header}
        >
          <div className={styles.intro}>
            <p className={styles.introText}>{t(intro.text, locale)}</p>
            <Image
              src={intro.image}
              alt=""
              width={501}
              height={282}
              className={styles.introImage}
              priority
            />
          </div>
        </PageHeader>
      </div>

      {/* 2,688 Financing And Non Financing Institutions */}
      <section className={styles.highlight}>
        <Container>
          <SectionTitle
            align="center"
            weight={700}
            ruleGap={20}
            subtitle={t(highlight.lead, locale)}
            className={styles.highlightTitle}
          >
            {t(highlight.title, locale)}
          </SectionTitle>
          <p className={styles.highlightText}>{t(highlight.text, locale)}</p>
        </Container>
      </section>

      {/* Visi / Misi — white band, text|image then image|text */}
      <section className={styles.band}>
        <Container>
          <div className={styles.visionRow}>
            <div className={styles.visionText}>
              <SectionTitle size="md" className={styles.smallTitle}>
                {t(visi.title, locale)}
              </SectionTitle>
              <Prose body={visi.body} locale={locale} className={styles.visionProse} />
            </div>
            <Image src={visi.image} alt="" width={459} height={265} className={styles.visiImage} />
          </div>
          <div className={styles.missionRow}>
            <Image src={misi.image} alt="" width={547} height={291} className={styles.misiImage} />
            <div className={styles.missionText}>
              <SectionTitle size="md" className={styles.smallTitle}>
                {t(misi.title, locale)}
              </SectionTitle>
              <ul className={styles.missionList}>
                {misi.items.map((item, index) => (
                  <li key={index}>{t(item, locale)}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Kenali CLIK Lebih Dekat — placeholder until the video URL exists */}
      <section className={styles.video}>
        <Container>
          <SectionTitle align="center" size="md" ruleGap={20} className={styles.videoTitle}>
            {t(video.title, locale)}
          </SectionTitle>
          {video.url ? (
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.videoBox}
              aria-label={t(video.playLabel, locale)}
            >
              <PlayIcon />
            </a>
          ) : (
            <div className={styles.videoBox} role="img" aria-label={t(video.title, locale)}>
              <PlayIcon />
            </div>
          )}
        </Container>
      </section>

      {/* Pencapaian Perusahaan Kami */}
      <section className={styles.milestones}>
        <Container>
          <SectionTitle size="md" className={styles.smallTitle}>
            {t(about.milestonesTitle, locale)}
          </SectionTitle>
          <div className={styles.timelineScroll}>
            <ol className={styles.timeline}>
              {milestones.map((milestone) => (
                <MilestoneItem key={milestone.year} milestone={milestone} locale={locale} />
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Perkembangan Usaha LPIP — photo with 50% black overlay */}
      <section className={styles.lpip}>
        <Image src={lpip.image} alt="" fill sizes="100vw" className={styles.lpipImage} />
        <Container className={styles.lpipInner}>
          <div className={styles.lpipContent}>
            <SectionTitle size="md" ruleGap={10} className={styles.lpipTitle}>
              {t(lpip.title, locale)}
            </SectionTitle>
            {lpip.paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.lpipText}>
                {t(paragraph, locale)}
              </p>
            ))}
            <Button href={detailHref('reports', lpip.reportSlug, locale)} width={191}>
              {t(lpip.button, locale)}
            </Button>
          </div>
        </Container>
      </section>

      {/* Tentang CRIF — text left, globe right, centred ornament above */}
      <section className={styles.crif}>
        <Container>
          <SectionRule align="center" className={styles.crifRule} />
          <div className={styles.crifGrid}>
            <div>
              <SectionTitle rule={false} weight={700} className={styles.crifTitle}>
                {t(crif.title, locale)}
              </SectionTitle>
              <Prose body={crif.body} locale={locale} variant="relaxed" className={styles.crifProse} />
              {site.crifUrl && (
                <Button href={site.crifUrl} external width={191}>
                  {t(crif.button, locale)}
                </Button>
              )}
            </div>
            <Image src={crif.image} alt="" width={604} height={606} className={styles.crifImage} />
          </div>
        </Container>
      </section>

      {/* CRIF infographic strip */}
      <section className={styles.strip}>
        <Container>
          <div className={styles.stripRow}>
            {crif.strip.map((image) => (
              <Image
                key={image.src}
                src={image.src}
                alt={t(image.alt, locale)}
                width={image.width}
                height={image.height}
                sizes={`(max-width: 1024px) 100vw, ${image.width}px`}
                className={styles.stripImage}
                style={{ flexGrow: image.width }}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Member CLIK */}
      <section className={styles.members}>
        <Container>
          <h2 className={styles.membersTitle}>{t(members.title, locale)}</h2>
          <div className={styles.memberGroups}>
            <MemberGrid label={t(members.financial, locale)} logos={clikMembers.financial} />
            <MemberGrid label={t(members.nonFinancial, locale)} logos={clikMembers.nonFinancial} />
          </div>
        </Container>
      </section>

      <CTASection block={cta} locale={locale} />
    </>
  )
}

function MilestoneItem({ milestone, locale }: { milestone: Milestone; locale: Locale }) {
  // Consecutive bulleted lines form one list; the rest are single lines.
  const groups: { bullet: boolean; lines: Milestone['lines'] }[] = []
  for (const line of milestone.lines) {
    const last = groups[groups.length - 1]
    if (line.bullet && last?.bullet) last.lines.push(line)
    else groups.push({ bullet: !!line.bullet, lines: [line] })
  }

  return (
    <li className={styles.milestone}>
      <span className={styles.year}>{milestone.year}</span>
      <span className={styles.marker} aria-hidden="true" />
      <div className={styles.milestoneBody} style={milestone.width ? { width: milestone.width } : undefined}>
        {groups.map((group, index) =>
          group.bullet ? (
            <ul key={index} className={styles.productList}>
              {group.lines.map((line, i) => (
                <li key={i}>{t(line.text, locale)}</li>
              ))}
            </ul>
          ) : (
            group.lines.map((line, i) => (
              <p
                key={`${index}-${i}`}
                className={[
                  styles.milestoneLine,
                  line.tone === 'accent' ? styles.accent : '',
                  line.strong ? styles.strong : '',
                  line.gapBefore ? styles.gapBefore : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {t(line.text, locale)}
                {line.accent && <span className={styles.accent}>{t(line.accent, locale)}</span>}
              </p>
            ))
          ),
        )}
      </div>
    </li>
  )
}

function MemberGrid({ label, logos }: { label: string; logos: MemberLogo[] }) {
  return (
    <div className={styles.memberGroup}>
      <h3 className={styles.memberLabel}>{label}</h3>
      <ul className={styles.logoGrid}>
        {logos.map((logo, index) => (
          <li key={index}>
            {/* eslint-disable-next-line @next/next/no-img-element -- small SVG logos, no optimisation needed */}
            <img src={logo.logo} alt={logo.name} width={logo.width} height={logo.height} decoding="async" />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Figma "play-circle" (jam-icons, I350:2289;343:1241): 80px glyph in a 96px box, #C1C7CD. */
function PlayIcon() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true" className={styles.play}>
      <path
        d="M48 88C25.908 88 8 70.092 8 48C8 25.908 25.908 8 48 8C70.092 8 88 25.908 88 48C88 70.092 70.092 88 48 88ZM48 80C56.4869 80 64.6263 76.6286 70.6274 70.6274C76.6286 64.6263 80 56.4869 80 48C80 39.5131 76.6286 31.3737 70.6274 25.3726C64.6263 19.3714 56.4869 16 48 16C39.5131 16 31.3737 19.3714 25.3726 25.3726C19.3714 31.3737 16 39.5131 16 48C16 56.4869 19.3714 64.6263 25.3726 70.6274C31.3737 76.6286 39.5131 80 48 80ZM64.504 54.984L48.284 66.576C44.664 69.16 39.764 68.132 37.336 64.272C36.4598 62.8685 35.9967 61.2465 36 59.592V36.408C36 31.768 39.532 28 43.888 28C45.452 28 46.984 28.496 48.284 29.424L64.504 41.016C68.124 43.604 69.088 48.824 66.664 52.684C66.1003 53.5838 65.3666 54.365 64.504 54.984ZM43.888 36.408V59.592L60.108 48L43.888 36.408Z"
        fill="currentColor"
      />
    </svg>
  )
}
