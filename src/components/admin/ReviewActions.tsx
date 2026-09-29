'use client'

import { useState } from 'react'
import { Button, useAuth, useConfig, useDocumentInfo, useForm, useFormFields, useLocale } from '@payloadcms/ui'
import './ReviewActions.scss'

/**
 * The save and decision buttons, in place of Payload's Save draft / Publish.
 *
 * A live page stays live while its edit is reviewed. Anything that is not an
 * approval is saved as a *draft version*: Payload writes only the version
 * history and leaves the published document — the one the website reads —
 * exactly as it was. Only an approval publishes, which is the moment the
 * reviewed draft replaces what readers see.
 *
 * Until 29 September every save published, so editing an approved page took
 * it off the website until someone approved the edit.
 *
 *   Editor       Kirim untuk ditinjau              draft
 *   Super Admin  Kirim untuk ditinjau              draft
 *                Setujui & tayangkan               publish, as Approved
 *   Approver     Setujui & tayangkan               publish, as Approved
 *                Tolak (with a reason)             draft, as Rejected
 *
 * The Approver's buttons appear only while an item is in review: a decision
 * on anything else is refused by the server, so they would be controls that
 * cannot work.
 */
export default function ReviewActions() {
  const { user } = useAuth()
  const { submit } = useForm()
  const { id, collectionSlug } = useDocumentInfo()
  const locale = useLocale()
  const {
    config: {
      routes: { api },
    },
  } = useConfig()
  const status = useFormFields(([fields]) => fields?.approvalStatus?.value) as string | undefined
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const role = (user as { role?: string } | null)?.role

  const run = async (work: () => Promise<unknown>) => {
    setBusy(true)
    try {
      await work()
    } finally {
      setBusy(false)
    }
  }

  // The same request Payload's own Save draft button makes.
  const saveDraft = (overrides: Record<string, unknown> = {}) =>
    run(() =>
      submit({
        action: `${api}/${collectionSlug}${id ? `/${id}` : ''}?locale=${locale?.code ?? 'id'}&depth=0&fallback-locale=null&draft=true`,
        method: id ? 'PATCH' : 'POST',
        overrides: { ...overrides, _status: 'draft' },
        skipValidation: true,
      }),
    )

  const publishApproved = () =>
    run(() => submit({ overrides: { approvalStatus: 'approved', _status: 'published' } }))

  if (role !== 'approver') {
    return (
      <div className="clik-review">
        <Button buttonStyle="primary" disabled={busy} onClick={() => saveDraft()}>
          Kirim untuk ditinjau
        </Button>
        {role === 'super_admin' ? (
          <Button buttonStyle="secondary" disabled={busy} onClick={publishApproved}>
            Setujui &amp; tayangkan
          </Button>
        ) : null}
      </div>
    )
  }

  if (status !== 'in_review') {
    const settled: Record<string, string> = {
      approved: 'Sudah disetujui dan tayang di website. Tidak ada yang perlu Anda lakukan.',
      rejected: 'Sudah ditolak. Menunggu penulis memperbaiki dan mengirim ulang.',
    }
    const note = status ? settled[status] : null
    // A document with no status yet is one the Approver cannot have reached.
    if (!note) return null
    return <p className="clik-review__settled">{note}</p>
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
            // A rejection is a draft: an approved page being edited stays live.
            onClick={() => saveDraft({ approvalStatus: 'rejected', rejectionReason: reason.trim() })}
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
      <Button buttonStyle="primary" disabled={busy} onClick={publishApproved}>
        Setujui &amp; tayangkan
      </Button>
      <Button buttonStyle="secondary" disabled={busy} onClick={() => setRejecting(true)}>
        Tolak
      </Button>
    </div>
  )
}
