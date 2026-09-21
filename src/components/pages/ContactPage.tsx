import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ContactForm } from '@/components/sections/ContactForm'
import { SectionRule } from '@/components/sections/SectionTitle'
import { BuildingIcon, EnvelopeIcon, PhoneIcon } from '@/components/sections/ContactIcons'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { site } from '@/content/site'
import { contactPage } from '@/content/contact'
import { t } from '@/lib/content'
import styles from './ContactPage.module.css'

/** Hubungi Kami — Figma 284:1397, per intent/02 §2.15. */
export async function ContactPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale)

  const intro = (
    <div className={styles.intro}>
      {contactPage.intro[locale].map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  )

  const aside = (
    <aside className={styles.details}>
      {site.address && (
        <section className={styles.item}>
          <BuildingIcon className={`${styles.icon} ${styles.iconBuilding}`} />
          <div>
            <h2 className={styles.heading}>{t(contactPage.visitUs, locale)}</h2>
            <address className={styles.value}>{t(site.address, locale)}</address>
          </div>
        </section>
      )}

      {site.generalEmail && (
        <section className={styles.item}>
          <EnvelopeIcon className={styles.icon} />
          <div>
            <h2 className={styles.heading}>{t(contactPage.emailUs, locale)}</h2>
            <a className={styles.value} href={`mailto:${site.generalEmail}`}>
              {site.generalEmail}
            </a>
          </div>
        </section>
      )}

      {site.phone && (
        <section className={styles.item}>
          <PhoneIcon className={styles.icon} />
          <div>
            <h2 className={styles.heading}>{t(contactPage.callUs, locale)}</h2>
            <a className={styles.value} href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>
              {site.phone}
            </a>
          </div>
        </section>
      )}

      {site.mapEmbedUrl && (
        <div className={styles.mapBlock}>
          {site.companyName && <p className={styles.company}>{site.companyName}</p>}
          <div className={styles.map}>
            <iframe
              src={site.mapEmbedUrl}
              title={`${site.companyName} — Google Maps`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </aside>
  )

  return (
    <>
      <PageHeader
        title={dict.contact.title}
        crumbs={[
          { label: dict.nav.home, href: href('home', locale) },
          { label: dict.contact.title },
        ]}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container>
        <div className={styles.page}>
          <SectionRule align="center" className={styles.divider} />
          <ContactForm t={dict.contact as never} locale={locale} intro={intro} aside={aside} />
        </div>
      </Container>
    </>
  )
}
