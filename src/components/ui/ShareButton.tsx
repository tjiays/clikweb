'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ShareIcon } from './icons'
import styles from './ShareButton.module.css'

/**
 * The round orange-outlined share button on article / report cards
 * (Figma "Share" group 1661:8969: 40x40 white circle, 1px #FF7D00 stroke,
 * orange share glyph). Uses the Web Share API where the browser has it;
 * otherwise copies the link and says so for two seconds.
 *
 *   <ShareButton url="/newsroom/slug" title="…" label="Bagikan" />
 *
 * `url` may be relative; it is resolved against the current origin.
 * `size` 40 (default, Newsroom/Laporan) or 45 (Home news cards, 45x44).
 */
export function ShareButton({
  url,
  title,
  label,
  copiedLabel,
  size = 40,
  className,
}: {
  url: string
  title: string
  label?: string
  copiedLabel?: string
  size?: 40 | 45
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // English pages live under /en.
  const pathname = usePathname() ?? '/'
  const lang = /^\/en(\/|$)/.test(pathname) ? 'en' : 'id'
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  const shareText = label ?? (lang === 'en' ? 'Share' : 'Bagikan')
  const copiedText = copiedLabel ?? (lang === 'en' ? 'Link copied' : 'Tautan disalin')

  async function onClick() {
    const absolute = new URL(url, window.location.origin).toString()
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url: absolute })
        return
      } catch (error) {
        // The reader closed the share sheet: nothing else to do.
        if ((error as Error)?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(absolute)
    } catch {
      // Clipboard blocked (http, old browser): fall back to a prompt the reader can copy from.
      window.prompt(copiedText, absolute)
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className={`${styles.wrap} ${className ?? ''}`}>
      <button
        type="button"
        className={`${styles.button} ${size === 45 ? styles.large : ''}`}
        onClick={onClick}
        aria-label={`${shareText}: ${title}`}
        title={shareText}
      >
        <ShareIcon className={styles.icon} />
      </button>
      <span className={`${styles.toast} ${copied ? styles.visible : ''}`} role="status" aria-live="polite">
        {copied ? copiedText : ''}
      </span>
    </span>
  )
}
