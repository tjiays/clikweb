'use client'

import { useState, type ReactNode } from 'react'
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
  isNew?: boolean
  useCases?: { segment?: string | null; use?: string | null }[]
}

/**
 * The "What We Offer" list on Credit Scoring: each row shows its status
 * badges, and the "+" button expands it to reveal the detail and use cases
 * (Figma "Expanded card" 1391:5420).
 */
export function ProductAccordion({ rows }: { rows: ProductRow[] }) {
  const [open, setOpen] = useState<string | number | null>(null)

  return (
    <ul className={styles.list}>
      {rows.map((row) => {
        const isOpen = open === row.id
        return (
          <li key={row.id} className={`${styles.row} ${isOpen ? styles.rowOpen : ''}`}>
            <button
              type="button"
              className={styles.head}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : row.id)}
            >
              <span className={styles.badges}>
                <StatusBadge status={row.status} />
                {row.isNew && <StatusBadge status="new" />}
              </span>

              {/*
                Figma "Product card" 1625:10968 — the name and its one-line
                description are stacked beside the badge, not laid out as
                separate columns.
              */}
              <span className={styles.text}>
                <span className={styles.name}>{row.name}</span>
                {row.shortDescription && (
                  <span className={styles.short}>{row.shortDescription}</span>
                )}
              </span>

              {/*
                Collapsed the toggle is an outlined circle; expanded
                (1391:5420) it is filled navy with a cross, pinned top right.
              */}
              <span
                className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  {isOpen ? (
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  ) : (
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  )}
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className={styles.body}>
                {row.description}
                {row.useCases && row.useCases.length > 0 && (
                  <dl className={styles.useCases}>
                    {row.useCases.map((useCase, index) => (
                      <div key={index} className={styles.useCase}>
                        <dt>{useCase.segment}</dt>
                        <dd>{useCase.use}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
