'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import styles from './Carousel.module.css'

type Variant = 'scroll' | 'solutions' | 'testimonials'

type Props = {
  children: ReactNode[]
  /** Accessible name of the carousel. */
  label: string
  /**
   * scroll (default)  native horizontal scroll, `perView` items per page
   *                   (Karir hero strip). Swipeable on touch screens.
   * solutions         Home "Solusi Lengkap" (Figma Component 28, 1780:10846):
   *                   346px cards, 31px gap, 3 cards + a peek of the 4th;
   *                   60px orange arrow; the row slides 0.3s ease-out;
   *                   15px navy dots.
   * testimonials      Home "Apa Kata Mitra Kami" (Component 4, 627:5394):
   *                   454px cards, 18px gap, auto-advances 3 cards (1416px)
   *                   every 5s with a 0.5s linear slide, looping; 20x6 navy
   *                   active dot, 6px #D9D9D9 dots.
   */
  variant?: Variant
  /** Advance on a timer. Default: true for testimonials, false otherwise. */
  autoAdvance?: boolean
  /** Show the arrow buttons. Default: true (scroll, solutions), false (testimonials). */
  showArrows?: boolean
  /** scroll variant: items per page. */
  perView?: number
  /** Slide variants: item width / gap in px (defaults per variant). */
  itemWidth?: number
  gap?: number
  /** Slide variants: ms between automatic steps, and slide duration in ms. */
  interval?: number
  duration?: number
  previousLabel?: string
  nextLabel?: string
  className?: string
}

/**
 * Horizontal carousel used for the Home solution cards and partner
 * testimonials, and the Karir photo strip.
 */
export function Carousel(props: Props) {
  if (props.variant === 'solutions' || props.variant === 'testimonials') {
    return <SlideCarousel {...props} variant={props.variant} />
  }
  return <ScrollCarousel {...props} />
}

/* ------------------------------------------------------------------ */
/* Slide variants (transform track, exact Figma timing)               */
/* ------------------------------------------------------------------ */

const PRESETS = {
  solutions: { itemWidth: 346, gap: 31, duration: 300, easing: 'ease-out', interval: 5000, auto: false, arrows: true },
  testimonials: { itemWidth: 454, gap: 18, duration: 500, easing: 'linear', interval: 5000, auto: true, arrows: false },
} as const

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduce(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduce
}

function Chevron({ direction }: { direction: 'prev' | 'next' }) {
  // Figma vector 1778:10737: 16x28 white chevron
  return (
    <svg
      width="17"
      height="29"
      viewBox="0 0 17 29"
      aria-hidden="true"
      focusable="false"
      style={direction === 'prev' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16.6964 14.5L2.58763 29.0001L-0.000571011 26.3401L5.75973 20.4201L11.52 14.5L-0.000571011 2.66373L2.58763 0L16.6964 14.5Z"
      />
    </svg>
  )
}

function SlideCarousel({
  children,
  label,
  variant,
  autoAdvance,
  showArrows,
  itemWidth,
  gap,
  interval,
  duration,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
}: Props & { variant: 'solutions' | 'testimonials' }) {
  const preset = PRESETS[variant]
  const width = itemWidth ?? preset.itemWidth
  const spacing = gap ?? preset.gap
  const auto = autoAdvance ?? preset.auto
  const arrows = showArrows ?? preset.arrows
  const every = interval ?? preset.interval
  const slideMs = duration ?? preset.duration
  const count = children.length

  const viewport = useRef<HTMLDivElement>(null)
  const firstItem = useRef<HTMLDivElement>(null)
  const [offsets, setOffsets] = useState<number[]>([0])
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = usePrefersReducedMotion()
  const touchStart = useRef<number | null>(null)

  const pages = offsets.length

  // Work out the scroll positions of each page from the real layout.
  const measure = useCallback(() => {
    const view = viewport.current
    const item = firstItem.current
    if (!view || !item) return
    const viewWidth = view.clientWidth
    const cardWidth = item.getBoundingClientRect().width
    const pitch = cardWidth + spacing
    const total = count * cardWidth + Math.max(0, count - 1) * spacing
    const max = Math.max(0, Math.round(total - viewWidth))
    const perPage = Math.max(1, Math.floor((viewWidth + spacing + 1) / pitch))
    const next: number[] = []
    for (let start = 0; start < count; start += perPage) {
      const offset = Math.min(Math.round(start * pitch), max)
      if (next.length === 0 || offset > next[next.length - 1]) next.push(offset)
      if (offset >= max) break
    }
    setOffsets(next.length ? next : [0])
  }, [count, spacing])

  useLayoutEffect(() => {
    measure()
    const view = viewport.current
    if (!view || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => measure())
    observer.observe(view)
    return () => observer.disconnect()
  }, [measure])

  const current = Math.min(page, pages - 1)

  const go = useCallback(
    (next: number) => setPage(((next % pages) + pages) % pages),
    [pages],
  )

  // Auto-advance: one step per `every` ms, looping back to the first page.
  useEffect(() => {
    if (!auto || reduce || paused || pages < 2) return
    const timer = setTimeout(() => go(current + 1), every)
    return () => clearTimeout(timer)
  }, [auto, reduce, paused, pages, current, every, go])

  const trackStyle = {
    '--item-w': `${width}px`,
    '--gap': `${spacing}px`,
    transform: `translate3d(${-offsets[current]}px, 0, 0)`,
    transition: reduce ? 'none' : `transform ${slideMs}ms ${preset.easing}`,
  } as CSSProperties

  return (
    <div
      className={[styles.slideWrap, styles[variant], className].filter(Boolean).join(' ')}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={styles.viewport}
        ref={viewport}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return
          const dx = event.changedTouches[0].clientX - touchStart.current
          touchStart.current = null
          if (Math.abs(dx) < 40) return
          if (dx < 0 && current < pages - 1) go(current + 1)
          if (dx > 0 && current > 0) go(current - 1)
        }}
      >
        <div className={styles.slideTrack} style={trackStyle}>
          {children.map((child, index) => (
            <div className={styles.slideItem} key={index} ref={index === 0 ? firstItem : undefined}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {arrows && pages > 1 && (
        <>
          <button
            type="button"
            className={`${styles.bigArrow} ${styles.bigArrowPrev} ${current > 0 ? styles.bigArrowShown : ''}`}
            onClick={() => go(current - 1)}
            aria-label={previousLabel}
            tabIndex={current > 0 ? 0 : -1}
            aria-hidden={current > 0 ? undefined : true}
          >
            <Chevron direction="prev" />
          </button>
          <button
            type="button"
            className={`${styles.bigArrow} ${styles.bigArrowNext} ${current < pages - 1 ? styles.bigArrowShown : ''}`}
            onClick={() => go(current + 1)}
            aria-label={nextLabel}
            tabIndex={current < pages - 1 ? 0 : -1}
            aria-hidden={current < pages - 1 ? undefined : true}
          >
            <Chevron direction="next" />
          </button>
        </>
      )}

      {pages > 1 && (
        <div className={styles.slideDots}>
          {offsets.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1} / ${pages}`}
              aria-current={index === current}
              className={`${styles.slideDot} ${index === current ? styles.slideDotActive : ''}`}
              onClick={() => go(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll variant (unchanged behaviour; used by the Karir photo strip) */
/* ------------------------------------------------------------------ */

function ScrollCarousel({
  children,
  autoAdvance = false,
  showArrows = true,
  perView = 3,
  label,
  className,
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
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
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
        style={{ '--per-view': perView } as CSSProperties}
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
