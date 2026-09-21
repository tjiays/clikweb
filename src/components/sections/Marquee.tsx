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
  /**
   * How many copies of the set to render. The track moves by one set per loop,
   * so copies - 1 sets must cover the widest strip or its right edge empties
   * before the loop restarts. 4 covers a 1454px set up to ~4360px wide.
   */
  copies?: number
  className?: string
}

/**
 * Endless horizontal scroll, used where the Figma prototype loops a strip on a
 * timer (the Newsroom logo row, the Karir photo band).
 *
 * The items are rendered several times and the track moves by exactly one set,
 * so the loop is seamless. Stops for prefers-reduced-motion.
 */
export function Marquee({
  children,
  duration,
  gap = 0,
  direction = 'left',
  label,
  copies = 4,
  className,
}: Props) {
  const style = {
    '--marquee-duration': `${duration}s`,
    '--marquee-gap': `${gap}px`,
    '--marquee-copies': copies,
  } as CSSProperties

  return (
    <div
      className={[styles.marquee, className].filter(Boolean).join(' ')}
      style={style}
      role={label ? 'region' : undefined}
      aria-label={label}
    >
      <div className={styles.track} data-direction={direction}>
        <div className={styles.set}>{children}</div>
        {Array.from({ length: Math.max(copies, 2) - 1 }, (_, i) => (
          <div key={i} className={styles.set} aria-hidden="true">
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
