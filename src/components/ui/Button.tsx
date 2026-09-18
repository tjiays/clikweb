import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'md' | 'lg'

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
}

/**
 * The buttons in the design ("Hubungi Kami", "Pelajari selengkapnya",
 * "Lamar", "Lihat detail", "Submit") are one component with variants.
 * Every variant has the hover state shown in Figma as "Variant2".
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
}: Props) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  if (href && !disabled) {
    if (external) {
      return (
        <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
