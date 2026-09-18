import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { Prose } from '@/components/ui/Prose'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { about, milestones } from '@/content/about'
import { partnerLogos } from '@/content/partners'
import { site } from '@/content/site'
import { ctaBlocks } from '@/content/cta'
import { t } from '@/lib/content'
import styles from './AboutPage.module.css'

/** Tentang CLIK — Figma 333:2672. Section order follows intent/02 §2.2. */
export async function AboutPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale)
  const members = partnerLogos.filter((p) => p.group === 'clik_member')
  const cta = ctaBlocks.find((b) => b.page === 'about')
  const find = (key: string) => about.sections.find((s) => s.key === key)
  const visi = find('visi')
  const misi = find('misi')
  const crif = find('tentang-crif')

  return (
    <>
      <PageHeader
        title={t(about.title, locale)}
        lead={t(about.lead, locale)}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.about },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        {about.heroImage && (
          <Image
            src={about.heroImage}
            alt=""
            width={1300}
            height={600}
            className={styles.hero}
            priority
          />
        )}

        {/* Visi and Misi, each an image beside its text */}
        {(visi || misi) && (
          <div className={styles.split}>
            {[visi, misi].filter(Boolean).map((block) => (
              <section key={block!.key} className={styles.splitItem}>
                {block!.image && (
                  <Image
                    src={block!.image}
                    alt=""
                    width={640}
                    height={420}
                    className={styles.splitImage}
                  />
                )}
                <SectionTitle as="h2">{t(block!.title, locale)}</SectionTitle>
                <Prose body={block!.body} locale={locale} />
              </section>
            ))}
          </div>
        )}

        {/* Kenali CLIK Lebih Dekat */}
        {about.videoUrl && (
          <section className={styles.section}>
            <SectionTitle as="h2">Kenali CLIK Lebih Dekat</SectionTitle>
            <div className={styles.video}>
              <iframe
                src={about.videoUrl}
                title="CLIK"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Pencapaian Perusahaan Kami — horizontal timeline */}
        {milestones.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">
              {locale === 'id' ? 'Pencapaian Perusahaan Kami' : 'Our Milestones'}
            </SectionTitle>
            <ol className={styles.timeline}>
              {milestones.map((milestone) => (
                <li key={milestone.year} className={styles.milestone}>
                  <span className={styles.year}>{milestone.year}</span>
                  <ul className={styles.milestoneItems}>
                    {milestone.items.map((item, index) => (
                      <li key={index}>{t(item, locale)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Member CLIK */}
        {members.length > 0 && (
          <section className={styles.section}>
            <SectionTitle as="h2">Member CLIK</SectionTitle>
            <ul className={styles.logoStrip}>
              {members.map((member) => (
                <li key={member.name}>
                  {member.logo ? (
                    <Image
                      src={member.logo}
                      alt={member.name}
                      width={160}
                      height={70}
                    />
                  ) : (
                    member.name
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tentang CRIF, linking out to the global site */}
        {crif && (
          <section className={styles.section}>
            <SectionTitle as="h2">{t(crif.title, locale)}</SectionTitle>
            <div className={styles.crif}>
              {crif.image && (
                <Image
                  src={crif.image}
                  alt=""
                  width={600}
                  height={400}
                  className={styles.crifImage}
                />
              )}
              <div>
                <Prose body={crif.body} locale={locale} />
                {site.crifUrl && (
                  <Button href={site.crifUrl} external variant="outline">
                    {dict.common.learnMore}
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}
      </Container>

      <CTASection block={cta} locale={locale} />
    </>
  )
}
