'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import styles from './HeroSlider.module.css'

export type Slide = {
  id: string | number
  title?: string | null
  subtitle?: string | null
  buttonLabel?: string | null
  buttonLink?: string | null
  imageUrl?: string | null
  imageAlt?: string
}

const INTERVAL = 6000

/** Full-width hero with auto-advancing slides, looping, as in the prototype. */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    if (count < 2 || paused) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => clearInterval(timer)
  }, [count, paused])

  if (count === 0) return null

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${i === index ? styles.active : ''}`}
          aria-hidden={i !== index}
        >
          {slide.imageUrl && (
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt ?? ''}
              fill
              priority={i === 0}
              sizes="100vw"
              className={styles.image}
            />
          )}
          <div className={styles.overlay} />
          <Container className={styles.inner}>
            <div className={styles.copy}>
              {slide.title && <h1 className="t-display">{slide.title}</h1>}
              {slide.subtitle && <p className="t-display-sub">{slide.subtitle}</p>}
              {slide.buttonLabel && slide.buttonLink && (
                <div className={styles.action}>
                  <Button href={slide.buttonLink} size="lg">
                    {slide.buttonLabel}
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </div>
      ))}

      {count > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Slides">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}

      {/* The curved bottom edge from the design */}
      <div className={styles.curve} aria-hidden="true" />
    </section>
  )
}
