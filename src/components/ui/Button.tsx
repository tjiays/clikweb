import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  className?: string
  /** Opens in a new tab and adds the safe rel attributes. */
  external?: boolean
  disabled?: boolean
  /** Width in px (applied as min-width, so longer translations still fit), as Figma sizes many buttons (e.g. 191 for
   *  "Lihat Selengkapnya", 175 for "Lihat Layanan Kami"). */
  width?: number
  ariaLabel?: string
}

/**
 * The buttons in the design ("Hubungi Kami", "Pelajari selengkapnya",
 * "Lamar", "Lihat detail", "Submit") are one component with variants.
 * Every variant has the hover state shown in Figma as "Variant2"
 * (SMART_ANIMATE 0.3s ease-out).
 *
 * variant
 *   primary (default)  #FF7D00 fill, white 14/700 label, 2px orange stroke;
 *                      hover: white fill, 1px orange stroke, black label.
 *   outline            white fill, orange label, orange stroke (0.5px black@20%
 *                      at size sm); hover: fill orange @ 15%  ("Lihat Detail").
 *   ghost              text-only navy link style.
 * size
 *   sm   28px tall, 14/400 — job cards ("Lamar" 162x28). Primary sm hover keeps
 *        an orange label on white.
 *   md   46px tall (default) — "Hubungi Kami" 135x46, "Pelajari selengkapnya".
 *   lg   54px tall, min 120px — form "Submit" 120x54.
 *   xl   58px tall, min 237px, label 800 — Home "LIHAT SELENGKAPNYA".
 * All sizes: radius 10px. `width={191}` gives the Figma width (as a min-width);
 * `className` for margins.
 *
 *   <Button href="/hubungi-kami">Hubungi Kami</Button>
 *   <Button size="sm">Lamar</Button> <Button size="sm" variant="outline">Lihat Detail</Button>
 *   <Button type="submit" size="lg">Submit</Button>
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  onClick,
  className,
  external,
  disabled,
  width,
  ariaLabel,
}: Props) {
  const style = width ? { minWidth: width } : undefined
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  if (href && !disabled) {
    if (external) {
      return (
        <a
          className={classes}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={style}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      )
    }
    return (
      <Link className={classes} href={href} style={style} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
