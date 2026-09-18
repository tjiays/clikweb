import type { ReactNode } from 'react'
import styles from './SectionTitle.module.css'

/**
 * A section title with the short orange bar above it, as used throughout the
 * design. Centred on the homepage, left-aligned on inner pages.
 */
export function SectionTitle({
  children,
  subtitle,
  align = 'left',
  as: Tag = 'h2',
}: {
  children: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <header className={`${styles.header} ${align === 'center' ? styles.center : ''}`}>
      <Tag
        className={`t-h1 section-rule ${align === 'center' ? 'section-rule--center' : ''}`}
      >
        {children}
      </Tag>
      {subtitle && <p className={`t-lead ${styles.subtitle}`}>{subtitle}</p>}
    </header>
  )
}
