import Link from 'next/link'
import styles from './Breadcrumb.module.css'

export type Crumb = {
  label: string
  href?: string
}

/**
 * `Home > Section > Page`, shown on every inner page.
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
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  &gt;
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
