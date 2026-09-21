'use client'

import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import styles from './ProductAccordion.module.css'

export type ProductRow = {
  id: string | number
  name: string
  shortDescription?: string | null
  /**
   * Rendered on the server and handed over as an element. A render function
   * cannot cross the server/client boundary.
   */
  description?: ReactNode
  status: 'live' | 'ready_to_sell'
  isNew?: boolean | null
  features?: string[]
  suitableFor?: string[]
  useCases?: string[]
  /** Expand/collapse duration in seconds (Figma smart-animate, linear). */
  duration?: number
}

export type ProductAccordionLabels = {
  description: string
  features: string
  suitableFor: string
  useCases: string
  expand: string
  collapse: string
}

/**
 * The "What We Offer" product list (Figma "Product card" 1432:6749 and the
 * expanded card 1391:5420). Collapsed, a row is 75px: status badge (NEW
 * stacked under it), name and one-line description, and a round "+" toggle.
 * Expanded it grows (smart-animate, linear) to show Deskripsi and the
 * Fitur Utama chips on the left, then the Cocok Untuk and Kasus Penggunaan
 * lists with orange dash bullets.
 *
 * `gap` is the space between rows (15 on Credit Scoring, 10 on Business
 * Solution); `openFirst` shows the first row expanded, as Business Solution
 * does.
 */
export function ProductAccordion({
  rows,
  labels,
  gap = 15,
  openFirst = false,
}: {
  rows: ProductRow[]
  labels: ProductAccordionLabels
  gap?: number
  openFirst?: boolean
}) {
  const baseId = useId()
  const [open, setOpen] = useState<Set<string | number>>(
    () => new Set(openFirst && rows[0] ? [rows[0].id] : []),
  )

  const toggle = (id: string | number) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <ul className={styles.list} style={{ gap }}>
      {rows.map((row, index) => {
        const isOpen = open.has(row.id)
        const bodyId = `${baseId}-${index}`
        const style = { '--accordion-duration': `${row.duration ?? 0.3}s` } as CSSProperties
        return (
          <li
            key={row.id}
            className={`${styles.row} ${isOpen ? styles.rowOpen : ''}`}
            style={style}
          >
            <button
              type="button"
              className={styles.head}
              aria-expanded={isOpen}
              aria-controls={bodyId}
              onClick={() => toggle(row.id)}
            >
              <span className={styles.badges}>
                <StatusBadge status={row.status} />
                {row.isNew && <StatusBadge status="new" />}
              </span>

              <span className={styles.text}>
                <span className={styles.name}>{row.name}</span>
                {row.shortDescription && (
                  <span className={styles.short}>{row.shortDescription}</span>
                )}
              </span>

              <span className={styles.toggle} aria-hidden="true">
                {/* akar-icons:plus 16px, 2px navy stroke; codex:cross 11px white */}
                <svg className={styles.plus} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <svg className={styles.cross} width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1l9 9M10 1l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="sr-only">{isOpen ? labels.collapse : labels.expand}</span>
            </button>

            <div
              id={bodyId}
              className={styles.bodyWrap}
              aria-hidden={!isOpen}
              inert={!isOpen}
            >
              <div className={styles.bodyInner}>
                <div className={styles.body}>
                  <div className={styles.colMain}>
                    <h4 className={styles.heading}>{labels.description}</h4>
                    <div className={styles.description}>{row.description}</div>
                    {row.features && row.features.length > 0 && (
                      <>
                        <h4 className={`${styles.heading} ${styles.featuresHeading}`}>
                          {labels.features}
                        </h4>
                        <ul className={styles.chips}>
                          {row.features.map((feature, i) => (
                            <li key={i} className={styles.chip}>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  {row.suitableFor && row.suitableFor.length > 0 && (
                    <div className={styles.colList}>
                      <h4 className={styles.heading}>{labels.suitableFor}</h4>
                      <ul className={styles.dashList}>
                        {row.suitableFor.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {row.useCases && row.useCases.length > 0 && (
                    <div className={styles.colList}>
                      <h4 className={styles.heading}>{labels.useCases}</h4>
                      <ul className={styles.dashList}>
                        {row.useCases.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
