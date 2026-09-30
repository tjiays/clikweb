'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useDocumentInfo } from '@payloadcms/ui'
import './DeleteUser.scss'

/**
 * Deleting an account, in plain sight.
 *
 * Payload has its own delete, but it lives behind the three dots beside Save
 * where people do not find it. Removing someone's access is a deliberate act
 * and deserves a control you can see, so this sits in the sidebar and says
 * what it does.
 *
 * It asks twice and names the account on the second pass, because the first
 * click of a destructive button is rarely the considered one. The rules that
 * actually matter — you cannot delete yourself, and you cannot delete the
 * last Super Admin — are enforced on the server, where a determined client
 * cannot talk its way past them; this only avoids offering what will be
 * refused.
 */
export default function DeleteUser() {
  const { id } = useDocumentInfo()
  const { user } = useAuth()
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const me = user as { id?: string | number; role?: string; email?: string } | null
  if (!id || me?.role !== 'super_admin') return null

  if (String(me?.id) === String(id)) {
    return (
      <p className="clik-del__self">
        Ini akun Anda sendiri, jadi tidak bisa dihapus dari sini. Minta Super Admin lain.
      </p>
    )
  }

  const remove = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE', credentials: 'include' })
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        // The server's own words: it knows why better than we do.
        throw new Error(body?.errors?.[0]?.message || 'Akun tidak bisa dihapus.')
      }
      router.push('/admin/collections/users')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Akun tidak bisa dihapus.')
      setBusy(false)
      setConfirming(false)
    }
  }

  return (
    <div className="clik-del">
      <span className="clik-del__heading">Hapus akun</span>
      {error ? <p className="clik-del__error">{error}</p> : null}

      {confirming ? (
        <>
          <p className="clik-del__warn">
            Akun ini akan dihapus permanen dan orangnya kehilangan akses ke CMS. Riwayat yang sudah
            tercatat tetap tersimpan.
          </p>
          <button type="button" className="clik-del__go" disabled={busy} onClick={remove}>
            {busy ? 'Menghapus…' : 'Ya, hapus akun ini'}
          </button>
          <button
            type="button"
            className="clik-del__cancel"
            disabled={busy}
            onClick={() => setConfirming(false)}
          >
            Batal
          </button>
        </>
      ) : (
        <button type="button" className="clik-del__start" onClick={() => setConfirming(true)}>
          Hapus akun ini
        </button>
      )}
    </div>
  )
}
