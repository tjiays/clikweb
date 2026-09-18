import Link from 'next/link'
import { Container } from './Container'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n'
import styles from './Footer.module.css'

/*
 * Phase 1 renders the footer's structure with the values taken from the Figma
 * design. From Phase 2 every item here (logos, links, address, licence number)
 * is read from CMS site settings instead — see intent/03-cms.md, SiteSettings.
 *
 * External URLs are marked TO VERIFY in docs/external-links.md until the team
 * confirms them.
 */

const SITE = {
  address:
    'Menara Dea Tower 2, Jl. Mega Kuningan Barat Blok E4.3 No 1-2, Kuningan Timur, Setiabudi, Jakarta 12950',
  phone: '(+62) 21 8060 4228',
  phoneHref: 'tel:+622180604228',
  email: 'info@cbclik.com',
  website: 'https://www.cbclik.com',
  websiteLabel: 'www.cbclik.com',
  ojkLicence: 'TODO: OJK licence number',
}

// TODO: confirm which platforms the three icons in the design represent.
const SOCIALS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/clik-indonesia/' },
  { name: 'Instagram', url: 'https://www.instagram.com/clik.indonesia/' },
  { name: 'Facebook', url: 'https://www.facebook.com/clikindonesia/' },
]

// TODO: replace with logo images from the CMS media library in Phase 2.
const MEMBER_ORGS = ['AFPI', 'BIIA', 'AFTECH', 'APPI']

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Link href={href('home', locale)} className={styles.logo}>
              CLIK
            </Link>
            <address className={styles.address}>
              <p>{SITE.address}</p>
              <p>
                {dict.footer.callUs}{' '}
                <a href={SITE.phoneHref}>{SITE.phone}</a>
              </p>
              <p>
                {dict.footer.emailUs}{' '}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
              <p>
                <a href={SITE.website} target="_blank" rel="noopener noreferrer">
                  {SITE.websiteLabel}
                </a>
              </p>
            </address>

            <ul className={styles.socials}>
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={styles.social}
                  >
                    {social.name.charAt(0)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>{dict.footer.members}</h2>
            <ul className={styles.logoRow}>
              {MEMBER_ORGS.map((org) => (
                <li key={org} className={styles.logoChip}>
                  {org}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>{dict.footer.supervised}</h2>
            <div className={styles.logoChip}>OJK</div>
            <p className={styles.licence}>{SITE.ojkLicence}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} PT CRIF Lembaga Informasi Keuangan. {dict.footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  )
}
