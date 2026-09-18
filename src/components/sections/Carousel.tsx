'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Carousel.module.css'

type Props = {
  children: ReactNode[]
  /** Advance on a timer, as the testimonial carousel does in the prototype. */
  autoAdvance?: boolean
  /** Show the arrow button, as the solutions carousel does. */
  showArrows?: boolean
  perView?: number
  label: string
}

/**
 * Horizontal carousel used for the solution cards and the partner
 * testimonials. Scrolls natively, so it stays swipeable on a touch screen.
 */
export function Carousel({
  children,
  autoAdvance = false,
  showArrows = true,
  perView = 3,
  label,
}: Props) {
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const pages = Math.max(1, Math.ceil(children.length / perView))

  const scrollTo = useCallback(
    (next: number) => {
      const element = track.current
      if (!element) return
      const target = ((next % pages) + pages) % pages
      element.scrollTo({ left: element.clientWidth * target, behavior: 'smooth' })
      setPage(target)
    },
    [pages],
  )

  useEffect(() => {
    if (!autoAdvance || pages < 2 || paused) return
    const timer = setInterval(() => scrollTo(page + 1), 5500)
    return () => clearInterval(timer)
  }, [autoAdvance, pages, page, paused, scrollTo])

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={styles.track}
        ref={track}
        role="group"
        aria-label={label}
        onScroll={(event) => {
          const element = event.currentTarget
          setPage(Math.round(element.scrollLeft / Math.max(1, element.clientWidth)))
        }}
        style={{ '--per-view': perView } as React.CSSProperties}
      >
        {children.map((child, index) => (
          <div className={styles.item} key={index}>
            {child}
          </div>
        ))}
      </div>

      {showArrows && pages > 1 && (
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scrollTo(page + 1)}
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {pages > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1}`}
              aria-current={index === page}
              className={`${styles.dot} ${index === page ? styles.dotActive : ''}`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
