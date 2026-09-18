import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import { getPartnerLogos, getSiteSettings, imageUrl, imageAlt } from '@/lib/content'
import styles from './Footer.module.css'

/*
 * Phase 1 renders the footer's structure with the values taken from the Figma
 * design. From Phase 2 every item here (logos, links, address, licence number)
 * is read from CMS site settings instead — see intent/03-cms.md, SiteSettings.
 *
 * External URLs are marked TO VERIFY in docs/external-links.md until the team
 * confirms them.
 */

/** Icons for the social platforms the design shows. */
const SOCIAL_ICON: Record<string, string> = {
  whatsapp: '/brand/icon-social-whatsapp.svg',
  instagram: '/brand/icon-social-instagram.svg',
  linkedin: '/brand/icon-social-linkedin.svg',
}

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [site, members, regulators] = await Promise.all([
    getSiteSettings(locale),
    getPartnerLogos(locale, 'member'),
    getPartnerLogos(locale, 'regulator'),
  ])
  const settings = site as any
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Link href={href('home', locale)} className={styles.logo}>
              <Image
                src="/brand/logo-clik.png"
                alt="CLIK — CRIF Lembaga Informasi Keuangan"
                width={354}
                height={118}
                className={styles.logoImage}
              />
            </Link>
            <address className={styles.address}>
              {settings?.address && <p>{settings.address}</p>}
              {settings?.phone && (
                <p>
                  {dict.footer.callUs}{' '}
                  <a href={`tel:${String(settings.phone).replace(/[^\d+]/g, '')}`}>
                    {settings.phone}
                  </a>
                </p>
              )}
              {settings?.generalEmail && (
                <p>
                  {dict.footer.emailUs}{' '}
                  <a href={`mailto:${settings.generalEmail}`}>{settings.generalEmail}</a>
                </p>
              )}
              {settings?.websiteUrl && (
                <p>
                  <a href={settings.websiteUrl} target="_blank" rel="noopener noreferrer">
                    {settings.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              )}
            </address>

            {settings?.socialLinks?.length > 0 && (
              <ul className={styles.socials}>
                {settings.socialLinks.map((social: any) => {
                  const icon = SOCIAL_ICON[social.platform]
                  if (!icon) return null
                  return (
                    <li key={social.platform}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className={styles.social}
                      >
                        <Image src={icon} alt="" width={28} height={28} />
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {members.length > 0 && (
            <div className={styles.column}>
              <h2 className={styles.heading}>{dict.footer.members}</h2>
              <ul className={styles.logoRow}>
                {members.map((member: any) => {
                  const url = imageUrl(member.logo)
                  const image = url ? (
                    <Image
                      src={url}
                      alt={imageAlt(member.logo, member.name)}
                      width={150}
                      height={62}
                      className={styles.partnerLogo}
                    />
                  ) : (
                    <span className={styles.logoChip}>{member.name}</span>
                  )
                  return (
                    <li key={member.id}>
                      {member.url ? (
                        <a href={member.url} target="_blank" rel="noopener noreferrer">
                          {image}
                        </a>
                      ) : (
                        image
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          <div className={styles.column}>
            <h2 className={styles.heading}>{dict.footer.supervised}</h2>
            {regulators.map((regulator: any) => {
              const url = imageUrl(regulator.logo)
              return url ? (
                <Image
                  key={regulator.id}
                  src={url}
                  alt={imageAlt(regulator.logo, regulator.name)}
                  width={150}
                  height={62}
                  className={styles.partnerLogo}
                />
              ) : null
            })}
            {settings?.ojkLicenceNumber && (
              <p className={styles.licence}>{settings.ojkLicenceNumber}</p>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} {settings?.companyName ?? 'PT CRIF Lembaga Informasi Keuangan'}.{' '}
            {dict.footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  )
}
