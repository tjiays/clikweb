import Link from 'next/link'
import { ChevronRight } from '@/components/ui/icons'
import styles from './Breadcrumb.module.css'

export type Crumb = {
  label: string
  href?: string
}

/**
 * `Home > Section > Page`, shown on every inner page (Figma 759:3664).
 * Every crumb — the current page included — is 16/400 #252525 at 70%;
 * the separator is the 9x17 chevron vector, 6px from each label.
 * The last crumb is the current page and is not a link.
 */
export function Breadcrumb({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className={styles.breadcrumb}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {item.href && !isLast ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className={styles.separator} />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
