import type { CSSProperties, ReactNode } from 'react'
import styles from './Marquee.module.css'

type Props = {
  children: ReactNode
  /** Seconds for one full set of items to scroll past, as in the Figma prototype timer. */
  duration: number
  /** Space between items, in px. Also applied after the last item so the loop has no seam. */
  gap?: number
  direction?: 'left' | 'right'
  /** Accessible name for the strip; the duplicated copy is hidden from assistive tech. */
  label?: string
  className?: string
}

/**
 * Endless horizontal scroll, used where the Figma prototype loops a strip on a
 * timer (the Newsroom logo row, the Karir photo band).
 *
 * The items are rendered twice and the track moves by exactly one set, so the
 * loop is seamless whatever the viewport width. Stops for prefers-reduced-motion.
 */
export function Marquee({ children, duration, gap = 0, direction = 'left', label, className }: Props) {
  const style = { '--marquee-duration': `${duration}s`, '--marquee-gap': `${gap}px` } as CSSProperties

  return (
    <div
      className={[styles.marquee, className].filter(Boolean).join(' ')}
      style={style}
      role={label ? 'region' : undefined}
      aria-label={label}
    >
      <div className={styles.track} data-direction={direction}>
        <div className={styles.set}>{children}</div>
        <div className={styles.set} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
