'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './JobShare.module.css'

/** Outlined share glyph of the job cards (Figma 582:3261, 20x21). */
function ShareOutline({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.3">
        <circle cx="15.9" cy="3.9" r="3.1" />
        <circle cx="4.1" cy="10.5" r="3.1" />
        <circle cx="15.9" cy="17.1" r="3.1" />
        <path d="M6.8 9 13.2 5.4M6.8 12 13.2 15.6" />
      </g>
    </svg>
  )
}

/**
 * The grey share control on job cards (Figma 582:3260, 20x21, #000 @ 50%) and
 * in the job detail header, where it is followed by the word "bagikan"
 * (Figma 587:3476 / 587:3479). Uses the Web Share API where available,
 * otherwise copies the job link and says so for two seconds.
 */
export function JobShare({
  url,
  title,
  label,
  copiedLabel,
  showLabel = false,
  className,
}: {
  url: string
  title: string
  label: string
  copiedLabel: string
  showLabel?: boolean
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  async function onClick() {
    const absolute = new URL(url, window.location.origin).toString()
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url: absolute })
        return
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(absolute)
    } catch {
      window.prompt(copiedLabel, absolute)
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={styles.button}
        onClick={onClick}
        aria-label={showLabel ? undefined : `${label}: ${title}`}
        title={label}
      >
        <ShareOutline className={styles.icon} />
        {showLabel && <span className={styles.label}>{label}</span>}
      </button>
      <span className={`${styles.toast} ${copied ? styles.visible : ''}`} role="status" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </span>
  )
}
