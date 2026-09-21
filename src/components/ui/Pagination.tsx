import Link from 'next/link'
import { ChevronLeft, ChevronNext } from './icons'
import styles from './Pagination.module.css'

/**
 * Pagination — Figma "Frame 2367" (1661:9033 / 1661:9065 / 1661:9105).
 * 50x50 tiles, radius 18, 13px apart. Current page: white, 2px #FF7D00
 * border; other pages: white, 1px black border; numbers 20/700 navy.
 * Arrows: navy fill + white chevron when they lead somewhere, #D9D9D9 fill +
 * black chevron when disabled. No hover state in Figma.
 *
 * `alwaysShow` (default true) keeps it visible with a single page, as on the
 * Laporan and Liputan Media frames; pass false to hide it when there is only
 * one page.
 *
 *   <Pagination page={2} totalPages={3} basePath="/newsroom" label="Navigasi halaman" />
 */
export function Pagination({
  page,
  totalPages,
  basePath,
  label,
  alwaysShow = true,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  className,
}: {
  page: number
  totalPages: number
  /** Page number is appended as ?page=n */
  basePath: string
  label: string
  alwaysShow?: boolean
  previousLabel?: string
  nextLabel?: string
  className?: string
}) {
  const total = Math.max(1, totalPages)
  if (total <= 1 && !alwaysShow) return null

  const current = Math.min(Math.max(1, page), total)
  const pageHref = (n: number) => (n <= 1 ? basePath : `${basePath}?page=${n}`)
  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <nav className={className ? `${styles.pagination} ${className}` : styles.pagination} aria-label={label}>
      {current > 1 ? (
        <Link href={pageHref(current - 1)} className={`${styles.tile} ${styles.arrow}`} aria-label={previousLabel}>
          <ChevronLeft className={styles.chevron} />
        </Link>
      ) : (
        <span className={`${styles.tile} ${styles.arrow} ${styles.disabled}`} aria-hidden="true">
          <ChevronLeft className={styles.chevron} />
        </span>
      )}

      {pages.map((n) => (
        <Link
          key={n}
          href={pageHref(n)}
          className={`${styles.tile} ${styles.page} ${n === current ? styles.active : ''}`}
          aria-current={n === current ? 'page' : undefined}
        >
          {n}
        </Link>
      ))}

      {current < total ? (
        <Link href={pageHref(current + 1)} className={`${styles.tile} ${styles.arrow}`} aria-label={nextLabel}>
          <ChevronNext className={styles.chevron} />
        </Link>
      ) : (
        <span className={`${styles.tile} ${styles.arrow} ${styles.disabled}`} aria-hidden="true">
          <ChevronNext className={styles.chevron} />
        </span>
      )}
    </nav>
  )
}
