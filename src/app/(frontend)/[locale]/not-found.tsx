import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { getDictionary } from '@/i18n'
import { defaultLocale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import styles from './not-found.module.css'

/**
 * 404. Not in the design, so it follows the design system (intent/02 §1).
 * Rendered outside the [locale] param, so it falls back to Indonesian.
 */
export default async function NotFound() {
  const dict = await getDictionary(defaultLocale)
  return (
    <Container>
      <div className={styles.wrap}>
        <p className={styles.code}>404</p>
        <h1 className="t-h1">{dict.notFound.title}</h1>
        <p className={`t-lead ${styles.body}`}>{dict.notFound.body}</p>
        <Link href={href('home', defaultLocale)} className={styles.link}>
          {dict.notFound.home} →
        </Link>
      </div>
    </Container>
  )
}
