import styles from './StatusBadge.module.css'

const LABELS: Record<string, string> = {
  live: 'Live',
  ready_to_sell: 'Ready to Sell',
  new: 'NEW',
}

/** Product status badges, styled as in intent/01-design-system.md §2. */
export function StatusBadge({ status }: { status: 'live' | 'ready_to_sell' | 'new' }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{LABELS[status]}</span>
}
