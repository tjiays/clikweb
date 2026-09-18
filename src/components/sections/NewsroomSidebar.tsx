import Image from 'next/image'
import Link from 'next/link'
import { detailHref, mediaOutletHref } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'

import styles from './NewsroomSidebar.module.css'

/**
 * The Newsroom left column: Featured News as a bulleted list of links, and
 * Daftar Media as a grid of outlet logos (intent/02 §2.12).
 */
export function NewsroomSidebar({
  locale,
  featured,
  outlets,
  featuredLabel,
  outletsLabel,
}: {
  locale: Locale
  featured: any[]
  outlets: { slug: string; name: string; logo: string }[]
  featuredLabel: string
  outletsLabel: string
}) {
  return (
    <aside className={styles.sidebar}>
      {featured.length > 0 && (
        <section className={styles.block}>
          <h2 className={`t-h4 section-rule ${styles.heading}`}>{featuredLabel}</h2>
          <ul className={styles.featured}>
            {featured.map((article) => (
              <li key={article.id}>
                <Link href={detailHref('newsroom', article.slug, locale)}>
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {outlets.length > 0 && (
        <section className={styles.block}>
          <h2 className={`t-h4 section-rule ${styles.heading}`}>{outletsLabel}</h2>
          <ul className={styles.outlets}>
            {outlets.map((outlet) => (
              <li key={outlet.slug}>
                <Link href={mediaOutletHref(outlet.slug, locale)} className={styles.outlet}>
                  {outlet.logo ? (
                    <Image
                      src={outlet.logo}
                      alt={outlet.name}
                      width={120}
                      height={48}
                    />
                  ) : (
                    <span>{outlet.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  )
}

/** The scrolling row of media logos across the top of the Newsroom. */
export function MediaLogoStrip({
  outlets,
  label,
}: {
  outlets: { slug: string; name: string; logo: string }[]
  label: string
}) {
  if (outlets.length === 0) return null
  return (
    <div className={styles.strip} aria-label={label}>
      <ul className={styles.stripList}>
        {outlets.map((outlet) => (
          <li key={outlet.slug}>
            {outlet.logo ? (
              <Image
                src={outlet.logo}
                alt={outlet.name}
                width={130}
                height={52}
              />
            ) : (
              <span className={styles.stripName}>{outlet.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
