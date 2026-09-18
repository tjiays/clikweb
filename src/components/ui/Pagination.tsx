import Link from 'next/link'
import styles from './Pagination.module.css'

/** Prev arrow, page numbers, next arrow. The active page is highlighted. */
export function Pagination({
  page,
  totalPages,
  basePath,
  label,
}: {
  page: number
  totalPages: number
  /** Page number is appended as ?page=n */
  basePath: string
  label: string
}) {
  if (totalPages <= 1) return null

  const pageHref = (n: number) => (n <= 1 ? basePath : `${basePath}?page=${n}`)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className={styles.pagination} aria-label={label}>
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className={styles.arrow} aria-label="Previous">
          <Arrow direction="left" />
        </Link>
      ) : (
        <span className={`${styles.arrow} ${styles.disabled}`} aria-hidden="true">
          <Arrow direction="left" />
        </span>
      )}

      {pages.map((n) => (
        <Link
          key={n}
          href={pageHref(n)}
          className={`${styles.page} ${n === page ? styles.active : ''}`}
          aria-current={n === page ? 'page' : undefined}
        >
          {n}
        </Link>
      ))}

      {page < totalPages ? (
        <Link href={pageHref(page + 1)} className={styles.arrow} aria-label="Next">
          <Arrow direction="right" />
        </Link>
      ) : (
        <span className={`${styles.arrow} ${styles.disabled}`} aria-hidden="true">
          <Arrow direction="right" />
        </span>
      )}
    </nav>
  )
}

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
