'use client'

import { useEffect, useState } from 'react'
import { useDocumentInfo, useLocale } from '@payloadcms/ui'
import './LanguageStatus.scss'

/**
 * Both languages at a glance, because only one of them is on screen.
 *
 * Payload edits one language at a time — the switcher at the top decides
 * which — so it is entirely possible to write a whole report in English and
 * never notice Indonesian is empty. That is exactly what happened: a report
 * reached the Approver looking blank, because the admin lists the default
 * language and there was nothing in it.
 *
 * Read with locale=all so the configured fallback does not quietly answer
 * with the Indonesian text for a missing English field.
 */
type State = { id: boolean; en: boolean } | null

const LANGS: { code: 'id' | 'en'; label: string }[] = [
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'en', label: 'English' },
]

export default function LanguageStatus() {
  const { id, collectionSlug } = useDocumentInfo()
  const locale = useLocale()
  const [title, setTitle] = useState<State>(null)
  const [body, setBody] = useState<State>(null)
  const [hasBody, setHasBody] = useState(false)

  useEffect(() => {
    if (!id || !collectionSlug) return
    let cancelled = false

    const filled = (v: unknown) => String(v ?? '').trim().length > 0
    const richFilled = (v: unknown) => {
      const children = (v as { root?: { children?: unknown[] } })?.root?.children
      if (!Array.isArray(children) || !children.length) return false
      return JSON.stringify(children).replace(/"text":""/g, '').includes('"text":"')
    }

    fetch(`/api/${collectionSlug}/${id}?locale=all&depth=0&draft=true`, {
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (cancelled || !doc) return
        // Reports keep a visible pair; everything else keeps one localised
        // field, which locale=all returns as { id, en }.
        // Products pair a name where news and reports pair a title.
        const base = 'titleId' in doc ? 'title' : 'nameId' in doc ? 'name' : null
        setTitle(
          base
            ? { id: filled(doc[`${base}Id`]), en: filled(doc[`${base}En`]) }
            : { id: filled(doc.title?.id), en: filled(doc.title?.en) },
        )
        const paired = Boolean(base)
        if (paired ? 'bodyId' in doc : 'body' in doc) {
          setHasBody(true)
          setBody(
            paired
              ? { id: richFilled(doc.bodyId), en: richFilled(doc.bodyEn) }
              : { id: richFilled(doc.body?.id), en: richFilled(doc.body?.en) },
          )
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
    // Re-read after a save, and when the editor switches language.
  }, [id, collectionSlug, locale?.code])

  if (!id || !title) return null

  return (
    <div className="clik-lang">
      <span className="clik-lang__heading">Kelengkapan bahasa</span>
      {LANGS.map(({ code, label }) => {
        const ok = title[code] && (!hasBody || Boolean(body?.[code]))
        const gaps = [
          !title[code] ? 'judul' : null,
          hasBody && !body?.[code] ? 'isi' : null,
        ].filter(Boolean)
        return (
          <div key={code} className="clik-lang__row">
            <span className={`clik-lang__dot clik-lang__dot--${ok ? 'ok' : 'gap'}`} aria-hidden="true" />
            <span className="clik-lang__name">
              {label}
              {locale?.code === code ? ' (sedang dibuka)' : ''}
            </span>
            <span className="clik-lang__note">{ok ? 'lengkap' : `${gaps.join(' & ')} kosong`}</span>
          </div>
        )
      })}
      <p className="clik-lang__hint">
        Keduanya harus terisi sebelum bisa disetujui. Ganti bahasa lewat pemilih di atas, atau pakai
        Auto-translate.
      </p>
    </div>
  )
}
