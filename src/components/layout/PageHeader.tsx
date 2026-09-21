import type { ReactNode } from 'react'
import { Container } from './Container'
import { Breadcrumb, type Crumb } from './Breadcrumb'
import styles from './PageHeader.module.css'

/**
 * Inner-page top area: breadcrumb then title, placed as in every inner Figma
 * frame (breadcrumb text box at y=142, i.e. 52px under the 90px header; title
 * 38/800 black with its glyph centre at y=237).
 *
 * Options for page implementers:
 * - `hideTitle`   keep only the breadcrumb (Detail Berita, DET-01); the h1 is
 *                 still rendered for screen readers.
 * - `lead`        optional paragraph under the title. `leadVariant="body"`
 *                 gives the Figma intro text (16/400, 30px, #000, max 707px);
 *                 the default "lead" is 24/400.
 * - `children`    rendered after the title inside the same container.
 * - `className`   extra class on the wrapper (e.g. to change bottom spacing).
 */
export function PageHeader({
  title,
  crumbs,
  breadcrumbLabel,
  lead,
  leadVariant = 'lead',
  hideTitle = false,
  className,
  children,
}: {
  title: string
  crumbs: Crumb[]
  breadcrumbLabel: string
  lead?: string | null
  leadVariant?: 'lead' | 'body'
  hideTitle?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <Container>
      <div className={className ? `${styles.wrap} ${className}` : styles.wrap}>
        <Breadcrumb items={crumbs} label={breadcrumbLabel} />
        <h1 className={hideTitle ? 'sr-only' : `t-h1 ${styles.title}`}>{title}</h1>
        {lead && (
          <p className={leadVariant === 'body' ? styles.leadBody : `t-lead ${styles.lead}`}>
            {lead}
          </p>
        )}
        {children}
      </div>
    </Container>
  )
}
