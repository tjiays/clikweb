import { Button } from '@/components/ui/Button'
import styles from './JobRow.module.css'

/**
 * A row in the Lowongan Pekerjaan list: title, category, and the two buttons.
 * "Lamar" opens an email; there is no application form (intent/04 §2).
 */
export function JobRow({
  title,
  category,
  detailHref,
  applyMailto,
  applyLabel,
  detailLabel,
}: {
  title: string
  category?: string | null
  detailHref: string
  applyMailto: string
  applyLabel: string
  detailLabel: string
}) {
  return (
    <article className={styles.row}>
      <div className={styles.text}>
        <h3 className="t-h4">{title}</h3>
        {category && <p className={styles.category}>{category}</p>}
      </div>
      <div className={styles.actions}>
        <Button href={applyMailto} external>
          {applyLabel}
        </Button>
        <Button href={detailHref} variant="outline">
          {detailLabel}
        </Button>
      </div>
    </article>
  )
}
