'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeLabels, type Locale } from '@/i18n/config'
import { switchLocalePath } from '@/i18n/routes'
import styles from './LanguageSwitch.module.css'

/** "ID | EN" — the active language is orange. Switches to the same page. */
export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? '/'

  return (
    <div className={styles.wrap} aria-label={label}>
      {locales.map((code, index) => (
        <span key={code} className={styles.slot}>
          {index > 0 && <span className={styles.divider} aria-hidden="true">|</span>}
          <Link
            href={switchLocalePath(pathname, code)}
            className={code === locale ? styles.active : styles.inactive}
            aria-current={code === locale ? 'true' : undefined}
            hrefLang={code}
          >
            {localeLabels[code]}
          </Link>
        </span>
      ))}
    </div>
  )
}
