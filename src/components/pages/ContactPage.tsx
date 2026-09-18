import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ContactForm } from '@/components/sections/ContactForm'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { site } from '@/content/site'
import { t } from '@/lib/content'
import styles from './ContactPage.module.css'

/** Hubungi Kami — Figma 284:1397, per intent/02 §2.15. */
export async function ContactPage({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale)

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
        <div className={styles.layout}>
          <div>
            <ContactForm t={dict.contact as never} locale={locale} />
          </div>

          <aside className={styles.details}>
            {site.address && (
              <section className={styles.block}>
                <h2 className="t-h5">{dict.contact.visitUs}</h2>
                <address>{t(site.address, locale)}</address>
                {site.companyName && <p className={styles.company}>{site.companyName}</p>}
              </section>
            )}

            {site.generalEmail && (
              <section className={styles.block}>
                <h2 className="t-h5">{dict.contact.emailUs}</h2>
                <a href={`mailto:${site.generalEmail}`}>{site.generalEmail}</a>
              </section>
            )}

            {site.phone && (
              <section className={styles.block}>
                <h2 className="t-h5">{dict.contact.callUs}</h2>
                <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>
                  {site.phone}
                </a>
              </section>
            )}

            {site.mapEmbedUrl ? (
              <div className={styles.map}>
                <iframe
                  src={site.mapEmbedUrl}
                  title={dict.contact.visitUs}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              /* The map embed URL is a site setting; until it is filled in
                 there is nothing to show rather than a broken frame. */
              <p className={styles.mapMissing}>TODO: map embed URL not set in site settings.</p>
            )}
          </aside>
        </div>
      </Container>
    </>
  )
}
