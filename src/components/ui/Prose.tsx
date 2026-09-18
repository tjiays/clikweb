import type { Locale } from '@/i18n/config'
import styles from './RichText.module.css'

type Paragraph = { id: string; en: string }

/**
 * Renders the paragraph arrays used by src/content. The CMS still returns
 * Lexical rich text for articles and reports — that goes through RichText.
 */
export function Prose({
  body,
  locale,
  className,
}: {
  body?: Paragraph[]
  locale: Locale
  className?: string
}) {
  if (!body || body.length === 0) return null
  return (
    <div className={className ? `${styles.prose} ${className}` : styles.prose}>
      {body.map((paragraph, index) => (
        <p key={index}>{paragraph[locale]}</p>
      ))}
    </div>
  )
}
