'use client'

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'
import styles from './ProductCarousel.module.css'

/**
 * Card carousel used on the product pages.
 *
 * variant
 *   services    Layanan Kami, Figma Component 17 (1343:5250): 360x500 cards,
 *               40px apart in a 1300px window; a 70px orange arrow on the edge,
 *               two 15px navy dots under the cards.
 *   advantages  Keunggulan Utama, Components 12/13/14/18: 412x210 cards, 32px
 *               apart, starting 20px into a 1340px window; a 40px arrow.
 *
 * The arrow slides the track to the next stop (smart-animate 0.8s ease-out);
 * at the last stop the arrow moves to the left edge and slides back, as in
 * Figma. Stops are one window of whole cards apart, and the last stop brings
 * the final card flush with the right edge, so at 1440 there are exactly two.
 * Reduced motion: the slide is instant.
 */
export function ProductCarousel({
  children,
  variant,
  label,
  previousLabel,
  nextLabel,
  goToLabel,
  className,
}: {
  children: ReactNode
  variant: 'services' | 'advantages'
  label: string
  previousLabel: string
  nextLabel: string
  goToLabel: string
  className?: string
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  // Two stops until measured, so the server render already shows the arrow
  // and both dots (no layout shift); the real stops replace them on mount.
  const [stops, setStops] = useState<number[]>([0, 0])
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const items = Children.toArray(children)

  const measure = useCallback(() => {
    const vp = viewport.current
    const tr = track.current
    if (!vp || !tr) return
    const first = tr.children[0] as HTMLElement | undefined
    const second = tr.children[1] as HTMLElement | undefined
    if (!first) return
    const style = getComputedStyle(tr)
    const padStart = parseFloat(style.paddingLeft) || 0
    const padEnd = parseFloat(style.paddingRight) || 0
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
    const max = Math.max(0, tr.scrollWidth - vp.clientWidth)
    const visible = vp.clientWidth - padStart - padEnd
    const perPage = Math.max(1, Math.floor((visible + (step - first.offsetWidth)) / step))
    const next: number[] = [0]
    for (let offset = perPage * step; offset < max - 1; offset += perPage * step) next.push(offset)
    if (max > 1) next.push(max)
    setStops(next)
    setIndex((current) => Math.min(current, next.length - 1))
  }, [])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (viewport.current) observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [measure])

  const last = stops.length - 1
  const go = (next: number) => setIndex(Math.max(0, Math.min(last, next)))

  const onPointerDown = (event: PointerEvent) => {
    startX.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (startX.current === null) return
    const dx = event.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <div
      className={[styles.carousel, styles[variant], className].filter(Boolean).join(' ')}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className={styles.frame}>
        <div
          ref={viewport}
          className={styles.viewport}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (startX.current = null)}
        >
          <div
            ref={track}
            className={styles.track}
            style={{ transform: `translateX(${-(stops[index] ?? 0)}px)` }}
          >
            {items.map((item, i) => (
              <div key={i} className={styles.slide}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {index > 0 && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => go(index - 1)}
            aria-label={previousLabel}
          >
            <Chevron />
          </button>
        )}
        {index < last && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => go(index + 1)}
            aria-label={nextLabel}
          >
            <Chevron />
          </button>
        )}
      </div>

      {stops.length > 1 && (
        <div className={styles.dots}>
          {stops.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              aria-label={`${goToLabel} ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** White chevron (Figma vector 19x33 in the 70px arrow, 9x16 in the 40px one). */
function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 19 33" fill="none" aria-hidden="true">
      <path
        d="M3 3l13.5 13.5L3 30"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
