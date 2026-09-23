'use client'

import { useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

/**
 * Puts the collection being edited on <body> so stylesheets can act on it.
 *
 * Used to hide the language switcher where it does nothing. Payload draws it
 * whenever localization is configured anywhere in the project, not per
 * collection — and news, reports and products now keep both languages as
 * visible pairs, so switching language on those screens changes nothing at
 * all. It still matters for job openings and for media alt text.
 */
export default function MarkCollection() {
  const { collectionSlug } = useDocumentInfo()

  useEffect(() => {
    if (!collectionSlug) return
    document.body.dataset.collection = collectionSlug
    return () => {
      delete document.body.dataset.collection
    }
  }, [collectionSlug])

  return null
}
