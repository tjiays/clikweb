import type { SVGProps } from 'react'
import { Button } from '@/components/ui/Button'
import { JobShare } from './JobShare'
import styles from './JobRow.module.css'

/** Briefcase before the job category (Figma 582:3263, 17x14, #000 @ 50%). */
export function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="17" height="14" viewBox="0 0 17 14" fill="none" aria-hidden="true" focusable="false" {...props}>
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="0.8" y="2.8" width="15.4" height="10.5" rx="1.6" />
        <path d="M5.3 2.8V1.5c0-.5.4-.9.9-.9h4.6c.5 0 .9.4.9.9v1.3" />
        <path d="M0.8 6.6c2.3 1.4 5 2 7.7 2s5.4-.6 7.7-2" />
        <path d="M7 6.4h3" strokeWidth="1.3" />
      </g>
    </svg>
  )
}

/**
 * A job card in the Lowongan Pekerjaan grid (Figma 582:3247, 393x162):
 * title 16/700 with a share icon top-right, briefcase + category 12/400 at
 * 50% black, a 1px rule, then "Lihat Detail" | "Lamar" (162x28 buttons).
 * "Lamar" opens an email; there is no application form (intent/04 §2).
 */
export function JobRow({
  title,
  category,
  detailHref,
  applyMailto,
  applyLabel,
  detailLabel,
  shareLabel,
  copiedLabel,
}: {
  title: string
  category?: string | null
  detailHref: string
  applyMailto: string
  applyLabel: string
  detailLabel: string
  shareLabel: string
  copiedLabel: string
}) {
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        <JobShare url={detailHref} title={title} label={shareLabel} copiedLabel={copiedLabel} />
      </div>
      {category && (
        <p className={styles.category}>
          <BriefcaseIcon className={styles.briefcase} />
          {category}
        </p>
      )}
      <div className={styles.actions}>
        <Button href={detailHref} variant="outline" size="sm" className={styles.button}>
          {detailLabel}
        </Button>
        <Button href={applyMailto} external size="sm" className={styles.button}>
          {applyLabel}
        </Button>
      </div>
    </article>
  )
}
