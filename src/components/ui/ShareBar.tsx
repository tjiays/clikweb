'use client'

import { useEffect, useRef, useState } from 'react'
import { FacebookLogo, LinkedinLogo, LinkSimple, WhatsappLogo, XLogo } from './icons'
import styles from './ShareBar.module.css'

/**
 * Article share row (Figma Detail Berita 556:2721): "Share:" 16/800 black,
 * then 27x27 #EAEAEA tiles (radius 5, 9px apart) with brand-coloured icons —
 * WhatsApp, Facebook, LinkedIn, X, and copy-link. Each opens the platform's
 * standard share URL for this page; the last copies the link.
 *
 *   <ShareBar url={absoluteUrl} title={article.title} label="Share:" copiedLabel="Tautan disalin" />
 */
export function ShareBar({
  url,
  title,
  label,
  copyLabel = 'Copy link',
  copiedLabel = 'Link copied',
  className,
}: {
  url: string
  title: string
  label: string
  copyLabel?: string
  copiedLabel?: string
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

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const targets = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, Icon: WhatsappLogo, color: '#2BB826' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: FacebookLogo, color: '#1A3F8F' },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, Icon: LinkedinLogo, color: '#283B8E' },
    { name: 'X', href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, Icon: XLogo, color: '#000000' },
  ]

  async function copy() {
    const absolute = new URL(url, window.location.href).toString()
    try {
      await navigator.clipboard.writeText(absolute)
    } catch {
      window.prompt(copyLabel, absolute)
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={className ? `${styles.share} ${className}` : styles.share}>
      <span className={styles.label}>{label}</span>
      <ul className={styles.list}>
        {targets.map(({ name, href, Icon, color }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={styles.button}
              style={{ color }}
            >
              <Icon />
            </a>
          </li>
        ))}
        <li className={styles.copyItem}>
          <button type="button" className={styles.button} onClick={copy} aria-label={copyLabel}>
            <LinkSimple />
          </button>
          <span className={`${styles.toast} ${copied ? styles.visible : ''}`} role="status" aria-live="polite">
            {copied ? copiedLabel : ''}
          </span>
        </li>
      </ul>
    </div>
  )
}
