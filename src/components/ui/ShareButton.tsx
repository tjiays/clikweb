'use client'

import { useEffect, useId, useRef, useState, type ComponentType, type SVGProps } from 'react'
import { usePathname } from 'next/navigation'
import { LinkSimple, ShareIcon } from './icons'
import styles from './ShareButton.module.css'

/*
 * Pop-over glyphs: Figma 156:1086-1089 are Font Awesome 5 Brands characters
 * (twitter f099, facebook-f f39e, pinterest f0d2, linkedin-in f0e1).
 * Paths from Font Awesome Free (CC BY 4.0, https://fontawesome.com/license/free).
 */
type Glyph = ComponentType<SVGProps<SVGSVGElement>>
function glyph(width: number, d: string): Glyph {
  function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox={`0 0 ${width} 512`}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        <path d={d} />
      </svg>
    )
  }
  return Icon
}
const TwitterGlyph = glyph(
  512,
  'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z',
)
const FacebookGlyph = glyph(
  320,
  'M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z',
)
const PinterestGlyph = glyph(
  496,
  'M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z',
)
const LinkedinGlyph = glyph(
  448,
  'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z',
)

/**
 * The round orange-outlined share button on article / report cards
 * (Figma "Share" group 1661:8969: 40x40 white circle, 1px #FF7D00 stroke,
 * orange share glyph).
 *
 *   <ShareButton url="/newsroom/slug" title="…" label="Bagikan" />
 *
 * `url` may be relative; it is resolved against the current origin.
 * `size` 40 (default, Newsroom/Laporan) or 45 (Home news cards, 45x44).
 * `variant`
 *   native  (default) Web Share API where the browser has it; otherwise
 *           copies the link and says so for two seconds.
 *   popover Home news cards (156:1079 "Overlay+Shadow" 156:1084): a white
 *           panel above the button, shadow 4px 3px 10px rgba(0,0,0,.07),
 *           with the Figma brand glyphs (Twitter/X #0096FF, Facebook
 *           #283B8E, Pinterest #FD4851, LinkedIn #39E6C7) plus copy-link.
 *           Esc, a click outside or tabbing away closes it.
 */
export function ShareButton({
  url,
  title,
  label,
  copiedLabel,
  size = 40,
  variant = 'native',
  className,
}: {
  url: string
  title: string
  label?: string
  copiedLabel?: string
  size?: 40 | 45
  variant?: 'native' | 'popover'
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const [absolute, setAbsolute] = useState(url)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  // English pages live under /en.
  const pathname = usePathname() ?? '/'
  const lang = /^\/en(\/|$)/.test(pathname) ? 'en' : 'id'
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  // Close the pop-over on Esc or a click outside it.
  useEffect(() => {
    if (!open) return
    function onPointer(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const shareText = label ?? (lang === 'en' ? 'Share' : 'Bagikan')
  const copiedText = copiedLabel ?? (lang === 'en' ? 'Link copied' : 'Tautan disalin')
  const copyText = lang === 'en' ? 'Copy link' : 'Salin tautan'

  async function copy(link: string) {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Clipboard blocked (http, old browser): fall back to a prompt the reader can copy from.
      window.prompt(copiedText, link)
      return
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  async function onClick() {
    const link = new URL(url, window.location.origin).toString()
    if (variant === 'popover') {
      setAbsolute(link)
      setOpen((value) => !value)
      return
    }
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url: link })
        return
      } catch (error) {
        // The reader closed the share sheet: nothing else to do.
        if ((error as Error)?.name === 'AbortError') return
      }
    }
    await copy(link)
  }

  const encodedUrl = encodeURIComponent(absolute)
  const encodedTitle = encodeURIComponent(title)
  const targets: { name: string; href: string; Icon: Glyph; color: string }[] = [
    {
      name: 'X (Twitter)',
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: TwitterGlyph,
      color: '#0096FF',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookGlyph,
      color: '#283B8E',
    },
    {
      name: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      Icon: PinterestGlyph,
      color: '#FD4851',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedinGlyph,
      color: '#39E6C7',
    },
  ]

  return (
    <span
      ref={wrapRef}
      className={`${styles.wrap} ${className ?? ''}`}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.button} ${size === 45 ? styles.large : ''}`}
        onClick={onClick}
        aria-label={`${shareText}: ${title}`}
        title={shareText}
        {...(variant === 'popover' ? { 'aria-expanded': open, 'aria-controls': panelId } : {})}
      >
        <ShareIcon className={styles.icon} />
      </button>
      {variant === 'popover' && (
        <ul id={panelId} className={styles.panel} hidden={!open} aria-label={shareText}>
          <li>
            <button
              type="button"
              className={styles.target}
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
                void copy(absolute)
              }}
              aria-label={copyText}
              title={copyText}
            >
              <LinkSimple className={styles.copyGlyph} />
            </button>
          </li>
          {targets.map(({ name, href, Icon, color }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.target}
                style={{ color }}
                aria-label={name}
                title={name}
                onClick={() => setOpen(false)}
              >
                <Icon className={styles.glyph} />
              </a>
            </li>
          ))}
        </ul>
      )}
      <span
        className={`${styles.toast} ${copied ? styles.visible : ''}`}
        role="status"
        aria-live="polite"
      >
        {copied ? copiedText : ''}
      </span>
    </span>
  )
}
