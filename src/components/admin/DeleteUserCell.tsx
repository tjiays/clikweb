'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import './DeleteUserCell.scss'

/**
 * Delete, as a column on the user list.
 *
 * Payload's own delete is reached by opening a user, finding the menu behind
 * the three dots and choosing from it. For the one job where you already know
 * which account is going — someone has left — that is three steps too many,
 * so it is a button on the row instead.
 *
 * The row is the confirmation: the second click is labelled with nothing but
 * the consequence, and the account is named right beside it.
 */
export default function DeleteUserCell({ rowData }: { rowData?: { id?: string | number; email?: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const me = user as { id?: string | number; role?: string } | null
  const id = rowData?.id

  // Only a Super Admin may delete, and never their own account from a list
  // where a misclick is one row away from the wrong person.
  if (!id || me?.role !== 'super_admin') return null
  if (String(me?.id) === String(id)) return <span className="clik-rowdel__self">akun Anda</span>

  const remove = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.errors?.[0]?.message || 'Gagal menghapus.')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menghapus.')
      setBusy(false)
      setArmed(false)
    }
  }

  if (error) {
    return (
      <span className="clik-rowdel__error" title={error}>
        {error.slice(0, 40)}
      </span>
    )
  }

  return armed ? (
    <span className="clik-rowdel">
      <button type="button" className="clik-rowdel__go" disabled={busy} onClick={remove}>
        {busy ? '…' : 'Hapus permanen'}
      </button>
      <button type="button" className="clik-rowdel__cancel" disabled={busy} onClick={() => setArmed(false)}>
        Batal
      </button>
    </span>
  ) : (
    <button type="button" className="clik-rowdel__start" onClick={() => setArmed(true)}>
      Hapus
    </button>
  )
}
