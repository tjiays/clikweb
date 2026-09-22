'use client'

import { useState } from 'react'
import { Button, PublishButton, useAuth, useForm } from '@payloadcms/ui'
import './ReviewActions.scss'

/**
 * What an Approver gets instead of Save draft and Publish.
 *
 * Their job is to read the item and decide, so the controls are the decision:
 * Setujui, or Tolak with the reason the workflow requires. Payload's own
 * buttons stay for everybody else — an editor still saves, and a Super Admin
 * still publishes.
 *
 * Rejecting asks for the reason here rather than leaving the editor to find a
 * field further up the sidebar, because a rejection without one is refused by
 * the server and the save would simply fail.
 */
export default function ReviewActions() {
  const { user } = useAuth()
  const { submit } = useForm()
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  if ((user as { role?: string } | null)?.role !== 'approver') {
    return <PublishButton />
  }

  const decide = async (overrides: Record<string, unknown>) => {
    setBusy(true)
    try {
      await submit({ overrides })
    } finally {
      setBusy(false)
    }
  }

  if (rejecting) {
    return (
      <div className="clik-review clik-review--rejecting">
        <label className="clik-review__label" htmlFor="clik-reject-reason">
          Alasan penolakan
        </label>
        <textarea
          id="clik-reject-reason"
          className="clik-review__reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Jelaskan apa yang perlu diperbaiki. Penulis akan melihat catatan ini."
        />
        <div className="clik-review__row">
          <Button
            buttonStyle="primary"
            disabled={busy || !reason.trim()}
            onClick={() => decide({ approvalStatus: 'rejected', rejectionReason: reason.trim() })}
          >
            Kirim penolakan
          </Button>
          <Button buttonStyle="secondary" disabled={busy} onClick={() => setRejecting(false)}>
            Batal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="clik-review">
      <Button
        buttonStyle="primary"
        disabled={busy}
        onClick={() => decide({ approvalStatus: 'approved' })}
      >
        Setujui &amp; tayangkan
      </Button>
      <Button buttonStyle="secondary" disabled={busy} onClick={() => setRejecting(true)}>
        Tolak
      </Button>
    </div>
  )
}
