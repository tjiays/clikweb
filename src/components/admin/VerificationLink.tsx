'use client'

import { useEffect, useState } from 'react'
import { useAuth, useDocumentInfo } from '@payloadcms/ui'
import './VerificationLink.scss'

type State =
  | { kind: 'loading' }
  | { kind: 'verified' }
  | { kind: 'link'; link: string; email?: string }
  | { kind: 'none' }

/**
 * The activation link for an account that has not been verified.
 *
 * Staging catches every outgoing email, so the one Payload sent is sitting on
 * the server rather than in anyone's inbox. Even in production a link gets
 * lost. Handing it over here means an account can still be activated properly
 * — the person clicks it and proves the address — rather than a Super Admin
 * ticking the verified box and the check meaning nothing.
 */
export default function VerificationLink() {
  const { id } = useDocumentInfo()
  const { user } = useAuth()
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [copied, setCopied] = useState(false)

  const isSuperAdmin = (user as { role?: string } | null)?.role === 'super_admin'

  useEffect(() => {
    if (!id || !isSuperAdmin) return
    let cancelled = false
    fetch(`/api/verification-link/${id}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return setState({ kind: 'none' })
        if (d.verified) return setState({ kind: 'verified' })
        if (d.link) return setState({ kind: 'link', link: d.link, email: d.email })
        setState({ kind: 'none' })
      })
      .catch(() => setState({ kind: 'none' }))
    return () => {
      cancelled = true
    }
  }, [id, isSuperAdmin])

  // A new account has no id yet, and nobody else has business with the link.
  if (!id || !isSuperAdmin || state.kind === 'loading' || state.kind === 'none') return null

  if (state.kind === 'verified') {
    return (
      <div className="clik-verify clik-verify--done">
        <span className="clik-verify__dot" aria-hidden="true" />
        Akun aktif. Email sudah diverifikasi.
      </div>
    )
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(state.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard refused; the link is on screen to copy by hand.
    }
  }

  return (
    <div className="clik-verify">
      <span className="clik-verify__heading">Menunggu verifikasi</span>
      <p className="clik-verify__note">
        Email aktivasi sudah dikirim{state.email ? ` ke ${state.email}` : ''}. Bila belum diterima,
        kirimkan tautan ini kepada yang bersangkutan.
      </p>
      <code className="clik-verify__link">{state.link}</code>
      <button type="button" className="clik-verify__copy" onClick={copy}>
        {copied ? 'Tersalin' : 'Salin tautan'}
      </button>
    </div>
  )
}
