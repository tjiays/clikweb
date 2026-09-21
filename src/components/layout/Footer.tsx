import Link from 'next/link'
import Image from 'next/image'
import type { ComponentType, SVGProps } from 'react'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import { site } from '@/content/site'
import { partnerLogos } from '@/content/partners'
import { InstagramLogo, LinkedinCircle, WhatsappSolid } from '@/components/ui/icons'
import styles from './Footer.module.css'

/*
 * Footer — Figma component 113:551 ("Footer ID"), 1440x440 on #F1FAFF with a
 * 2px orange line on top. Positions at 1440: logo 328x109 at (84,60);
 * address (94,206) 15px italic navy; "ANGGOTA DARI" column at x=512;
 * "TERDAFTAR & DIAWASI OLEH OJK" at x=1028; navy rule at y=367 from x=84,
 * 1207 wide; social icons bottom-left and the copyright centred below it.
 *
 * External URLs are marked TO VERIFY in docs/external-links.md until the team
 * confirms them.
 */

/** Per-logo size and vertical offset in the members grid (Figma 101:110–113). */
const memberLayout: Record<string, { width: number; height: number; offset: number }> = {
  AFPI: { width: 247, height: 65, offset: 0 },
  BIIA: { width: 96, height: 55, offset: 6 },
  'Fintech Indonesia (AFTECH)': { width: 173, height: 108, offset: 0 },
  APPI: { width: 204, height: 50, offset: 11 },
}

const socialIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  whatsapp: WhatsappSolid,
  instagram: InstagramLogo,
  linkedin: LinkedinCircle,
}

const socialNames: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const members = partnerLogos.filter((p) => p.group === 'member')
  const regulators = partnerLogos.filter((p) => p.group === 'regulator')
  const year = new Date().getFullYear()
  const website = site.websiteUrl.replace(/^https?:\/\//, '')

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
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
              <p>
                {site.addressLines[locale].map((line, index) => (
                  <span key={index} className={styles.line}>
                    {line}
                  </span>
                ))}
              </p>
              <p>
                <a href={`tel:+62${site.footerPhone.replace(/\D/g, '').replace(/^0/, '')}`}>
                  {site.footerPhone}
                </a>
                {' | '}
                <a href={`mailto:${site.generalEmail}`}>{site.generalEmail}</a>
                <br />
                <a
                  href={site.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.website}
                >
                  {website}
                </a>
              </p>
            </address>
          </div>

          {members.length > 0 && (
            <div className={styles.members}>
              <h2 className={`${styles.heading} ${styles.headingMembers}`}>{dict.footer.members}</h2>
              <ul className={styles.memberGrid}>
                {members.map((member) => {
                  const box = memberLayout[member.name] ?? { width: 150, height: 62, offset: 0 }
                  const image = (
                    <Image
                      src={member.logo}
                      alt={member.name}
                      width={box.width * 2}
                      height={box.height * 2}
                      className={styles.memberLogo}
                      style={{ width: box.width, height: box.height, marginTop: box.offset }}
                    />
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

          <div className={styles.regulator}>
            <h2 className={styles.heading}>{dict.footer.supervised}</h2>
            <div className={styles.ojkRow}>
              {regulators.map((regulator) =>
                regulator.logo ? (
                  <Image
                    key={regulator.name}
                    src={regulator.logo}
                    alt={regulator.name}
                    width={200}
                    height={82}
                    className={styles.ojkLogo}
                  />
                ) : null,
              )}
              {site.ojkLicenceNumber && (
                <p className={styles.licence}>
                  {site.ojkLicenceLabel}
                  <br />
                  {site.ojkLicenceNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className={styles.rule} />

        <div className={styles.bottom}>
          {site.socialLinks.length > 0 && (
            <ul className={styles.socials}>
              {site.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform]
                if (!Icon) return null
                return (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialNames[social.platform] ?? social.platform}
                      className={`${styles.social} ${styles[social.platform] ?? ''}`}
                    >
                      <Icon />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
          <p className={styles.copyright}>© Copyright {year} - CLIK</p>
        </div>
      </div>
    </footer>
  )
}
