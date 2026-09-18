import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import { site } from '@/content/site'
import { partnerLogos } from '@/content/partners'
import { t } from '@/lib/content'
import styles from './Footer.module.css'

/*
 * Phase 1 renders the footer's structure with the values taken from the Figma
 * design. From Phase 2 every item here (logos, links, address, licence number)
 * is read from CMS site settings instead — see intent/03-cms.md, SiteSettings.
 *
 * External URLs are marked TO VERIFY in docs/external-links.md until the team
 * confirms them.
 */

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const members = partnerLogos.filter((p) => p.group === 'member')
  const regulators = partnerLogos.filter((p) => p.group === 'regulator')
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Link href={href('home', locale)} className={styles.logo}>
              <Image
                src="/images/shared/logo-clik.png"
                alt="CLIK — CRIF Lembaga Informasi Keuangan"
                width={354}
                height={118}
                className={styles.logoImage}
              />
            </Link>
            <address className={styles.address}>
              {site.address && <p>{t(site.address, locale)}</p>}
              {site.phone && (
                <p>
                  {dict.footer.callUs}{' '}
                  <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>
                    {site.phone}
                  </a>
                </p>
              )}
              {site.generalEmail && (
                <p>
                  {dict.footer.emailUs}{' '}
                  <a href={`mailto:${site.generalEmail}`}>{site.generalEmail}</a>
                </p>
              )}
              {site.websiteUrl && (
                <p>
                  <a href={site.websiteUrl} target="_blank" rel="noopener noreferrer">
                    {site.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              )}
            </address>

            {site.socialLinks.length > 0 && (
              <ul className={styles.socials}>
                {site.socialLinks.map((social) => {
                  if (!social.icon) return null
                  return (
                    <li key={social.platform}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className={styles.social}
                      >
                        <Image src={social.icon} alt="" width={28} height={28} />
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
                {members.map((member) => {
                  const image = member.logo ? (
                    <Image
                      src={member.logo}
                      alt={member.name}
                      width={150}
                      height={62}
                      className={styles.partnerLogo}
                    />
                  ) : (
                    <span className={styles.logoChip}>{member.name}</span>
                  )
                  return (
                    <li key={member.name}>
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
            {regulators.map((regulator) =>
              regulator.logo ? (
                <Image
                  key={regulator.name}
                  src={regulator.logo}
                  alt={regulator.name}
                  width={150}
                  height={62}
                  className={styles.partnerLogo}
                />
              ) : null,
            )}
            {site.ojkLicenceNumber && (
              <p className={styles.licence}>{site.ojkLicenceNumber}</p>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} {site.companyName}.{' '}
            {dict.footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  )
}
