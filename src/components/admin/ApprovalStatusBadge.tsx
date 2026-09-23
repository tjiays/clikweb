'use client'

import { useFormFields } from '@payloadcms/ui'
import './ApprovalStatusBadge.scss'

/**
 * Shows an editor where their work stands, without offering to change it.
 *
 * The real approvalStatus select is drawn only for the people who decide,
 * because saving is what submits an item and any control here would be a
 * choice they cannot make. They still need to see the answer, though —
 * especially "Ditolak", which is the one that asks them to do something.
 *
 * This is a display, not an input: blocking the field with access.update
 * instead would have let Payload revert the status the submit hook sets.
 */
const LABELS: Record<string, { text: string; tone: string }> = {
  in_review: { text: 'Menunggu peninjauan', tone: 'review' },
  approved: { text: 'Disetujui, tayang', tone: 'approved' },
  rejected: { text: 'Ditolak, perlu diperbaiki', tone: 'rejected' },
}

export default function ApprovalStatusBadge() {
  const status = useFormFields(([fields]) => fields?.approvalStatus?.value) as
    | string
    | undefined

  // A document that has not been saved yet has no standing to report.
  if (!status) return null

  const label = LABELS[status] ?? { text: status, tone: 'draft' }

  return (
    <div className="clik-status">
      <span className="clik-status__label">Status</span>
      <span className={`clik-status__pill clik-status__pill--${label.tone}`}>{label.text}</span>
      {status === 'in_review' ? (
        <p className="clik-status__hint">
          Sudah dikirim ke Approver. Anda masih bisa menyuntingnya sampai ada keputusan.
        </p>
      ) : null}
    </div>
  )
}
