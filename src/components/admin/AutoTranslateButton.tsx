'use client'

import { useState } from 'react'
import { useDocumentInfo, useLocale, Button } from '@payloadcms/ui'

/**
 * Sidebar action that drafts the English version of a document from the
 * Indonesian one. Only fills fields that have no English text yet, and always
 * saves as a draft so the result goes through the normal review.
 */
export default function AutoTranslateButton() {
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const locale = useLocale()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const unsaved = !id && !globalSlug

  const run = async () => {
    setBusy(true)
    setMessage(null)
    setIsError(false)
    try {
      const response = await fetch('/api/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(
          globalSlug ? { global: globalSlug } : { collection: collectionSlug, id },
        ),
      })
      const result = await response.json()
      if (!response.ok) {
        setIsError(true)
        setMessage(result?.error ?? 'Translation failed.')
      } else {
        setMessage(result?.message ?? 'Done.')
        // Show the freshly written English draft.
        if (result?.translated > 0) {
          setTimeout(() => window.location.reload(), 1200)
        }
      }
    } catch {
      setIsError(true)
      setMessage('Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginBlock: '1rem' }}>
      <Button
        buttonStyle="secondary"
        size="small"
        disabled={busy || unsaved}
        onClick={run}
      >
        {busy ? 'Translating…' : 'Auto-translate to English'}
      </Button>
      <p
        style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          lineHeight: 1.5,
          color: isError ? '#c0392b' : 'var(--theme-elevation-600)',
        }}
      >
        {message ??
          (unsaved
            ? 'Save the document first.'
            : locale?.code === 'en'
              ? 'Fills empty English fields from the Indonesian version and saves a draft.'
              : 'Switch to the English locale to review the result after translating.')}
      </p>
    </div>
  )
}
