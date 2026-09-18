import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { RichText } from '@/components/ui/RichText'
import { Button } from '@/components/ui/Button'
import { CTASection } from '@/components/sections/CTASection'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import {
  getPageContent,
  getMilestones,
  getPartnerLogos,
  getSiteSettings,
  getCTABlock,
  section,
  imageUrl,
  imageAlt,
} from '@/lib/content'
import styles from './AboutPage.module.css'

/** Tentang CLIK — Figma 333:2672. Section order follows intent/02 §2.2. */
export async function AboutPage({ locale }: { locale: Locale }) {
  const [dict, page, milestones, members, site, cta] = await Promise.all([
    getDictionary(locale),
    getPageContent(locale, 'about'),
    getMilestones(locale),
    getPartnerLogos(locale, 'clik_member'),
    getSiteSettings(locale),
    getCTABlock(locale, 'about'),
  ])

  const visi = section(page, 'visi')
  const misi = section(page, 'misi')
  const crif = section(page, 'tentang-crif')

  return (
    <>
      <PageHeader
        title={page?.title ?? dict.dropdown.aboutClik}
        lead={page?.lead}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.nav.about },
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

        {/* Visi and Misi, each an image beside its text */}
        {(visi || misi) && (
          <div className={styles.split}>
            {[visi, misi].filter(Boolean).map((block: any) => (
              <section key={block.key} className={styles.splitItem}>
                {imageUrl(block.image) && (
                  <Image
                    src={imageUrl(block.image) as string}
                    alt={imageAlt(block.image)}
                    width={640}
                    height={420}
                    className={styles.splitImage}
                  />
                )}
                <SectionTitle as="h2">{block.title}</SectionTitle>
                <RichText data={block.body} />
              </section>
            ))}
          </div>
        )}

        {/* Kenali CLIK Lebih Dekat */}
        {page?.videoUrl && (
          <section className={styles.section}>
            <SectionTitle as="h2">Kenali CLIK Lebih Dekat</SectionTitle>
            <div className={styles.video}>
              <iframe
                src={page.videoUrl}
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
              {milestones.map((milestone: any) => (
                <li key={milestone.id} className={styles.milestone}>
                  <span className={styles.year}>{milestone.year}</span>
                  <ul className={styles.milestoneItems}>
                    {(milestone.items ?? []).map((item: any, index: number) => (
                      <li key={index}>{item.text}</li>
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
              {members.map((member: any) => (
                <li key={member.id}>
                  {imageUrl(member.logo) ? (
                    <Image
                      src={imageUrl(member.logo) as string}
                      alt={imageAlt(member.logo, member.name)}
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
            <SectionTitle as="h2">{crif.title}</SectionTitle>
            <div className={styles.crif}>
              {imageUrl(crif.image) && (
                <Image
                  src={imageUrl(crif.image) as string}
                  alt={imageAlt(crif.image)}
                  width={600}
                  height={400}
                  className={styles.crifImage}
                />
              )}
              <div>
                <RichText data={crif.body} />
                {(site as any)?.crifUrl && (
                  <Button href={(site as any).crifUrl} external variant="outline">
                    {dict.common.learnMore}
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}
      </Container>

      <CTASection block={cta} />
    </>
  )
}
