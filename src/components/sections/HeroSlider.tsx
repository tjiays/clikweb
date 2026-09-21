'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './HeroSlider.module.css'

/** Figma 177:383-385: AFTER_TIMEOUT 8s, SMART_ANIMATE 0.5s ease-out. */
const INTERVAL = 8000

/**
 * Home hero (Figma "Slider component" 177:390).
 *
 * Only the images move: they sit side by side and every 8s the row shifts one
 * image width to the left (0.5s ease-out), looping 1 → 2 → 3 → 1 (the last
 * step slides back across). The title and subtitle are one static layer
 * above the images (911:5989 / 911:5990). No button, dots or dark overlay.
 * The bottom edge is the Figma wave (vector 158:999). Auto-advance stops
 * when the user prefers reduced motion.
 */
export function HeroSlider({
  images,
  title,
  subtitle,
}: {
  images: string[]
  title?: string | null
  subtitle?: string | null
}) {
  const [index, setIndex] = useState(0)
  const count = images.length

  useEffect(() => {
    if (count < 2) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => clearInterval(timer)
  }, [count])

  return (
    <section className={styles.hero}>
      <div
        className={styles.track}
        style={{ transform: `translate3d(${-100 * index}%, 0, 0)` }}
        aria-hidden="true"
      >
        {images.map((src, i) => (
          <div key={src} className={styles.slide}>
            <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className={styles.image} />
          </div>
        ))}
      </div>

      <div className={styles.copy}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* Bottom wave, Figma vector 158:999 (1440x148, #FAFAFA) */}
      <svg
        className={styles.wave}
        viewBox="0 0 1440 149"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M1351.73 71.1213C1328.55 81.9714 1302.98 88.455 1276.8 90.109L480.9 139.199C454.725 140.787 428.4 137.545 403.725 129.606L0 0V149H1440V29.7717L1351.73 71.1213Z" />
      </svg>
    </section>
  )
}
