'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeLabels, type Locale } from '@/i18n/config'
import { switchLocalePath } from '@/i18n/routes'
import styles from './LanguageSwitch.module.css'

/**
 * "ID  EN" (Figma 247:2362): 16/800 upper case, EN starts 40px after ID, no
 * divider. The active language is orange with a 3px orange bar right under
 * it; the other one takes the header's text colour. Switches to the same page.
 */
export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? '/'

  return (
    <div className={styles.wrap} role="group" aria-label={label}>
      {locales.map((code) => (
        <Link
          key={code}
          href={switchLocalePath(pathname, code)}
          className={`${styles.link} ${code === locale ? styles.active : styles.inactive}`}
          aria-current={code === locale ? 'true' : undefined}
          hrefLang={code}
        >
          <span className={styles.text}>{localeLabels[code]}</span>
        </Link>
      ))}
    </div>
  )
}
