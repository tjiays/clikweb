import type { ReactNode } from 'react'
import styles from './Container.module.css'

/** Centres content in the 1300px column the Figma design uses at 1440px wide. */
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className ? `${styles.container} ${className}` : styles.container}>
      {children}
    </div>
  )
}
